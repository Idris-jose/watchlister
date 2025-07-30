import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useWatchlist } from './Watchlistcontext.jsx';
import { Star, Heart, X, RotateCcw } from 'lucide-react';

export default function Discover() {
    const [discoveryData, setDiscoveryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedItems, setLikedItems] = useState([]);
    const [passedItems, setPassedItems] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const { addToWatchlist } = useWatchlist();

    const handleAddToWatchlist = (movie) => {
    const movieToAdd = movie || selectedMovie;
    if (!movieToAdd) return;
    
    addToWatchlist(movieToAdd);
    
    if (!movie) handleCloseModal();
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
        }, 250);
    }, [currentIndex, discoveryData.length, isAnimating]);

    const handleReset = () => {
        setCurrentIndex(0);
        setLikedItems([]);
        setPassedItems([]);
        setIsAnimating(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
                <div className="text-white text-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto" />
                    <p className="mt-4 text-lg">Loading discovery content...</p>
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
                    <p className="text-gray-400 mb-8 text-lg">You've discovered all available content.</p>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
                        <div className="flex justify-center gap-8 text-lg">
                            <div className="text-center">
                                <div className="text-green-400 text-2xl mb-1">❤️</div>
                                <div className="text-green-400 font-bold">{likedItems.length}</div>
                                <div className="text-gray-500 text-sm">Liked</div>
                            </div>
                            <div className="text-center">
                                <div className="text-red-400 text-2xl mb-1">✕</div>
                                <div className="text-red-400 font-bold">{passedItems.length}</div>
                                <div className="text-gray-500 text-sm">Passed</div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleReset}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 font-semibold"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Discover Again
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen py-8 bg-black flex flex-col items-center justify-center px-4 overflow-hidden">
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
            </div>

            {/* Card Stack */}
            <div className="relative w-full max-w-sm mx-auto mb-8">
                <TinderSwipeStack
                    data={discoveryData}
                    currentIndex={currentIndex}
                    onSwipe={handleSwipe}
                    isAnimating={isAnimating}
                    img_300={img_300}
                    imagenotfound={imagenotfound}
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

            {/* Live Stats */}
            <div className="flex gap-8 text-base mb-6">
                <StatBadge
                    icon="❤️"
                    label="Liked"
                    count={likedItems.length}
                    color="text-green-400"
                />
                <StatBadge
                    icon="✕"
                    label="Passed"
                    count={passedItems.length}
                    color="text-red-400"
                />
            </div>

            {/* Footer */}
            <footer className="text-gray-500 text-sm">
                <p>made by jose idris</p>
            </footer>
        </div>
    );
}

