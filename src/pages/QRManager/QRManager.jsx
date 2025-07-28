import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQR } from '../../contexts/QRContext';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, FiEdit, FiTrash2, FiCopy, FiEye, FiDownload, 
  FiCalendar, FiFilter, FiSearch, FiGrid, FiList, FiMoreHorizontal
} = FiIcons;

function QRManager() {
  const { qrCodes, fetchQRCodes, deleteQRCode, duplicateQRCode, loading } = useQR();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [selectedQR, setSelectedQR] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    fetchQRCodes();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQRCode(id);
      setIsDeleteModalOpen(false);
      setSelectedQR(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateQRCode(id);
    } catch (error) {
      console.error('Duplicate error:', error);
    }
  };

  const filteredQRCodes = qrCodes
    .filter(qr => {
      // Search filter
      const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesFilter = filter === 'all' || qr.type === filter;
      
      // Status filter (active/inactive)
      const matchesStatus = 
        (filter === 'active' && qr.isActive) || 
        (filter === 'inactive' && !qr.isActive) || 
        filter !== 'active' && filter !== 'inactive';
      
      // Dynamic filter
      const matchesDynamic = 
        (filter === 'dynamic' && qr.isDynamic) || 
        (filter === 'static' && !qr.isDynamic) || 
        filter !== 'dynamic' && filter !== 'static';
      
      return matchesSearch && matchesFilter && matchesStatus && matchesDynamic;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'scans-high':
          return b.scans - a.scans;
        case 'scans-low':
          return a.scans - b.scans;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading && !qrCodes.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const renderQRCodeItem = (qr) => {
    return (
      <div 
        key={qr.id} 
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Preview */}
        <div className="p-4 border-b border-gray-100 flex justify-center">
          <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
              {/* QR Preview would go here */}
            </div>
          </div>
        </div>
        
        {/* Details */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              qr.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {qr.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center">
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                {qr.scans} scans
              </span>
              <span className="text-xs text-gray-500">
                {qr.isDynamic ? 'Dynamic' : 'Static'}
              </span>
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
              <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 mt-3">
            <button 
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
              onClick={() => {}}
            >
              <SafeIcon icon={FiEdit} className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button 
              className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              onClick={() => handleDuplicate(qr.id)}
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4" />
            </button>
            <button 
              className="flex items-center justify-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              onClick={() => {
                setSelectedQR(qr);
                setIsDeleteModalOpen(true);
              }}
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQRCodeListItem = (qr) => {
    return (
      <div 
        key={qr.id} 
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center">
          {/* QR Preview */}
          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
              {/* QR Preview would go here */}
            </div>
          </div>
          
          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                qr.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {qr.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
              <span className="mr-3">{qr.scans} scans</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {qr.isDynamic ? 'Dynamic' : 'Static'}
              </span>
              <span className="mx-2">•</span>
              <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
              <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 ml-4">
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
              onClick={() => {}}
            >
              <SafeIcon icon={FiEdit} className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              onClick={() => handleDuplicate(qr.id)}
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              onClick={() => {
                setSelectedQR(qr);
                setIsDeleteModalOpen(true);
              }}
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage QR Codes - QR Studio</title>
        <meta name="description" content="Manage and organize all your QR codes in one place." />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Manage QR Codes
                </h1>
                <p className="text-gray-600">
                  View, edit, and organize all your QR codes.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  to="/generate"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  <span>Create New QR</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-200 mb-6"
          >
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiSearch} className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search QR codes..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="url">URL</option>
                  <option value="text">Text</option>
                  <option value="wifi">WiFi</option>
                  <option value="vcard">vCard</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="dynamic">Dynamic</option>
                  <option value="static">Static</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="scans-high">Most Scans</option>
                  <option value="scans-low">Least Scans</option>
                </select>
                
                <div className="hidden md:flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <SafeIcon icon={FiGrid} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <SafeIcon icon={FiList} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* QR Codes Grid/List */}
          {filteredQRCodes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredQRCodes.map(qr => renderQRCodeItem(qr))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQRCodes.map(qr => renderQRCodeListItem(qr))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 border border-gray-200 text-center"
            >
              <SafeIcon icon={FiFilter} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first QR code to get started'}
              </p>
              <Link
                to="/generate"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Create QR Code</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete QR Code
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedQR.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4 justify-end">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={() => handleDelete(selectedQR.id)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default QRManager;