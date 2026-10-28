import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <motion.div
        className="w-16 h-16 border-4 border-gray-800 border-t-cyan-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="mt-4 text-cyan-400 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
