import { supabase } from '../lib/supabase';

class AuthService {
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name,
        role: profile?.role || 'user',
        plan: profile?.plan || 'free',
        avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=3b82f6&color=fff`,
        createdAt: data.user.created_at
      };

      localStorage.setItem('token', data.session.access_token);
      
      return { user, session: data.session };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.email === 'alaa@nulled.ai' ? 'superAdmin' : 'user',
            plan: 'free',
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`
          });

        if (profileError) throw profileError;

        const user = {
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          role: userData.email === 'alaa@nulled.ai' ? 'superAdmin' : 'user',
          plan: 'free',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
          createdAt: data.user.created_at
        };

        if (data.session) {
          localStorage.setItem('token', data.session.access_token);
        }

        return { user, session: data.session };
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name,
        role: profile?.role || 'user',
        plan: profile?.plan || 'free',
        avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=3b82f6&color=fff`,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(userData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async sendPasswordReset(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return { message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
    }
  }
}

export const authService = new AuthService();