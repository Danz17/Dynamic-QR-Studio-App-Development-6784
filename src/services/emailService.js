import { supabase } from '../lib/supabase';

class EmailService {
  constructor() {
    this.smtpConfig = null;
  }

  async getSmtpConfig() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('smtp_config')
        .single();

      if (error) throw error;
      
      this.smtpConfig = data.smtp_config;
      return this.smtpConfig;
    } catch (error) {
      console.error('Error getting SMTP config:', error);
      return null;
    }
  }

  async updateSmtpConfig(config) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          smtp_config: config,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      this.smtpConfig = config;
      return data;
    } catch (error) {
      console.error('Error updating SMTP config:', error);
      throw error;
    }
  }

  async testSmtpConnection(config = null) {
    try {
      const testConfig = config || this.smtpConfig;
      
      if (!testConfig) {
        throw new Error('No SMTP configuration found');
      }

      // Call edge function to test SMTP
      const { data, error } = await supabase.functions.invoke('test-smtp', {
        body: { 
          config: testConfig,
          to: testConfig.fromEmail,
          subject: 'QR Studio SMTP Test',
          text: 'This is a test email to verify SMTP configuration.',
          html: '<p>This is a test email to verify SMTP configuration.</p>'
        }
      });

      if (error) throw error;

      return { success: true, message: 'SMTP test successful' };
    } catch (error) {
      console.error('SMTP test error:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, text, html = null, template = null, templateData = null) {
    try {
      if (!this.smtpConfig) {
        await this.getSmtpConfig();
      }

      if (!this.smtpConfig) {
        throw new Error('SMTP not configured');
      }

      let emailContent = { text, html };
      
      // Use template if provided
      if (template && templateData) {
        emailContent = this.renderTemplate(template, templateData);
      }

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          config: this.smtpConfig,
          to,
          subject,
          ...emailContent
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  }

  renderTemplate(template, data) {
    const templates = {
      'team-invite': {
        subject: 'You\'ve been invited to join {{teamName}} on QR Studio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You've been invited to join {{teamName}}</h2>
            <p>Hi {{inviteeName}},</p>
            <p>{{inviterName}} has invited you to join their team "{{teamName}}" on QR Studio.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{acceptUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
            </div>
            <p>If you don't want to join this team, you can ignore this email.</p>
            <p>Best regards,<br>The QR Studio Team</p>
          </div>
        `
      },
      'password-reset': {
        subject: 'Reset your QR Studio password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset your password</h2>
            <p>Hi {{name}},</p>
            <p>We received a request to reset your password for your QR Studio account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
            </div>
            <p>This link will expire in 24 hours. If you didn't request this, you can ignore this email.</p>
            <p>Best regards,<br>The QR Studio Team</p>
          </div>
        `
      },
      'scan-alert': {
        subject: 'QR Code Scan Alert - {{qrName}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Scan Alert for {{qrName}}</h2>
            <p>Hi {{userName}},</p>
            <p>Your QR code "{{qrName}}" has received {{scanCount}} scans today, exceeding your alert threshold of {{threshold}}.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Scan Details:</h3>
              <ul>
                <li>Total scans today: {{scanCount}}</li>
                <li>Unique scans: {{uniqueScans}}</li>
                <li>Top location: {{topLocation}}</li>
                <li>Top device: {{topDevice}}</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{analyticsUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Analytics</a>
            </div>
            <p>Best regards,<br>The QR Studio Team</p>
          </div>
        `
      },
      'account-verification': {
        subject: 'Verify your QR Studio account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to QR Studio!</h2>
            <p>Hi {{name}},</p>
            <p>Thanks for signing up! Please verify your email address to get started.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{verifyUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
            </div>
            <p>If you didn't create this account, you can ignore this email.</p>
            <p>Best regards,<br>The QR Studio Team</p>
          </div>
        `
      }
    };

    const template_config = templates[template];
    if (!template_config) {
      throw new Error(`Template ${template} not found`);
    }

    // Replace template variables
    let subject = template_config.subject;
    let html = template_config.html;

    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(placeholder, data[key]);
      html = html.replace(placeholder, data[key]);
    });

    return { subject, html, text: html.replace(/<[^>]*>/g, '') };
  }

  // Predefined email methods
  async sendTeamInvite(inviteData) {
    return this.sendEmail(
      inviteData.inviteeEmail,
      null,
      null,
      null,
      'team-invite',
      inviteData
    );
  }

  async sendPasswordReset(userData) {
    return this.sendEmail(
      userData.email,
      null,
      null,
      null,
      'password-reset',
      userData
    );
  }

  async sendScanAlert(alertData) {
    return this.sendEmail(
      alertData.userEmail,
      null,
      null,
      null,
      'scan-alert',
      alertData
    );
  }

  async sendAccountVerification(userData) {
    return this.sendEmail(
      userData.email,
      null,
      null,
      null,
      'account-verification',
      userData
    );
  }
}

export const emailService = new EmailService();