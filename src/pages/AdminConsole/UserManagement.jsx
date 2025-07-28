import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Helmet} from 'react-helmet-async';
import {useAuthStore} from '../../stores/useAuthStore';
import {userService} from '../../services/userService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const {
  FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiFilter,
  FiDownload, FiUpload, FiShield, FiUser, FiEye, FiEyeOff, FiCheck, FiX,
  FiAlertTriangle, FiSettings, FiMail, FiCalendar, FiActivity, FiBarChart3
} = FiIcons;

function UserManagement() {
  const {user, isSuperAdmin} = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    plan: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, edit, delete
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (isSuperAdmin()) {
      loadUsers();
      loadUserStats();
    }
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
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
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await userService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Load user stats error:', error);
    }
  };

  const handleUserAction = async (action, userId, data = {}) => {
    try {
      switch (action) {
        case 'updateRole':
          await userService.updateUserRole(userId, data.role, user.id);
          toast.success('User role updated successfully');
          break;
        case 'updateStatus':
          await userService.updateUserStatus(userId, data.isActive, user.id);
          toast.success(`User ${data.isActive ? 'activated' : 'deactivated'} successfully`);
          break;
        case 'delete':
          await userService.deleteUser(userId, user.id);
          toast.success('User deleted successfully');
          break;
      }
      loadUsers();
      setShowUserModal(false);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleBulkAction = async (action, data = {}) => {
    if (selectedUsers.size === 0) {
      toast.error('Please select users first');
      return;
    }

    try {
      const userIds = Array.from(selectedUsers);
      await userService.bulkUpdateUsers(userIds, data, user.id);
      toast.success(`Bulk action completed for ${userIds.length} users`);
      setSelectedUsers(new Set());
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Bulk action failed');
    }
  };

  const openUserModal = (mode, userData = null) => {
    setModalMode(mode);
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      superAdmin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800',
      guest: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (!isSuperAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiShield} className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management - QR Studio</title>
        <meta name="description" content="Manage user accounts, roles, and permissions." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  User Management
                </h1>
                <p className="text-gray-600">
                  Manage user accounts, roles, and permissions across your platform.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiSettings} className="w-4 h-4" />
                  <span>Bulk Actions</span>
                </button>
                <button
                  onClick={() => openUserModal('create')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                  <span>Invite User</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {userStats && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.1}}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
                  </div>
                  <SafeIcon icon={FiUsers} className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
                  </div>
                  <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recent Signups</p>
                    <p className="text-2xl font-bold text-purple-600">{userStats.recentSignups}</p>
                  </div>
                  <SafeIcon icon={FiActivity} className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {(userStats.byRole.admin || 0) + (userStats.byRole.superAdmin || 0)}
                    </p>
                  </div>
                  <SafeIcon icon={FiShield} className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters and Search */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2}}
            className="bg-white rounded-xl p-4 border border-gray-200 mb-6"
          >
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiSearch} className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({...prev, role: e.target.value}))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Roles</option>
                  <option value="superAdmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="guest">Guest</option>
                </select>
                <select
                  value={filters.plan}
                  onChange={(e) => setFilters(prev => ({...prev, plan: e.target.value}))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && selectedUsers.size > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedUsers.size} users selected
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkAction('activate', {is_active: true})}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate', {is_active: false})}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => setSelectedUsers(new Set())}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.3}}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(new Set(users.map(u => u.id)));
                            } else {
                              setSelectedUsers(new Set());
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QR Codes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userData) => (
                      <tr key={userData.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(userData.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedUsers);
                              if (e.target.checked) {
                                newSelected.add(userData.id);
                              } else {
                                newSelected.delete(userData.id);
                              }
                              setSelectedUsers(newSelected);
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`}
                                alt={userData.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {userData.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {userData.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeColor(userData.role)}`}>
                            {userService.roles[userData.role]?.name || userData.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">
                            {userData.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeColor(userData.is_active)}`}>
                            {userData.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userData.qr_codes?.[0]?.count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(userData.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openUserModal('view', userData)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <SafeIcon icon={FiEye} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openUserModal('edit', userData)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                            </button>
                            {userData.role !== 'superAdmin' && (
                              <button
                                onClick={() => openUserModal('delete', userData)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({...prev, page: prev.page - 1}))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))}
                      disabled={pagination.page * pagination.limit >= pagination.total}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onAction={handleUserAction}
        />
      )}
    </>
  );
}

// User Modal Component
function UserModal({mode, user: userData, onClose, onAction}) {
  const [formData, setFormData] = useState({
    role: userData?.role || 'viewer',
    plan: userData?.plan || 'free',
    is_active: userData?.is_active !== false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'edit') {
        if (formData.role !== userData.role) {
          await onAction('updateRole', userData.id, {role: formData.role});
        }
        if (formData.is_active !== userData.is_active) {
          await onAction('updateStatus', userData.id, {isActive: formData.is_active});
        }
      } else if (mode === 'delete') {
        await onAction('delete', userData.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.9}}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === 'view' && 'User Details'}
            {mode === 'edit' && 'Edit User'}
            {mode === 'delete' && 'Delete User'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        {mode === 'delete' ? (
          <div>
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-gray-900">
                Are you sure you want to delete <strong>{userData.name}</strong>?
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The user will be deactivated and their data anonymized.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center mb-6">
                <img
                  src={userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`}
                  alt={userData.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{userData.name}</h4>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <p className="text-xs text-gray-500">
                    Joined {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {mode === 'edit' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      {userData.role !== 'superAdmin' && (
                        <option value="superAdmin">Super Admin</option>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({...prev, is_active: e.target.checked}))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active User
                    </label>
                  </div>
                </>
              )}

              {mode === 'view' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Role:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(userData.role)}`}>
                      {userService.roles[userData.role]?.name || userData.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="text-sm font-medium capitalize">{userData.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(userData.is_active)}`}>
                      {userData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">QR Codes:</span>
                    <span className="text-sm font-medium">{userData.qr_codes?.[0]?.count || 0}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {mode === 'edit' && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// Helper functions
const getRoleBadgeColor = (role) => {
  const colors = {
    superAdmin: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    editor: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800',
    guest: 'bg-yellow-100 text-yellow-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const getStatusBadgeColor = (isActive) => {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export default UserManagement;