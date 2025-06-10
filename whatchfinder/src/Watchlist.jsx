// Watchlist.jsx
import { useWatchlist } from './Watchlistcontext.jsx';
import { Star, X } from 'lucide-react';
import imagenotfound from './assets/imagenotfound.png';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const img_300 = "https://image.tmdb.org/t/p/w300";

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
          <Star className="w-8 h-8 text-yellow-400 mr-3" />
          My Watchlist ({watchlist.length})
        </h1>
        
        {watchlist.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl">Your watchlist is empty</p>
            <p className="mt-2">Add some movies or TV shows to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((movie) => (
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
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
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