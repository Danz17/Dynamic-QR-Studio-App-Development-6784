import { supabase } from '../lib/supabase';

class RecommendationService {
  constructor() {
    this.userBehavior = new Map();
    this.productCatalog = new Map();
    this.initializeProductCatalog();
  }

  initializeProductCatalog() {
    // Product catalog with categories, features, and compatibility
    const products = [
      {
        id: 'qr-pro-plus',
        name: 'QR Pro Plus',
        category: 'subscription',
        price: 29.99,
        features: ['unlimited_qr', 'advanced_analytics', 'custom_branding', 'api_access'],
        targetUsers: ['business', 'enterprise'],
        description: 'Advanced QR code management for businesses',
        compatibility: ['bulk_generation', 'team_collaboration'],
        rating: 4.8,
        popularity: 0.85
      },
      {
        id: 'analytics-dashboard',
        name: 'Advanced Analytics Dashboard',
        category: 'addon',
        price: 9.99,
        features: ['real_time_analytics', 'custom_reports', 'data_export'],
        targetUsers: ['marketer', 'analyst'],
        description: 'Deep insights into your QR code performance',
        compatibility: ['qr_generation'],
        rating: 4.6,
        popularity: 0.72
      },
      {
        id: 'white-label-solution',
        name: 'White Label Solution',
        category: 'enterprise',
        price: 199.99,
        features: ['custom_branding', 'domain_mapping', 'api_integration'],
        targetUsers: ['agency', 'enterprise'],
        description: 'Complete white-label QR solution for agencies',
        compatibility: ['team_collaboration', 'api_access'],
        rating: 4.9,
        popularity: 0.45
      },
      {
        id: 'mobile-app',
        name: 'QR Studio Mobile App',
        category: 'mobile',
        price: 4.99,
        features: ['mobile_scanning', 'offline_mode', 'camera_integration'],
        targetUsers: ['individual', 'business'],
        description: 'Scan and manage QR codes on the go',
        compatibility: ['qr_generation', 'analytics'],
        rating: 4.4,
        popularity: 0.68
      },
      {
        id: 'design-templates',
        name: 'Premium Design Templates',
        category: 'templates',
        price: 14.99,
        features: ['premium_designs', 'custom_styles', 'brand_templates'],
        targetUsers: ['designer', 'marketer'],
        description: 'Professional QR code design templates',
        compatibility: ['qr_generation'],
        rating: 4.7,
        popularity: 0.59
      },
      {
        id: 'api-integration',
        name: 'API Integration Package',
        category: 'developer',
        price: 39.99,
        features: ['rest_api', 'webhooks', 'sdk_access'],
        targetUsers: ['developer', 'enterprise'],
        description: 'Complete API access for developers',
        compatibility: ['bulk_generation', 'analytics'],
        rating: 4.5,
        popularity: 0.41
      }
    ];

    products.forEach(product => {
      this.productCatalog.set(product.id, product);
    });
  }

  // Track user behavior
  trackUserBehavior(userId, action, data = {}) {
    if (!this.userBehavior.has(userId)) {
      this.userBehavior.set(userId, {
        actions: [],
        preferences: {},
        lastActive: new Date(),
        profile: {}
      });
    }

    const userProfile = this.userBehavior.get(userId);
    userProfile.actions.push({
      action,
      data,
      timestamp: new Date()
    });
    userProfile.lastActive = new Date();

    // Update preferences based on actions
    this.updateUserPreferences(userId, action, data);
  }

  updateUserPreferences(userId, action, data) {
    const userProfile = this.userBehavior.get(userId);
    
    switch (action) {
      case 'qr_created':
        userProfile.preferences.qrTypes = userProfile.preferences.qrTypes || {};
        userProfile.preferences.qrTypes[data.type] = 
          (userProfile.preferences.qrTypes[data.type] || 0) + 1;
        break;
      
      case 'feature_used':
        userProfile.preferences.features = userProfile.preferences.features || {};
        userProfile.preferences.features[data.feature] = 
          (userProfile.preferences.features[data.feature] || 0) + 1;
        break;
      
      case 'page_visited':
        userProfile.preferences.pages = userProfile.preferences.pages || {};
        userProfile.preferences.pages[data.page] = 
          (userProfile.preferences.pages[data.page] || 0) + 1;
        break;
      
      case 'product_viewed':
        userProfile.preferences.viewedProducts = userProfile.preferences.viewedProducts || [];
        if (!userProfile.preferences.viewedProducts.includes(data.productId)) {
          userProfile.preferences.viewedProducts.push(data.productId);
        }
        break;
    }
  }

