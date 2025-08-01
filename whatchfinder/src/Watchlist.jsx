import { useState, useMemo } from 'react';
import { useWatchlist } from './Watchlistcontext.jsx';
import { Star, X, MonitorCheck, Search, Trash2, Share2  } from 'lucide-react';
import imagenotfound from './assets/imagenotfound.png';
import ShareModal from './ShareModal.jsx';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, addToWatched, isWatched, clearWatchlist, updatePriority,achievement } = useWatchlist();
  const img_300 = "https://image.tmdb.org/t/p/w300";

   const [showShareModal, setShowShareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateAdded'); 

  
  const filteredWatchlist = useMemo(() => {
    return watchlist.filter(movie =>
      (movie.title || movie.name).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [watchlist, searchTerm]);


  const sortedWatchlist = useMemo(() => {
    const sorted = [...filteredWatchlist];
    if(sortOption === 'title') {
      sorted.sort((a,b) => (a.title || a.name).localeCompare(b.title || b.name));
    }
    else if (sortOption === 'dateAdded') {
      sorted.reverse();
    }
    else if (sortOption === 'watched') {
     
      sorted.sort((a, b) => {
        const aWatched = isWatched(a.id) ? 1: 0;
        const bWatched = isWatched(b.id) ? 1:0;
        if (aWatched !== bWatched) {
          return bWatched - aWatched; 
        }
        return 0;
      });
    }
    else if (sortOption === 'unwatched') {
    
      sorted.sort((a, b) => {
        const aUnwatched = !isWatched(a.id) ? 1 : 0;
        const bUnwatched = !isWatched(b.id) ? 1 : 0;
        if (aUnwatched !== bUnwatched) {
          return bUnwatched - aUnwatched; 
        }
        return 0;
      });
    }
    else if (sortOption === 'priority') {

      const priorityOrder = { high: 3, medium: 2, low: 1 };
      sorted.sort((a, b) => {
        const aPriority = priorityOrder[a.priority?.toLowerCase()] || 2;
        const bPriority = priorityOrder[b.priority?.toLowerCase()] || 2;
        return bPriority - aPriority; 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="w-7 h-7 text-yellow-400" />
          My Watchlist <span className="text-gray-300 font-normal">({watchlist.length})</span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 w-full md:w-1/2 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white w-full focus:outline-none placeholder-gray-400"
              aria-label="Search watchlist"
            />
          </div>

          <div className="flex  sm:flex-row items-stretch gap-2 sm:gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-white text-sm">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-gray-800 text-white rounded px-2 py-1 text-sm focus:outline-none"
                aria-label="Sort watchlist"
              >
                <option value="dateAdded">Date Added</option>
                <option value="title">Title</option>
                <option value="watched">Watched</option>
                <option value="unwatched">Unwatched</option>
                <option value="priority">Priority</option>
              </select>
            </div>

     <div className="flex items-center gap-2">
     <button
  onClick={handleClearAll}
  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md border border-red-700 hover:border-red-800 min-w-[44px]"
  aria-label="Clear all watchlist"
>
  <Trash2 className="w-4 h-4 flex-shrink-0" />
  <span className="hidden sm:inline whitespace-nowrap">Clear All</span>
</button>

<button
  onClick={() => setShowShareModal(true)}
  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md border border-green-700 hover:border-green-800 min-w-[44px]"
  aria-label="Share watchlist"
>
  <Share2 className="w-4 h-4 flex-shrink-0" />
  <span className="hidden sm:inline whitespace-nowrap">Share Watchlist</span>
</button>
</div>
          
          </div>
        </div>

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />

        {sortedWatchlist.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            <p className="text-xl font-semibold">Your watchlist is empty</p>
            <p className="mt-2">Add some movies or TV shows to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedWatchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-200 group flex flex-col"
              >
                <div className="relative">
                  <img
                    src={movie.poster_path ? `${img_300}${movie.poster_path}` : imagenotfound}
                    alt={movie.title || movie.name}
                    className="w-full h-64 object-cover bg-gray-800"
                  />
                  {isWatched(movie.id) && (
                    <div className="absolute top-2 right-3 bg-green-500 rounded-full p-1.5 shadow">
                      <MonitorCheck className="text-white w-6 h-6" />
                    </div>
                  )}

                  <div className="absolute bottom-2 right-3">
                    <select
                      value={movie.priority || "medium"}
                      onChange={(e) => {
                        updatePriority(movie.id, e.target.value);
                      }}
                      className="bg-gray-800 text-white rounded px-2 py-1 text-xs shadow focus:outline-none"
                    >
                      <option value="high" className="text-red-600">High</option>
                      <option value="medium" className="text-orange-500">Medium</option>
                      <option value="low" className="text-green-500">Low</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemove(movie.id)}
                    className="absolute top-2 left-3 bg-red-600 rounded-full p-1.5 hover:bg-red-700 transition-colors shadow"
                    aria-label="Remove from watchlist"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-1">
                    {movie.media_type === "tv" ? "TV Show" : "Movie"}
                  </p>
                  <p className="text-gray-500 text-xs mb-1">
                    {movie.release_date || movie.first_air_date || "Unknown"}
                  </p>
                  <p className="text-yellow-400 text-xs mt-auto">
                    Priority: {movie.priority ? movie.priority.charAt(0).toUpperCase() + movie.priority.slice(1) : "Medium"}
                  </p>
                </div>
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={() => addToWatched(movie.id)}
                    className={`rounded text-white w-full py-2 text-sm font-medium transition-colors ${
                      isWatched(movie.id)
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isWatched(movie.id) ? 'Mark as Unwatched' : 'Mark Watched'}
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
