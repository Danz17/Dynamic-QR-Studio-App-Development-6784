import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import { useAuthStore } from '../../stores/useAuthStore';
import { qrService } from '../../services/qrService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ShareModal from '../../components/Modals/ShareModal';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { 
  FiLink, FiType, FiWifi, FiUser, FiMail, FiInstagram, 
  FiDownload, FiSave, FiEye, FiSettings, FiPalette, 
  FiUpload, FiSmartphone, FiShoppingBag, FiGift, FiShare2,
  FiInfo, FiAlertTriangle, FiCalendar, FiClock, FiLock
} = FiIcons;

const QR_TYPES = [
  { id: 'url', name: 'Website URL', icon: FiLink, description: 'Link to any website' },
  { id: 'text', name: 'Plain Text', icon: FiType, description: 'Display text message' },
  { id: 'wifi', name: 'WiFi', icon: FiWifi, description: 'WiFi network credentials' },
  { id: 'vcard', name: 'Business Card', icon: FiUser, description: 'Contact information' },
  { id: 'email', name: 'Email', icon: FiMail, description: 'Pre-filled email' },
  { id: 'social', name: 'Social Media', icon: FiInstagram, description: 'Social profiles' },
  { id: 'app', name: 'App Download', icon: FiSmartphone, description: 'App store links' },
  { id: 'menu', name: 'Digital Menu', icon: FiShoppingBag, description: 'Restaurant menu' },
  { id: 'coupon', name: 'Coupon', icon: FiGift, description: 'Discount codes' }
];

