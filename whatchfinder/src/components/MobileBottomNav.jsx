import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart as Watchlist, Search, Star } from 'lucide-react';

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner sm:hidden z-50">
      <ul className="flex justify-around">
        <li>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
            aria-label="Watchlist"
          >
            <Watchlist className="h-6 w-6 mb-1" aria-hidden="true" />
            <span className="text-xs">Watchlist</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
            aria-label="Search"
          >
            <Search className="h-6 w-6 mb-1" aria-hidden="true" />
            <span className="text-xs">Search</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
            aria-label="Recommendations"
          >
            <Star className="h-6 w-6 mb-1" aria-hidden="true" />
            <span className="text-xs">Recommendations</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
