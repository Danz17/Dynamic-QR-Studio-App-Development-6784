import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendations } from '../../hooks/useRecommendations';
import RecommendationCard from './RecommendationCard';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiChevronRight, FiRefreshCw } = FiIcons;

function RecommendationWidget({ 
  context = 'dashboard', 
  title = 'Recommended for You',
  limit = 3,
  variant = 'compact',
  className = ''
}) {
  const [expanded, setExpanded] = useState(false);
  const { 
    recommendations, 
    loading, 
    acceptRecommendation, 
    dismissRecommendation,
    refreshRecommendations 
  } = useRecommendations(context, { limit });

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-5 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const displayedRecommendations = expanded ? recommendations : recommendations.slice(0, 2);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiStar} className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={refreshRecommendations}
            className="p-1 hover:bg-white/50 rounded transition-colors"
            title="Refresh recommendations"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          <AnimatePresence>
            {displayedRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                {variant === 'compact' ? (
                  <CompactRecommendationCard
                    recommendation={recommendation}
                    onAccept={acceptRecommendation}
                    onDismiss={dismissRecommendation}
                  />
                ) : (
                  <RecommendationCard
                    recommendation={recommendation}
                    onAccept={acceptRecommendation}
                    onDismiss={dismissRecommendation}
                    variant="default"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Expand/Collapse */}
        {recommendations.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>
              {expanded ? 'Show Less' : `Show ${recommendations.length - 2} More`}
            </span>
            <SafeIcon 
              icon={FiChevronRight} 
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} 
            />
          </button>
        )}
      </div>
    </div>
  );
}

function CompactRecommendationCard({ recommendation, onAccept, onDismiss }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'upgrade': return FiIcons.FiTrendingUp;
      case 'promotion': return FiIcons.FiGift;
      case 'feature': return FiIcons.FiStar;
      case 'tutorial': return FiIcons.FiBook;
      default: return FiIcons.FiLightbulb;
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <SafeIcon 
          icon={getTypeIcon(recommendation.type)} 
          className="w-5 h-5 text-primary-600" 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm truncate">
          {recommendation.title || recommendation.name}
        </h4>
        <p className="text-gray-600 text-xs truncate">
          {recommendation.description}
        </p>
        {recommendation.reason && (
          <p className="text-primary-600 text-xs mt-1">
            💡 {recommendation.reason}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={() => onAccept(recommendation)}
          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
        >
          {recommendation.type === 'upgrade' ? 'Upgrade' : 
           recommendation.type === 'promotion' ? 'Get' : 
           'Try'}
        </button>
        <button
          onClick={() => onDismiss(recommendation.id)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <SafeIcon icon={FiIcons.FiX} className="w-3 h-3 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

export default RecommendationWidget;