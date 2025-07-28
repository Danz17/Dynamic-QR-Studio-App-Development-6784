import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiTrendingUp, FiGift, FiArrowRight, FiHeart, FiX } = FiIcons;

function RecommendationCard({ 
  recommendation, 
  onAccept, 
  onDismiss, 
  variant = 'default',
  showDismiss = true 
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return 'bg-gradient-to-r from-primary-500 to-purple-600 text-white';
      case 'urgent':
        return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
      case 'promotion':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'upgrade': return FiTrendingUp;
      case 'promotion': return FiGift;
      case 'feature': return FiStar;
      default: return FiArrowRight;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`rounded-xl p-6 relative overflow-hidden ${getVariantStyles()}`}
    >
      {/* Dismiss button */}
      {showDismiss && (
        <button
          onClick={() => onDismiss?.(recommendation.id)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <SafeIcon icon={FiX} className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          variant === 'default' ? 'bg-primary-100' : 'bg-white/20'
        }`}>
          <SafeIcon 
            icon={getIconForType(recommendation.type)} 
            className={`w-6 h-6 ${
              variant === 'default' ? 'text-primary-600' : 'text-white'
            }`} 
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {recommendation.title || recommendation.name}
          </h3>
          <p className={`text-sm ${
            variant === 'default' ? 'text-gray-600' : 'text-white/80'
          }`}>
            {recommendation.description}
          </p>
        </div>
      </div>

      {/* Product details */}
      {recommendation.price && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {recommendation.discount ? (
                <>
                  <span className="line-through text-sm opacity-60 mr-2">
                    {formatPrice(recommendation.price)}
                  </span>
                  {formatPrice(recommendation.price * (1 - recommendation.discount / 100))}
                </>
              ) : (
                formatPrice(recommendation.price)
              )}
            </span>
            {recommendation.discount && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                variant === 'default' ? 'bg-green-100 text-green-800' : 'bg-white/20 text-white'
              }`}>
                {recommendation.discount}% OFF
              </span>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      {recommendation.features && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {recommendation.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs ${
                  variant === 'default' 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-white/20 text-white'
                }`}
              >
                {feature.replace('_', ' ')}
              </span>
            ))}
            {recommendation.features.length > 3 && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                variant === 'default' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-white/20 text-white'
              }`}>
                +{recommendation.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rating */}
      {recommendation.rating && (
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <SafeIcon
                key={i}
                icon={FiStar}
                className={`w-4 h-4 ${
                  i < Math.floor(recommendation.rating)
                    ? (variant === 'default' ? 'text-yellow-400' : 'text-yellow-300')
                    : (variant === 'default' ? 'text-gray-300' : 'text-white/30')
                }`}
              />
            ))}
          </div>
          <span className={`ml-2 text-sm ${
            variant === 'default' ? 'text-gray-600' : 'text-white/80'
          }`}>
            {recommendation.rating} ({recommendation.reviews || '124'} reviews)
          </span>
        </div>
      )}

      {/* Reason */}
      {recommendation.reason && (
        <div className={`text-sm mb-4 ${
          variant === 'default' ? 'text-gray-600' : 'text-white/80'
        }`}>
          💡 {recommendation.reason}
        </div>
      )}

      {/* Urgency indicator */}
      {recommendation.urgency === 'high' && (
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Limited time offer</span>
        </div>
      )}

      {/* Expiry */}
      {recommendation.expires && (
        <div className={`text-sm mb-4 ${
          variant === 'default' ? 'text-orange-600' : 'text-white/80'
        }`}>
          ⏰ Expires: {new Date(recommendation.expires).toLocaleDateString()}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => onAccept?.(recommendation)}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
            variant === 'default'
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span>
            {recommendation.type === 'upgrade' ? 'Upgrade Now' :
             recommendation.type === 'promotion' ? 'Get Offer' :
             recommendation.type === 'addon' ? 'Add Feature' :
             'Learn More'}
          </span>
          <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
        </button>

        {recommendation.type === 'product' && (
          <button
            className={`p-3 rounded-md transition-colors ${
              variant === 'default'
                ? 'border border-gray-300 hover:bg-gray-50'
                : 'border border-white/30 hover:bg-white/10'
            }`}
          >
            <SafeIcon icon={FiHeart} className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Promotion code */}
      {recommendation.code && (
        <div className="mt-4 p-3 bg-black/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Promo Code:</span>
            <code className="px-2 py-1 bg-white/20 rounded text-sm font-mono">
              {recommendation.code}
            </code>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default RecommendationCard;