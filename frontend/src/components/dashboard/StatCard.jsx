import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorMap = {
    cyan: 'border-l-cyan-400',
    green: 'border-l-emerald-400',
    red: 'border-l-red-400',
    orange: 'border-l-orange-400'
  };

  const textColorMap = {
    cyan: 'text-cyan-400',
    green: 'text-emerald-400',
    red: 'text-red-400',
    orange: 'text-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 border-l-4 ${colorMap[color] || 'border-l-gray-400'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-gray-800 ${textColorMap[color] || 'text-gray-400'}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
