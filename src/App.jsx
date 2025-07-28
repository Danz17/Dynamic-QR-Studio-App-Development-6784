import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { useAuthStore } from './stores/useAuthStore';
import { QRProvider } from './contexts/QRContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { FeedbackButton } from './components/Feedback';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import QRGenerator from './pages/QRGenerator/QRGenerator';
import QRManager from './pages/QRManager/QRManager';
import Analytics from './pages/Analytics/Analytics';
import AdvancedAnalytics from './pages/Analytics/AdvancedAnalytics';
import AdminConsole from './pages/AdminConsole/AdminConsole';
import UserManagement from './pages/AdminConsole/UserManagement';
import RolePermissions from './pages/AdminConsole/RolePermissions';
import Templates from './pages/Templates/Templates';
import BulkGenerator from './pages/BulkGenerator/BulkGenerator';
import LandingPageBuilder from './pages/LandingPageBuilder/LandingPageBuilder';
import TeamManagement from './pages/Team/TeamManagement';
import Settings from './pages/Settings/Settings';
import QRLandingPage from './pages/Public/QRLandingPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/" />;
}

function AppContent() {
  const { user, initializeAuth, loading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/qr/:id" element={<QRLandingPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <QRGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage"
            element={
              <ProtectedRoute>
                <QRManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics/advanced"
            element={
              <ProtectedRoute>
                <AdvancedAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminConsole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute>
                <RolePermissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulk"
            element={
              <ProtectedRoute>
                <BulkGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landing-builder"
            element={
              <ProtectedRoute>
                <LandingPageBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Global Feedback Button - Available on all pages */}
      <FeedbackButton />
      
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <QRProvider>
              <Router>
                <AppContent />
              </Router>
            </QRProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;