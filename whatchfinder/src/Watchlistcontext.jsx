// WatchlistContext.jsx
import { createContext, useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [number, setNumber] = useState(0);

  const addToWatchlist = (movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist(prev => [...prev, movie]);
      setNumber(prev => prev + 1);
      
      // Use toast.success instead of Toaster.success
      toast.success(`${movie.title || movie.name} has been added to your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
    } else {
      // Show message if already in watchlist
      toast.error(`${movie.title || movie.name} is already in your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const removeFromWatchlist = (movieId) => {
    const movieToRemove = watchlist.find(movie => movie.id === movieId);
    
    // Use toast.error instead of Toaster.error
    toast.error(`${movieToRemove?.title || movieToRemove?.name || 'Movie'} has been removed from your watchlist!`, {
      duration: 3000,
      position: 'top-right',
    });
    
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
    setNumber(prev => Math.max(0, prev - 1)); // Ensure number doesn't go below 0
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      addToWatchlist, 
      removeFromWatchlist,
      number,
    }}>
      {children}
      {/* Add the Toaster component here to render toasts */}
      <Toaster />
    </WatchlistContext.Provider>
  );
};