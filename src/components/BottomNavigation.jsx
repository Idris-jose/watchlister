import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, Home, User } from 'lucide-react';
import { useWatchlist } from '../Watchlistcontext.jsx';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { number } = useWatchlist();

  const navItems = [
    {
      id: 'recommendations',
      label: 'Discover',
      icon: Home,
      path: '/home',
      badge: null
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: '/home',
      badge: null
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: Heart,
      path: '/Watchlist',
      badge: number > 0 ? number : null
    }
  ];

  const handleNavClick = (item) => {
    if (item.id === 'search' && location.pathname === '/home') {
      // If already on home page and clicking search, focus the search input
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate(item.path);
    }
  };

  const isActive = (item) => {
    if (item.id === 'search' || item.id === 'recommendations') {
      return location.pathname === '/home';
    }
    return location.pathname === item.path;
  };

  // Don't show on landing page, login, or signup pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/Signup' || location.pathname === '/forgot-password') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-2 px-4 min-w-0 flex-1 relative transition-colors duration-200 ${
                active 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 mb-1 ${
                    active ? 'text-blue-400' : 'text-gray-400'
                  }`} 
                />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium truncate ${
                active ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;