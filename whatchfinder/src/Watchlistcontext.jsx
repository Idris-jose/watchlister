import { createContext, useContext, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from './Auth/AuthContext';
import {
  initializeUser,
  addToWatchlistDB,
  removeFromWatchlistDB,
  clearWatchlistDB,
  updateMoviePriorityDB,
  addToWatchedDB,
  removeFromWatchedDB,
  subscribeToUserData
} from './firestoreservices';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
 const { user } = useAuth();

  
  // Watchlist state
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [number, setNumber] = useState(0);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Search and details state
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [trailers, setTrailers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingTrailers, setLoadingTrailers] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [series, setSeries] = useState([]);
  const [achievement, setAchievement] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constants
  const API_KEY = "56185e1e9a25474a6cf2f5748dfb6ebf";
  const img_300 = "https://image.tmdb.org/t/p/w300";

  // Initialize user and subscribe to data changes
  useEffect(() => {
    if (!user) {
      // Reset all data when no user is authenticated
      setWatchlist([]);
      setWatched([]);
      setNumber(0);
      setUserDataLoading(false);
      return;
    }

    const initAndSubscribe = async () => {
      setUserDataLoading(true);
      
      try {
       await initializeUser(user.uid, user.email);
        // Subscribe to real-time updates
        const unsubscribe = subscribeToUserData(user.uid, (userData) => {
          setWatchlist(userData.watchlist || []);
          setWatched(userData.watched || []);
          setNumber((userData.watchlist || []).length);
          setUserDataLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing user data:', error);
        setUserDataLoading(false);
        toast.error('Failed to sync with server. Please check your connection.');
        
        // Don't fallback to localStorage - keep empty state
        setWatchlist([]);
        setWatched([]);
        setNumber(0);
      }
    };

    const unsubscribePromise = initAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [user]);

  // Fetch popular series (unchanged)
  const fetchPopularSeries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch TV series');
      }
      
      const data = await response.json();
      setSeries(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularSeries();
  }, []);

  // Movie details and trailers (unchanged functions)
  const fetchMovieDetails = async (movieId, mediaType) => {
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      const details = await response.json();
      
      setMovieDetails(prev => ({
        ...prev,
        [movieId]: {
          runtime: details.runtime || null,
          number_of_seasons: details.number_of_seasons || null,
          seasons: details.seasons || null,
          episode_run_time: details.episode_run_time || null,
          genres: details.genres || [],
          status: details.status || null,
          tagline: details.tagline || null
        }
      }));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const fetchTrailers = async (movieId, mediaType) => {
    setLoadingTrailers(true);
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const data = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      const { results } = await data.json();
      
      const youtubeTrailers = results?.filter(
        video => video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser' || video.type === 'Clip')
      ).sort((a, b) => {
        const typeOrder = { 'Trailer': 0, 'Teaser': 1, 'Clip': 2 };
        return typeOrder[a.type] - typeOrder[b.type];
      }) || [];
      
      setTrailers(youtubeTrailers);
      return youtubeTrailers;
    } catch (error) {
      console.error("Error fetching trailers:", error);
      setTrailers([]);
      return [];
    } finally {
      setLoadingTrailers(false);
    }
  };

  // Search functions (unchanged)
  const searchContent = async (query, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setMovieDetails({});
      return;
    }

    setIsSearching(true);
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`
      );
      const { results } = await data.json();
      setSearchResults(results || []);
      
      if (results && results.length > 0) {
        results.forEach(movie => {
          if (movie.id && movie.media_type) {
            fetchMovieDetails(movie.id, movie.media_type);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const updateSearchText = (text) => {
    setSearchText(text);
    if (text.trim()) {
      searchContent(text);
    } else {
      setSearchResults([]);
      setMovieDetails({});
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    setMovieDetails({});
  };

  const getMovieDetails = (movieId) => {
    return movieDetails[movieId] || {};
  };

  // Helper function to check if user is authenticated
  const requireAuth = (action) => {
    if (!user) {
      toast.error('Please sign in to use this feature', {
        duration: 3000,
        position: 'top-right',
      });
      return false;
    }
    return true;
  };

  // Watchlist functions with Firestore only
  const addToWatchlist = async (movie, Show, priority = "medium") => {
    if (!requireAuth('add to watchlist')) return;
    
    const movieToAdd = movie || Show;
    
    if (watchlist.some((m) => m.id === movieToAdd.id)) {
      toast.error(`${movieToAdd.title || movieToAdd.name} is already in your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    const enhancedMovie = {
      ...movieToAdd,
      ...movieDetails[movieToAdd.id],
      priority: priority.toLowerCase()
    };

    try {
      await addToWatchlistDB(user.uid, enhancedMovie);
      toast.success(`${movieToAdd.title || movieToAdd.name} has been added to your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist. Please try again.');
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!requireAuth('remove from watchlist')) return;
    
    const movieToRemove = watchlist.find(movie => movie.id === movieId);

    try {
      await removeFromWatchlistDB(user.uid, movieId);
      toast.error(`${movieToRemove?.title || movieToRemove?.name || 'Movie'} has been removed from your watchlist!`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist. Please try again.');
    }
  };

  const clearWatchlist = async () => {
    if (!requireAuth('clear watchlist')) return;

    try {
      await clearWatchlistDB(user.uid);
      toast.error('Watchlist has been cleared!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      toast.error('Failed to clear watchlist. Please try again.');
    }
  };

  const updatePriority = async (movieId, newPriority) => {
    if (!requireAuth('update priority')) return;

    try {
     await updateMoviePriorityDB(user.uid, movieId, newPriority);
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Failed to update priority. Please try again.');
    }
  };

  // Watched functions with Firestore only
  const isWatched = (movieId) => {
    return watched.some(movie => movie.id === movieId);
  };

  const addToWatched = async (movieOrId) => {
    if (!requireAuth('update watched status')) return;
    
    let movieToAdd;
    let movieId;

    if (typeof movieOrId === 'object') {
      movieToAdd = movieOrId;
      movieId = movieOrId.id;
    } else {
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

    try {
      if (!watched.some((m) => m.id === movieId)) {
        await addToWatchedDB(user.uid, movieToAdd);
        toast.success(`${movieToAdd.title || movieToAdd.name} has been added to your watched!`, {
          duration: 3000,
          position: 'top-right',
        });
      } else {
       await removeFromWatchedDB(user.uid, movieId);
        toast.error(`${movieToAdd.title || movieToAdd.name} has been removed from your watched!`, {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error updating watched status:', error);
      toast.error('Failed to update watched status. Please try again.');
    }
  };

  // Achievement system (unchanged)
  const ACHIEVEMENTS = [
    { count: 5, message: "🎉 Congrats! You added 5 items to your watchlist!" },
    { count: 10, message: "🏆 Amazing! 10 items in your watchlist!" },
    { count: 20, message: "🥇 You're a true cinephile! 20+ items added!" },
    { count: 50, message: "🌟 Unstoppable! 50+ items in your watchlist!" }
  ];

  useEffect(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (number === achievement.count) {
        setAchievement([achievement]);
        toast.success(`${achievement.message}`, {
          duration: 3000,
          position: 'top-right',
        });
      }
    });
  }, [number]);

  return (
    <WatchlistContext.Provider value={{
      // User state
      user,
      userDataLoading,
      
      // Existing watchlist functionality
      watchlist,
      watched,
      addToWatchlist,
      addToWatched,
      removeFromWatchlist,
      isWatched,
      number,
      clearWatchlist,
      updatePriority,
      achievement,
      
      // Search and details functionality
      searchText,
      searchResults,
      movieDetails,
      trailers,
      isSearching,
      loadingTrailers,
      loadingDetails,
      series,
      updateSearchText,
      searchContent,
      clearSearch,
      fetchMovieDetails,
      fetchTrailers,
      getMovieDetails,
      
      // Constants
      API_KEY,
      img_300,
    }}>
      {children}
      <Toaster />
    </WatchlistContext.Provider>
  );
};