import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQR } from '../../contexts/QRContext';
import { recommendationService } from '../../services/recommendationService';
import { qrService } from '../../services/qrService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import RecommendationWidget from '../../components/Recommendations/RecommendationWidget';
import RecommendationPanel from '../../components/Recommendations/RecommendationPanel';
import SmartSuggestions from '../../components/Recommendations/SmartSuggestions';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiBarChart3, FiEye, FiUsers, FiTrendingUp, FiGrid, FiCalendar, FiArrowRight, FiActivity, FiStar } = FiIcons;

function DashboardWithRecommendations() {
  const { user } = useAuth();
  const { qrCodes, fetchQRCodes, loading } = useQR();
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showRecommendationPanel, setShowRecommendationPanel] = useState(false);

  useEffect(() => {
    fetchQRCodes();
    loadAnalytics();
    loadRecentActivity();
    
    // Track dashboard visit
    if (user) {
      recommendationService.trackUserBehavior(user.id, 'page_visited', {
        page: 'dashboard'
      });
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0);
      const totalUnique = qrCodes.reduce((sum, qr) => sum + qr.uniqueScans, 0);
      
      setAnalytics({
        totalQRCodes: qrCodes.length,
        totalScans,
        totalUnique,
        activeQRCodes: qrCodes.filter(qr => qr.isActive).length
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadRecentActivity = () => {
    setRecentActivity([
      {
        id: 1,
        type: 'scan',
        message: 'Company Website QR scanned 15 times',
        time: '2 hours ago',
        icon: FiEye
      },
      {
        id: 2,
        type: 'create',
        message: 'New QR code "WiFi Access" created',
        time: '1 day ago',
        icon: FiPlus
      },
      {
        id: 3,
        type: 'update',
        message: 'Business Card QR updated',
        time: '2 days ago',
        icon: FiActivity
      }
    ]);
  };

  const handleSuggestionApplied = (suggestion) => {
    if (suggestion.type === 'analytics') {
      // Navigate to analytics
      window.location.href = '/analytics';
    }
    // Handle other suggestion types
  };

  const stats = [
    {
      title: 'Total QR Codes',
      value: analytics?.totalQRCodes || 0,
      change: '+12%',
      changeType: 'positive',
      icon: FiGrid
    },
    {
      title: 'Total Scans',
      value: analytics?.totalScans || 0,
      change: '+23%',
      changeType: 'positive',
      icon: FiEye
    },
    {
      title: 'Unique Scans',
      value: analytics?.totalUnique || 0,
      change: '+18%',
      changeType: 'positive',
      icon: FiUsers
    },
    {
      title: 'Active QRs',
      value: analytics?.activeQRCodes || 0,
      change: '+5%',
      changeType: 'positive',
      icon: FiActivity
    }
  ];

  if (loading && !qrCodes.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - QR Studio</title>
        <meta name="description" content="Manage your QR codes and view analytics from your dashboard." />
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your QR codes today.
                </p>
              </div>
              <button
                onClick={() => setShowRecommendationPanel(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiStar} className="w-4 h-4" />
                <span>Recommendations</span>
              </button>
            </div>
          </motion.div>

          {/* Smart Suggestions */}
          <SmartSuggestions
            context="dashboard"
            onSuggestionApplied={handleSuggestionApplied}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={stat.icon} className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      to="/generate"
                      className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
                        <SafeIcon icon={FiPlus} className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Create QR Code</h3>
                        <p className="text-sm text-gray-600">Generate a new QR code</p>
                      </div>
                    </Link>

                    <Link
                      to="/analytics"
                      className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                        <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">View Analytics</h3>
                        <p className="text-sm text-gray-600">Check scan performance</p>
                      </div>
                    </Link>

                    <Link
                      to="/templates"
                      className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                        <SafeIcon icon={FiGrid} className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Browse Templates</h3>
                        <p className="text-sm text-gray-600">Use pre-made designs</p>
                      </div>
                    </Link>

                    <Link
                      to="/bulk"
                      className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                        <SafeIcon icon={FiUsers} className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Bulk Generate</h3>
                        <p className="text-sm text-gray-600">Create multiple QRs</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Recent QR Codes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent QR Codes</h2>
                    <Link
                      to="/manage"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View all
                    </Link>
                  </div>

                  {qrCodes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {qrCodes.slice(0, 6).map((qr) => (
                        <div
                          key={qr.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              qr.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {qr.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                              {qr.scans} scans
                            </span>
                            <span className="flex items-center">
                              <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                              {new Date(qr.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <SafeIcon icon={FiGrid} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
                      <p className="text-gray-600 mb-6">Create your first QR code to get started</p>
                      <Link
                        to="/generate"
                        className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Create QR Code
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommendations Widget */}
              <RecommendationWidget
                context="dashboard"
                title="Recommended for You"
                limit={3}
                variant="compact"
              />

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <SafeIcon icon={activity.icon} className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/analytics"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mt-4"
                  >
                    View all activity
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Panel */}
      <RecommendationPanel
        visible={showRecommendationPanel}
        onClose={() => setShowRecommendationPanel(false)}
        context="dashboard"
        maxRecommendations={5}
      />
    </>
  );
}

export default DashboardWithRecommendations;