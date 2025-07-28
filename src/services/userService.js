import {supabase} from '../lib/supabase';

class UserService {
  constructor() {
    this.roles = {
      superAdmin: {
        name: 'Super Admin',
        level: 100,
        permissions: ['*'], // All permissions
        description: 'Full system access and configuration'
      },
      admin: {
        name: 'Admin',
        level: 80,
        permissions: [
          'user.manage',
          'qr.manage_all',
          'analytics.view_all',
          'team.manage',
          'settings.manage',
          'export.data'
        ],
        description: 'Administrative access with user management'
      },
      editor: {
        name: 'Editor',
        level: 60,
        permissions: [
          'qr.create',
          'qr.edit',
          'qr.delete',
          'analytics.view_own',
          'templates.use',
          'bulk.generate'
        ],
        description: 'Can create and manage QR codes'
      },
      viewer: {
        name: 'Viewer',
        level: 40,
        permissions: [
          'qr.view',
          'analytics.view_own'
        ],
        description: 'Read-only access to QR codes and analytics'
      },
      guest: {
        name: 'Guest',
        level: 20,
        permissions: [
          'qr.scan'
        ],
        description: 'Limited access for temporary users'
      }
    };
  }

  async getAllUsers(page = 1, limit = 20, filters = {}) {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role,
          plan,
          avatar_url,
          is_active,
          last_login,
          created_at,
          updated_at,
          qr_codes(count)
        `)
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.plan) {
        query = query.eq('plan', filters.plan);
      }
      if (filters.status) {
        query = query.eq('is_active', filters.status === 'active');
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const {data, error, count} = await query;
      if (error) throw error;

      return {
        users: data,
        total: count,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select(`
          *,
          qr_codes(count),
          team_memberships(
            team_id,
            teams(name)
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserRole(userId, newRole, updatedBy) {
    try {
      // Validate role
      if (!this.roles[newRole]) {
        throw new Error('Invalid role specified');
      }

      // Check permissions
      const {data: currentUser} = await supabase.auth.getUser();
      if (!this.canManageUser(currentUser.user.id, userId)) {
        throw new Error('Insufficient permissions');
      }

      const {data, error} = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log role change
      await this.logUserAction({
        user_id: userId,
        action: 'role_updated',
        details: {
          old_role: data.role,
          new_role: newRole,
          updated_by: updatedBy
        }
      });

      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, isActive, updatedBy) {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log status change
      await this.logUserAction({
        user_id: userId,
        action: isActive ? 'user_activated' : 'user_deactivated',
        details: {
          updated_by: updatedBy
        }
      });

      return data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(userId, deletedBy) {
    try {
      // Check if user can be deleted
      const user = await this.getUserById(userId);
      if (user.role === 'superAdmin') {
        throw new Error('Cannot delete super admin user');
      }

      // Soft delete - mark as inactive and anonymize
      const {data, error} = await supabase
        .from('profiles')
        .update({
          is_active: false,
          email: `deleted_${userId}@example.com`,
          name: 'Deleted User',
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log deletion
      await this.logUserAction({
        user_id: userId,
        action: 'user_deleted',
        details: {
          deleted_by: deletedBy
        }
      });

      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async bulkUpdateUsers(userIds, updates, updatedBy) {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('id', userIds)
        .select();

      if (error) throw error;

      // Log bulk update
      await this.logUserAction({
        action: 'bulk_user_update',
        details: {
          user_ids: userIds,
          updates,
          updated_by: updatedBy
        }
      });

      return data;
    } catch (error) {
      console.error('Error bulk updating users:', error);
      throw error;
    }
  }

  async getUserActivity(userId, limit = 50) {
    try {
      const {data, error} = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false})
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  async logUserAction(actionData) {
    try {
      const {error} = await supabase
        .from('user_activity_logs')
        .insert({
          ...actionData,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging user action:', error);
    }
  }

  // Permission checking methods
  hasPermission(userRole, permission) {
    const role = this.roles[userRole];
    if (!role) return false;
    
    // Super admin has all permissions
    if (role.permissions.includes('*')) return true;
    
    return role.permissions.includes(permission);
  }

  canManageUser(managerId, targetUserId) {
    // Users can't manage themselves for role changes
    if (managerId === targetUserId) return false;
    
    // Implementation would check manager's role level vs target's role level
    return true;
  }

  getRoleHierarchy() {
    return Object.entries(this.roles)
      .sort((a, b) => b[1].level - a[1].level)
      .map(([key, role]) => ({
        key,
        ...role
      }));
  }

  getPermissionsList() {
    return [
      {
        category: 'QR Codes',
        permissions: [
          {key: 'qr.create', name: 'Create QR Codes', description: 'Can create new QR codes'},
          {key: 'qr.edit', name: 'Edit QR Codes', description: 'Can edit existing QR codes'},
          {key: 'qr.delete', name: 'Delete QR Codes', description: 'Can delete QR codes'},
          {key: 'qr.view', name: 'View QR Codes', description: 'Can view QR codes'},
          {key: 'qr.manage_all', name: 'Manage All QR Codes', description: 'Can manage all users\' QR codes'}
        ]
      },
      {
        category: 'Analytics',
        permissions: [
          {key: 'analytics.view_own', name: 'View Own Analytics', description: 'Can view own analytics'},
          {key: 'analytics.view_all', name: 'View All Analytics', description: 'Can view all analytics'},
          {key: 'analytics.export', name: 'Export Analytics', description: 'Can export analytics data'}
        ]
      },
      {
        category: 'Users',
        permissions: [
          {key: 'user.manage', name: 'Manage Users', description: 'Can manage user accounts'},
          {key: 'user.invite', name: 'Invite Users', description: 'Can invite new users'},
          {key: 'user.delete', name: 'Delete Users', description: 'Can delete user accounts'}
        ]
      },
      {
        category: 'Team',
        permissions: [
          {key: 'team.manage', name: 'Manage Teams', description: 'Can manage team settings'},
          {key: 'team.invite', name: 'Invite Team Members', description: 'Can invite team members'},
          {key: 'team.remove', name: 'Remove Team Members', description: 'Can remove team members'}
        ]
      },
      {
        category: 'Settings',
        permissions: [
          {key: 'settings.manage', name: 'Manage Settings', description: 'Can manage system settings'},
          {key: 'settings.smtp', name: 'Configure SMTP', description: 'Can configure email settings'},
          {key: 'settings.branding', name: 'Manage Branding', description: 'Can manage site branding'}
        ]
      }
    ];
  }

  async getUserStats() {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select('role, plan, is_active, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        active: data.filter(u => u.is_active).length,
        inactive: data.filter(u => !u.is_active).length,
        byRole: {},
        byPlan: {},
        recentSignups: data.filter(u => 
          new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      };

      // Count by role
      data.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
      });

      // Count by plan
      data.forEach(user => {
        stats.byPlan[user.plan] = (stats.byPlan[user.plan] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
}

export const userService = new UserService();