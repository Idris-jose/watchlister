import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';
import { 
  Clapperboard as Watchlist, 
  Search, 
  Star, 
  Home, 
  Compass,
  User,
  LogOut,
  Settings,
  X,
  Clapperboard
} from 'lucide-react';

export default function MobileBottomNav() {
  const [showUserModal, setShowUserModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/watchlist', icon: Watchlist, label: 'Watchlist' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 lg:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 ${
                isActive(item.path)
                  ? 'text-white'
                  : 'text-gray-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-700 to-blue-300 shadow-lg'
                  : 'hover:bg-gray-800'
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs mt-1 font-medium truncate ${
                isActive(item.path) ? 'text-white' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </NavLink>
          ))}
          
          {/* User Profile Button */}
          <button
            onClick={() => setShowUserModal(true)}
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-xl hover:bg-gray-800 transition-all duration-200">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500">
              Profile
            </span>
          </button>
        </div>
      </nav>

      {/* User Modal for Mobile */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 lg:hidden">
          <div 
            className="bg-gray-900 w-full max-w-md rounded-t-3xl border-t border-gray-800 animate-slide-up"
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Account</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {user?.email || 'User'}
                  </p>
                  
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-4">
            
        
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-4 text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Safe area padding for devices with home indicators */}
            <div className="h-8"></div>
          </div>
        </div>
      )}

      {/* Add custom CSS for slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}