  // Get personalized recommendations
  getPersonalizedRecommendations(userId, limit = 5) {
    const userProfile = this.userBehavior.get(userId);
    if (!userProfile) {
      return this.getPopularRecommendations(limit);
    }

    const recommendations = [];
    const products = Array.from(this.productCatalog.values());

    // Score products based on user behavior
    const scoredProducts = products.map(product => ({
      ...product,
      score: this.calculateProductScore(product, userProfile)
    }));

    // Sort by score and return top recommendations
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(product => ({
        ...product,
        reason: this.getRecommendationReason(product, userProfile)
      }));
  }

  calculateProductScore(product, userProfile) {
    let score = product.popularity * 0.3; // Base popularity score

    // Feature compatibility score
    if (userProfile.preferences.features) {
      const featureMatch = product.features.filter(feature =>
        userProfile.preferences.features[feature]
      ).length;
      score += (featureMatch / product.features.length) * 0.4;
    }

    // QR type compatibility
    if (userProfile.preferences.qrTypes) {
      const typeCompatibility = this.getTypeCompatibility(product, userProfile.preferences.qrTypes);
      score += typeCompatibility * 0.2;
    }

    // User activity level
    const activityScore = Math.min(userProfile.actions.length / 100, 1);
    score += activityScore * 0.1;

    return score;
  }

  getTypeCompatibility(product, qrTypes) {
    // Map QR types to product categories
    const typeMapping = {
      'url': ['subscription', 'analytics', 'templates'],
      'business': ['enterprise', 'white-label', 'api'],
      'bulk': ['subscription', 'api', 'enterprise']
    };

    let compatibility = 0;
    Object.keys(qrTypes).forEach(type => {
      if (typeMapping[type] && typeMapping[type].includes(product.category)) {
        compatibility += qrTypes[type] / 10; // Normalize usage count
      }
    });

    return Math.min(compatibility, 1);
  }

  getRecommendationReason(product, userProfile) {
    const reasons = [];

    // Check feature usage
    if (userProfile.preferences.features) {
      const matchingFeatures = product.features.filter(feature =>
        userProfile.preferences.features[feature]
      );
      if (matchingFeatures.length > 0) {
        reasons.push(`Based on your use of ${matchingFeatures[0].replace('_', ' ')}`);
      }
    }

    // Check QR type usage
    if (userProfile.preferences.qrTypes) {
      const topQrType = Object.keys(userProfile.preferences.qrTypes)
        .sort((a, b) => userProfile.preferences.qrTypes[b] - userProfile.preferences.qrTypes[a])[0];
      
      if (topQrType === 'url' && product.category === 'analytics') {
        reasons.push('Perfect for tracking URL QR codes');
      }
    }

    // Default reasons
    if (reasons.length === 0) {
      if (product.rating >= 4.5) {
        reasons.push('Highly rated by users');
      } else if (product.popularity >= 0.7) {
        reasons.push('Popular choice');
      } else {
        reasons.push('Recommended for you');
      }
    }

    return reasons[0];
  }

  // Get popular recommendations (fallback)
  getPopularRecommendations(limit = 5) {
    return Array.from(this.productCatalog.values())
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
      .map(product => ({
        ...product,
        reason: 'Popular choice'
      }));
  }

