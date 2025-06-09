import { useState, useEffect } from 'react'
import { SearchCheck, Star, Plus, Info, X } from 'lucide-react'
import './App.css'
import logo from './assets/logo.png' // Placeholder logo since we can't import local assets
// Placeholder images since we can't import local assets
const imagenotfound = "https://via.placeholder.com/300x450/gray/white?text=No+Image+Available"

function App() {
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);
  const [page] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  
  // Image constants
  const img_300 = "https://image.tmdb.org/t/p/w300";
 
  const fetchTrailers = async (movieId, mediaType) => {
  try {
    const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
    const data = await fetch(
      `https://api.themoviedb.org/3/${endpoint}/${movieId}/videos?api_key=56185e1e9a25474a6cf2f5748dfb6ebf&language=en-US`
    );
    const { results } = await data.json();
    
    // Filter for YouTube trailers only
    const youtubeTrailers = results?.filter(
      video => video.site === 'YouTube' && 
      (video.type === 'Trailer' || video.type === 'Teaser')
    ) || [];
    
    setTrailers(youtubeTrailers); // Same pattern as setContent(results)
  } catch (error) {
    console.error("Error fetching trailers:", error);
    setTrailers([]);
  }
}

  const fetchSearch = async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=56185e1e9a25474a6cf2f5748dfb6ebf&language=en-US&query=${searchText}&page=${page}&include_adult=false`
      );
      const { results } = await data.json();
      setContent(results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setContent([]);
    }
  };

  useEffect(() => {
    if (searchText.trim()) {
      fetchSearch();
    } else {
      setContent([]);
    }
  }, [searchText]);
 
  const Trigger = (e) => {
    setSearchText(e.target.value);
  };
 
  const Search = () => {
    if (searchText.trim()) {
      fetchSearch();
    }
  };

  const handleOpenModal = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
    fetchTrailers(movie.id, movie.media_type)
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  // Modal component for movie details
  const MovieModal = ({ open, onClose, movie }) => {
    if (!open || !movie) return null;

    const {
      title,
      name,
      poster_path,
      first_air_date,
      release_date,
      overview,
      vote_average,
      vote_count,
      trailler,
      media_type,

    } = movie;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{title || name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          
         {trailers && trailers.length > 0 ? (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">Trailers</h3>
    {trailers.map((trailer) => (
      <div key={trailer.key} className="mb-3">
        <p className="text-sm font-medium mb-1">{trailer.name}</p>
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name}
          frameBorder="0"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 text-sm mb-4">No trailers available</p>
)}



          
          <p className="text-gray-600 mb-2">
            {media_type === "tv" ? "TV Series" : "Movie"} • {first_air_date || release_date || "Unknown"}
          </p>
          
          <p className="text-gray-700 mb-4">{overview || "No overview available."}</p>
          
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="text-gray-700">
              {vote_average ? vote_average.toFixed(1) : "N/A"} ({vote_count || 0} votes)
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
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
      <div className="flex flex-col items-center justify-center mb-8">
        <img src={logo} alt="WatchFinder Logo" className="w-70 mb-4" />
        <div className="flex w-full max-w-2xl bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl">
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            value={searchText}
            onChange={Trigger}
            className="flex-1 px-4 py-2 rounded-l-xl border-0 focus:outline-none text-gray-800 bg-white backdrop-blur-sm shadow-inner placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && Search()}
          />
          <button
            className="bg-gradient-to-r from-gray-950 to-gray-700 backdrop-blur-sm text-white px-6 rounded-r-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={Search}
          >
            <SearchCheck className="text-white" />
          </button>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="container mx-auto px-4 flex justify-center">
        <div className="grid justify-center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content && content.length > 0 ? (
            content.map((movie) => {
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
              
              return (
                <div
                  className="bg-white rounded-xl shadow-lg w-full overflow-hidden hover:scale-105 transition-transform duration-200 group mx-auto"
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
                    {vote_average && (
                      <span className="absolute top-2 right-2 flex items-center bg-yellow-400/90 text-black text-xs px-2 py-1 rounded-full font-semibold">
                        {vote_average.toFixed(1)}
                        <Star className="ml-1 w-4 h-4 text-yellow-700" />
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col h-56">
                    <h5 className="text-lg font-semibold text-black text-center mb-1 truncate">
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
                    <p className="text-gray-700 text-sm flex-1 mb-3 line-clamp-3 overflow-hidden">
                      {overview || "No overview available."}
                    </p>
                    <div className="flex flex-col gap-2 mt-auto">
                      <button 
                        onClick={() => handleOpenModal(movie)}
                        className="bg-blue-900 rounded text-white flex items-center justify-center w-full px-4 py-2 font-medium hover:bg-blue-800 transition"
                      >
                        <Info className='mr-1 w-4 text-white'/> More Info
                      </button>
                      <button className="bg-white border border-blue-900 flex items-center justify-center rounded text-blue-900 w-full px-4 py-2 font-medium hover:bg-blue-50 transition">
                        <Plus className='mr-1 text-blue-800' /> Add to Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : searchText.trim() ? (
            <div className="col-span-full text-center text-white font-semibold text-xl mt-8">
              No results found for "{searchText}"
            </div>
          ) : (
            <div className="col-span-full text-center text-white/70 font-medium text-lg mt-8">
              Search for movies or TV shows to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App