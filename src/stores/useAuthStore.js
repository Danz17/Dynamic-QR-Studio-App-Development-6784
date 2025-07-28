import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      isAuthenticated: false,
      
      login: async (email, password) => {
        set({ loading: true });
        try {
          const response = await authService.login(email, password);
          set({ user: response.user, isAuthenticated: true, loading: false });
          toast.success('Login successful!');
          return response;
        } catch (error) {
          set({ loading: false });
          toast.error(error.message || 'Login failed');
          throw error;
        }
      },
      
      register: async (userData) => {
        set({ loading: true });
        try {
          const response = await authService.register(userData);
          set({ user: response.user, isAuthenticated: true, loading: false });
          toast.success('Registration successful!');
          return response;
        } catch (error) {
          set({ loading: false });
          toast.error(error.message || 'Registration failed');
          throw error;
        }
      },
      
      logout: () => {
        authService.logout().then(() => {
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
        });
      },
      
      updateUser: (userData) => {
        set(state => ({ user: { ...state.user, ...userData } }));
      },
      
      initializeAuth: async () => {
        set({ loading: true });
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
        } finally {
          set({ loading: false });
        }
      },
      
      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
      
      // Check if user is super admin
      isSuperAdmin: () => {
        const { user } = get();
        return user?.role === 'superAdmin';
      },
      
      // Check if user can access admin features
      canAccessAdmin: () => {
        const { user } = get();
        return ['superAdmin', 'admin'].includes(user?.role);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);