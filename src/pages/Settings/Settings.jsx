import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, FiMail, FiLock, FiSave, FiAlertTriangle, FiCheck,
  FiCreditCard, FiGlobe, FiMonitor, FiMoon, FiTrash2, FiBell
} = FiIcons;

function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, language, changeLanguage } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'Acme Inc.',
    bio: 'QR code enthusiast and digital marketing professional.'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    qrScans: true,
    weeklyReports: true,
    teamUpdates: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({
        name: profileForm.name,
        // Other fields would be updated too in a real app
      });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Notification preferences updated successfully!');
    } catch (error) {
      setError('Failed to update notification preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAppearanceSettings = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Appearance Settings
      </h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Dark Mode</h3>
            <p className="text-sm text-gray-600">
              Switch between light and dark theme
            </p>
          </div>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
            <input
              type="checkbox"
              id="toggle"
              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white rounded-full appearance-none cursor-pointer peer border border-gray-300 checked:right-0 checked:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <label
              htmlFor="toggle"
              className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-primary-500"
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">Language</h3>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Billing & Subscription
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <SafeIcon icon={FiCreditCard} className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Current Plan: Pro</h3>
            <p className="mt-1 text-sm text-blue-700">
              Your subscription renews on November 15, 2024
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Plan Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium">Pro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price</span>
              <span className="font-medium">$19.99/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Cycle</span>
              <span className="font-medium">Monthly</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-6 bg-gray-200 rounded"></div>
            <div>
              <p className="text-sm font-medium">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/2025</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Update Payment Method
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Billing History</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">Invoice #12345</p>
                <p className="text-gray-500">Oct 15, 2023</p>
              </div>
              <span className="text-green-600 font-medium">$19.99</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">Invoice #12344</p>
                <p className="text-gray-500">Sep 15, 2023</p>
              </div>
              <span className="text-green-600 font-medium">$19.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Settings - QR Studio</title>
        <meta name="description" content="Manage your account settings, preferences, and subscription." />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your profile, preferences, and account settings.
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
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">{user?.name}</h2>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {user?.plan || 'Pro'} Plan
                      </span>
                    </div>
                  </div>
                </div>
                
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'profile'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('password')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'password'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiLock} className="w-4 h-4" />
                        <span>Password</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'notifications'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiBell} className="w-4 h-4" />
                        <span>Notifications</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('billing')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'billing'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiCreditCard} className="w-4 h-4" />
                        <span>Billing</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('appearance')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'appearance'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiMonitor} className="w-4 h-4" />
                        <span>Appearance</span>
                      </button>
                    </li>
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
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Profile Settings
                    </h2>
                    <form onSubmit={handleProfileSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                              readOnly
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Email address cannot be changed.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={profileForm.company}
                            onChange={handleProfileChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        {error && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center">
                            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2" />
                            {error}
                          </div>
                        )}

                        {success && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                            {success}
                          </div>
                        )}

                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Password Settings */}
                {activeTab === 'password' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Change Password
                    </h2>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              required
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter your current password"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              required
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter your new password"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Password must be at least 8 characters.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center">
                            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2" />
                            {error}
                          </div>
                        )}

                        {success && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                            {success}
                          </div>
                        )}

                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                            <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Notification Preferences
                    </h2>
                    <form onSubmit={handleNotificationsSubmit}>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-600">
                              Receive email notifications from QR Studio.
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={notificationSettings.emailNotifications}
                            onChange={handleNotificationChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">QR Code Scans</h3>
                            <p className="text-sm text-gray-600">
                              Get notified when your QR codes are scanned.
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            name="qrScans"
                            checked={notificationSettings.qrScans}
                            onChange={handleNotificationChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                            <p className="text-sm text-gray-600">
                              Receive weekly analytics reports via email.
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            name="weeklyReports"
                            checked={notificationSettings.weeklyReports}
                            onChange={handleNotificationChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Team Updates</h3>
                            <p className="text-sm text-gray-600">
                              Get notified about team member activities.
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            name="teamUpdates"
                            checked={notificationSettings.teamUpdates}
                            onChange={handleNotificationChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>

                        {error && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center">
                            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2" />
                            {error}
                          </div>
                        )}

                        {success && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                            {success}
                          </div>
                        )}

                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                            <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && renderAppearanceSettings()}

                {/* Billing Settings */}
                {activeTab === 'billing' && renderBillingSettings()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;