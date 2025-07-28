import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { recommendationService } from '../services/recommendationService';

export function useRecommendations(context = 'general', options = {}) {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    limit = 5,
    autoRefresh = true,
    refreshInterval = 300000, // 5 minutes
    includePromotions = true,
    includeUpsells = true
  } = options;

  useEffect(() => {
    if (user) {
      loadRecommendations();
      
      if (autoRefresh) {
        const interval = setInterval(loadRecommendations, refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [user, context, limit]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let recs = [];

      switch (context) {
        case 'dashboard':
          recs = recommendationService.getPersonalizedRecommendations(user.id, limit);
          if (includeUpsells) {
            recs = [...recs, ...recommendationService.getUpsellRecommendations(user.id, user.plan)];
          }
          if (includePromotions) {
            recs = [...recs, ...recommendationService.getPromotionalRecommendations()];
          }
          break;

        case 'generator':
          recs = [
            ...recommendationService.getCategoryRecommendations('templates', 2),
            ...recommendationService.getContentRecommendations(user.id)
          ];
          break;

        case 'analytics':
          recs = recommendationService.getCategoryRecommendations('addon', limit);
          break;

        case 'upsell':
          recs = recommendationService.getUpsellRecommendations(user.id, user.plan);
          break;

        case 'promotional':
          recs = recommendationService.getPromotionalRecommendations();
          break;

        default:
          recs = recommendationService.getPersonalizedRecommendations(user.id, limit);
      }

      setRecommendations(recs.slice(0, limit));
    } catch (err) {
      setError(err.message);
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = (action, recommendation) => {
    if (user) {
      recommendationService.trackUserBehavior(user.id, action, {
        recommendationId: recommendation.id,
        type: recommendation.type,
        context
      });
    }
  };

  const acceptRecommendation = (recommendation) => {
    trackInteraction('recommendation_accepted', recommendation);
    
    // Remove from current list
    setRecommendations(recs => recs.filter(r => r.id !== recommendation.id));
    
    return recommendation;
  };

  const dismissRecommendation = (recommendationId) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      trackInteraction('recommendation_dismissed', recommendation);
    }
    
    setRecommendations(recs => recs.filter(r => r.id !== recommendationId));
  };

  const refreshRecommendations = () => {
    loadRecommendations();
  };

  return {
    recommendations,
    loading,
    error,
    acceptRecommendation,
    dismissRecommendation,
    refreshRecommendations,
    trackInteraction
  };
}

export function usePersonalizedContent(userId) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadPersonalizedContent();
    }
  }, [userId]);

  const loadPersonalizedContent = async () => {
    try {
      setLoading(true);
      
      const contentRecs = recommendationService.getContentRecommendations(userId);
      const predictiveRecs = recommendationService.getPredictiveRecommendations(userId);
      
      setContent([...contentRecs, ...predictiveRecs]);
    } catch (error) {
      console.error('Failed to load personalized content:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    content,
    loading,
    refresh: loadPersonalizedContent
  };
}

export function useSmartSuggestions(context, data) {
  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (user && context) {
      generateSuggestions();
    }
  }, [user, context, data]);

  const generateSuggestions = () => {
    // Context-specific suggestions
    const contextSuggestions = [];

    if (context === 'qr_generator' && data) {
      if (data.type === 'url' && !data.analytics) {
        contextSuggestions.push({
          id: 'enable_analytics',
          title: 'Enable Analytics',
          description: 'Track scans and user behavior',
          action: 'analytics',
          priority: 'high'
        });
      }

      if (!data.isDynamic) {
        contextSuggestions.push({
          id: 'make_dynamic',
          title: 'Make Dynamic',
          description: 'Edit content without reprinting',
          action: 'dynamic',
          priority: 'medium'
        });
      }
    }

    setSuggestions(contextSuggestions);
  };

  const applySuggestion = (suggestion) => {
    recommendationService.trackUserBehavior(user.id, 'suggestion_applied', {
      suggestionId: suggestion.id,
      context
    });

    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    return suggestion;
  };

  return {
    suggestions,
    applySuggestion,
    refresh: generateSuggestions
  };
}