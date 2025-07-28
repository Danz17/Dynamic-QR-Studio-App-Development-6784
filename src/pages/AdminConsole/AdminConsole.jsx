import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { emailService } from '../../services/emailService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { 
  FiShield, FiSettings, FiMail, FiPalette, FiGlobe, FiUsers, 
  FiToggleLeft, FiToggleRight, FiSave, FiTestTube, FiUpload,
  FiCheck, FiAlertTriangle, FiEye, FiEyeOff
} = FiIcons;

function AdminConsole() {
  const { t } = useTranslation();
  const { user, isSuperAdmin } = useAuthStore();
  const {
    siteName,
    siteDescription,
    logoUrl,
    primaryColor,
    secondaryColor,
    smtpConfig,
    features,
    defaultLanguage,
    updateSiteSettings,
    updateSmtpConfig,
    toggleFeature,
    updateLanguageSettings
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState('site');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  const [siteForm, setSiteForm] = useState({
    siteName: siteName || 'QR Studio',
    siteDescription: siteDescription || 'Professional QR Code Generator & Analytics',
    primaryColor: primaryColor || '#3b82f6',
    secondaryColor: secondaryColor || '#64748b'
  });

  const [smtpForm, setSmtpForm] = useState({
    provider: smtpConfig?.provider || 'custom',
    host: smtpConfig?.host || '',
    port: smtpConfig?.port || 587,
    username: smtpConfig?.username || '',
    password: smtpConfig?.password || '',
    fromName: smtpConfig?.fromName || 'QR Studio',
    fromEmail: smtpConfig?.fromEmail || 'noreply@qrstudio.com',
    secure: smtpConfig?.secure || false
  });

  // Redirect if not super admin
  if (!isSuperAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiShield} className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin console.</p>
        </div>
      </div>
    );
  }

  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      updateSiteSettings(siteForm);
      toast.success('Site settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update site settings');
      console.error('Site settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSmtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      updateSmtpConfig(smtpForm);
      await emailService.updateSmtpConfig(smtpForm);
      toast.success('SMTP settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update SMTP settings');
      console.error('SMTP settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    setTestEmailSent(false);

    try {
      await emailService.testSmtpConnection(smtpForm);
      setTestEmailSent(true);
      toast.success('Test email sent successfully!');
    } catch (error) {
      toast.error('Failed to send test email: ' + error.message);
      console.error('Test email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to your storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        setSiteForm(prev => ({ ...prev, logoUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'site', name: 'Site Settings', icon: FiSettings },
    { id: 'email', name: 'Email Settings', icon: FiMail },
    { id: 'features', name: 'Features', icon: FiToggleLeft },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'branding', name: 'Branding', icon: FiPalette }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Console - QR Studio</title>
        <meta name="description" content="Manage site settings, SMTP configuration, and features." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
            </div>
            <p className="text-gray-600">
              Manage site settings, email configuration, and system features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                      <p className="text-sm text-gray-600">Super Admin</p>
                    </div>
                  </div>
                </div>

                <nav className="p-4">
                  <ul className="space-y-1">
                    {tabs.map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <SafeIcon icon={tab.icon} className="w-4 h-4" />
                          <span>{tab.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Site Settings */}
                {activeTab === 'site' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Site Settings
                    </h2>
                    <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={siteForm.siteName}
                          onChange={(e) => setSiteForm(prev => ({ ...prev, siteName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Description
                        </label>
                        <textarea
                          value={siteForm.siteDescription}
                          onChange={(e) => setSiteForm(prev => ({ ...prev, siteDescription: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={siteForm.primaryColor}
                              onChange={(e) => setSiteForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="w-12 h-10 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              value={siteForm.primaryColor}
                              onChange={(e) => setSiteForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Secondary Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={siteForm.secondaryColor}
                              onChange={(e) => setSiteForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                              className="w-12 h-10 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              value={siteForm.secondaryColor}
                              onChange={(e) => setSiteForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Language
                        </label>
                        <select
                          value={defaultLanguage}
                          onChange={(e) => updateLanguageSettings({ defaultLanguage: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="tl">Filipino</option>
                        </select>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                          )}
                          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Email Settings
                    </h2>
                    <form onSubmit={handleSmtpSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Provider
                        </label>
                        <select
                          value={smtpForm.provider}
                          onChange={(e) => setSmtpForm(prev => ({ ...prev, provider: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="custom">Custom SMTP</option>
                          <option value="mailgun">Mailgun</option>
                          <option value="sendgrid">SendGrid</option>
                        </select>
                      </div>

                      {smtpForm.provider === 'custom' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                SMTP Host
                              </label>
                              <input
                                type="text"
                                value={smtpForm.host}
                                onChange={(e) => setSmtpForm(prev => ({ ...prev, host: e.target.value }))}
                                placeholder="smtp.gmail.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Port
                              </label>
                              <input
                                type="number"
                                value={smtpForm.port}
                                onChange={(e) => setSmtpForm(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                              </label>
                              <input
                                type="text"
                                value={smtpForm.username}
                                onChange={(e) => setSmtpForm(prev => ({ ...prev, username: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={smtpForm.password}
                                  onChange={(e) => setSmtpForm(prev => ({ ...prev, password: e.target.value }))}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                  <SafeIcon 
                                    icon={showPassword ? FiEyeOff : FiEye} 
                                    className="h-5 w-5 text-gray-400" 
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="secure"
                              checked={smtpForm.secure}
                              onChange={(e) => setSmtpForm(prev => ({ ...prev, secure: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="secure" className="ml-2 block text-sm text-gray-700">
                              Use SSL/TLS
                            </label>
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Name
                          </label>
                          <input
                            type="text"
                            value={smtpForm.fromName}
                            onChange={(e) => setSmtpForm(prev => ({ ...prev, fromName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Email
                          </label>
                          <input
                            type="email"
                            value={smtpForm.fromEmail}
                            onChange={(e) => setSmtpForm(prev => ({ ...prev, fromEmail: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                          )}
                          <span>{loading ? 'Saving...' : 'Save SMTP Settings'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleTestEmail}
                          disabled={loading || !smtpForm.host}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <LoadingSpinner size="sm" />
                          ) : testEmailSent ? (
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                          ) : (
                            <SafeIcon icon={FiTestTube} className="w-4 h-4" />
                          )}
                          <span>
                            {loading ? 'Testing...' : testEmailSent ? 'Test Sent' : 'Test Email'}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Feature Toggles */}
                {activeTab === 'features' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Feature Management
                    </h2>
                    <div className="space-y-6">
                      {Object.entries(features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {feature.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getFeatureDescription(feature)}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleFeature(feature)}
                            className={`flex items-center ${enabled ? 'text-green-600' : 'text-gray-400'}`}
                          >
                            <SafeIcon 
                              icon={enabled ? FiToggleRight : FiToggleLeft} 
                              className="w-8 h-8" 
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Management */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      User Management
                    </h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">
                            Coming Soon
                          </h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            User management features will be available in the next update.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Branding */}
                {activeTab === 'branding' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Branding
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo Upload
                        </label>
                        <div className="flex items-center space-x-4">
                          {logoUrl && (
                            <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg border border-gray-200" />
                          )}
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                              <SafeIcon icon={FiUpload} className="w-4 h-4" />
                              <span>Upload Logo</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-blue-800">
                              Additional Branding Options
                            </h3>
                            <p className="text-sm text-blue-700 mt-1">
                              More branding customization options including favicon, custom CSS, and white-labeling features will be available in future updates.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

function getFeatureDescription(feature) {
  const descriptions = {
    emailNotifications: 'Send email notifications for various events',
    teamCollaboration: 'Enable team features and collaboration tools',
    landingPageBuilder: 'Allow users to create custom landing pages',
    apiAccess: 'Provide API access for developers',
    bulkGeneration: 'Enable bulk QR code generation features',
    analytics: 'Provide detailed analytics and reporting'
  };
  
  return descriptions[feature] || 'Feature description not available';
}

export default AdminConsole;