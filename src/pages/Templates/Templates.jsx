import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQR } from '../../contexts/QRContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiLink, FiWifi, FiUser, FiGrid, FiMail, FiTag, 
  FiCreditCard, FiShoppingBag, FiSmartphone, FiArrowRight 
} = FiIcons;

function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { setTemplates } = useQR();

  const categories = [
    { id: 'all', name: 'All Templates', icon: FiGrid },
    { id: 'business', name: 'Business', icon: FiUser },
    { id: 'marketing', name: 'Marketing', icon: FiTag },
    { id: 'ecommerce', name: 'E-commerce', icon: FiShoppingBag },
    { id: 'events', name: 'Events', icon: FiCalendar },
    { id: 'restaurant', name: 'Restaurant', icon: FiCoffee }
  ];

  const templates = [
    {
      id: 'business-card',
      name: 'Business Card',
      description: 'Share your contact information',
      icon: FiUser,
      category: 'business',
      type: 'vcard',
      design: {
        dotsOptions: { color: '#1e40af', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#1e40af', type: 'extra-rounded' },
        cornersDotOptions: { color: '#1e40af', type: 'dot' }
      }
    },
    {
      id: 'website',
      name: 'Website',
      description: 'Link to your website',
      icon: FiLink,
      category: 'business',
      type: 'url',
      design: {
        dotsOptions: { color: '#3b82f6', type: 'dots' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#3b82f6', type: 'extra-rounded' },
        cornersDotOptions: { color: '#3b82f6', type: 'dot' }
      }
    },
    {
      id: 'wifi',
      name: 'WiFi Access',
      description: 'Share WiFi credentials',
      icon: FiWifi,
      category: 'business',
      type: 'wifi',
      design: {
        dotsOptions: { color: '#10b981', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#10b981', type: 'extra-rounded' },
        cornersDotOptions: { color: '#10b981', type: 'dot' }
      }
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Start an email conversation',
      icon: FiMail,
      category: 'business',
      type: 'email',
      design: {
        dotsOptions: { color: '#6366f1', type: 'classy-rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#6366f1', type: 'extra-rounded' },
        cornersDotOptions: { color: '#6366f1', type: 'dot' }
      }
    },
    {
      id: 'coupon',
      name: 'Coupon',
      description: 'Share discount codes',
      icon: FiTag,
      category: 'marketing',
      type: 'text',
      design: {
        dotsOptions: { color: '#f59e0b', type: 'dots' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#f59e0b', type: 'extra-rounded' },
        cornersDotOptions: { color: '#f59e0b', type: 'dot' }
      }
    },
    {
      id: 'payment',
      name: 'Payment',
      description: 'Receive payments',
      icon: FiCreditCard,
      category: 'ecommerce',
      type: 'url',
      design: {
        dotsOptions: { color: '#059669', type: 'classy' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#059669', type: 'extra-rounded' },
        cornersDotOptions: { color: '#059669', type: 'dot' }
      }
    },
    {
      id: 'product',
      name: 'Product Info',
      description: 'Display product details',
      icon: FiShoppingBag,
      category: 'ecommerce',
      type: 'url',
      design: {
        dotsOptions: { color: '#7c3aed', type: 'dots' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#7c3aed', type: 'extra-rounded' },
        cornersDotOptions: { color: '#7c3aed', type: 'dot' }
      }
    },
    {
      id: 'app-download',
      name: 'App Download',
      description: 'Link to app stores',
      icon: FiSmartphone,
      category: 'marketing',
      type: 'url',
      design: {
        dotsOptions: { color: '#db2777', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#db2777', type: 'extra-rounded' },
        cornersDotOptions: { color: '#db2777', type: 'dot' }
      }
    }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  const handleSelectTemplate = (template) => {
    // Store the selected template to be used in the generator
    setTemplates(prevTemplates => [...prevTemplates, template]);
    
    // Navigate to the QR generator with the template
    navigate(`/generate?template=${template.id}`);
  };

  return (
    <>
      <Helmet>
        <title>QR Code Templates - QR Studio</title>
        <meta name="description" content="Choose from a variety of professionally designed QR code templates." />
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
              QR Code Templates
            </h1>
            <p className="text-gray-600">
              Choose from our collection of professionally designed templates.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={category.icon} className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto">
                    <div 
                      className="w-16 h-16 rounded-lg" 
                      style={{ 
                        background: `linear-gradient(135deg, ${template.design.dotsOptions.color}88, ${template.design.cornersSquareOptions?.color || template.design.dotsOptions.color})`,
                      }}
                    >
                      <SafeIcon 
                        icon={template.icon} 
                        className="w-full h-full p-4 text-white" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <span>Use Template</span>
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Add missing icons
const FiCalendar = FiIcons.FiCalendar;
const FiCoffee = FiIcons.FiCoffee;

export default Templates;