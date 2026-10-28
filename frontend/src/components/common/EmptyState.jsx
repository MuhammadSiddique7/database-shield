import React from 'react';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card">
      {Icon && <Icon className="w-16 h-16 text-gray-500 mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
