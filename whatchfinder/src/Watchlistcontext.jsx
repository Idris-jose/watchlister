import { createContext, useContext, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

const WATCHLIST_STORAGE_KEY = 'watchlist';
const WATCHED_STORAGE_KEY = 'watched';

export const WatchlistProvider = ({ children }) => {
  // Existing watchlist state
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [watched, setWatched] = useState(() => {
    const stored = localStorage.getItem(WATCHED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [number, setNumber] = useState(watchlist.length);

  // New search and details state
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [trailers, setTrailers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingTrailers, setLoadingTrailers] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [priority, setPriority] = useState(""); // Default priority for trailers
  const [priorityMap, setPriorityMap] = useState({}); // Store priority per movieId

  
  // Constants
  const API_KEY = "56185e1e9a25474a6cf2f5748dfb6ebf";
  const img_300 = "https://image.tmdb.org/t/p/w300";

  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    setNumber(watchlist.length);
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watched));
  }, [watched]);

 

  // Fetch additional details for a movie/TV show
  const fetchMovieDetails = async (movieId, mediaType) => {
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      const details = await response.json();
      
      // Store details in our state object using the movie ID as key
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

  // Fetch trailers for a movie/TV show
  const fetchTrailers = async (movieId, mediaType) => {
    setLoadingTrailers(true);
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const data = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      const { results } = await data.json();
      
      // Filter for YouTube trailers only and sort by type preference
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

  // Search for movies and TV shows
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
      
      // Fetch additional details for each result
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

  // Update search text and trigger search
  const updateSearchText = (text) => {
    setSearchText(text);
    if (text.trim()) {
      searchContent(text);
    } else {
      setSearchResults([]);
      setMovieDetails({});
    }
  };

  // Clear search results
  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    setMovieDetails({});
  };

  // Get details for a specific movie
  const getMovieDetails = (movieId) => {
    return movieDetails[movieId] || {};
  };

  // Existing watchlist functions
  const isWatched = (movieId) => {
    return watched.some(movie => movie.id === movieId);
  };

  const addToWatched = (movieOrId) => {
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

  if (!watched.some((m) => m.id === movieId)) {
    setWatched(prev => [...prev, movieToAdd]);
    

    toast.success(`${movieToAdd.title || movieToAdd.name} has been added to your watched!`, {
      duration: 3000,
      position: 'top-right',
    });
  } else if (watched.some((m) => m.id === movieId)) {
    // If already watched, remove from watched and notify
    setWatched(prev => prev.filter(movie => movie.id !== movieId));
    toast.error(`${movieToAdd.title || movieToAdd.name} has been removed from your watched!`, {
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
      // Include additional details if available
      const enhancedMovie = {
        ...movie,
        ...movieDetails[movie.id]
      };
      
      
      setWatchlist(prev => [...prev, enhancedMovie]);
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

  const clearWatchlist = () => {
    setWatchlist([]);
    setNumber(0);
    toast.error('Watchlist has been cleared!', {
      duration: 3000,
      position: 'top-right',
    });
  };

  return (
    <WatchlistContext.Provider value={{
      // Existing watchlist functionality
      watchlist,
      watched,
      addToWatchlist,
      addToWatched,
      removeFromWatchlist,
      removeFromWatched,
      isWatched,
      number,
      clearWatchlist,
      
      // New search and details functionality
      searchText,
      searchResults,
      movieDetails,
      trailers,
      isSearching,
      loadingTrailers,
      loadingDetails,
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