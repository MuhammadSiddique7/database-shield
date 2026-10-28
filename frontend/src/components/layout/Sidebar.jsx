import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineChartBarSquare,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineUser
} from 'react-icons/hi2';

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: HiOutlineChartBarSquare, end: true },
    { name: 'Projects', path: '/dashboard/projects', icon: HiOutlineFolder, end: false },
    { name: 'Logs', path: '/dashboard/logs', icon: HiOutlineDocumentText, end: false },
    { name: 'Documentation', path: '/dashboard/docs', icon: HiOutlineBookOpen, end: false },
    { name: 'Profile', path: '/dashboard/profile', icon: HiOutlineUser, end: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-white/5">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/shield.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-white tracking-tight">DB Shield</span>
          </NavLink>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={() => { if (isOpen) onClose(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive ? 'sidebar-link-active bg-cyan-900/30 text-cyan-400' : 'sidebar-link text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
