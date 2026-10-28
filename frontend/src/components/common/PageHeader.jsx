import React from 'react';

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-800">
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
