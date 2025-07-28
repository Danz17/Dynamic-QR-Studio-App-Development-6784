import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQR } from '../../contexts/QRContext';
import { qrService } from '../../services/qrService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';

const { 
  FiBarChart2, FiPieChart, FiMap, FiCalendar, 
  FiDownload, FiSmartphone, FiGlobe, FiExternalLink 
} = FiIcons;

function Analytics() {
  const { qrCodes, loading } = useQR();
  const [selectedQR, setSelectedQR] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (qrCodes.length > 0 && !selectedQR) {
      setSelectedQR(qrCodes[0].id);
    }
  }, [qrCodes]);

  useEffect(() => {
    if (selectedQR) {
      loadAnalytics();
    }
  }, [selectedQR, timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await qrService.getQRCodeAnalytics(selectedQR, timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    if (!analytics) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Date,Total Scans,Unique Scans\n";
    
    // Data rows
    analytics.scansByDate.forEach(item => {
      csvContent += `${item.date},${item.scans},${item.uniqueScans}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `qr-analytics-${selectedQR}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  // Chart colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        <title>Analytics - QR Studio</title>
        <meta name="description" content="View detailed analytics and statistics for your QR codes." />
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
              QR Code Analytics
            </h1>
            <p className="text-gray-600">
              View detailed performance metrics and insights for your QR codes.
            </p>
          </motion.div>

          {qrCodes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 border border-gray-200 text-center"
            >
              <SafeIcon icon={FiBarChart2} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
              <p className="text-gray-600 mb-6">
                Create a QR code first to view analytics and statistics.
              </p>
            </motion.div>
          ) : (
            <>
              {/* QR Selection and Time Range */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 mb-6"
              >
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <label htmlFor="qr-select" className="block text-sm font-medium text-gray-700 mb-1">
                      Select QR Code
                    </label>
                    <select
                      id="qr-select"
                      value={selectedQR || ''}
                      onChange={(e) => setSelectedQR(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      {qrCodes.map(qr => (
                        <option key={qr.id} value={qr.id}>{qr.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:w-64">
                    <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Range
                    </label>
                    <select
                      id="time-range"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="year">Last year</option>
                      <option value="all">All time</option>
                    </select>
                  </div>
                  <div className="md:w-auto flex items-end">
                    <button
                      onClick={exportCSV}
                      disabled={!analytics}
                      className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : analytics ? (
                <>
                  {/* Stats Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiBarChart2} className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.totalScans.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Total Scans</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiBarChart2} className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.uniqueScans.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Unique Scans</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiSmartphone} className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.deviceTypes[0]?.device || 'N/A'}
                      </h3>
                      <p className="text-gray-600 text-sm">Top Device</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiGlobe} className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.locations[0]?.country || 'N/A'}
                      </h3>
                      <p className="text-gray-600 text-sm">Top Location</p>
                    </div>
                  </motion.div>

                  {/* Charts */}
                  <div className="space-y-6">
                    {/* Scans by Date */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Scans Over Time
                        </h2>
                        <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.scansByDate}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="scans" name="Total Scans" fill="#3b82f6" />
                            <Bar dataKey="uniqueScans" name="Unique Scans" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>

                    {/* Device and Location */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {/* Device Types */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-gray-900">
                            Device Types
                          </h2>
                          <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.deviceTypes}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="device"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {analytics.deviceTypes.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-gray-900">
                            Top Locations
                          </h2>
                          <SafeIcon icon={FiMap} className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.locations}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="country"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {analytics.locations.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>

                    {/* Referrers */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Referral Sources
                        </h2>
                        <SafeIcon icon={FiExternalLink} className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.referrers}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="source"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {analytics.referrers.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                  <SafeIcon icon={FiBarChart2} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
                  <p className="text-gray-600">
                    Select a QR code to view its analytics data.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Analytics;