  // Get category-based recommendations
  getCategoryRecommendations(category, limit = 3) {
    return Array.from(this.productCatalog.values())
      .filter(product => product.category === category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Get complementary products
  getComplementaryProducts(productId, limit = 3) {
    const baseProduct = this.productCatalog.get(productId);
    if (!baseProduct) return [];

    return Array.from(this.productCatalog.values())
      .filter(product => 
        product.id !== productId &&
        product.compatibility.some(feature => baseProduct.features.includes(feature))
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // AI-powered content recommendations
  getContentRecommendations(userId) {
    const userProfile = this.userBehavior.get(userId);
    const recommendations = [];

    // Tutorial recommendations based on usage
    if (userProfile?.preferences.features) {
      const features = userProfile.preferences.features;
      
      if (features.qr_generation && !features.analytics) {
        recommendations.push({
          type: 'tutorial',
          title: 'Understanding QR Code Analytics',
          description: 'Learn how to track and analyze your QR code performance',
          url: '/tutorials/analytics-basics',
          priority: 'high'
        });
      }

      if (features.qr_generation && !features.bulk_generation) {
        recommendations.push({
          type: 'tutorial',
          title: 'Bulk QR Code Generation',
          description: 'Save time by creating multiple QR codes at once',
          url: '/tutorials/bulk-generation',
          priority: 'medium'
        });
      }
    }

    // Feature recommendations
    recommendations.push({
      type: 'feature',
      title: 'Try Dynamic QR Codes',
      description: 'Edit your QR code content without reprinting',
      action: 'create_dynamic_qr',
      priority: 'high'
    });

    return recommendations;
  }

  // Smart upsell recommendations
  getUpsellRecommendations(userId, currentPlan = 'free') {
    const userProfile = this.userBehavior.get(userId);
    const recommendations = [];

    // Analyze usage patterns
    const qrCount = userProfile?.actions.filter(a => a.action === 'qr_created').length || 0;
    const analyticsUsage = userProfile?.preferences.features?.analytics || 0;
    const teamFeatures = userProfile?.preferences.features?.team_collaboration || 0;

    if (currentPlan === 'free') {
      if (qrCount >= 10) {
        recommendations.push({
          type: 'upgrade',
          title: 'Upgrade to Pro',
          description: 'You\'ve created many QR codes! Upgrade for unlimited generation',
          product: 'qr-pro-plus',
          urgency: 'high',
          savings: 'Save 20% on your first month'
        });
      }

      if (analyticsUsage >= 5) {
        recommendations.push({
          type: 'addon',
          title: 'Advanced Analytics',
          description: 'Get deeper insights with our analytics dashboard',
          product: 'analytics-dashboard',
          urgency: 'medium'
        });
      }
    }

    if (teamFeatures >= 3) {
      recommendations.push({
        type: 'upgrade',
        title: 'Team Collaboration',
        description: 'Upgrade to enable team features and shared workspaces',
        product: 'qr-pro-plus',
        urgency: 'medium'
      });
    }

    return recommendations;
  }

  // Seasonal and promotional recommendations
  getPromotionalRecommendations() {
    const now = new Date();
    const month = now.getMonth();
    const recommendations = [];

    // Holiday promotions
    if (month === 10 || month === 11) { // November/December
      recommendations.push({
        type: 'promotion',
        title: 'Holiday Special: 50% Off Pro Plans',
        description: 'Limited time offer for the holiday season',
        product: 'qr-pro-plus',
        discount: 50,
        expires: new Date(now.getFullYear(), 11, 31)
      });
    }

    // Back to school (August/September)
    if (month === 7 || month === 8) {
      recommendations.push({
        type: 'promotion',
        title: 'Back to School: Student Discount',
        description: '30% off for students and educators',
        product: 'qr-pro-plus',
        discount: 30,
        code: 'STUDENT30'
      });
    }

    return recommendations;
  }

  // A/B testing for recommendations
  getTestRecommendations(userId, testVariant = 'A') {
    const baseRecommendations = this.getPersonalizedRecommendations(userId);

    if (testVariant === 'B') {
      // Test variant with different sorting or content
      return baseRecommendations.map(rec => ({
        ...rec,
        reason: `✨ ${rec.reason}`, // Add emoji for variant B
        highlight: true
      }));
    }

    return baseRecommendations;
  }

  // Machine learning insights (simulated)
  getPredictiveRecommendations(userId) {
    const userProfile = this.userBehavior.get(userId);
    if (!userProfile) return [];

    const predictions = [];

    // Predict churn risk
    const daysSinceLastActive = (new Date() - userProfile.lastActive) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActive > 7) {
      predictions.push({
        type: 'retention',
        title: 'Welcome Back!',
        description: 'Check out what\'s new since your last visit',
        action: 'show_recent_features',
        priority: 'high'
      });
    }

    // Predict feature adoption
    const actionsCount = userProfile.actions.length;
    if (actionsCount >= 20 && !userProfile.preferences.features?.analytics) {
      predictions.push({
        type: 'feature_adoption',
        title: 'Unlock Analytics',
        description: 'You\'re a power user! See how your QR codes perform',
        action: 'enable_analytics',
        priority: 'medium'
      });
    }

    return predictions;
  }

  // Export user data for GDPR compliance
  exportUserData(userId) {
    const userProfile = this.userBehavior.get(userId);
    return {
      userId,
      profile: userProfile,
      recommendations: this.getPersonalizedRecommendations(userId),
      exportDate: new Date().toISOString()
    };
  }

  // Clear user data
  clearUserData(userId) {
    this.userBehavior.delete(userId);
  }
}

export const recommendationService = new RecommendationService();