// Ultra smooth swipe stack with optimized performance
function TinderSwipeStack({ data, currentIndex, onSwipe, isAnimating, img_300, imagenotfound }) {
    const [gesture, setGesture] = useState({
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        isDragging: false,
        velocity: { x: 0, y: 0 },
        lastPosition: { x: 0, y: 0 },
        lastTime: 0
    });

    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const velocityTrackerRef = useRef([]);
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

    // Memoized transform calculations for better performance
    const transformStyle = useMemo(() => {
        const { x, y, rotation, scale, opacity } = gesture;
        return {
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`,
            opacity: opacity,
            willChange: gesture.isDragging ? 'transform, opacity' : 'auto',
            transition: gesture.isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        };
    }, [gesture]);

    // Enhanced physics calculations
    const calculatePhysics = useCallback((deltaX, deltaY, velocity = { x: 0, y: 0 }) => {
        const maxRotation = 25;
        const rotationMultiplier = 0.1;
        const resistance = 0.8;
        
        // Smooth rotation with velocity influence
        const rotation = Math.max(-maxRotation, Math.min(maxRotation, 
            deltaX * rotationMultiplier + velocity.x * 0.02
        ));
        
        // Subtle scaling with smoother curves
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const scale = Math.max(0.95, 1 - (distance * 0.00015));
        
        // Opacity with velocity consideration
        const opacity = Math.max(0.7, 1 - (Math.abs(deltaX) * 0.0012));
        
        // Add slight Y movement for natural feel
        const adjustedY = deltaY * resistance + (Math.abs(deltaX) * 0.1);
        
        return { 
            x: deltaX, 
            y: adjustedY, 
            rotation, 
            scale, 
            opacity 
        };
    }, []);

    // Optimized velocity tracking
    const updateVelocity = useCallback((x, y) => {
        const now = performance.now();
        const tracker = velocityTrackerRef.current;
        
        // Keep only recent samples for smooth velocity calculation
        tracker.push({ x, y, time: now });
        if (tracker.length > 5) tracker.shift();
        
        if (tracker.length >= 2) {
            const recent = tracker[tracker.length - 1];
            const previous = tracker[tracker.length - 2];
            const timeDelta = recent.time - previous.time;
            
            if (timeDelta > 0) {
                return {
                    x: (recent.x - previous.x) / timeDelta,
                    y: (recent.y - previous.y) / timeDelta
                };
            }
        }
        
        return { x: 0, y: 0 };
    }, []);

    // Enhanced pointer event handlers
    const handlePointerStart = useCallback((e) => {
        if (isAnimating) return;
        
        e.preventDefault();
        const pointer = e.touches ? e.touches[0] : e;
        const { clientX, clientY } = pointer;
        const now = performance.now();
        
        touchStartRef.current = { x: clientX, y: clientY, time: now };
        velocityTrackerRef.current = [{ x: clientX, y: clientY, time: now }];
        
        setGesture(prev => ({
            ...prev,
            isDragging: true,
            lastPosition: { x: clientX, y: clientY },
            lastTime: now
        }));

        // Prevent default behaviors
        document.body.style.touchAction = 'none';
        document.body.style.userSelect = 'none';
        
        // Add slight haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(1);
        }
    }, [isAnimating]);

    const handlePointerMove = useCallback((e) => {
        if (!gesture.isDragging) return;
        
        e.preventDefault();
        const pointer = e.touches ? e.touches[0] : e;
        const { clientX, clientY } = pointer;
        
        const deltaX = clientX - touchStartRef.current.x;
        const deltaY = clientY - touchStartRef.current.y;
        
        const velocity = updateVelocity(clientX, clientY);
        const physics = calculatePhysics(deltaX, deltaY, velocity);
        
        // Use RAF for smooth updates
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        
        rafRef.current = requestAnimationFrame(() => {
            setGesture(prev => ({
                ...prev,
                ...physics,
                velocity,
                lastPosition: { x: clientX, y: clientY },
                lastTime: performance.now()
            }));
        });
    }, [gesture.isDragging, updateVelocity, calculatePhysics]);

    const handlePointerEnd = useCallback(() => {
        if (!gesture.isDragging) return;
        
        const { x, velocity } = gesture;
        const swipeThreshold = 50;
        const velocityThreshold = 0.3;
        
        // Improved swipe detection with momentum
        const hasEnoughDistance = Math.abs(x) > swipeThreshold;
        const hasEnoughVelocity = Math.abs(velocity.x) > velocityThreshold;
        const shouldSwipe = hasEnoughDistance || hasEnoughVelocity;
        
        // Reset body styles
        document.body.style.touchAction = '';
        document.body.style.userSelect = '';
        
        if (shouldSwipe) {
            const direction = (x > 0 || velocity.x > 0) ? 'right' : 'left';
            const momentumMultiplier = Math.max(1.5, Math.abs(velocity.x) * 3);
            
            // Enhanced exit animation
            const exitX = direction === 'right' 
                ? window.innerWidth * momentumMultiplier 
                : -window.innerWidth * momentumMultiplier;
            
            const exitRotation = direction === 'right' ? 30 : -30;
            const exitY = gesture.y + (Math.random() - 0.5) * 100;
            
            setGesture(prev => ({
                ...prev,
                x: exitX,
                y: exitY,
                rotation: exitRotation,
                scale: 0.8,
                opacity: 0,
                isDragging: false
            }));
            
            // Trigger swipe callback with slight delay for animation
            setTimeout(() => onSwipe(direction), 100);
        } else {
            // Smooth return animation
            setGesture(prev => ({
                ...prev,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
                isDragging: false,
                velocity: { x: 0, y: 0 }
            }));
        }
        
        // Clear velocity tracker
        velocityTrackerRef.current = [];
    }, [gesture, onSwipe]);

    // Reset gesture on card change
    useEffect(() => {
        setGesture({
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            isDragging: false,
            velocity: { x: 0, y: 0 },
            lastPosition: { x: 0, y: 0 },
            lastTime: 0
        });
        velocityTrackerRef.current = [];
    }, [currentIndex]);

    // Global event listeners
    useEffect(() => {
        if (!gesture.isDragging) return;

        const handleGlobalMove = (e) => handlePointerMove(e);
        const handleGlobalEnd = () => handlePointerEnd();

        // Add passive: false for better performance on touch devices
        const options = { passive: false };
        
        document.addEventListener('mousemove', handleGlobalMove, options);
        document.addEventListener('mouseup', handleGlobalEnd);
        document.addEventListener('touchmove', handleGlobalMove, options);
        document.addEventListener('touchend', handleGlobalEnd);
        document.addEventListener('touchcancel', handleGlobalEnd);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMove);
            document.removeEventListener('mouseup', handleGlobalEnd);
            document.removeEventListener('touchmove', handleGlobalMove);
            document.removeEventListener('touchend', handleGlobalEnd);
            document.removeEventListener('touchcancel', handleGlobalEnd);
            
            // Cleanup RAF
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [gesture.isDragging, handlePointerMove, handlePointerEnd]);

    const currentItem = data[currentIndex];
    const nextItem = data[currentIndex + 1];
    const thirdItem = data[currentIndex + 2];

    if (!currentItem) return null;

    const { name, title, poster_path, first_air_date, release_date, media_type, vote_average, vote_count, overview } = currentItem;

    // Smooth indicator calculations
    const likeOpacity = Math.max(0, Math.min(1, gesture.x / 80));
    const passOpacity = Math.max(0, Math.min(1, -gesture.x / 80));
    const indicatorScale = 0.9 + (Math.max(likeOpacity, passOpacity) * 0.3);

    return (
        <div className="relative" style={{ height: '650px' }}>
            {/* Background cards with smooth transitions - NO SNAP BACK */}
            {thirdItem && (
                <div 
                    className="absolute inset-0 bg-gray-800 rounded-3xl shadow-xl"
                    style={{ 
                        zIndex: 1,
                        opacity: 0.3,
                        transform: 'scale(0.90) rotate(1deg)',
                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                        transformOrigin: 'center bottom'
                    }}
                >
                    <div className="w-full h-full rounded-3xl overflow-hidden">
                        <img
                            src={thirdItem.poster_path ? `${img_300}/${thirdItem.poster_path}` : imagenotfound}
                            className="w-full h-2/3 object-cover"
                            alt="Background card"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}

            {nextItem && (
                <div 
                    className="absolute inset-0 bg-gray-800 rounded-3xl shadow-xl"
                    style={{ 
                        zIndex: 2,
                        opacity: gesture.isDragging ? Math.min(1, 0.7 + (Math.abs(gesture.x) / 400)) : 0.7,
                        transform: gesture.isDragging 
                            ? `scale(${Math.min(1, 0.95 + (Math.abs(gesture.x) / 800))}) translateY(${-Math.abs(gesture.x) / 30}px)`
                            : 'scale(0.95)',
                        transition: gesture.isDragging ? 'none' : 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transformOrigin: 'center bottom'
                    }}
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
                </div>
            )}

            {/* Main interactive card */}
            <div
                ref={cardRef}
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden select-none border border-gray-700"
                style={{
                    ...transformStyle,
                    zIndex: 10,
                    cursor: gesture.isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform3d: true
                }}
                onMouseDown={handlePointerStart}
                onTouchStart={handlePointerStart}
            >
                {/* Image Section */}
                <div className="relative h-2/3 overflow-hidden">
                    <img
                        src={poster_path ? `${img_300}/${poster_path}` : imagenotfound}
                        className="w-full h-full object-cover"
                        alt={title || name || "Movie poster"}
                        draggable={false}
                        loading="eager"
                        style={{ 
                            pointerEvents: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                        }}
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
                    
                    {/* Ultra smooth swipe indicators */}
                    <div
                        className="absolute left-8 top-1/2 transform -translate-y-1/2 rotate-12 pointer-events-none"
                        style={{ 
                            opacity: likeOpacity,
                            transform: `translateY(-50%) rotate(12deg) scale(${indicatorScale})`,
                            transition: gesture.isDragging ? 'none' : 'all 0.2s ease-out'
                        }}
                    >
                        <div className="border-4 border-green-400 text-green-400 px-8 py-4 rounded-3xl font-black text-3xl bg-black/50 backdrop-blur-sm shadow-2xl">
                            LIKE
                        </div>
                    </div>
                    
                    <div
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 -rotate-12 pointer-events-none"
                        style={{ 
                            opacity: passOpacity,
                            transform: `translateY(-50%) rotate(-12deg) scale(${indicatorScale})`,
                            transition: gesture.isDragging ? 'none' : 'all 0.2s ease-out'
                        }}
                    >
                        <div className="border-4 border-red-400 text-red-400 px-8 py-4 rounded-3xl font-black text-3xl bg-black/50 backdrop-blur-sm shadow-2xl">
                            PASS
                        </div>
                    </div>
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
                </div>
            </div>
        </div>
    );
}

// Action Button Component
function ActionButton({ onClick, disabled, className, icon, small }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${className} ${small ? 'p-3' : 'p-5'} rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-2xl active:scale-95 font-semibold text-white transform-gpu`}
        >
            {icon}
        </button>
    );
}

// Stat Badge Component
function StatBadge({ icon, label, count, color }) {
    return (
        <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
            <span className="text-lg">{icon}</span>
            <div className="text-center">
                <div className={`${color} font-bold text-lg`}>{count}</div>
                <div className="text-gray-500 text-xs">{label}</div>
            </div>
        </div>
    );
}