import React, { createContext, useContext } from 'react';
import FeedbackModal from './FeedbackModal';
import useFeedback from '../../hooks/useFeedback';

const FeedbackContext = createContext();

export function useFeedbackContext() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext must be used within FeedbackProvider');
  }
  return context;
}

export function FeedbackProvider({ children }) {
  const feedbackProps = useFeedback();

  return (
    <FeedbackContext.Provider value={feedbackProps}>
      {children}
      <FeedbackModal />
    </FeedbackContext.Provider>
  );
}

export default FeedbackProvider;