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
  const [number,setNumber] = useState (0)
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const addToWatchlist = (movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist(prev => [...prev, movie]);
    }
    setNumber(prev => prev + 1);
    Toaster.success(`${movie.title} has been added to your watchlist!`, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const removeFromWatchlist = (movieId) => {
   Toaster.error(`Movie has been removed from your watchlist!`, {
      duration: 3000,
      position: 'top-right',
    });
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      addToWatchlist, 
      removeFromWatchlist,
      toast,
      number,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};