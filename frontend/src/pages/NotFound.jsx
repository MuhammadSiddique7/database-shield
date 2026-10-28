import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark cyber-grid-bg flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-extrabold gradient-text tracking-widest drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">
          404
        </h1>
        <div className="bg-cyan-400 px-2 text-sm rounded rotate-12 absolute -mt-16 ml-[6.5rem] text-dark font-bold shadow-lg">
          Page Not Found
        </div>
        <div className="mt-12 glass-card p-8 max-w-md mx-auto">
          <p className="text-gray-300 text-lg mb-6">
            The page you're looking for doesn't exist or has been moved to another quadrant of the matrix.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center justify-center w-full">
            Return to Base
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
