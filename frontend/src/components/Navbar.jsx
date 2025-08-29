import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User, Mic, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAppStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('Logged out successfully');
      navigate('/auth/sign-in');
    } else {
      toast.error('Logout failed');
    }
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 hover:cursor-pointer"
           onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Mic className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">VoiceNote</span>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              </div>
              <span className="font-medium text-gray-900 text-sm md:text-base hidden sm:block">
                {userInfo?.firstName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {userInfo?.email}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {userInfo?.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm md:text-base">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;