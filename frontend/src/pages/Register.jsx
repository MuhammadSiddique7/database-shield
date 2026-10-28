import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark cyber-grid-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <img src="/shield.svg" alt="Logo" className="w-12 h-12" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            Sign in
          </Link>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass-card py-8 px-4 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  className="input-field pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  className="input-field pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                  {showConfirmPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-2.5 flex justify-center"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
