import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export function useFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const openFeedback = useCallback(() => {
    setIsOpen(true);
    // Track feedback interaction
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'feedback_opened', {
        event_category: 'engagement',
        event_label: 'feedback_workflow'
      });
    }
  }, []);

  const closeFeedback = useCallback(() => {
    setIsOpen(false);
  }, []);

  const getUserId = useCallback(() => {
    return user?.id || localStorage.getItem('userId') || 'anonymous';
  }, [user]);

  const submitFeedback = useCallback(async (feedbackData) => {
    try {
      // Here you would normally send to your backend
      console.log('Feedback submitted:', {
        ...feedbackData,
        userId: getUserId(),
        timestamp: new Date().toISOString()
      });
      
      // You can replace this with actual API call
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackData)
      // });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }, [getUserId]);

  return {
    isOpen,
    openFeedback,
    closeFeedback,
    getUserId,
    submitFeedback
  };
}

export default useFeedback;