import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Site settings
      siteName: 'QR Studio',
      siteDescription: 'Professional QR Code Generator & Analytics',
      logoUrl: null,
      faviconUrl: null,
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      
      // SMTP settings
      smtpConfig: {
        provider: 'custom', // 'custom', 'mailgun', 'sendgrid'
        host: '',
        port: 587,
        username: '',
        password: '',
        fromName: 'QR Studio',
        fromEmail: 'noreply@qrstudio.com',
        secure: false, // true for SSL, false for TLS
      },
      
      // Feature flags
      features: {
        emailNotifications: true,
        teamCollaboration: true,
        landingPageBuilder: true,
        apiAccess: true,
        bulkGeneration: true,
        analytics: true,
      },
      
      // Language settings
      defaultLanguage: 'en',
      availableLanguages: ['en', 'es', 'tl'],
      
      // Update site settings
      updateSiteSettings: (settings) => {
        set(state => ({
          ...state,
          ...settings
        }));
      },
      
      // Update SMTP configuration
      updateSmtpConfig: (config) => {
        set(state => ({
          smtpConfig: { ...state.smtpConfig, ...config }
        }));
      },
      
      // Toggle features
      toggleFeature: (feature) => {
        set(state => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature]
          }
        }));
      },
      
      // Update language settings
      updateLanguageSettings: (languageSettings) => {
        set(state => ({
          ...state,
          ...languageSettings
        }));
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);