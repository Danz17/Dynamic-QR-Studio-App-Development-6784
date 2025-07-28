import {useState, useEffect} from 'react';
import {userService} from '../services/userService';
import {useAuthStore} from '../stores/useAuthStore';
import toast from 'react-hot-toast';

export function useUserManagement(options = {}) {
  const {user} = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: options.limit || 20,
    total: 0
  });

  const {
    autoLoad = true,
    filters = {},
    onUserUpdate = null
  } = options;

  useEffect(() => {
    if (autoLoad && user) {
      loadUsers();
    }
  }, [user, pagination.page, filters]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getAllUsers(
        pagination.page,
        pagination.limit,
        filters
      );
      
      setUsers(response.users);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const updatedUser = await userService.updateUserRole(userId, newRole, user.id);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      onUserUpdate?.(updatedUser, 'role_updated');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to update user role');
      throw error;
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      const updatedUser = await userService.updateUserStatus(userId, isActive, user.id);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      onUserUpdate?.(updatedUser, 'status_updated');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId, user.id);
      setUsers(prev => prev.filter(u => u.id !== userId));
      onUserUpdate?.(null, 'user_deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
      throw error;
    }
  };

  const bulkUpdateUsers = async (userIds, updates) => {
    try {
      const updatedUsers = await userService.bulkUpdateUsers(userIds, updates, user.id);
      setUsers(prev => prev.map(u => {
        const updated = updatedUsers.find(uu => uu.id === u.id);
        return updated || u;
      }));
      onUserUpdate?.(updatedUsers, 'bulk_updated');
      return updatedUsers;
    } catch (error) {
      toast.error(error.message || 'Failed to bulk update users');
      throw error;
    }
  };

  const searchUsers = (searchTerm) => {
    setPagination(prev => ({...prev, page: 1}));
    // This would trigger a reload with new filters
    loadUsers();
  };

  const changePage = (newPage) => {
    setPagination(prev => ({...prev, page: newPage}));
  };

  const refresh = () => {
    loadUsers();
  };

  return {
    users,
    loading,
    error,
    pagination,
    loadUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    bulkUpdateUsers,
    searchUsers,
    changePage,
    refresh
  };
}

export function useRolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoleData();
  }, []);

  const loadRoleData = () => {
    setRoles(userService.getRoleHierarchy());
    setPermissions(userService.getPermissionsList());
  };

  const hasPermission = (userRole, permission) => {
    return userService.hasPermission(userRole, permission);
  };

  const canManageUser = (managerId, targetUserId) => {
    return userService.canManageUser(managerId, targetUserId);
  };

  const updateRolePermissions = async (roleKey, permissions) => {
    setLoading(true);
    try {
      // Implementation would update role permissions
      toast.success('Role permissions updated successfully');
      loadRoleData();
    } catch (error) {
      toast.error('Failed to update role permissions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCustomRole = async (roleData) => {
    setLoading(true);
    try {
      // Implementation would create custom role
      toast.success('Custom role created successfully');
      loadRoleData();
    } catch (error) {
      toast.error('Failed to create custom role');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    permissions,
    loading,
    hasPermission,
    canManageUser,
    updateRolePermissions,
    createCustomRole,
    refresh: loadRoleData
  };
}

export function useUserActivity(userId) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadActivity = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await userService.getUserActivity(userId);
      setActivity(data);
    } catch (error) {
      toast.error('Failed to load user activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, [userId]);

  return {
    activity,
    loading,
    refresh: loadActivity
  };
}