function QRGenerator() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [selectedType, setSelectedType] = useState('url');
  const [qrData, setQrData] = useState({
    name: '',
    content: '',
    isDynamic: true,
    isActive: true,
    password: '',
    expiryDate: '',
    scanLimit: ''
  });
  
  const [design, setDesign] = useState({
    size: 300,
    bgColor: '#ffffff',
    fgColor: '#000000',
    level: 'M',
    includeMargin: true,
    style: 'square' // square, dots, rounded
  });
  
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [errors, setErrors] = useState({});
  
  const qrRef = useRef(null);

  // Load template if provided
  useEffect(() => {
    if (templateId) {
      // Load template data
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedType(template.type);
        setDesign(prev => ({ ...prev, ...template.design }));
        if (template.content) {
          setQrData(prev => ({ ...prev, content: template.content }));
        }
      }
    }
  }, [templateId]);

  const validateForm = () => {
    const newErrors = {};

    if (!qrData.name.trim()) {
      newErrors.name = 'QR code name is required';
    }

    if (!qrData.content) {
      newErrors.content = 'Content is required';
    } else if (selectedType === 'url' && !isValidUrl(qrData.content)) {
      newErrors.content = 'Please enter a valid URL';
    } else if (selectedType === 'email' && !isValidEmail(qrData.content)) {
      newErrors.content = 'Please enter a valid email address';
    }

    if (qrData.expiryDate && new Date(qrData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    if (qrData.scanLimit && (isNaN(qrData.scanLimit) || qrData.scanLimit < 1)) {
      newErrors.scanLimit = 'Scan limit must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setLoading(true);
    try {
      const qrCodeData = {
        ...qrData,
        type: selectedType,
        design,
        userId: user.id
      };

      const newQR = await qrService.createQRCode(qrCodeData);
      setGeneratedQR(newQR);
      toast.success('QR code created successfully!');
      
      // Show share modal
      setTimeout(() => setShowShareModal(true), 500);
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to create QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format = 'png') => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${qrData.name || 'qr-code'}.${format}`;
    
    if (format === 'png') {
      link.href = canvas.toDataURL('image/png');
    } else if (format === 'svg') {
      // Convert to SVG (simplified)
      const svg = canvas.toDataURL('image/svg+xml');
      link.href = svg;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };

  const renderContentForm = () => {
    switch (selectedType) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={qrData.content}
                onChange={(e) => setQrData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Message
              </label>
              <textarea
                value={qrData.content}
                onChange={(e) => setQrData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your text message"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={qrData.content?.ssid || ''}
                onChange={(e) => setQrData(prev => ({ 
                  ...prev, 
                  content: { ...prev.content, ssid: e.target.value }
                }))}
                placeholder="WiFi Network Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={qrData.content?.password || ''}
                onChange={(e) => setQrData(prev => ({ 
                  ...prev, 
                  content: { ...prev.content, password: e.target.value }
                }))}
                placeholder="WiFi Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Type
              </label>
              <select
                value={qrData.content?.security || 'WPA'}
                onChange={(e) => setQrData(prev => ({ 
                  ...prev, 
                  content: { ...prev.content, security: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <input
                type="text"
                value={qrData.content}
                onChange={(e) => setQrData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter content"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('nav.generate')} - QR Studio</title>
        <meta name="description" content="Create custom QR codes with advanced design options and analytics tracking." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('nav.generate')}
            </h1>
            <p className="text-gray-600">
              Create a custom QR code with advanced design options.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* QR Type Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Select QR Code Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {QR_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 md:p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedType === type.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <SafeIcon icon={type.icon} className="w-5 h-5 md:w-6 md:h-6 text-primary-600 mb-2" />
                      <h3 className="font-medium text-gray-900 text-sm md:text-base">{type.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Content Configuration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
              >
                {/* Tabs */}
                <div className="flex flex-wrap space-x-2 md:space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
                  {['content', 'design', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 px-1 border-b-2 font-medium text-sm md:text-base whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        QR Code Name
                      </label>
                      <input
                        type="text"
                        value={qrData.name}
                        onChange={(e) => setQrData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter a name for your QR code"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    {renderContentForm()}
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Foreground Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={design.fgColor}
                            onChange={(e) => setDesign(prev => ({ ...prev, fgColor: e.target.value }))}
                            className="w-12 h-10 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            value={design.fgColor}
                            onChange={(e) => setDesign(prev => ({ ...prev, fgColor: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={design.bgColor}
                            onChange={(e) => setDesign(prev => ({ ...prev, bgColor: e.target.value }))}
                            className="w-12 h-10 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            value={design.bgColor}
                            onChange={(e) => setDesign(prev => ({ ...prev, bgColor: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="500"
                        value={design.size}
                        onChange={(e) => setDesign(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>200px</span>
                        <span>{design.size}px</span>
                        <span>500px</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          Dynamic QR Code
                          <SafeIcon icon={FiInfo} className="w-4 h-4 ml-2 text-gray-400" />
                        </h3>
                        <p className="text-sm text-gray-600">
                          Allow editing content after creation
                        </p>
                        {!qrData.isDynamic && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 flex items-start">
                            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Static QR codes cannot be edited after creation</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={qrData.isDynamic}
                        onChange={(e) => setQrData(prev => ({ ...prev, isDynamic: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    {qrData.isDynamic && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <SafeIcon icon={FiLock} className="w-4 h-4 inline mr-1" />
                            Password Protection (Optional)
                          </label>
                          <input
                            type="password"
                            value={qrData.password}
                            onChange={(e) => setQrData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
                              Expiry Date (Optional)
                            </label>
                            <input
                              type="datetime-local"
                              value={qrData.expiryDate}
                              onChange={(e) => setQrData(prev => ({ ...prev, expiryDate: e.target.value }))}
                              min={new Date().toISOString().slice(0, 16)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                                errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <SafeIcon icon={FiClock} className="w-4 h-4 inline mr-1" />
                              Scan Limit (Optional)
                            </label>
                            <input
                              type="number"
                              value={qrData.scanLimit}
                              onChange={(e) => setQrData(prev => ({ ...prev, scanLimit: e.target.value }))}
                              placeholder="Unlimited"
                              min="1"
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                                errors.scanLimit ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.scanLimit && (
                              <p className="mt-1 text-sm text-red-600">{errors.scanLimit}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Preview Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* QR Code Preview */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Preview
                </h2>
                <div className="flex justify-center mb-6">
                  <div ref={qrRef} className="p-4 bg-gray-50 rounded-lg">
                    {qrData.content ? (
                      <QRCode
                        value={qrData.content}
                        size={design.size}
                        bgColor={design.bgColor}
                        fgColor={design.fgColor}
                        level={design.level}
                        includeMargin={design.includeMargin}
                      />
                    ) : (
                      <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
                        <SafeIcon icon={FiEye} className="w-8 h-8 mb-2" />
                        <p className="text-sm text-center">Enter content to see preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload('png')}
                      disabled={!qrData.content}
                      className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => handleDownload('svg')}
                      disabled={!qrData.content}
                      className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>SVG</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSave}
                    disabled={!qrData.name || !qrData.content || loading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        <span>Save QR Code</span>
                      </>
                    )}
                  </button>

                  {generatedQR && (
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <SafeIcon icon={FiShare2} className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  )}
                </div>
              </div>

              {/* QR Info */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">QR Code Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {QR_TYPES.find(t => t.id === selectedType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dynamic:</span>
                    <span className="font-medium">
                      {qrData.isDynamic ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${qrData.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                      {qrData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && generatedQR && (
        <ShareModal
          qrCode={generatedQR}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}

// Helper functions
const getTemplateById = (id) => {
  // This would normally fetch from a templates service
  const templates = {
    'business-card': {
      type: 'vcard',
      content: { name: 'John Doe', email: 'john@example.com' },
      design: { fgColor: '#1e40af', bgColor: '#ffffff' }
    },
    'website': {
      type: 'url',
      content: 'https://example.com',
      design: { fgColor: '#3b82f6', bgColor: '#ffffff' }
    }
  };
  return templates[id];
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default QRGenerator;