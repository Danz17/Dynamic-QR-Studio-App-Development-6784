import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';
import { recommendationService } from '../../services/recommendationService';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBulb, FiArrowRight, FiX, FiRefreshCw } = FiIcons;

function SmartSuggestions({ context, data, onSuggestionApplied }) {
  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (user && context) {
      generateSuggestions();
    }
  }, [user, context, data]);

  const generateSuggestions = () => {
    const contextualSuggestions = [];

    switch (context) {
      case 'qr_generator':
        if (data?.type === 'url') {
          contextualSuggestions.push({
            id: 'analytics_suggestion',
            title: 'Enable Analytics',
            description: 'Track how many people scan this QR code',
            action: 'enable_analytics',
            priority: 'high',
            icon: FiIcons.FiBarChart3
          });
        }
        
        if (!data?.isDynamic) {
          contextualSuggestions.push({
            id: 'dynamic_suggestion',
            title: 'Make it Dynamic',
            description: 'Edit content later without reprinting',
            action: 'make_dynamic',
            priority: 'medium',
            icon: FiIcons.FiEdit3
          });
        }
        break;

      case 'dashboard':
        const userBehavior = recommendationService.userBehavior.get(user.id);
        if (userBehavior?.actions.length >= 10) {
          contextualSuggestions.push({
            id: 'bulk_generation',
            title: 'Try Bulk Generation',
            description: 'Create multiple QR codes at once with CSV import',
            action: 'navigate_bulk',
            priority: 'medium',
            icon: FiIcons.FiUpload
          });
        }
        break;

      case 'analytics':
        contextualSuggestions.push({
          id: 'export_data',
          title: 'Export Your Data',
          description: 'Download analytics data for further analysis',
          action: 'export_analytics',
          priority: 'low',
          icon: FiIcons.FiDownload
        });
        break;
    }

    // Add AI-powered suggestions
    const aiSuggestions = getAISuggestions();
    setSuggestions([...contextualSuggestions, ...aiSuggestions].slice(0, 3));
  };

  const getAISuggestions = () => {
    const userBehavior = recommendationService.userBehavior.get(user.id);
    const suggestions = [];

    if (userBehavior) {
      // Analyze patterns and suggest optimizations
      const qrTypes = userBehavior.preferences?.qrTypes || {};
      const mostUsedType = Object.keys(qrTypes).reduce((a, b) => 
        qrTypes[a] > qrTypes[b] ? a : b, 'url'
      );

      if (mostUsedType === 'url' && !userBehavior.preferences?.features?.landing_pages) {
        suggestions.push({
          id: 'landing_page_suggestion',
          title: 'Create Landing Pages',
          description: 'Build custom landing pages for your URL QR codes',
          action: 'try_landing_builder',
          priority: 'medium',
          icon: FiIcons.FiLayout
        });
      }

      // Time-based suggestions
      const lastActive = new Date(userBehavior.lastActive);
      const daysSinceActive = (new Date() - lastActive) / (1000 * 60 * 60 * 24);
      
      if (daysSinceActive > 7) {
        suggestions.push({
          id: 'welcome_back',
          title: 'Welcome Back!',
          description: 'Check out new features added since your last visit',
          action: 'show_whats_new',
          priority: 'high',
          icon: FiIcons.FiStar
        });
      }
    }

    return suggestions;
  };

  const applySuggestion = (suggestion) => {
    // Track suggestion usage
    recommendationService.trackUserBehavior(user.id, 'suggestion_applied', {
      suggestionId: suggestion.id,
      context,
      action: suggestion.action
    });

    // Execute suggestion action
    switch (suggestion.action) {
      case 'enable_analytics':
        onSuggestionApplied?.({ type: 'analytics', enabled: true });
        break;
      
      case 'make_dynamic':
        onSuggestionApplied?.({ type: 'dynamic', enabled: true });
        break;
      
      case 'navigate_bulk':
        window.location.href = '/bulk';
        break;
      
      case 'try_landing_builder':
        window.location.href = '/landing-builder';
        break;
      
      case 'export_analytics':
        onSuggestionApplied?.({ type: 'export' });
        break;
      
      case 'show_whats_new':
        // Show what's new modal
        onSuggestionApplied?.({ type: 'whats_new' });
        break;
    }

    // Remove applied suggestion
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (suggestionId) => {
    recommendationService.trackUserBehavior(user.id, 'suggestion_dismissed', {
      suggestionId,
      context
    });
    
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiBulb} className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Smart Suggestions</h4>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={generateSuggestions}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
            title="Refresh suggestions"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={suggestion.icon} className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900 text-sm">
                  {suggestion.title}
                </h5>
                <p className="text-gray-600 text-xs">
                  {suggestion.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => applySuggestion(suggestion)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <span>Apply</span>
                <SafeIcon icon={FiArrowRight} className="w-3 h-3" />
              </button>
              <button
                onClick={() => dismissSuggestion(suggestion.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <SafeIcon icon={FiX} className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default SmartSuggestions;