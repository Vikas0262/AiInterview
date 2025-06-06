import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  
  // Update isLogin when mode prop changes
  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (!isOpen) return null;

  const switchMode = () => {
    setIsLogin(prev => !prev);
    // Reset form when switching modes
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/signup';
  
    try {
      const requestData = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };
  
      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      console.log('Success:', response.data);
      toast.success(`${isLogin ? 'Login' : 'Signup'} successful!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // for cleaning inputs
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Something went wrong!';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 shadow-md"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-gray-600"></i>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Log in to your account' : 'Join us today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[black]"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[black]"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {isLogin && (
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[black]"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={isLogin ? 6 : 8}
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#4A90E2] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#3A80D2] transition-colors"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={switchMode}
              className="text-blue-600 font-medium hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <i className="fab fa-google text-red-500"></i>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with GitHub</span>
              <i className="fab fa-github"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
