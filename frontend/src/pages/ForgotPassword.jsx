import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '../services/api';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setIsSuccess(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
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
          Reset Password
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass-card py-8 px-4 sm:rounded-lg sm:px-10">
          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/50">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Check your email</h3>
              <p className="text-gray-400 mb-6">
                We've sent password reset instructions to your email address.
              </p>
              <Link to="/login" className="btn-secondary w-full block text-center">
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <p className="text-gray-400 text-sm text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-2.5 flex justify-center"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
