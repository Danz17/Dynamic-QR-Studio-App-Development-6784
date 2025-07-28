import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiGrid, FiBarChart3, FiUsers, FiShield, FiZap, FiGlobe, FiSmartphone,
  FiSettings, FiTrendingUp, FiCheck, FiArrowRight, FiHeart, FiGithub,
  FiTwitter, FiLinkedin
} = FiIcons;

function LandingPage() {
  const features = [
    {
      icon: FiZap,
      title: 'Dynamic QR Codes',
      description: 'Create QR codes that can be edited and updated anytime without reprinting.'
    },
    {
      icon: FiBarChart3,
      title: 'Advanced Analytics',
      description: 'Track scans, locations, devices, and user behavior with detailed insights.'
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Work together with role-based permissions and shared workspaces.'
    },
    {
      icon: FiShield,
      title: 'Security Features',
      description: 'Password protection, expiration dates, and GDPR compliance built-in.'
    },
    {
      icon: FiGlobe,
      title: 'Landing Pages',
      description: 'Create beautiful landing pages with drag-and-drop builder.'
    },
    {
      icon: FiSettings,
      title: 'API Integration',
      description: 'Programmatic access with RESTful APIs and webhook support.'
    }
  ];

  const stats = [
    { label: 'QR Codes Generated', value: '500K+' },
    { label: 'Total Scans', value: '10M+' },
    { label: 'Active Users', value: '25K+' },
    { label: 'Countries', value: '150+' }
  ];

  const version = process.env.VITE_APP_VERSION || '1.0.0';
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Dynamic QR Studio - Professional QR Code Generator & Analytics</title>
        <meta name="description" content="Create, customize, and manage dynamic QR codes with advanced analytics, team collaboration, and landing page builder." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiGrid} className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">QR Studio</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6"
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Create Dynamic{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                    QR Codes
                  </span>
                  <br />
                  That Work Harder
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                  Generate, customize, and track QR codes with advanced analytics, team collaboration, and beautiful landing pages.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Start Free Trial</span>
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors text-center"
                  >
                    Watch Demo
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-6 mt-12 lg:mt-0"
              >
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3">
                    <div className="bg-gray-100 rounded-lg p-6 mb-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded grid grid-cols-3 gap-1 p-2">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="bg-gray-900 rounded-sm" />
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="h-2 bg-gray-300 rounded mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>1,234 scans</span>
                      <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white/50 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From basic QR generation to advanced analytics and team collaboration, we've got all the tools you need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                    <SafeIcon icon={feature.icon} className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-600 to-purple-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of businesses using QR Studio to create amazing experiences.
              </p>
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>Start Your Free Trial</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                  Create, customize, and manage dynamic QR codes with advanced analytics and team collaboration features.
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
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-600 hover:text-gray-900 text-sm">
                      Get Started
                    </Link>
                  </li>
                  <li>
                    <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#help" className="text-gray-600 hover:text-gray-900 text-sm">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#api" className="text-gray-600 hover:text-gray-900 text-sm">
                      API Docs
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-gray-600 hover:text-gray-900 text-sm">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © {currentYear} QR Studio. All rights reserved.
              </p>
              <p className="text-gray-600 text-sm flex items-center mt-2 md:mt-0">
                Built with{' '}
                <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-500 mx-1" />
                and frustration by Alaa Qweider
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;