import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import useFeedback from '../../hooks/useFeedback';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare } = FiIcons;

function FeedbackTrigger({ 
  variant = 'floating', // 'floating', 'button', 'link'
  className = '',
  children,
  position = 'middle-right' // 'middle-right', 'bottom-right', 'custom'
}) {
  const { openFeedback } = useFeedback();

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-6 right-6';
      case 'middle-right':
        return 'fixed top-1/2 -translate-y-1/2 right-0';
      default:
        return '';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'floating':
        return 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl';
      case 'button':
        return 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700';
      case 'link':
        return 'text-primary-600 hover:text-primary-700 underline';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
    }
  };

  if (variant === 'link') {
    return (
      <button
        onClick={openFeedback}
        className={`inline-flex items-center space-x-1 transition-colors ${getVariantClasses()} ${className}`}
      >
        {children || (
          <>
            <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
            <span>Feedback</span>
          </>
        )}
      </button>
    );
  }

  return (
    <motion.button
      onClick={openFeedback}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center justify-center
        px-4 py-2 rounded-full
        transition-all duration-200
        ${getVariantClasses()}
        ${getPositionClasses()}
        ${className}
      `}
    >
      {children || (
        <>
          <SafeIcon icon={FiMessageSquare} className="w-5 h-5 mr-2" />
          <span className="font-medium">Feedback</span>
        </>
      )}
    </motion.button>
  );
}

export default FeedbackTrigger;