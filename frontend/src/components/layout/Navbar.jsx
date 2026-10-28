import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/shield.svg" alt="Shield Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-white tracking-tight">Database Shield</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
              <Link to="/docs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Docs</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <HiOutlineX className="block h-6 w-6" /> : <HiOutlineMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-b border-white/5"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
              <Link to="/docs" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Docs</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-800">
              <div className="px-2 space-y-1 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary w-full text-center">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full text-center">Login</Link>
                    <Link to="/register" className="btn-primary w-full text-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
