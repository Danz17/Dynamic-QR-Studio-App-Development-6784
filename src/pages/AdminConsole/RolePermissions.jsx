import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Helmet} from 'react-helmet-async';
import {useAuthStore} from '../../stores/useAuthStore';
import {userService} from '../../services/userService';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const {FiShield, FiLock, FiUnlock, FiCheck, FiX, FiEdit2, FiSave, FiPlus, FiTrash2} = FiIcons;

function RolePermissions() {
  const {isSuperAdmin} = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [editMode, setEditMode] = useState(false);
  const [customRoles, setCustomRoles] = useState({});
  const [showCreateRole, setShowCreateRole] = useState(false);

  const roles = userService.getRoleHierarchy();
  const permissions = userService.getPermissionsList();

  const handlePermissionToggle = (roleKey, permission) => {
    if (!editMode) return;
    
    // Implementation would update role permissions
    toast.success(`Permission ${permission} toggled for ${roleKey}`);
  };

  const createCustomRole = (roleData) => {
    setCustomRoles(prev => ({
      ...prev,
      [roleData.key]: roleData
    }));
    toast.success('Custom role created successfully');
    setShowCreateRole(false);
  };

  if (!isSuperAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiShield} className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to manage roles and permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Role & Permissions - QR Studio</title>
        <meta name="description" content="Manage user roles and permissions." />
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
                  Roles & Permissions
                </h1>
                <p className="text-gray-600">
                  Configure user roles and their associated permissions.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    editMode 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={editMode ? FiSave : FiEdit2} className="w-4 h-4" />
                  <span>{editMode ? 'Save Changes' : 'Edit Permissions'}</span>
                </button>
                <button
                  onClick={() => setShowCreateRole(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  <span>Create Role</span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Role Selector */}
            <motion.div
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.1}}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.key}
                      onClick={() => setSelectedRole(role.key)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedRole === role.key
                          ? 'bg-primary-100 text-primary-700 border-primary-200'
                          : 'hover:bg-gray-50 border-transparent'
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            Level {role.level}
                          </p>
                        </div>
                        <SafeIcon 
                          icon={FiShield} 
                          className={`w-5 h-5 ${
                            selectedRole === role.key ? 'text-primary-600' : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Permissions Matrix */}
            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Permissions for {roles.find(r => r.key === selectedRole)?.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {roles.find(r => r.key === selectedRole)?.description}
                    </p>
                  </div>
                  {editMode && (
                    <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      Edit Mode Active
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {permissions.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <SafeIcon icon={FiLock} className="w-4 h-4 mr-2 text-gray-500" />
                        {category.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.permissions.map((permission) => {
                          const hasPermission = userService.hasPermission(selectedRole, permission.key);
                          const isSystemRole = ['superAdmin', 'admin', 'editor', 'viewer', 'guest'].includes(selectedRole);
                          
                          return (
                            <div
                              key={permission.key}
                              className={`p-4 border rounded-lg transition-colors ${
                                hasPermission 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-gray-200 bg-gray-50'
                              } ${editMode && !isSystemRole ? 'cursor-pointer hover:shadow-sm' : ''}`}
                              onClick={() => !isSystemRole && handlePermissionToggle(selectedRole, permission.key)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {permission.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {permission.description}
                                  </p>
                                </div>
                                <div className={`ml-3 flex-shrink-0 ${
                                  hasPermission ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  <SafeIcon 
                                    icon={hasPermission ? FiCheck : FiX} 
                                    className="w-5 h-5" 
                                  />
                                </div>
                              </div>
                              {isSystemRole && editMode && (
                                <div className="mt-2 text-xs text-amber-600">
                                  System role - cannot be modified
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Role Hierarchy */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.3}}
            className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Role Hierarchy</h2>
            <div className="space-y-4">
              {roles.map((role, index) => (
                <div key={role.key} className="flex items-center">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      role.level >= 80 ? 'bg-purple-100 text-purple-600' :
                      role.level >= 60 ? 'bg-blue-100 text-blue-600' :
                      role.level >= 40 ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <SafeIcon icon={FiShield} className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Level {role.level}
                  </div>
                  {index < roles.length - 1 && (
                    <div className="ml-4 text-gray-400">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateRole && (
        <CreateRoleModal
          onClose={() => setShowCreateRole(false)}
          onCreate={createCustomRole}
        />
      )}
    </>
  );
}

// Create Role Modal Component
function CreateRoleModal({onClose, onCreate}) {
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    level: 50,
    permissions: []
  });

  const permissions = userService.getPermissionsList();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.key || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    onCreate(formData);
  };

  const togglePermission = (permissionKey) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.9}}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Create Custom Role</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Key *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({...prev, key: e.target.value}))}
                  placeholder="custom_role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Custom Role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe this role's purpose..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authority Level
              </label>
              <input
                type="range"
                min="1"
                max="99"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({...prev, level: parseInt(e.target.value)}))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low (1)</span>
                <span>Level: {formData.level}</span>
                <span>High (99)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {permissions.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                    <div className="space-y-2 ml-4">
                      {category.permissions.map((permission) => (
                        <label key={permission.key} className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.key)}
                            onChange={() => togglePermission(permission.key)}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                            <div className="text-xs text-gray-600">{permission.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Create Role
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default RolePermissions;