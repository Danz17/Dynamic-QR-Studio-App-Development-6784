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
  FiShield, FiSettings, FiMail, FiPalette, FiGlobe, FiUsers, FiToggleLeft, FiToggleRight,
  FiSave, FiTestTube, FiUpload, FiCheck, FiAlertTriangle, FiEye, FiEyeOff, FiBarChart3,
  FiTrendingUp, FiActivity, FiDatabase, FiRefreshCw, FiDownload
} = FiIcons;

function AdminConsole() {
  const { t } = useTranslation();
  const { user, isSuperAdmin } = useAuthStore();
  const {
    siteName, siteDescription, logoUrl, primaryColor, secondaryColor, smtpConfig,
    features, defaultLanguage, updateSiteSettings, updateSmtpConfig, toggleFeature,
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

  // Analytics state
  const [analyticsSettings, setAnalyticsSettings] = useState({
    retentionPeriod: 365, // days
    enableGeoTracking: true,
    enableDeviceTracking: true,
    enableReferrerTracking: true,
    anonymizeIPs: true,
    exportFormat: 'csv',
    autoReports: true,
    reportFrequency: 'weekly'
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 1250,
    totalQRCodes: 15680,
    totalScans: 2340000,
    activeUsers: 890,
    storageUsed: '2.4 GB',
    apiCalls: 45600
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

  const handleAnalyticsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, save analytics settings to backend
      toast.success('Analytics settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update analytics settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async (type) => {
    setLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${type} data exported successfully!`);
    } catch (error) {
      toast.error(`Failed to export ${type} data`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    { id: 'analytics', name: 'Analytics', icon: FiBarChart3 },
    { id: 'features', name: 'Features', icon: FiToggleLeft },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'system', name: 'System', icon: FiDatabase },
    { id: 'branding', name: 'Branding', icon: FiPalette }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Console - QR Studio</title>
        <meta name="description" content="Manage site settings, SMTP configuration, analytics, and features." />
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
              Manage site settings, analytics, email configuration, and system features.
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Site Settings</h2>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Settings</h2>
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
                                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5 text-gray-400" />
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

                {/* Analytics Settings */}
                {activeTab === 'analytics' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Configuration</h2>
                    
                    {/* Analytics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100">Total Scans</p>
                            <p className="text-2xl font-bold">{systemStats.totalScans.toLocaleString()}</p>
                          </div>
                          <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100">Active Users</p>
                            <p className="text-2xl font-bold">{systemStats.activeUsers}</p>
                          </div>
                          <SafeIcon icon={FiUsers} className="w-8 h-8 text-green-200" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100">Total QR Codes</p>
                            <p className="text-2xl font-bold">{systemStats.totalQRCodes.toLocaleString()}</p>
                          </div>
                          <SafeIcon icon={FiActivity} className="w-8 h-8 text-purple-200" />
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleAnalyticsSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Retention Period (days)
                          </label>
                          <select
                            value={analyticsSettings.retentionPeriod}
                            onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value={30}>30 days</option>
                            <option value={90}>90 days</option>
                            <option value={180}>180 days</option>
                            <option value={365}>1 year</option>
                            <option value={730}>2 years</option>
                            <option value={-1}>Unlimited</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Export Format
                          </label>
                          <select
                            value={analyticsSettings.exportFormat}
                            onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, exportFormat: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="csv">CSV</option>
                            <option value="xlsx">Excel</option>
                            <option value="json">JSON</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Tracking Options</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Geographic Tracking</h4>
                              <p className="text-sm text-gray-600">Track user locations by country and region</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={analyticsSettings.enableGeoTracking}
                              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, enableGeoTracking: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Device Tracking</h4>
                              <p className="text-sm text-gray-600">Track device types and operating systems</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={analyticsSettings.enableDeviceTracking}
                              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, enableDeviceTracking: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Referrer Tracking</h4>
                              <p className="text-sm text-gray-600">Track traffic sources and referrers</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={analyticsSettings.enableReferrerTracking}
                              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, enableReferrerTracking: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">IP Anonymization</h4>
                              <p className="text-sm text-gray-600">Anonymize IP addresses for privacy compliance</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={analyticsSettings.anonymizeIPs}
                              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, anonymizeIPs: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Automated Reports</h4>
                            <p className="text-sm text-gray-600">Send regular analytics reports to admins</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={analyticsSettings.autoReports}
                            onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, autoReports: e.target.checked }))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>

                        {analyticsSettings.autoReports && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Report Frequency
                            </label>
                            <select
                              value={analyticsSettings.reportFrequency}
                              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, reportFrequency: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                        )}
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
                          <span>{loading ? 'Saving...' : 'Save Analytics Settings'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExportData('analytics')}
                          disabled={loading}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <SafeIcon icon={FiDownload} className="w-4 h-4" />
                          <span>Export All Data</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Feature Toggles */}
                {activeTab === 'features' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Feature Management</h2>
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
                            <SafeIcon icon={enabled ? FiToggleRight : FiToggleLeft} className="w-8 h-8" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Overview */}
                {activeTab === 'system' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">Total Users</h3>
                          <SafeIcon icon={FiUsers} className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
                        <p className="text-sm text-green-600 flex items-center mt-2">
                          <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
                          +12% from last month
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">Storage Used</h3>
                          <SafeIcon icon={FiDatabase} className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed}</p>
                        <p className="text-sm text-gray-600 mt-2">of 10 GB limit</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">API Calls</h3>
                          <SafeIcon icon={FiActivity} className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{systemStats.apiCalls.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-2">This month</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-medium text-gray-900 mb-4">System Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => handleExportData('users')}
                            disabled={loading}
                            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <SafeIcon icon={FiDownload} className="w-4 h-4" />
                            <span>Export User Data</span>
                          </button>

                          <button
                            onClick={() => handleExportData('qrcodes')}
                            disabled={loading}
                            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <SafeIcon icon={FiDownload} className="w-4 h-4" />
                            <span>Export QR Data</span>
                          </button>

                          <button
                            onClick={() => setLoading(true)}
                            disabled={loading}
                            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                            <span>Refresh Stats</span>
                          </button>

                          <button
                            disabled={loading}
                            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <SafeIcon icon={FiDatabase} className="w-4 h-4" />
                            <span>Database Status</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Management */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Branding</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo Upload
                        </label>
                        <div className="flex items-center space-x-4">
                          {logoUrl && (
                            <img
                              src={logoUrl}
                              alt="Logo"
                              className="w-16 h-16 rounded-lg border border-gray-200"
                            />
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
                            <h3 className="text-sm font-medium text-blue-800">Additional Branding Options</h3>
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