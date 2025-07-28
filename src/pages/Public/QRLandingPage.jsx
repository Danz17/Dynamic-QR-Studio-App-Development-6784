import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const { FiExternalLink, FiDownload, FiShare2, FiInfo } = FiIcons;

function QRLandingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // In a real app, we would fetch the page data from the API
        // For now, we'll simulate a successful fetch with mock data
        setTimeout(() => {
          setPageData({
            id,
            title: 'Product Demo',
            description: 'Explore our latest product and its features',
            elements: [
              {
                type: 'heading',
                content: 'Wireless Noise-Cancelling Headphones',
                align: 'center',
                size: 'large'
              },
              {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                alt: 'Wireless Headphones'
              },
              {
                type: 'text',
                content: 'Experience premium sound quality with our latest wireless noise-cancelling headphones. Designed for comfort and performance, these headphones deliver exceptional audio clarity and up to 30 hours of battery life.',
                align: 'left'
              },
              {
                type: 'heading',
                content: 'Key Features',
                align: 'left',
                size: 'medium'
              },
              {
                type: 'text',
                content: '• Active Noise Cancellation\n• 30-hour battery life\n• Premium sound quality\n• Comfortable fit for all-day wear\n• Voice assistant compatibility',
                align: 'left'
              },
              {
                type: 'button',
                content: 'Buy Now - $249.99',
                align: 'center',
                color: 'primary',
                url: '#'
              }
            ],
            createdAt: '2023-09-15T14:48:00.000Z',
            visits: 1256
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load the landing page. Please try again later.');
        setLoading(false);
      }
    };

    fetchPageData();
    
    // Record a visit in a real application
    const recordVisit = async () => {
      try {
        // Here we would make an API call to record the visit
        console.log('Visit recorded for QR code:', id);
      } catch (err) {
        console.error('Error recording visit:', err);
      }
    };

    recordVisit();
  }, [id]);

  const renderElement = (element, index) => {
    switch (element.type) {
      case 'heading':
        return (
          <div key={index} className="mb-4 w-full">
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
          <div key={index} className="mb-6 w-full">
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
          <div key={index} className="mb-6 w-full flex justify-center">
            <img 
              src={element.src} 
              alt={element.alt || 'Image'} 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        );
      
      case 'button':
        return (
          <div 
            key={index} 
            className={`mb-6 w-full flex ${
              element.align === 'center' ? 'justify-center' : element.align === 'right' ? 'justify-end' : 'justify-start'
            }`}
          >
            <a 
              href={element.url || '#'}
              className={`px-8 py-3 rounded-md font-medium transition-colors ${
                element.color === 'primary' ? 'bg-primary-600 hover:bg-primary-700 text-white' : 
                element.color === 'secondary' ? 'bg-secondary-600 hover:bg-secondary-700 text-white' : 
                'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {element.content}
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <SafeIcon icon={FiInfo} className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 text-center mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageData.title || 'QR Landing Page'} - QR Studio</title>
        <meta name="description" content={pageData.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-md"
          >
            {pageData.elements.map((element, index) => renderElement(element, index))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 py-4">
          <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 mb-2 md:mb-0">
              Created with QR Studio
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <SafeIcon icon={FiShare2} className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
              <a 
                href="https://qrstudio.example.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                <span className="text-sm">Create Your Own</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QRLandingPage;