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
  const [watched, setWatched] = useState([]);

  const isWatched = (movieId) => {
    return watched.some(movie => movie.id === movieId);
  };

  const addToWatched = (movieOrId) => {
    // Handle both movie object and movie ID
    let movieToAdd;
    let movieId;
    
    if (typeof movieOrId === 'object') {
      // Full movie object was passed
      movieToAdd = movieOrId;
      movieId = movieOrId.id;
    } else {
      // Just ID was passed, find the movie in watchlist
      movieId = movieOrId;
      movieToAdd = watchlist.find(movie => movie.id === movieId);
    }
    
    if (!movieToAdd) {
      toast.error('Movie not found!', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }
    
    if (!watched.some((m) => m.id === movieId)) {
      setWatched(prev => [...prev, movieToAdd]);
      
      toast.success(`${movieToAdd.title || movieToAdd.name} has been added to your watched!`, {
        duration: 3000,
        position: 'top-right',
      });
    } else {
      toast.error(`${movieToAdd.title || movieToAdd.name} has already been added to your watched!`, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const removeFromWatched = (movieId) => {
    const movieToRemove = watched.find(movie => movie.id === movieId);
    
    toast.error(`${movieToRemove?.title || movieToRemove?.name || 'Movie'} has been removed from your watched list!`, {
      duration: 3000,
      position: 'top-right',
    });
    
    setWatched(prev => prev.filter(movie => movie.id !== movieId));
  };

  const addToWatchlist = (movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist(prev => [...prev, movie]);
      setNumber(prev => prev + 1);
      
      toast.success(`${movie.title || movie.name} has been added to your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
    } else {
      toast.error(`${movie.title || movie.name} is already in your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const removeFromWatchlist = (movieId) => {
    const movieToRemove = watchlist.find(movie => movie.id === movieId);
    
    toast.error(`${movieToRemove?.title || movieToRemove?.name || 'Movie'} has been removed from your watchlist!`, {
      duration: 3000,
      position: 'top-right',
    });
    
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
    setNumber(prev => Math.max(0, prev - 1));
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      watched,
      addToWatchlist, 
      addToWatched,
      removeFromWatchlist,
      removeFromWatched,
      isWatched,
      number,
    }}>
      {children}
      <Toaster />
    </WatchlistContext.Provider>
  );
};