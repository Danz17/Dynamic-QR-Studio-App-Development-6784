import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../UI/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiX, FiGrid, FiAlertCircle, FiCheck } = FiIcons;

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  
  const { login, register, loading } = useAuthStore();

  useEffect(() => {
    // Reset forms when modal opens
    if (isOpen) {
      setMode(initialMode);
      setLoginForm({ email: '', password: '' });
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      setErrors({});
      setSuccess(null);
    }
  }, [isOpen, initialMode]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!loginForm.email) newErrors.email = 'Email is required';
    if (!loginForm.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await login(loginForm.email, loginForm.password);
      onClose();
    } catch (error) {
      setErrors({ form: error.message || 'Login failed. Please check your credentials.' });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!registerForm.name) newErrors.name = 'Name is required';
    if (!registerForm.email) newErrors.email = 'Email is required';
    if (!registerForm.password) newErrors.password = 'Password is required';
    else if (registerForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (registerForm.password !== registerForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      });
      setSuccess('Registration successful! You are now logged in.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setErrors({ form: error.message || 'Registration failed. Please try again.' });
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setLoginForm({
        email: 'alaa@nulled.ai',
        password: 'password'
      });
    } else {
      setLoginForm({
        email: 'demo@example.com',
        password: 'password'
      });
    }
  };

  const handleRegisterDemoFill = () => {
    setRegisterForm({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password',
      confirmPassword: 'password'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiGrid} className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {errors.form && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-red-800">{errors.form}</p>
              </div>
            )}

            {/* Mode Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => {
                  setMode('login');
                  setErrors({});
                }}
                className={`pb-3 px-4 text-sm font-medium ${
                  mode === 'login'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setErrors({});
                }}
                className={`pb-3 px-4 text-sm font-medium ${
                  mode === 'register'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === 'login' ? (
              <>
                {/* Demo Credentials */}
                <div className="mb-6 space-y-3">
                  {/* Super Admin Demo */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-purple-800 mb-1 font-medium">
                          Super Admin Demo:
                        </p>
                        <div className="text-xs text-purple-700 font-mono bg-purple-100 p-2 rounded mb-2">
                          <div>Email: alaa@nulled.ai</div>
                          <div>Password: password</div>
                        </div>
                        <button
                          onClick={() => handleDemoFill('admin')}
                          className="text-xs text-purple-600 hover:text-purple-800 underline"
                        >
                          Fill credentials
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Regular Demo */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 mb-1 font-medium">
                          Regular Demo:
                        </p>
                        <div className="text-xs text-blue-700 font-mono bg-blue-100 p-2 rounded mb-2">
                          <div>Email: demo@example.com</div>
                          <div>Password: password</div>
                        </div>
                        <button
                          onClick={() => handleDemoFill('user')}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Fill credentials
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
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
                        autoComplete="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        className={`block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <SafeIcon
                          icon={showPassword ? FiEyeOff : FiEye}
                          className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        />
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        'Sign in'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Demo Registration */}
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 mb-1 font-medium">
                          Demo Registration:
                        </p>
                        <div className="text-xs text-blue-700 font-mono bg-blue-100 p-2 rounded mb-2">
                          <div>Name: Demo User</div>
                          <div>Email: demo@example.com</div>
                          <div>Password: password</div>
                        </div>
                        <button
                          onClick={handleRegisterDemoFill}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Fill demo credentials
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="reg-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        className={`block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <SafeIcon
                          icon={showPassword ? FiEyeOff : FiEye}
                          className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        />
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        className={`block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <SafeIcon
                          icon={showConfirmPassword ? FiEyeOff : FiEye}
                          className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="agree-terms"
                      name="agree-terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        'Create account'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;