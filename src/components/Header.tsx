import React, { useState } from 'react';
import { ChevronDown, User, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';
import ProfileSettingsModal from './ProfileSettingsModal';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout API fails
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsDropdownOpen(false);
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                disabled={isLoading}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <span className="font-medium">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button 
                    onClick={handleChangePasswordClick}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    <Lock className="h-4 w-4 mr-3" />
                    Change Password
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
      )}
      
      {showProfileModal && (
        <ProfileSettingsModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

export default Header;