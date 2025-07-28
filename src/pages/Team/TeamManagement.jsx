import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiUserPlus, FiUserX, FiEdit2, FiTrash2, FiMail, FiUser, FiLock, FiShield, FiCheck, FiAlertTriangle, FiPlus, FiInfo } = FiIcons;

function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      joined: '2023-12-10'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      joined: '2024-01-15'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      role: 'viewer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      status: 'invited',
      joined: '2024-04-01'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('invite'); // invite, edit, delete
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [teamSettings, setTeamSettings] = useState({
    name: 'Marketing Team',
    allowMemberInvites: true,
    notifyOnJoin: true
  });

  const openModal = (type, member = null) => {
    setModalType(type);
    setSelectedMember(member);
    setError(null);
    setSuccess(null);

    if (type === 'invite') {
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
        message: `Hi there,\n\nI'd like to invite you to join our team on QR Studio.\n\nBest regards,\nYour Name`
      });
    } else if (type === 'edit' && member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate API call
    setTimeout(() => {
      try {
        if (modalType === 'invite') {
          // Add new member
          const newMember = {
            id: Date.now().toString(),
            name: formData.name || 'Invited User',
            email: formData.email,
            role: formData.role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Invited User')}&background=3b82f6&color=fff`,
            status: 'invited',
            joined: new Date().toISOString().split('T')[0]
          };
          setTeamMembers([...teamMembers, newMember]);
          setSuccess('Invitation sent successfully!');
          toast.success('Invitation email sent to ' + formData.email);
        } else if (modalType === 'edit') {
          // Update member
          const updatedMembers = teamMembers.map(member => 
            member.id === selectedMember.id 
              ? { ...member, name: formData.name, email: formData.email, role: formData.role } 
              : member
          );
          setTeamMembers(updatedMembers);
          setSuccess('Team member updated successfully!');
        } else if (modalType === 'delete') {
          // Delete member
          const filteredMembers = teamMembers.filter(member => member.id !== selectedMember.id);
          setTeamMembers(filteredMembers);
          setSuccess('Team member removed successfully!');
          closeModal();
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderInviteModal = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Team Member</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="colleague@example.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Their name (if known)"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personal Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add a personal message to your invitation"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center">
            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center">
            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
            {success}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                <span>Send Invitation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderEditModal = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Team Member</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
              readOnly
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Email address cannot be changed.</p>
        </div>
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center">
            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center">
            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
            {success}
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderDeleteModal = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Remove Team Member</h3>
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 h-10 w-10 mr-3">
          <img className="h-10 w-10 rounded-full" src={selectedMember?.avatar} alt={selectedMember?.name} />
        </div>
        <div>
          <p className="font-medium">{selectedMember?.name}</p>
          <p className="text-sm text-gray-500">{selectedMember?.email}</p>
        </div>
      </div>
      <p className="text-gray-600 mb-6">
        Are you sure you want to remove {selectedMember?.name} from your team? This action cannot be undone.
      </p>
      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center">
          <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
      <div className="flex justify-end space-x-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Remove Member'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Team Management - QR Studio</title>
        <meta name="description" content="Manage your team members and their permissions." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Team Management
                </h1>
                <p className="text-gray-600">
                  Manage your team members and their access permissions.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => openModal('invite')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Team Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Team: {teamSettings.name}</h2>
                <p className="text-sm text-gray-600">{teamMembers.length} members • Created on April 15, 2023</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  Team Settings
                </button>
              </div>
            </div>
          </motion.div>

          {/* Team Members List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Members ({teamMembers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={member.avatar} alt={member.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeColor(member.role)}`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeColor(member.status)}`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.joined}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal('edit', member)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('delete', member)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {teamMembers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                          <p className="text-gray-500 mb-4">Invite colleagues to collaborate on QR codes</p>
                          <button
                            onClick={() => openModal('invite')}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                          >
                            <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                            <span>Invite First Member</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pending Invitations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h2>
            <div className="space-y-4">
              {teamMembers.filter(member => member.status === 'invited').length > 0 ? (
                teamMembers.filter(member => member.status === 'invited').map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={member.avatar} alt={member.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-yellow-700">Invited on {member.joined}</span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        onClick={() => openModal('delete', member)}
                      >
                        <SafeIcon icon={FiUserX} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pending invitations
                </div>
              )}
            </div>
          </motion.div>

          {/* Roles and Permissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Roles and Permissions</h2>
              <div className="relative group">
                <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors">
                  <SafeIcon icon={FiInfo} className="w-5 h-5" />
                </button>
                <div className="absolute right-0 w-64 p-3 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  Different roles have different permissions and access levels in the system.
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <SafeIcon icon={FiShield} className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Admin</h3>
                    <p className="text-sm text-gray-600">
                      Full access to all features, team management, and billing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <SafeIcon icon={FiEdit2} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Editor</h3>
                    <p className="text-sm text-gray-600">
                      Can create, edit, and delete QR codes. No access to billing or team settings.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Viewer</h3>
                    <p className="text-sm text-gray-600">
                      Read-only access to QR codes and analytics. Cannot make changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            {modalType === 'invite' && renderInviteModal()}
            {modalType === 'edit' && renderEditModal()}
            {modalType === 'delete' && renderDeleteModal()}
          </motion.div>
        </div>
      )}
    </>
  );
}

export default TeamManagement;