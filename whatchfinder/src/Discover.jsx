import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, X, Calendar, Tv, Play, Users, TrendingUp, Award, Eye, Filter } from 'lucide-react';

import { useWatchlist } from './Watchlistcontext';

export default function Discover() {
    const [discoveryData, setDiscoveryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentFilter, setCurrentFilter] = useState('trending');
    const [sortBy, setSortBy] = useState('popularity.desc');
        const [selectedMovie, setSelectedMovie] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [likedItems, setLikedItems] = useState(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [releaseYear, setReleaseYear] = useState('');
    const loaderRef = useRef(null);

    const { addToWatchlist, fetchMovieDetails, fetchTrailers } = useWatchlist();
    
    const API_KEY = "56185e1e9a25474a6cf2f5748dfb6ebf";
    const img_300 = "https://image.tmdb.org/t/p/w300";
    const img_500 = "https://image.tmdb.org/t/p/w500";
    const imagenotfound = "https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image";

    const genres = [
        { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
        { id: 10770, name: 'TV Movie' }, { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
    ];

    const sortOptions = [
        { value: 'popularity.desc', label: 'Most Popular' },
        { value: 'popularity.asc', label: 'Least Popular' },
        { value: 'vote_average.desc', label: 'Highest Rated' },
        { value: 'vote_average.asc', label: 'Lowest Rated' },
        { value: 'release_date.desc', label: 'Newest' },
        { value: 'release_date.asc', label: 'Oldest' }
    ];

    const applyFilters = (results) => {
        let filtered = results;
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(item => {
                const itemGenres = item.genre_ids || [];
                return selectedGenres.some(genreId => itemGenres.includes(genreId));
            });
        }
        if (minRating > 0) {
            filtered = filtered.filter(item => item.vote_average >= minRating);
        }
        if (releaseYear) {
            filtered = filtered.filter(item => {
                const date = item.release_date || item.first_air_date;
                if (!date) return false;
                return new Date(date).getFullYear().toString() === releaseYear;
            });
        }
        return filtered;
    };

    const fetchDiscoveryData = useCallback(async (currentPage = 1, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                setPage(1);
                currentPage = 1;
            }

            let endpoint = '';
            let baseParams = `api_key=${API_KEY}&page=${currentPage}&sort_by=${sortBy}`;

            if (selectedGenres.length > 0 && (currentFilter === 'movies' || currentFilter === 'tv')) {
                baseParams += `&with_genres=${selectedGenres.join(',')}`;
            }
            if (releaseYear && (currentFilter === 'movies' || currentFilter === 'tv')) {
                if (currentFilter === 'movies') {
                    baseParams += `&year=${releaseYear}`;
                } else {
                    baseParams += `&first_air_date_year=${releaseYear}`;
                }
            }
            if (minRating > 0 && (currentFilter === 'movies' || currentFilter === 'tv')) {
                baseParams += `&vote_average.gte=${minRating}`;
            }
            
            switch (currentFilter) {
                case 'all':
                    endpoint = `https://api.themoviedb.org/3/trending/all/week?${baseParams}`;
                    break;
                case 'trending':
                    endpoint = `https://api.themoviedb.org/3/trending/all/week?${baseParams}`;
                    break;
                case 'movies':
                    endpoint = `https://api.themoviedb.org/3/discover/movie?${baseParams}`;
                    break;
                case 'tv':
                    endpoint = `https://api.themoviedb.org/3/discover/tv?${baseParams}`;
                    break;
                case 'popular':
                    endpoint = `https://api.themoviedb.org/3/movie/popular?${baseParams}`;
                    break;
                case 'top_rated':
                    endpoint = `https://api.themoviedb.org/3/movie/top_rated?${baseParams}`;
                    break;
                default:
                    endpoint = `https://api.themoviedb.org/3/trending/all/week?${baseParams}`;
            }

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.results) {
                let processedResults = data.results
                    .filter(item => item.poster_path && item.vote_average > 0)
                    .map(item => ({
                        ...item,
                        media_type: item.media_type || (currentFilter === 'tv' ? 'tv' : 'movie')
                    }));

                // Always apply client-side filters so selection (genres, rating, year) works for any category
                processedResults = applyFilters(processedResults);

                if (reset || currentPage === 1) {
                    setDiscoveryData(processedResults);
                } else {
                    setDiscoveryData(prev => [...prev, ...processedResults]);
                }

                setTotalPages(Math.min(data.total_pages || 1, 500)); // Limit to 500 pages
            }
        } catch (error) {
            console.error('Error fetching discovery data:', error);
        } finally {
            setLoading(false);
        }
    }, [API_KEY, sortBy, currentFilter, selectedGenres, minRating, releaseYear]);

    useEffect(() => {
        fetchDiscoveryData(1, true);
    }, [fetchDiscoveryData]);

    const filterOptions = [
        { key: 'all', label: 'All', icon: Users },
        { key: 'trending', label: 'Trending', icon: TrendingUp },
        { key: 'popular', label: 'Popular', icon: Eye },
        { key: 'top_rated', label: 'Top Rated', icon: Award },
        { key: 'movies', label: 'Movies', icon: Play },
        { key: 'tv', label: 'TV Shows', icon: Tv },
    ];

    const handleFilterChange = (newFilter) => {
        setCurrentFilter(newFilter);
        setPage(1);
    };

    const handleLike = (item) => {
        const newLiked = new Set(likedItems);
        if (likedItems.has(item.id)) {
            newLiked.delete(item.id);
        } else {
            newLiked.add(item.id);
            addToWatchlist(item);
        }
        setLikedItems(newLiked);
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev => (
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        ));
    };

    const clearFilters = () => {
        setSelectedGenres([]);
        setMinRating(0);
        setReleaseYear('');
    };

    const loadMore = () => {
        if (page < totalPages && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchDiscoveryData(nextPage, false);
        }
    };

    // Infinite scroll using IntersectionObserver
    useEffect(() => {
        const node = loaderRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !loading && page < totalPages) {
                    loadMore();
                }
            },
            { root: null, rootMargin: '200px', threshold: 0 }
        );

        observer.observe(node);
        return () => {
            observer.disconnect();
        };
    }, [loaderRef, loading, page, totalPages, currentFilter, sortBy, selectedGenres, minRating, releaseYear]);

    if (loading && discoveryData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-white text-lg">Discovering amazing content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
          <div className=" bg-black/80 backdrop-blur-xl border-b border-gray-800">
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="flex flex-col gap-4">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
       

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
        

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors flex items-center gap-2 ${
              selectedGenres.length > 0 || minRating > 0 || releaseYear
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {(selectedGenres.length > 0 || minRating > 0 || releaseYear) && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {[selectedGenres.length > 0, minRating > 0, releaseYear].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {filterOptions.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterChange(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              currentFilter === key
                ? "bg-gradient-to-r from-blue-700 to-blue-300 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/50 rounded-lg p-4 lg:p-6 border border-gray-700 space-y-4">
              <div>
                <h3 className="text-white font-medium mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreToggle(genre.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedGenres.includes(genre.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Minimum Rating: {minRating || 'Any'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Release Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2023"
                    min="1900"
                    max="2030"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {(selectedGenres.length > 0 || minRating > 0 || releaseYear) && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


                        {/* Results Info */}
                        <div className="flex items-center justify-between text-gray-400 text-sm">
                            <span>
                                {discoveryData.length > 0 && `Showing ${discoveryData.length} results`}
                            </span>
                            {likedItems.size > 0 && (
                                <span className="flex items-center gap-1">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    {likedItems.size} liked
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {discoveryData.length === 0 && !loading ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-gray-400 mb-6">Try selecting a different category or adjusting filters</p>
                        {(selectedGenres.length > 0 || minRating > 0 || releaseYear) && (
                          <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            Clear Filters
                          </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grid/List View */}
                        <motion.div
                            layout
                            className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'
                        >
                            <AnimatePresence>
                                {discoveryData.map((item, index) => (
                                    <ContentCard
                                        key={`${item.id}-${item.media_type}-${index}`}
                                        item={item}
                                                                                isLiked={likedItems.has(item.id)}
                                        onLike={handleLike}
                                        onShowDetails={(movie) => {
                                            setSelectedMovie(movie);
                                            setModalOpen(true);
                                            fetchMovieDetails(movie.id, movie.media_type);
                                            fetchTrailers(movie.id, movie.media_type);
                                        }}
                                        img_300={img_300}
                                        img_500={img_500}
                                        imagenotfound={imagenotfound}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Infinite scroll sentinel */}
                        <div ref={loaderRef} className="h-12 flex items-center justify-center mt-8">
                            {loading && (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && selectedMovie && (
                    <MovieModal 
                        open={modalOpen} 
                        onClose={() => {
                            setModalOpen(false);
                            setSelectedMovie(null);
                        }}
                        movie={selectedMovie}
                        onAddToWatchlist={() => handleLike(selectedMovie)}
                        isLiked={likedItems.has(selectedMovie.id)}
                        img_500={img_500}
                        imagenotfound={imagenotfound}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Content Card Component
function ContentCard({ item, isLiked, onLike, onShowDetails, img_300, img_500, imagenotfound }) {
    const { title, name, poster_path, first_air_date, release_date, media_type, vote_average } = item;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group"
            onClick={() => onShowDetails(item)}
        >
            <div className="relative">
                <img
                    src={poster_path ? `${img_300}${poster_path}` : imagenotfound}
                    alt={title || name}
                    className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge */}
                {vote_average > 0 && (
                    <div className="absolute top-2 left-2 flex items-center bg-yellow-400/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-xs font-bold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {vote_average.toFixed(1)}
                    </div>
                )}

                {/* Media Type Badge */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                    {media_type === 'tv' ? 'TV' : 'Movie'}
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(item);
                    }}
                    className={`absolute bottom-2 right-2 p-2 rounded-full transition-all duration-300 ${
                        isLiked
                            ? 'bg-red-500 text-white scale-110'
                            : 'bg-black/60 text-white hover:bg-red-500 hover:scale-110'
                    }`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Hover Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm truncate">{title || name}</h3>
                    {(first_air_date || release_date) && (
                        <p className="text-gray-300 text-xs mt-1">
                            {new Date(first_air_date || release_date).getFullYear()}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Movie Modal Component
function MovieModal({ open, onClose, movie, onAddToWatchlist, isLiked, img_500, imagenotfound }) {
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
        genre_ids = []
    } = movie;

    const { getMovieDetails, trailers, loadingTrailers } = useWatchlist();
    const details = getMovieDetails(movie.id) || {};

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const genres = [
        { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
        { id: 10770, name: 'TV Movie' }, { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
    ];

    const getGenreNames = () => {
        if (details.genres && details.genres.length) {
            return details.genres.map(g => g.name);
        }
        return genre_ids.map(id => {
            const genre = genres.find(g => g.id === id);
            return genre ? genre.name : null;
        }).filter(Boolean);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800 my-8"
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
                            className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute bottom-4 left-6 flex items-end space-x-4">
                        <img
                            src={poster_path ? `${img_500}${poster_path}` : imagenotfound}
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
                                {vote_average > 0 && (
                                    <span className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                        {vote_average.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                    {/* Overview Section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                        <p className="text-gray-300 leading-relaxed">
                            {overview || "No overview available for this title."}
                        </p>
                    </div>

                    {/* Genres */}
                    {getGenreNames().length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {getGenreNames().map((genre, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Details */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className="text-white font-medium">{details.status || 'Unknown'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Duration</p>
                                <p className="text-white font-medium">
                                    {media_type === 'tv'
                                        ? (details.number_of_seasons ? `${details.number_of_seasons} season(s)` : 'N/A')
                                        : (details.runtime ? `${details.runtime} min` : 'N/A')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current" />
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

                    {/* Trailers */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Trailers</h3>
                        {loadingTrailers ? (
                            <div className="flex items-center justify-center py-6">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
                                />
                            </div>
                        ) : (
                            trailers && trailers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {trailers.slice(0, 2).map((t) => (
                                        <div key={t.id || t.key} className="aspect-video">
                                            <iframe
                                                className="w-full h-full rounded-lg"
                                                src={`https://www.youtube.com/embed/${t.key}`}
                                                title={t.name}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No trailers found.</p>
                            )
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToWatchlist();
                            }}
                            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 ${
                                isLiked
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                            }`}
                        >
                            <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                            {isLiked ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}