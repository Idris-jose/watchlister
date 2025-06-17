import { useState, useMemo } from 'react';
import { useWatchlist } from './Watchlistcontext.jsx';
import { Star, X, MonitorCheck, Search, Trash2 } from 'lucide-react';
import imagenotfound from './assets/imagenotfound.png';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, addToWatched, isWatched, clearWatchlist, updatePriority } = useWatchlist();
  const img_300 = "https://image.tmdb.org/t/p/w300";

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateAdded'); // 'dateAdded' or 'title'

  // Filter watchlist by search term
  const filteredWatchlist = useMemo(() => {
    return watchlist.filter(movie =>
      (movie.title || movie.name).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [watchlist, searchTerm]);

  // Sort filtered watchlist
  const sortedWatchlist = useMemo(() => {
    const sorted = [...filteredWatchlist];
    if(sortOption === 'title') {
      sorted.sort((a,b) => (a.title || a.name).localeCompare(b.title || b.name));
    }
    else if (sortOption === 'dateAdded') {
      sorted.reverse();
    }
    else if (sortOption === 'watched') {
      // Sort so watched items appear first, then by date added (newest first)
      sorted.sort((a, b) => {
        const aWatched = isWatched(a.id) ? 1: 0;
        const bWatched = isWatched(b.id) ? 1:0;
        if (aWatched !== bWatched) {
          return bWatched - aWatched; // watched first
        }
        return 0;
      });
    }
    else if (sortOption === 'unwatched') {
      // Sort so unwatched items appear first
      sorted.sort((a, b) => {
        const aUnwatched = !isWatched(a.id) ? 1 : 0;
        const bUnwatched = !isWatched(b.id) ? 1 : 0;
        if (aUnwatched !== bUnwatched) {
          return bUnwatched - aUnwatched; // unwatched first
        }
        return 0;
      });
    }
    else if (sortOption === 'priority') {
      // Sort by priority: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      sorted.sort((a, b) => {
        const aPriority = priorityOrder[a.priority?.toLowerCase()] || 2;
        const bPriority = priorityOrder[b.priority?.toLowerCase()] || 2;
        return bPriority - aPriority; // higher priority first
      });
    }
    return sorted;
  }, [filteredWatchlist, sortOption, isWatched]);

  const handleRemove = (movieId) => {
    if (window.confirm('Are you sure you want to remove this movie from your watchlist?')) {
      removeFromWatchlist(movieId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      clearWatchlist();
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
          <Star className="w-8 h-8 text-yellow-400 mr-3" />
          My Watchlist ({watchlist.length})
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center bg-gray-900 rounded p-2 w-full sm:w-1/2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white w-full focus:outline-none"
              aria-label="Search watchlist"
            />
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="text-white mr-2">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-900 text-white rounded p-2"
              aria-label="Sort watchlist"
            >
              <option value="dateAdded">Date Added</option>
              <option value="title">Title</option>
              <option value="watched">Watched</option>
              <option value="unwatched">Unwatched</option>
              <option value="priority">Priority</option>
            </select>

            <button
              onClick={handleClearAll}
              className="bg-red-600 rounded hover:bg-red-700 text-white p-2 flex items-center gap-1"
              aria-label="Clear all watchlist"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          </div>
        </div>

        {sortedWatchlist.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl">Your watchlist is empty</p>
            <p className="mt-2">Add some movies or TV shows to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedWatchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200 group"
              >
                <div className="relative">
                  <img
                    src={movie.poster_path ? `${img_300}${movie.poster_path}` : imagenotfound}
                    alt={movie.title || movie.name}
                    className="w-full h-72 object-cover"
                  />
                  {isWatched(movie.id) && (
                    <div className='absolute top-2 right-3 bg-green-500 rounded-full p-2 '>
                      <MonitorCheck className=' text-white  w-7 h-7 ' />
                    </div>
                  )}

                  <div className="absolute bottom-2 right-3">
                    <select
                      value={movie.priority || "medium"}
                      onChange={(e) => {
                        updatePriority(movie.id, e.target.value);
                      }}
                      className="bg-gray-800 text-white rounded p-1 text-xs"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemove(movie.id)}
                    className="absolute top-2 left-3 bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors"
                    aria-label="Remove from watchlist"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    {movie.media_type === "tv" ? "TV Show" : "Movie"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {movie.release_date || movie.first_air_date || "Unknown"}
                  </p>
                  <p className="text-yellow-400 text-xs mt-1">
                    Priority: {movie.priority ? movie.priority.charAt(0).toUpperCase() + movie.priority.slice(1) : "Medium"}
                  </p>
                </div>
                <div className='flex gap-2 p-3 rounded-2xl'>
                  <button
                    onClick={() => addToWatched(movie.id)}
                    className={`rounded text-white w-full p-2 ${
                      isWatched(movie.id)
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isWatched(movie.id) ? 'Mark as unWatched' : 'Mark Watched'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
