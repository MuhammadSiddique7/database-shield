import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiBars3, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-white/5 bg-gray-900/50 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-400 hover:text-white focus:outline-none"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-right">
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
              title="Logout"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
