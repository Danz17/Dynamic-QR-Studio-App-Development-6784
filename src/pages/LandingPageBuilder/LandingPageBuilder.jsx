import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiEdit3, FiLayout, FiImage, FiType, FiLink, FiGrid,
  FiLayers, FiSave, FiTrash2, FiPlus, FiAlignLeft, FiAlignCenter
} = FiIcons;

function LandingPageBuilder() {
  const [activeTemplate, setActiveTemplate] = useState('blank');
  const [pageTitle, setPageTitle] = useState('My Landing Page');
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);

  const templates = [
    {
      id: 'blank',
      name: 'Blank Canvas',
      description: 'Start from scratch',
      elements: []
    },
    {
      id: 'product',
      name: 'Product Page',
      description: 'Showcase your product',
      elements: [
        { id: '1', type: 'heading', content: 'Product Name', align: 'center', size: 'large' },
        { id: '2', type: 'image', src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Product' },
        { id: '3', type: 'text', content: 'This is a product description. Write about your product here.', align: 'left' },
        { id: '4', type: 'button', content: 'Buy Now', url: '#', color: 'primary' }
      ]
    },
    {
      id: 'contact',
      name: 'Contact Info',
      description: 'Share your contact details',
      elements: [
        { id: '1', type: 'heading', content: 'Contact Us', align: 'center', size: 'large' },
        { id: '2', type: 'text', content: 'Get in touch with our team', align: 'center' },
        { id: '3', type: 'text', content: 'Email: contact@example.com\nPhone: (123) 456-7890\nAddress: 123 Main St, City', align: 'center' }
      ]
    }
  ];

  const handleSelectTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setActiveTemplate(templateId);
      setElements(template.elements);
      setShowTemplates(false);
    }
  };

  const handleAddElement = (type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      content: type === 'heading' ? 'New Heading' : 
              type === 'text' ? 'New Text Block' :
              type === 'button' ? 'Button Text' : '',
      align: 'left',
      size: type === 'heading' ? 'medium' : undefined,
      src: type === 'image' ? 'https://images.unsplash.com/photo-1569396116180-210c182bedb8?w=500' : undefined,
      url: type === 'button' ? '#' : undefined,
      color: type === 'button' ? 'primary' : undefined
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleDeleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleUpdateElement = (id, updates) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const renderElement = (element) => {
    const isSelected = selectedElement === element.id;
    const baseProps = {
      className: `${isSelected ? 'border-2 border-dashed border-primary-500' : ''}`,
      onClick: () => setSelectedElement(element.id)
    };
    
    switch (element.type) {
      case 'heading':
        return (
          <div {...baseProps} className={`${baseProps.className} mb-4 w-full`}>
            <h2 
              className={`
                ${element.size === 'large' ? 'text-3xl' : element.size === 'medium' ? 'text-2xl' : 'text-xl'} 
                font-bold 
                ${element.align === 'center' ? 'text-center' : element.align === 'right' ? 'text-right' : 'text-left'}
              `}
            >
              {element.content}
            </h2>
          </div>
        );
      
      case 'text':
        return (
          <div {...baseProps} className={`${baseProps.className} mb-4 w-full`}>
            <p 
              className={`
                text-gray-600 whitespace-pre-wrap
                ${element.align === 'center' ? 'text-center' : element.align === 'right' ? 'text-right' : 'text-left'}
              `}
            >
              {element.content}
            </p>
          </div>
        );
      
      case 'image':
        return (
          <div {...baseProps} className={`${baseProps.className} mb-4 w-full flex justify-center`}>
            <img 
              src={element.src} 
              alt={element.alt || 'Image'} 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      
      case 'button':
        return (
          <div {...baseProps} className={`${baseProps.className} mb-4 w-full flex ${
            element.align === 'center' ? 'justify-center' : element.align === 'right' ? 'justify-end' : 'justify-start'
          }`}>
            <button 
              className={`px-6 py-2 rounded-md ${
                element.color === 'primary' ? 'bg-primary-600 text-white' : 
                element.color === 'secondary' ? 'bg-secondary-600 text-white' : 
                'bg-gray-200 text-gray-800'
              }`}
            >
              {element.content}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderElementEditor = () => {
    if (!selectedElement) return null;
    
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return null;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-4">Edit Element</h3>
        
        {/* Common controls */}
        <div className="space-y-4 mb-4">
          {/* Content */}
          {(element.type === 'heading' || element.type === 'text' || element.type === 'button') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {element.type === 'heading' ? 'Heading Text' : 
                 element.type === 'text' ? 'Text Content' : 'Button Label'}
              </label>
              {element.type === 'text' ? (
                <textarea
                  value={element.content}
                  onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  value={element.content}
                  onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              )}
            </div>
          )}
          
          {/* Alignment */}
          {(element.type === 'heading' || element.type === 'text' || element.type === 'button') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alignment
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateElement(element.id, { align: 'left' })}
                  className={`p-2 rounded ${element.align === 'left' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  <SafeIcon icon={FiAlignLeft} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleUpdateElement(element.id, { align: 'center' })}
                  className={`p-2 rounded ${element.align === 'center' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  <SafeIcon icon={FiAlignCenter} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleUpdateElement(element.id, { align: 'right' })}
                  className={`p-2 rounded ${element.align === 'right' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  <SafeIcon icon={FiIcons.FiAlignRight} className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Element specific controls */}
          {element.type === 'heading' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={element.size}
                onChange={(e) => handleUpdateElement(element.id, { size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          )}
          
          {element.type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={element.src}
                onChange={(e) => handleUpdateElement(element.id, { src: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={element.alt || ''}
                onChange={(e) => handleUpdateElement(element.id, { alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}
          
          {element.type === 'button' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button URL
                </label>
                <input
                  type="text"
                  value={element.url}
                  onChange={(e) => handleUpdateElement(element.id, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  value={element.color}
                  onChange={(e) => handleUpdateElement(element.id, { color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </>
          )}
        </div>
        
        {/* Delete button */}
        <button
          onClick={() => handleDeleteElement(element.id)}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          <span>Delete Element</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Landing Page Builder - QR Studio</title>
        <meta name="description" content="Create custom landing pages for your QR codes with our drag-and-drop builder." />
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
                  Landing Page Builder
                </h1>
                <p className="text-gray-600">
                  Create custom landing pages for your QR codes
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiLayout} className="w-4 h-4" />
                  <span>Templates</span>
                </button>
                <button
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>Save Page</span>
                </button>
              </div>
            </div>
          </motion.div>

          {showTemplates ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose a Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.id)}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:shadow-md transition-all"
                    >
                      <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <SafeIcon icon={FiLayout} className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Editor Tools */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1 space-y-6"
              >
                {/* Page Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Page Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Add Elements */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Add Elements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddElement('heading')}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded hover:border-primary-500 hover:bg-primary-50"
                    >
                      <SafeIcon icon={FiType} className="w-6 h-6 text-primary-600 mb-1" />
                      <span className="text-xs">Heading</span>
                    </button>
                    <button
                      onClick={() => handleAddElement('text')}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded hover:border-primary-500 hover:bg-primary-50"
                    >
                      <SafeIcon icon={FiAlignLeft} className="w-6 h-6 text-primary-600 mb-1" />
                      <span className="text-xs">Text</span>
                    </button>
                    <button
                      onClick={() => handleAddElement('image')}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded hover:border-primary-500 hover:bg-primary-50"
                    >
                      <SafeIcon icon={FiImage} className="w-6 h-6 text-primary-600 mb-1" />
                      <span className="text-xs">Image</span>
                    </button>
                    <button
                      onClick={() => handleAddElement('button')}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded hover:border-primary-500 hover:bg-primary-50"
                    >
                      <SafeIcon icon={FiLink} className="w-6 h-6 text-primary-600 mb-1" />
                      <span className="text-xs">Button</span>
                    </button>
                  </div>
                </div>

                {/* Element Editor */}
                {selectedElement && renderElementEditor()}
              </motion.div>

              {/* Preview Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 min-h-[600px]">
                  <div className="border-b border-gray-200 pb-2 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{pageTitle}</h2>
                  </div>
                  
                  {elements.length > 0 ? (
                    <div className="space-y-2">
                      {elements.map((element) => (
                        <div key={element.id} className="relative">
                          {renderElement(element)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                      <SafeIcon icon={FiLayers} className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Your page is empty</p>
                      <p className="text-sm text-gray-500 mb-4">Add elements from the sidebar to get started</p>
                      <button
                        onClick={() => handleAddElement('heading')}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4" />
                        <span>Add Heading</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LandingPageBuilder;