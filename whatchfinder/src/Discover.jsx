import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'framer-motion';
import { Star, Heart, X, RotateCcw, Info, Calendar, Clock, Tv, Play, Users } from 'lucide-react';
import { useWatchlist } from './Watchlistcontext';



export default function Discover() {
    const [discoveryData, setDiscoveryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedItems, setLikedItems] = useState([]);
    const [passedItems, setPassedItems] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [activeTrailer, setActiveTrailer] = useState(0);

    const { 
        addToWatchlist,
        movieDetails,
        getMovieDetails,
        fetchMovieDetails,
        trailers,
        fetchTrailers,
        loadingTrailers,
    } = useWatchlist();

    const handleAddToWatchlist = (movie) => {
        const movieToAdd = movie || selectedMovie;
        if (!movieToAdd) return;
        
        addToWatchlist(movieToAdd);
        
        if (!movie) handleCloseModal();
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedMovie(null);
    };
    
    const API_KEY = "56185e1e9a25474a6cf2f5748dfb6ebf";
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const today = new Date();
    const recentDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    
    const img_300 = "https://image.tmdb.org/t/p/w300";
    const imagenotfound = "https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image";

    useEffect(() => {
        async function fetchDiscoveryData() {
            try {
                setLoading(true);
                const [moviesResponse, seriesResponse] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${randomPage}&sort_by=popularity.desc&primary_release_date.gte=${recentDate}&vote_count.gte=100&with_original_language=en`),
                    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${randomPage}&sort_by=popularity.desc&first_air_date.gte=${recentDate}&vote_count.gte=100&with_original_language=en`)
                ]);

                const moviesData = await moviesResponse.json();
                const seriesData = await seriesResponse.json();

                const movies = moviesData.results.map(item => ({
                    ...item,
                    media_type: 'movie'
                }));

                const series = seriesData.results.map(item => ({
                    ...item,
                    media_type: 'tv'
                }));

                const combined = [...movies, ...series];
                const shuffled = combined.sort(() => Math.random() - 0.5);
                
                setDiscoveryData(shuffled);
            } catch (error) {
                console.error('Error fetching discovery data:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchDiscoveryData();
    }, []);

    const handleSwipe = useCallback((direction) => {
        if (currentIndex >= discoveryData.length || isAnimating) return;
        
        setIsAnimating(true);
        const currentItem = discoveryData[currentIndex];
        
        if (direction === 'right') {
            setLikedItems(prev => [...prev, currentItem]);
            handleAddToWatchlist(currentItem);
        } else if (direction === 'left') {
            setPassedItems(prev => [...prev, currentItem]);
        }
        
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setIsAnimating(false);
        }, 300);
    }, [currentIndex, discoveryData.length, isAnimating]);

    const handleReset = () => {
        setCurrentIndex(0);
        setLikedItems([]);
        setPassedItems([]);
        setIsAnimating(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (currentIndex >= discoveryData.length) {
        return (
            <div className="min-h-screen py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
                <div className="text-center text-white max-w-md mx-auto px-4">
                    <div className="animate-bounce mb-4">
                        <div className="text-6xl mb-4">🎬</div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        All Done!
                    </h1>
                    <p className="text-gray-400 mb-8 text-lg">
                        You've discovered all available content.
                        <span className='text-green-500'> Refresh to discover more</span>
                    </p>
                </div>
            </div>
        );
    }

    const formatRuntime = (minutes) => {
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
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                <Heart className="w-5 h-5 mr-2" />
                                Add to Watchlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center px-4 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-white mb-3">
                    Discover
                </h1>
                <p className="text-gray-300 text-lg mb-2">
                    Swipe right to like • Swipe left to pass
                </p>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-gray-700">
                    <span className="text-gray-400 text-sm">
                        {currentIndex + 1} of {discoveryData.length}
                    </span>
                </div>
                <div className="w-64 h-2 bg-gray-800 border border-gray-700 rounded-full mt-3 mx-auto overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                        style={{ width: `${discoveryData.length ? Math.min(100, ((currentIndex + 1) / discoveryData.length) * 100) : 0}%` }}
                    />
                </div>
            </div>

            {/* Card Stack */}
            <div className="relative w-full max-w-sm mx-auto mb-8">
                <FramerSwipeStack
                    data={discoveryData}
                    currentIndex={currentIndex}
                    onSwipe={handleSwipe}
                    isAnimating={isAnimating}
                    img_300={img_300}
                    imagenotfound={imagenotfound}
                    onShowDetails={(movie) => {
                        setSelectedMovie(movie);
                        setModalOpen(true);
                        fetchMovieDetails(movie.id, movie.media_type);
                        fetchTrailers(movie.id, movie.media_type);
                        setActiveTrailer(0);
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mb-6">
                <ActionButton
                    onClick={() => handleSwipe('left')}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25"
                    icon={<X className="w-8 h-8" />}
                />
                
                <ActionButton
                    onClick={handleReset}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-500/25"
                    icon={<RotateCcw className="w-6 h-6" />}
                    small
                />
                
                <ActionButton
                    onClick={() => handleSwipe('right')}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25"
                    icon={<Heart className="w-8 h-8" />}
                />
            </div>

            {/* Modal */}
            <MovieModal 
                open={modalOpen} 
                onClose={handleCloseModal} 
                movie={selectedMovie} 
            />

            {/* Footer */}
            <footer className="text-gray-500 text-sm">
                <p>made by jose idris</p>
            </footer>
        </div>
    );
}

// Framer Motion swipe stack component
function FramerSwipeStack({ data, currentIndex, onSwipe, isAnimating, img_300, imagenotfound, onShowDetails }) {
    const currentItem = data[currentIndex];
    const nextItem = data[currentIndex + 1];
    const thirdItem = data[currentIndex + 2];

    if (!currentItem) return null;

    return (
        <div className="relative" style={{ height: '650px' }}>
            {/* Background cards */}
            <AnimatePresence>
                {thirdItem && (
                    <motion.div 
                        key={`third-${currentIndex + 2}`}
                        initial={{ opacity: 0, scale: 0.85, rotate: 2 }}
                        animate={{ opacity: 0.3, scale: 0.90, rotate: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 bg-gray-800 rounded-3xl shadow-xl"
                        style={{ zIndex: 1 }}
                    >
                        <div className="w-full h-full rounded-3xl overflow-hidden">
                            <img
                                src={thirdItem.poster_path ? `${img_300}/${thirdItem.poster_path}` : imagenotfound}
                                className="w-full h-2/3 object-cover"
                                alt="Background card"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                )}

                {nextItem && (
                    <motion.div 
                        key={`next-${currentIndex + 1}`}
                        initial={{ opacity: 0.5, scale: 0.90, y: 20 }}
                        animate={{ opacity: 0.7, scale: 0.95, y: 0 }}
                        exit={{ opacity: 0, scale: 0.90, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 bg-gray-800 rounded-3xl shadow-xl"
                        style={{ zIndex: 2 }}
                    >
                        <div className="w-full h-full rounded-3xl overflow-hidden">
                            <img
                                src={nextItem.poster_path ? `${img_300}/${nextItem.poster_path}` : imagenotfound}
                                className="w-full h-2/3 object-cover"
                                alt="Next card"
                                loading="lazy"
                            />
                            <div className="p-4 h-1/3 bg-gray-800 flex flex-col justify-center">
                                <h3 className="text-white font-semibold text-lg truncate">
                                    {nextItem.title || nextItem.name}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main interactive card */}
            <SwipeableCard
                key={`main-${currentIndex}`}
                item={currentItem}
                onSwipe={onSwipe}
                img_300={img_300}
                imagenotfound={imagenotfound}
                onShowDetails={onShowDetails}
                isAnimating={isAnimating}
            />
        </div>
    );
}

// Individual swipeable card component
function SwipeableCard({ item, onSwipe, img_300, imagenotfound, onShowDetails, isAnimating }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const dismissingRef = useRef(false);
    
    // Transform values for smooth animations
    const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
    const opacity = useTransform(x, [-300, -50, 0, 50, 300], [0, 1, 1, 1, 0]);
    const scale = useTransform(x, [-300, 0, 300], [0.8, 1, 0.8]);
    
    // Indicator opacities
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);
    const passOpacity = useTransform(x, [-150, 0], [1, 0]);
    
    const handleDragEnd = (event, info) => {
        const swipeThreshold = 120;
        const velocityThreshold = 600;

        const deltaX = info.offset.x;
        const velX = info.velocity.x;

        const shouldSwipe = Math.abs(deltaX) > swipeThreshold || Math.abs(velX) > velocityThreshold;

        if (shouldSwipe && !isAnimating && !dismissingRef.current) {
            dismissingRef.current = true;
            const direction = deltaX > 0 ? 'right' : 'left';
            const to = (direction === 'right' ? window.innerWidth : -window.innerWidth) * 1.1;

            const controls = animate(x, to, { type: 'spring', stiffness: 260, damping: 30 });
            controls.then(() => {
                onSwipe(direction);
                dismissingRef.current = false;
                x.set(0);
            });
        } else {
            // Snap back if not past threshold
            animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 });
        }
    };

    const { name, title, poster_path, first_air_date, release_date, media_type, vote_average, vote_count, overview } = item;

    return (
        <motion.div
            drag="x"
            dragElastic={0.25}
            dragMomentum={true}
            onDragEnd={handleDragEnd}
            style={{ 
                x, 
                y, 
                rotate, 
                opacity, 
                scale,
                zIndex: 10,
                touchAction: 'pan-y'
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ 
                opacity: 0,
                transition: { duration: 0.25 } 
            }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 28 
            }}
            className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden select-none border border-gray-700 cursor-grab active:cursor-grabbing"
        >
            {/* Image Section */}
            <div className="relative h-2/3 overflow-hidden">
                <img
                    src={poster_path ? `${img_300}/${poster_path}` : imagenotfound}
                    className="w-full h-full object-cover"
                    alt={title || name || "Movie poster"}
                    draggable={false}
                    loading="eager"
                />
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                 
                {/* Media type badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full border border-white/20 font-medium">
                    {media_type === "tv" ? "📺 TV Series" : "🎬 Movie"}
                </div>

                {/* Rating badge */}
                {vote_average > 0 && (
                    <div className="absolute top-4 right-4 flex items-center bg-yellow-400/95 backdrop-blur-md text-black text-sm px-4 py-2 rounded-full font-bold border border-yellow-300">
                        <Star className="mr-1 w-4 h-4 fill-current" />
                        {vote_average.toFixed(1)}
                    </div>
                )}
                
                {/* Swipe indicators with Framer Motion */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 rotate-12 pointer-events-none"
                >
                    <div className="border-4 border-green-400 text-green-400 px-8 py-4 rounded-3xl font-black text-3xl bg-black/50 backdrop-blur-sm shadow-2xl">
                        LIKE
                    </div>
                </motion.div>
                
                <motion.div
                    style={{ opacity: passOpacity }}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 -rotate-12 pointer-events-none"
                >
                    <div className="border-4 border-red-400 text-red-400 px-8 py-4 rounded-3xl font-black text-3xl bg-black/50 backdrop-blur-sm shadow-2xl">
                        PASS
                    </div>
                </motion.div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 h-1/3 flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                    {title || name}
                </h2>
                <div className="flex items-center text-gray-400 mb-3 text-sm">
                    <span className="bg-gray-700 px-3 py-1 rounded-full mr-3">
                        {first_air_date || release_date || "Unknown"}
                    </span>
                    {vote_count && (
                        <span className="bg-gray-700 px-3 py-1 rounded-full">
                            {vote_count.toLocaleString()} votes
                        </span>
                    )}
                </div>
                <p className="text-gray-300 text-sm flex-1 leading-relaxed line-clamp-3">
                    {overview || "No overview available."}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onShowDetails(item);
                    }}
                    className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                    aria-label="Show details"
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}

// Action Button Component
function ActionButton({ onClick, disabled, className, icon, small }) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${className} ${small ? 'p-3' : 'p-5'} rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white transform-gpu shadow-2xl`}
        >
            {icon}
        </motion.button>
    );
}