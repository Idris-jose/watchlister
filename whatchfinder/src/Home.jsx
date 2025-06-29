
import { useState } from 'react'
import { SearchCheck, Star, Plus, Info, X, Play, Calendar, Clock, Users, Clapperboard, Tv } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from './assets/logo.png'
import imagenotfound from './assets/imagenotfound.png'
import { useWatchlist } from './Watchlistcontext.jsx';

function Home1() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTrailer, setActiveTrailer] = useState(0);
  
  const {
    // Search functionality
    searchText,
    searchResults,
    updateSearchText,
    isSearching,
    
    // Movie details
    movieDetails,
    series,
    getMovieDetails,
    fetchMovieDetails,
    
    // Trailers
    trailers,
    fetchTrailers,
    loadingTrailers,
    
    // Watchlist functionality
    addToWatchlist,
    number,
    
    // Constants
    img_300,
  } = useWatchlist();

  const handleAddToWatchlist = (movie) => {
    const movieToAdd = movie || selectedMovie;
    if (!movieToAdd) return;
    
    addToWatchlist(movieToAdd);
    
    if (!movie) handleCloseModal();
  };

  const handleOpenModal = async (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
    
    // Fetch additional details if not already loaded
    const details = getMovieDetails(movie.id);
    if (!details || Object.keys(details).length === 0) {
      await fetchMovieDetails(movie.id, movie.media_type);
    }
    
    const fetchedTrailers = await fetchTrailers(movie.id, movie.media_type);
    setActiveTrailer(0);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
    setActiveTrailer(0);
  };

  // Helper function to format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Enhanced Modal component for movie details
  const MovieModal = ({ open, onClose, movie }) => {
    if (!open || !movie) return null;

    const {
      title,
      name,
      poster_path,
      backdrop_path,
      first_air_date,
      release_date,
      overview,
      vote_average,
      vote_count,
      media_type,
    } = movie;

    // Get additional details for this movie
    const details = getMovieDetails(movie.id);

    const formatDate = (dateString) => {
      if (!dateString) return "Unknown";
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with backdrop */}
          <div className="relative h-64 bg-gradient-to-b from-transparent to-gray-900">
            {backdrop_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
                alt="Backdrop"
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900"></div>
            )}
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute bottom-4 left-6 flex items-end space-x-4">
              <img
                src={poster_path ? `${img_300}${poster_path}` : imagenotfound}
                alt="Poster"
                className="w-24 h-36 rounded-lg shadow-lg border-2 border-white/20"
              />
              <div className="text-white pb-2">
                <h2 className="text-3xl font-bold mb-2">{title || name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-300 flex-wrap">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(first_air_date || release_date)}
                  </span>
                  <span className="px-2 py-1 bg-blue-600 rounded-full text-xs font-medium">
                    {media_type === "tv" ? "TV Series" : "Movie"}
                  </span>
                  {/* Runtime for movies */}
                  {media_type === 'movie' && details.runtime && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatRuntime(details.runtime)}
                    </span>
                  )}
                  {/* Seasons for TV shows */}
                  {media_type === 'tv' && details.number_of_seasons && (
                    <span className="flex items-center">
                      <Tv className="w-4 h-4 mr-1" />
                      {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                    </span>
                  )}
                  {vote_average > 0 && (
                    <span className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
            {/* Additional Info Section */}
            {details && Object.keys(details).length > 0 && (
              <div className="mb-6 bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {media_type === 'movie' && details.runtime && (
                    <div>
                      <span className="text-gray-400">Runtime:</span>
                      <p className="text-white font-medium">{formatRuntime(details.runtime)}</p>
                    </div>
                  )}
                  {media_type === 'tv' && details.number_of_seasons && (
                    <div>
                      <span className="text-gray-400">Seasons:</span>
                      <p className="text-white font-medium">{details.number_of_seasons}</p>
                    </div>
                  )}
                  {media_type === 'tv' && details.episode_run_time && details.episode_run_time.length > 0 && (
                    <div>
                      <span className="text-gray-400">Episode Length:</span>
                      <p className="text-white font-medium">{details.episode_run_time[0]} min</p>
                    </div>
                  )}
                  {details.status && (
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <p className="text-white font-medium">{details.status}</p>
                    </div>
                  )}
                  {details.genres && details.genres.length > 0 && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-gray-400">Genres:</span>
                      <p className="text-white font-medium">
                        {details.genres.map(genre => genre.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trailers Section */}
            {loadingTrailers ? (
              <div className="mb-6 bg-gray-800 rounded-xl p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="bg-gray-700 rounded-lg h-48"></div>
                </div>
              </div>
            ) : trailers && trailers.length > 0 ? (
              <div className="mb-6 bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-red-500" />
                  Trailers & Videos
                </h3>
                
                {/* Main video player */}
                <div className="mb-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="300"
                      src={`https://www.youtube.com/embed/${trailers[activeTrailer]?.key}?rel=0`}
                      title={trailers[activeTrailer]?.name}
                      frameBorder="0"
                      allowFullScreen
                      className="w-full"
                    ></iframe>
                  </div>
                  <div className="mt-2 px-2">
                    <h4 className="text-white font-medium">{trailers[activeTrailer]?.name}</h4>
                    <p className="text-gray-400 text-sm">{trailers[activeTrailer]?.type}</p>
                  </div>
                </div>

                {/* Video thumbnails */}
                {trailers.length > 1 && (
                  <div className="space-y-2">
                    <h4 className="text-white text-sm font-medium">More Videos</h4>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {trailers.map((trailer, index) => (
                        <button
                          key={trailer.key}
                          onClick={() => setActiveTrailer(index)}
                          className={`flex-shrink-0 group relative ${
                            index === activeTrailer ? 'ring-2 ring-red-500' : ''
                          }`}
                        >
                          <div className="w-32 h-18 bg-gray-700 rounded-lg overflow-hidden relative">
                            <img
                              src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                              alt={trailer.name}
                              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white opacity-80" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 mt-1 w-32 truncate">
                            {trailer.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6 bg-gray-800 rounded-xl p-6 text-center">
                <Play className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No trailers available</p>
              </div>
            )}

            {/* Overview Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                {overview || "No overview available for this title."}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">
                    {vote_average ? vote_average.toFixed(1) : "N/A"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Rating</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-blue-400 mr-1" />
                  <span className="text-white font-semibold">
                    {vote_count ? vote_count.toLocaleString() : "0"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Votes</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
             
              <button 
                onClick={() => handleAddToWatchlist(movie)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 bg-black flex flex-col items-center">
      {/* Movie Modal */}
      <MovieModal
        open={modalOpen}
        onClose={handleCloseModal}
        movie={selectedMovie}
      />
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center mb-4 relative">
        <img src={logo} alt="WatchFinder Logo" className="w-70 " />

         <div className="col-span-full text-center text-white/70 font-medium text-lg mt-3">
              Search for movies or TV shows to get started
            </div>

        <div className="flex items-center bg-gray-900 rounded p-2 lg:w-2xl md:w-xl mt-3 mb-3 sm:w-lg">
          <SearchCheck className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            value={searchText}
            onChange={(e) => updateSearchText(e.target.value)}
            className="bg-transparent text-white w-full focus:outline-none"
            aria-label="Search watchlist"
          />
        </div>

        <Link to="/Watchlist">
          <div className="absolute top-5 right-5 flex items-center">
            <Clapperboard className='text-white w-8 h-8' />
            {number > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {number}
              </span>
            )}
          </div>
        </Link>
      </div>
        
      {/* Loading indicator */}
      {isSearching && (
        <div className="text-white text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2">Searching...</p>
        </div>
      )}

      {/* Results Section */}
      <div className="container mx-auto px-4 flex justify-center">

      {
        !searchText &&  (
        //for popular series
        <div className="grid justify-center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.map((show) => (
            <div
              key={show.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
            >
              {/* Poster Image */}
              <div className="relative">
                <img
                  src={
                    show.poster_path
                      ? `${img_300}/${show.poster_path}`
                      : 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Image'
                  }
                  alt={show.name}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-sm text-white">{show.vote_average?.toFixed(1)}</span>
                </div>
                {/* Popularity Badge */}
                <div className="absolute top-2 left-2 bg-purple-600 bg-opacity-90 rounded-full px-2 py-1">
                  <span className="text-xs text-white font-medium">#{series.indexOf(show) + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {show.name}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {show.first_air_date
                      ? new Date(show.first_air_date).getFullYear()
                      : 'TBA'}
                  </span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-3">
                  {show.overview || 'No description available.'}
                </p>

                {/* Additional Info */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Popularity: {Math.round(show.popularity)}</span>
                  <span>Votes: {show.vote_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        )
      }
       

        
        <div className="grid justify-center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          // for search result
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((movie) => {
              const {
                name,
                title,
                poster_path,
                first_air_date,
                release_date,
                media_type,
                vote_average,
                vote_count,
                overview,
                id,
              } = movie;
              
              // Get additional details for this movie
              const details = getMovieDetails(id);
              
              return (
                <div
                  className="bg-gray-900 rounded-xl shadow-lg w-full overflow-hidden hover:scale-105 transition-transform duration-200 group mx-auto"
                  style={{ maxWidth: "420px" }}
                  key={id}
                >
                  <div className="relative">
                    <img
                      src={poster_path ? `${img_300}/${poster_path}` : imagenotfound}
                      className="w-full h-72 object-cover transition-opacity duration-300 group-hover:opacity-80"
                      alt={title || name || "Movie poster"}
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {media_type === "tv" ? "TV" : "Movie"}
                    </span>
                    {vote_average > 0 && (
                      <span className="absolute top-2 right-2 flex items-center bg-yellow-400/90 text-black text-xs px-2 py-1 rounded-full font-semibold">
                        {vote_average.toFixed(1)}
                        <Star className="ml-1 w-4 h-4 text-yellow-700" />
                      </span>
                    )}
                    {/* Show runtime/seasons on card */}
                    {(details.runtime || details.number_of_seasons) && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        {media_type === 'movie' && details.runtime ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            {formatRuntime(details.runtime)}
                          </>
                        ) : media_type === 'tv' && details.number_of_seasons ? (
                          <>
                            <Tv className="w-3 h-3 mr-1" />
                            {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                          </>
                        ) : null}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col h-56">
                    <h5 className="text-lg font-semibold text-white text-center mb-1 truncate">
                      {title || name}
                    </h5>
                    <div className="flex items-center justify-center text-xs text-gray-600 mb-2">
                      <span>
                        {first_air_date || release_date || "Unknown"}
                      </span>
                      {vote_count ? (
                        <span className="ml-2 text-gray-400">({vote_count} votes)</span>
                      ) : null}
                    </div>
                    <p className="text-white text-sm flex-1  line-clamp-1 overflow-hidden">
                      {overview || "No overview available."}
                    </p>
                    <div className="flex flex-col gap-2 mt">
                      <button 
                        onClick={() => handleOpenModal(movie)}
                        className="bg-blue-900 rounded text-white flex items-center justify-center w-full px-4 py-2 font-medium hover:bg-blue-800 transition"
                      >
                        <Info className='mr-1 w-4 text-white'/> More Info
                      </button>
                      <button 
                        onClick={() => handleAddToWatchlist(movie)}
                        className="bg-white border border-blue-900 flex items-center justify-center rounded text-blue-900 w-full px-4 py-2 font-medium hover:bg-blue-50 transition">
                        <Plus className='mr-1 text-blue-800' /> Add to Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : searchText.trim() && (
            <div className="col-span-full text-center text-white font-semibold text-xl mt-8">
              No results found for "{searchText}"
            </div>
          ) }
        </div>
      </div>
      <footer className="mt-8 text-gray-500 text-sm">
        <p className="text-center"> 
          made by jose idris
          </p>
          </footer>
    </div>
  );
}

export default Home1