import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import SafeIcon from '../../common/SafeIcon';
import LanguageSelector from '../UI/LanguageSelector';
import AuthModal from '../Auth/AuthModal';
import * as FiIcons from 'react-icons/fi';

const {
  FiMenu, FiX, FiHome, FiPlus, FiGrid, FiBarChart3, FiUsers, FiSettings,
  FiLogOut, FiUser, FiTemplate, FiUpload, FiEdit3, FiShield, FiGlobe,
  FiTrendingUp, FiUserCheck, FiLogIn
} = FiIcons;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const { t } = useTranslation();
  const { user, logout, isSuperAdmin, canAccessAdmin } = useAuthStore();
  const { siteName, logoUrl } = useSettingsStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: FiHome },
    { name: t('nav.generate'), href: '/generate', icon: FiPlus },
    { name: t('nav.manage'), href: '/manage', icon: FiGrid },
    { name: t('nav.analytics'), href: '/analytics', icon: FiBarChart3 },
    { name: t('nav.templates'), href: '/templates', icon: FiTemplate },
    { name: t('nav.bulk'), href: '/bulk', icon: FiUpload },
    { name: t('nav.landing'), href: '/landing-builder', icon: FiEdit3 },
    { name: t('nav.team'), href: '/team', icon: FiUsers },
  ];

  // Add admin console for users with admin access
  if (user && canAccessAdmin()) {
    navigation.push({
      name: t('nav.admin'),
      href: '/admin',
      icon: FiShield,
      children: [
        { name: 'Dashboard', href: '/admin', icon: FiBarChart3 },
        { name: 'User Management', href: '/admin/users', icon: FiUserCheck },
        { name: 'Roles & Permissions', href: '/admin/roles', icon: FiShield }
      ]
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                {logoUrl ? (
                  <img src={logoUrl} alt={siteName} className="w-8 h-8 rounded-lg" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiGrid} className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="text-xl font-bold text-gray-900">{siteName}</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {user && navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.children && item.children.some(child => location.pathname === child.href));
                
                if (item.children) {
                  return (
                    <div key={item.name} className="relative group">
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={item.icon} className="w-4 h-4" />
                        <span className="hidden xl:block">{item.name}</span>
                      </Link>
                      
                      {/* Dropdown */}
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 ${
                                location.pathname === child.href
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-gray-700'
                              }`}
                            >
                              <SafeIcon icon={child.icon} className="w-4 h-4" />
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span className="hidden xl:block">{item.name}</span>
                  </Link>
                );
              })}

              {/* Advanced Analytics Link */}
              {user && (
                <Link
                  to="/analytics/advanced"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/analytics/advanced'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                  <span className="hidden xl:block">Advanced</span>
                </Link>
              )}
            </div>

            {/* User menu and language selector */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1">
                          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                            {user?.email}
                            <div className="text-xs text-primary-600 capitalize">
                              {user?.role} • {user?.plan}
                            </div>
                          </div>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <SafeIcon icon={FiUser} className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <SafeIcon icon={FiSettings} className="w-4 h-4" />
                            <span>{t('nav.settings')}</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                            <span>{t('auth.logout')}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors hidden md:block"
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors hidden md:block"
                  >
                    {t('auth.register')}
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="md:hidden flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <SafeIcon icon={FiLogIn} className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
                {user ? (
                  <>
                    {navigation.map((item) => {
                      if (item.children) {
                        return (
                          <div key={item.name}>
                            <Link
                              to={item.href}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                                location.pathname === item.href
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <SafeIcon icon={item.icon} className="w-4 h-4" />
                              <span>{item.name}</span>
                            </Link>
                            <div className="ml-4 space-y-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                                    location.pathname === child.href
                                      ? 'bg-primary-100 text-primary-700'
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <SafeIcon icon={child.icon} className="w-4 h-4" />
                                  <span>{child.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <SafeIcon icon={item.icon} className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    {/* Advanced Analytics Link for Mobile */}
                    <Link
                      to="/analytics/advanced"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/analytics/advanced'
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                      <span>Advanced Analytics</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiLogIn} className="w-4 h-4" />
                      <span>{t('auth.login')}</span>
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiUser} className="w-4 h-4" />
                      <span>{t('auth.register')}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode} 
      />
    </>
  );
}

export default Navbar;