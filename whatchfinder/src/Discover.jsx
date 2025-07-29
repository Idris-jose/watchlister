import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Star, Heart, X, RotateCcw } from 'lucide-react';

export default function Discover() {
    const [discoveryData, setDiscoveryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedItems, setLikedItems] = useState([]);
    const [passedItems, setPassedItems] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const API_KEY = "56185e1e9a25474a6cf2f5748dfb6ebf";
    const randomPage = Math.floor(Math.random() * 300) + 1;
    const img_300 = "https://image.tmdb.org/t/p/w300";
    const imagenotfound = "https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image";

    useEffect(() => {
        async function fetchDiscoveryData() {
            try {
                setLoading(true);
                const [moviesResponse, seriesResponse] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${randomPage}&sort_by=popularity.desc`),
                    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${randomPage}&sort_by=popularity.desc`)
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
        } else if (direction === 'left') {
            setPassedItems(prev => [...prev, currentItem]);
        }
        
        // Wait for animation to complete before moving to next card
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setIsAnimating(false);
        }, 400);
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
        <div className="min-h-screen py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center px-4 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-3">
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

// Custom Tinder-like Swipe Stack Component
function TinderSwipeStack({ data, currentIndex, onSwipe, isAnimating, img_300, imagenotfound }) {
    const [dragState, setDragState] = useState({ isDragging: false, x: 0, y: 0, startX: 0, startY: 0 });
    const [cardTransform, setCardTransform] = useState({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
    const cardRef = useRef(null);

    const resetCard = useCallback(() => {
        setCardTransform({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
        setDragState({ isDragging: false, x: 0, y: 0, startX: 0, startY: 0 });
    }, []);

    useEffect(() => {
        resetCard();
    }, [currentIndex, resetCard]);

    const handleStart = useCallback((clientX, clientY) => {
        if (isAnimating) return;
        
        setDragState({
            isDragging: true,
            startX: clientX,
            startY: clientY,
            x: 0,
            y: 0
        });
    }, [isAnimating]);

    // Mouse events
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
    }, []);

    const handleMouseMove = useCallback((e) => {
        handleMove(e.clientX, e.clientY);
    }, [dragState.isDragging, dragState.startX, dragState.startY]);

    const handleMouseUp = useCallback(() => {
        handleEnd();
    }, [dragState.isDragging, dragState.x]);

    // Touch events
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    }, [dragState.isDragging, dragState.startX, dragState.startY]);

    const handleTouchEnd = useCallback(() => {
        handleEnd();
    }, [dragState.isDragging, dragState.x]);

    // Global event listeners
    useEffect(() => {
        if (dragState.isDragging) {
            const handleGlobalMouseMove = (e) => {
                if (!dragState.isDragging) return;
                
                const deltaX = e.clientX - dragState.startX;
                const deltaY = e.clientY - dragState.startY;

                const maxRotation = 15;
                const rotationFactor = 0.1;
                const rotation = Math.max(-maxRotation, Math.min(maxRotation, deltaX * rotationFactor));
                
                const maxScale = 1;
                const minScale = 0.95;
                const scaleFactor = 1 - Math.abs(deltaX) * 0.0003;
                const scale = Math.max(minScale, Math.min(maxScale, scaleFactor));
                
                const opacityFactor = 1 - Math.abs(deltaX) * 0.001;
                const opacity = Math.max(0.7, Math.min(1, opacityFactor));

                setDragState(prev => ({ ...prev, x: deltaX, y: deltaY }));
                setCardTransform({
                    x: deltaX,
                    y: deltaY * 0.5,
                    rotate: rotation,
                    scale: scale,
                    opacity: opacity
                });
            };

            const handleGlobalMouseUp = () => {
                if (!dragState.isDragging) return;

                const { x } = dragState;
                const swipeThreshold = 80;

                if (Math.abs(x) > swipeThreshold) {
                    const direction = x > 0 ? 'right' : 'left';
                    
                    const exitX = direction === 'right' ? window.innerWidth + 100 : -window.innerWidth - 100;
                    const exitRotation = direction === 'right' ? 25 : -25;
                    
                    setCardTransform({
                        x: exitX,
                        y: cardTransform.y + (Math.random() - 0.5) * 100,
                        rotate: exitRotation,
                        scale: 0.8,
                        opacity: 0
                    });
                    
                    onSwipe(direction);
                } else {
                    resetCard();
                }
            };

            const handleGlobalTouchMove = (e) => {
                if (!dragState.isDragging || !e.touches[0]) return;
                e.preventDefault();
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - dragState.startX;
                const deltaY = touch.clientY - dragState.startY;

                const maxRotation = 15;
                const rotationFactor = 0.1;
                const rotation = Math.max(-maxRotation, Math.min(maxRotation, deltaX * rotationFactor));
                
                const maxScale = 1;
                const minScale = 0.95;
                const scaleFactor = 1 - Math.abs(deltaX) * 0.0003;
                const scale = Math.max(minScale, Math.min(maxScale, scaleFactor));
                
                const opacityFactor = 1 - Math.abs(deltaX) * 0.001;
                const opacity = Math.max(0.7, Math.min(1, opacityFactor));

                setDragState(prev => ({ ...prev, x: deltaX, y: deltaY }));
                setCardTransform({
                    x: deltaX,
                    y: deltaY * 0.5,
                    rotate: rotation,
                    scale: scale,
                    opacity: opacity
                });
            };

            const handleGlobalTouchEnd = () => {
                if (!dragState.isDragging) return;

                const { x } = dragState;
                const swipeThreshold = 80;

                if (Math.abs(x) > swipeThreshold) {
                    const direction = x > 0 ? 'right' : 'left';
                    
                    const exitX = direction === 'right' ? window.innerWidth + 100 : -window.innerWidth - 100;
                    const exitRotation = direction === 'right' ? 25 : -25;
                    
                    setCardTransform({
                        x: exitX,
                        y: cardTransform.y + (Math.random() - 0.5) * 100,
                        rotate: exitRotation,
                        scale: 0.8,
                        opacity: 0
                    });
                    
                    onSwipe(direction);
                } else {
                    resetCard();
                }
            };

            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            document.addEventListener('touchend', handleGlobalTouchEnd);

            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove);
                document.removeEventListener('mouseup', handleGlobalMouseUp);
                document.removeEventListener('touchmove', handleGlobalTouchMove);
                document.removeEventListener('touchend', handleGlobalTouchEnd);
            };
        }
    }, [dragState.isDragging, dragState.startX, dragState.startY, dragState.x, onSwipe, resetCard, cardTransform.y]);

    const currentItem = data[currentIndex];
    const nextItem = data[currentIndex + 1];
    const thirdItem = data[currentIndex + 2];

    if (!currentItem) return null;

    const { name, title, poster_path, first_air_date, release_date, media_type, vote_average, vote_count, overview } = currentItem;

    // Calculate indicator opacities
    const likeOpacity = Math.max(0, Math.min(1, dragState.x / 80));
    const passOpacity = Math.max(0, Math.min(1, -dragState.x / 80));

    return (
        <div className="relative" style={{ height: '650px' }}>
            {/* Third card (bottom of stack) */}
            {thirdItem && (
                <div className="absolute inset-0 bg-gray-800 rounded-3xl shadow-xl opacity-20 transform scale-90 -rotate-1" style={{ zIndex: 1 }}>
                    <div className="w-full h-full rounded-3xl overflow-hidden">
                        <img
                            src={thirdItem.poster_path ? `${img_300}/${thirdItem.poster_path}` : imagenotfound}
                            className="w-full h-2/3 object-cover"
                            alt="Card 3"
                        />
                    </div>
                </div>
            )}

            {/* Second card (middle of stack) */}
            {nextItem && (
                <div className="absolute inset-0 bg-gray-800 rounded-3xl shadow-xl opacity-60 transform scale-95" style={{ zIndex: 2 }}>
                    <div className="w-full h-full rounded-3xl overflow-hidden">
                        <img
                            src={nextItem.poster_path ? `${img_300}/${nextItem.poster_path}` : imagenotfound}
                            className="w-full h-2/3 object-cover"
                            alt="Next card"
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
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden cursor-grab select-none border border-gray-700"
                style={{
                    transform: `translate(${cardTransform.x}px, ${cardTransform.y}px) rotate(${cardTransform.rotate}deg) scale(${cardTransform.scale})`,
                    opacity: cardTransform.opacity,
                    zIndex: 10,
                    cursor: dragState.isDragging ? 'grabbing' : 'grab',
                    transition: dragState.isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Image Section */}
                <div className="relative h-2/3 overflow-hidden">
                    <img
                        src={poster_path ? `${img_300}/${poster_path}` : imagenotfound}
                        className="w-full h-full object-cover"
                        alt={title || name || "Movie poster"}
                        draggable={false}
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
                    
                    {/* Enhanced Swipe Indicators */}
                    <div
                        className="absolute left-8 top-1/2 transform -translate-y-1/2 rotate-12 transition-all duration-200"
                        style={{ 
                            opacity: likeOpacity,
                            transform: `translateY(-50%) rotate(12deg) scale(${0.8 + likeOpacity * 0.4})`
                        }}
                    >
                        <div className="border-4 border-green-400 text-green-400 px-8 py-4 rounded-3xl font-black text-3xl bg-black/40 backdrop-blur-sm shadow-2xl">
                            LIKE
                        </div>
                    </div>
                    
                    <div
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 -rotate-12 transition-all duration-200"
                        style={{ 
                            opacity: passOpacity,
                            transform: `translateY(-50%) rotate(-12deg) scale(${0.8 + passOpacity * 0.4})`
                        }}
                    >
                        <div className="border-4 border-red-400 text-red-400 px-8 py-4 rounded-3xl font-black text-3xl bg-black/40 backdrop-blur-sm shadow-2xl">
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
            className={`${className} ${small ? 'p-3' : 'p-5'} rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-2xl active:scale-95 font-semibold text-white`}
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