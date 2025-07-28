import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';
import { recommendationService } from '../../services/recommendationService';
import RecommendationCard from './RecommendationCard';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiX, FiRefreshCw, FiSettings, FiEye, FiEyeOff } = FiIcons;

function RecommendationPanel({ 
  visible = true, 
  onClose, 
  context = 'dashboard',
  maxRecommendations = 3 
}) {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());
  const [preferences, setPreferences] = useState({
    showPromotions: true,
    showUpsells: true,
    showContent: true,
    frequency: 'normal' // low, normal, high
  });

  useEffect(() => {
    if (user && visible) {
      loadRecommendations();
    }
  }, [user, visible, context]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      let recs = [];

      // Get different types of recommendations based on context
      switch (context) {
        case 'dashboard':
          recs = [
            ...recommendationService.getPersonalizedRecommendations(user.id, 2),
            ...recommendationService.getUpsellRecommendations(user.id, user.plan),
            ...recommendationService.getPromotionalRecommendations()
          ];
          break;
        
        case 'generator':
          recs = [
            ...recommendationService.getCategoryRecommendations('templates', 2),
            ...recommendationService.getContentRecommendations(user.id)
          ];
          break;
        
        case 'analytics':
          recs = [
            ...recommendationService.getCategoryRecommendations('addon', 2),
            ...recommendationService.getPredictiveRecommendations(user.id)
          ];
          break;
        
        default:
          recs = recommendationService.getPersonalizedRecommendations(user.id, maxRecommendations);
      }

      // Filter based on preferences
      const filteredRecs = recs.filter(rec => {
        if (!preferences.showPromotions && rec.type === 'promotion') return false;
        if (!preferences.showUpsells && rec.type === 'upgrade') return false;
        if (!preferences.showContent && rec.type === 'tutorial') return false;
        if (dismissed.has(rec.id)) return false;
        return true;
      });

      setRecommendations(filteredRecs.slice(0, maxRecommendations));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRecommendation = (recommendation) => {
    // Track acceptance
    recommendationService.trackUserBehavior(user.id, 'recommendation_accepted', {
      recommendationId: recommendation.id,
      type: recommendation.type,
      context
    });

    // Handle different recommendation types
    switch (recommendation.type) {
      case 'upgrade':
      case 'addon':
        // Navigate to pricing or product page
        window.open(`/pricing?product=${recommendation.product}`, '_blank');
        break;
      
      case 'tutorial':
        // Navigate to tutorial
        window.open(recommendation.url, '_blank');
        break;
      
      case 'feature':
        // Trigger feature action
        if (recommendation.action === 'create_dynamic_qr') {
          window.location.href = '/generate?type=dynamic';
        }
        break;
      
      default:
        console.log('Recommendation accepted:', recommendation);
    }

    // Remove from current recommendations
    setRecommendations(recs => recs.filter(r => r.id !== recommendation.id));
  };

  const handleDismissRecommendation = (recommendationId) => {
    // Track dismissal
    recommendationService.trackUserBehavior(user.id, 'recommendation_dismissed', {
      recommendationId,
      context
    });

    // Add to dismissed set
    setDismissed(prev => new Set([...prev, recommendationId]));
    
    // Remove from current recommendations
    setRecommendations(recs => recs.filter(r => r.id !== recommendationId));
  };

  const refreshRecommendations = () => {
    setDismissed(new Set());
    loadRecommendations();
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!visible || (!loading && recommendations.length === 0)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-4 top-20 w-80 max-h-[calc(100vh-100px)] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-40"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiStar} className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshRecommendations}
              className="p-1 hover:bg-white/50 rounded transition-colors"
              title="Refresh recommendations"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              <SafeIcon icon={FiX} className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Finding recommendations...</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id || index}
                  recommendation={recommendation}
                  onAccept={handleAcceptRecommendation}
                  onDismiss={handleDismissRecommendation}
                  variant={
                    recommendation.urgency === 'high' ? 'urgent' :
                    recommendation.type === 'promotion' ? 'promotion' :
                    index === 0 ? 'featured' : 'default'
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-gray-900">
            <span className="flex items-center space-x-2">
              <SafeIcon icon={FiSettings} className="w-4 h-4" />
              <span>Preferences</span>
            </span>
            <SafeIcon 
              icon={FiEye} 
              className="w-4 h-4 group-open:rotate-180 transition-transform" 
            />
          </summary>
          <div className="mt-3 space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={preferences.showPromotions}
                onChange={() => togglePreference('showPromotions')}
                className="rounded"
              />
              <span>Show promotions</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={preferences.showUpsells}
                onChange={() => togglePreference('showUpsells')}
                className="rounded"
              />
              <span>Show upgrades</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={preferences.showContent}
                onChange={() => togglePreference('showContent')}
                className="rounded"
              />
              <span>Show tutorials</span>
            </label>
          </div>
        </details>
      </div>
    </motion.div>
  );
}

export default RecommendationPanel;