import React from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiUser, FiMail, FiCalendar, FiShield, FiEye, FiEdit2, FiTrash2, FiMoreVertical} = FiIcons;

function UserCard({user, onView, onEdit, onDelete, onRoleChange, compact = false}) {
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

  if (compact) {
    return (
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
            <button
              onClick={() => onView?.(user)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <SafeIcon icon={FiMail} className="w-4 h-4 mr-1" />
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(user.is_active)}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Role</label>
            <div className="mt-1">
              <span className={`px-2 py-1 text-sm rounded-full ${getRoleBadgeColor(user.role)}`}>
                <SafeIcon icon={FiShield} className="w-3 h-3 inline mr-1" />
                {user.role}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Plan</label>
            <p className="mt-1 text-sm font-medium text-gray-900 capitalize">{user.plan}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">QR Codes</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {user.qr_codes?.[0]?.count || 0}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Joined</label>
            <p className="mt-1 text-sm text-gray-600 flex items-center">
              <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onView?.(user)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => onEdit?.(user)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
          {user.role !== 'superAdmin' && (
            <button
              onClick={() => onDelete?.(user)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default UserCard;