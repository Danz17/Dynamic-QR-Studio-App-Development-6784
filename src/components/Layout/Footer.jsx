import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiGithub, FiTwitter, FiLinkedin, FiGrid } = FiIcons;

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const version = process.env.VITE_APP_VERSION || '1.0.0';

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiGrid} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QR Studio</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                v{version}
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Create, customize, and manage dynamic QR codes with advanced analytics 
              and team collaboration features.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiTwitter} className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiLinkedin} className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiGithub} className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/generate" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('nav.generate')}
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('nav.analytics')}
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('nav.templates')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('footer.apiDocs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} QR Studio. {t('footer.allRightsReserved')}.
          </p>
          <p className="text-gray-600 text-sm flex items-center mt-2 md:mt-0">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;