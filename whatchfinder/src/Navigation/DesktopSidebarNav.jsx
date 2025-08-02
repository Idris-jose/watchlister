import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSidebar } from '../SidebarContext.jsx';
import { useAuth } from '../Auth/AuthContext.jsx';
import { useWatchlist } from '../Watchlistcontext.jsx';
import logo from '../assets/logo.png'
import { 
  Clapperboard as Watchlist, 
  Search, 
  Star, 
  Home, 
  Compass,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Film
} from 'lucide-react';

export default function DesktopSidebarNav() {
  const {number} = useWatchlist()
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const { isCollapsed, setIsCollapsed } = useSidebar();
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

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <nav className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 hidden lg:flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Header */}
        <div className={`border-b border-gray-800 flex items-center ${isCollapsed ? 'p-3 justify-center' : 'p-6'}`}>
          <div className="flex items-center justify-between w-full">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <img src={logo} alt="WatchFinder Logo" className="w-70" />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800 flex-shrink-0"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
          <ul className="space-y-2">
           
            {navigationItems.map((item) => (
              <li key={item.path} className={isCollapsed ? 'px-2' : 'px-3'}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-700 to-blue-300 shadow-lg text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium transition-opacity duration-200">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* User Section */}
        <div className={`border-t border-gray-800 ${isCollapsed ? 'p-3' : 'p-6'}`}>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center w-full p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? user?.email || 'User Account' : ''}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="ml-3 text-left transition-opacity duration-200 min-w-0 flex-1">
                  <p className="font-medium text-white truncate">
                    {user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Account</p>
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className={`absolute bottom-full mb-2 ${
                isCollapsed 
                  ? 'left-full ml-2 w-48' 
                  : 'left-3 right-3'
              } bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-2 z-50`}>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for user menu on mobile (if needed) */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}