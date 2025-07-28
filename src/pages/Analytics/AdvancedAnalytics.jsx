import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQR } from '../../contexts/QRContext';
import { qrService } from '../../services/qrService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  ScatterChart, Scatter, RadialBarChart, RadialBar, ComposedChart
} from 'recharts';

const {
  FiBarChart2, FiPieChart, FiMap, FiCalendar, FiDownload, FiSmartphone,
  FiGlobe, FiExternalLink, FiFilter, FiRefreshCw, FiTrendingUp, FiTrendingDown,
  FiClock, FiUsers, FiEye, FiMousePointer, FiShare2, FiTarget
} = FiIcons;

function AdvancedAnalytics() {
  const { qrCodes, loading } = useQR();
  const [selectedQR, setSelectedQR] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [compareMode, setCompareMode] = useState(false);
  const [compareQR, setCompareQR] = useState(null);

  useEffect(() => {
    if (qrCodes.length > 0 && !selectedQR) {
      setSelectedQR(qrCodes[0].id);
    }
  }, [qrCodes]);

  useEffect(() => {
    if (selectedQR) {
      loadAdvancedAnalytics();
    }
  }, [selectedQR, timeRange]);

  const loadAdvancedAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await qrService.getAdvancedAnalytics(selectedQR, timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAdvancedReport = () => {
    if (!analytics) return;

    // Create comprehensive CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Summary section
    csvContent += "QR Code Analytics Report\n";
    csvContent += `QR Code: ${qrCodes.find(qr => qr.id === selectedQR)?.name}\n`;
    csvContent += `Time Range: ${timeRange}\n`;
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Performance metrics
    csvContent += "Performance Metrics\n";
    csvContent += "Metric,Value,Change\n";
    csvContent += `Total Scans,${analytics.totalScans},${analytics.scanGrowth}%\n`;
    csvContent += `Unique Scans,${analytics.uniqueScans},${analytics.uniqueGrowth}%\n`;
    csvContent += `Conversion Rate,${analytics.conversionRate}%,${analytics.conversionGrowth}%\n`;
    csvContent += `Avg Session Duration,${analytics.avgSessionDuration}s,${analytics.sessionGrowth}%\n\n`;

    // Time series data
    csvContent += "Daily Scans\n";
    csvContent += "Date,Total Scans,Unique Scans,Conversion Rate\n";
    analytics.timeSeriesData.forEach(item => {
      csvContent += `${item.date},${item.scans},${item.uniqueScans},${item.conversionRate}%\n`;
    });

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `advanced-analytics-${selectedQR}-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
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
        <title>Advanced Analytics - QR Studio</title>
        <meta name="description" content="View comprehensive analytics and insights for your QR codes." />
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
              Advanced Analytics
            </h1>
            <p className="text-gray-600">
              Deep insights and comprehensive metrics for your QR codes.
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
              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 mb-6"
              >
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
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

                  <div className="lg:w-48">
                    <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Range
                    </label>
                    <select
                      id="time-range"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="24h">Last 24 hours</option>
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="year">Last year</option>
                      <option value="all">All time</option>
                    </select>
                  </div>

                  <div className="lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      View Mode
                    </label>
                    <select
                      value={activeView}
                      onChange={(e) => setActiveView(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="overview">Overview</option>
                      <option value="performance">Performance</option>
                      <option value="audience">Audience</option>
                      <option value="behavior">Behavior</option>
                      <option value="conversion">Conversion</option>
                    </select>
                  </div>

                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => setCompareMode(!compareMode)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        compareMode
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Compare
                    </button>

                    <button
                      onClick={exportAdvancedReport}
                      disabled={!analytics}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>Export</span>
                    </button>

                    <button
                      onClick={loadAdvancedAnalytics}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <SafeIcon icon={FiRefreshCw} className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {compareMode && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compare with
                    </label>
                    <select
                      value={compareQR || ''}
                      onChange={(e) => setCompareQR(e.target.value)}
                      className="w-full lg:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select QR code to compare</option>
                      {qrCodes.filter(qr => qr.id !== selectedQR).map(qr => (
                        <option key={qr.id} value={qr.id}>{qr.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </motion.div>

              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : analytics ? (
                <>
                  {/* Key Metrics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiEye} className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex items-center text-sm">
                          <SafeIcon icon={analytics.scanGrowth >= 0 ? FiTrendingUp : FiTrendingDown} 
                                   className={`w-4 h-4 mr-1 ${analytics.scanGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={analytics.scanGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(analytics.scanGrowth)}%
                          </span>
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
                          <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex items-center text-sm">
                          <SafeIcon icon={analytics.uniqueGrowth >= 0 ? FiTrendingUp : FiTrendingDown} 
                                   className={`w-4 h-4 mr-1 ${analytics.uniqueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={analytics.uniqueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(analytics.uniqueGrowth)}%
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.uniqueScans.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Unique Visitors</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiTarget} className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex items-center text-sm">
                          <SafeIcon icon={analytics.conversionGrowth >= 0 ? FiTrendingUp : FiTrendingDown} 
                                   className={`w-4 h-4 mr-1 ${analytics.conversionGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={analytics.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(analytics.conversionGrowth)}%
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.conversionRate}%
                      </h3>
                      <p className="text-gray-600 text-sm">Conversion Rate</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiClock} className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex items-center text-sm">
                          <SafeIcon icon={analytics.sessionGrowth >= 0 ? FiTrendingUp : FiTrendingDown} 
                                   className={`w-4 h-4 mr-1 ${analytics.sessionGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={analytics.sessionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(analytics.sessionGrowth)}%
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {analytics.avgSessionDuration}s
                      </h3>
                      <p className="text-gray-600 text-sm">Avg. Session</p>
                    </div>
                  </motion.div>

                  {/* Charts based on active view */}
                  <div className="space-y-6">
                    {activeView === 'overview' && (
                      <>
                        {/* Time Series Chart */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Scan Trends</h2>
                            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={analytics.timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="scans" name="Total Scans" fill="#3b82f6" />
                                <Bar yAxisId="left" dataKey="uniqueScans" name="Unique Scans" fill="#10b981" />
                                <Line yAxisId="right" type="monotone" dataKey="conversionRate" name="Conversion Rate %" stroke="#f59e0b" strokeWidth={2} />
                              </ComposedChart>
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
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-lg font-semibold text-gray-900">Device Types</h2>
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

                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-lg font-semibold text-gray-900">Top Locations</h2>
                              <SafeIcon icon={FiMap} className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.locations} layout="horizontal">
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis type="number" />
                                  <YAxis dataKey="country" type="category" width={80} />
                                  <Tooltip />
                                  <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}

                    {activeView === 'performance' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                      >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h2>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.performanceData}>
                              <defs>
                                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Area type="monotone" dataKey="scans" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScans)" />
                              <Area type="monotone" dataKey="conversions" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorConversions)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    )}

                    {activeView === 'audience' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      >
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h2 className="text-lg font-semibold text-gray-900 mb-4">Age Demographics</h2>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={analytics.ageGroups}>
                                <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="count" />
                                <Legend iconSize={18} layout="vertical" verticalAlign="middle" wrapperStyle={{ paddingLeft: '20px' }} />
                                <Tooltip />
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Behavior</h2>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart data={analytics.userBehavior}>
                                <CartesianGrid />
                                <XAxis dataKey="sessionDuration" name="Session Duration" unit="s" />
                                <YAxis dataKey="pageViews" name="Page Views" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Users" data={analytics.userBehavior} fill="#8884d8" />
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeView === 'conversion' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                      >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.conversionFunnel}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="stage" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="users" fill="#3b82f6" />
                              <Bar dataKey="conversions" fill="#10b981" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    )}
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

export default AdvancedAnalytics;