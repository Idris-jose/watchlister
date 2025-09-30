import { Heart, X } from "lucide-react";
import { useWatchlist } from "../../Watchlistcontext";
import { motion } from "framer-motion";
import { Star, Users, Calendar } from "lucide-react";
export default function MovieModal({ open, onClose, movie, onAddToWatchlist, isLiked, img_500, imagenotfound }) {
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
                                onAddToWatchlist(movie);
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