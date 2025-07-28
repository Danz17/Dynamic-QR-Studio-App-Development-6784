import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiShare2, FiCopy, FiDownload, FiMail, FiFacebook, FiTwitter, FiLinkedin, FiMessageSquare } = FiIcons;

function ShareModal({ qrCode, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  const qrUrl = `${window.location.origin}/qr/${qrCode.id}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDownload = (format) => {
    // This would normally trigger the actual download
    toast.success(`Downloading ${format.toUpperCase()} file...`);
  };

  const handleSocialShare = (platform) => {
    const text = `Check out my QR code: ${qrCode.name}`;
    const url = qrUrl;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(qrCode.name)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiShare2} className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Share QR Code</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* QR Code Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-1">{qrCode.name}</h4>
              <p className="text-sm text-gray-600">Created on {new Date(qrCode.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Share URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Download Options */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Download</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDownload('png')}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs font-medium text-gray-700">PNG</span>
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs font-medium text-gray-700">SVG</span>
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs font-medium text-gray-700">PDF</span>
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Share on Social Media</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiFacebook} className="w-4 h-4" />
                  <span className="text-sm font-medium">Facebook</span>
                </button>
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex items-center justify-center space-x-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <SafeIcon icon={FiTwitter} className="w-4 h-4" />
                  <span className="text-sm font-medium">Twitter</span>
                </button>
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <SafeIcon icon={FiLinkedin} className="w-4 h-4" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleSocialShare('whatsapp')}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
              </div>
              <button
                onClick={() => handleSocialShare('email')}
                className="w-full mt-2 flex items-center justify-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiMail} className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ShareModal;