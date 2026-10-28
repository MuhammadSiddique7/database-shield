import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { HiOutlineUser, HiOutlineKey } from 'react-icons/hi2';
import PageHeader from '../components/common/PageHeader';
import useAuth from '../hooks/useAuth';
import { updateProfile, changePassword } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email) {
      toast.error('Name and email are required');
      return;
    }
    
    setIsUpdatingProfile(true);
    try {
      const res = await updateProfile(profileData);
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your account settings and change your password."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            <div className="p-3 bg-cyan-900/30 rounded-lg text-cyan-400">
              <HiOutlineUser className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
              <p className="text-sm text-gray-400">Update your name and email address</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-4">Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
              <button 
                type="submit" 
                disabled={isUpdatingProfile} 
                className="btn-primary w-full md:w-auto px-8"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            <div className="p-3 bg-indigo-900/30 rounded-lg text-indigo-400">
              <HiOutlineKey className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security</h2>
              <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isUpdatingPassword} 
                className="btn-secondary w-full md:w-auto px-8 text-indigo-400 hover:text-white"
              >
                {isUpdatingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
