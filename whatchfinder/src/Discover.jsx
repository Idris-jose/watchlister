import React, { useEffect, useState, useRef } from 'react';
import { Star, Heart, X, RotateCcw } from 'lucide-react';

export default function Discover() {
    const [discoveryData, setDiscoveryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [likedItems, setLikedItems] = useState([]);
    const [passedItems, setPassedItems] = useState([]);
    
    const cardRef = useRef(null);
    const startX = useRef(0);
    const startY = useRef(0);
    const currentX = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);
    
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

    // Touch/Mouse event handlers
    const handleStart = (clientX, clientY) => {
        if (isAnimating) return;
        
        startX.current = clientX;
        startY.current = clientY;
        currentX.current = clientX;
        currentY.current = clientY;
        isDragging.current = true;
        
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging.current || isAnimating) return;
        
        const deltaX = clientX - startX.current;
        const deltaY = clientY - startY.current;
        const rotation = deltaX * 0.1;
        
        currentX.current = clientX;
        currentY.current = clientY;
        
        if (cardRef.current) {
            cardRef.current.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`;
            
            // Add visual feedback
            const opacity = Math.max(0, 1 - Math.abs(deltaX) / 200);
            if (deltaX > 50) {
                cardRef.current.style.boxShadow = `0 0 20px rgba(34, 197, 94, ${1 - opacity})`;
            } else if (deltaX < -50) {
                cardRef.current.style.boxShadow = `0 0 20px rgba(239, 68, 68, ${1 - opacity})`;
            } else {
                cardRef.current.style.boxShadow = 'none';
            }
        }
    };

    const handleEnd = () => {
        if (!isDragging.current || isAnimating) return;
        
        isDragging.current = false;
        const deltaX = currentX.current - startX.current;
        const threshold = 100;
        
        if (Math.abs(deltaX) > threshold) {
            // Swipe detected
            const direction = deltaX > 0 ? 'right' : 'left';
            performSwipe(direction);
        } else {
            // Snap back
            if (cardRef.current) {
                cardRef.current.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
                cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
                cardRef.current.style.boxShadow = 'none';
            }
        }
    };

    // Mouse events
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        handleEnd();
    };

    // Touch events
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        handleEnd();
    };

    // Add global event listeners
    useEffect(() => {
        const handleGlobalMouseMove = (e) => handleMouseMove(e);
        const handleGlobalMouseUp = () => handleMouseUp();

        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    const performSwipe = (direction) => {
        if (currentIndex >= discoveryData.length) return;
        
        setIsAnimating(true);
        setSwipeDirection(direction);
        
        const currentItem = discoveryData[currentIndex];
        
        if (direction === 'right') {
            setLikedItems(prev => [...prev, currentItem]);
        } else {
            setPassedItems(prev => [...prev, currentItem]);
        }
        
        if (cardRef.current) {
            const translateX = direction === 'right' ? '100vw' : '-100vw';
            cardRef.current.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            cardRef.current.style.transform = `translateX(${translateX}) rotate(${direction === 'right' ? '30deg' : '-30deg'})`;
            cardRef.current.style.opacity = '0';
        }
        
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setIsAnimating(false);
            setSwipeDirection(null);
            if (cardRef.current) {
                cardRef.current.style.transition = 'none';
                cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
                cardRef.current.style.opacity = '1';
                cardRef.current.style.boxShadow = 'none';
            }
        }, 500);
    };

    const handleLike = () => {
        performSwipe('right');
    };

    const handlePass = () => {
        performSwipe('left');
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setLikedItems([]);
        setPassedItems([]);
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
            cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
            cardRef.current.style.opacity = '1';
            cardRef.current.style.boxShadow = 'none';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-black flex flex-col items-center justify-center">
                <div className="text-white text-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2">Loading discovery content...</p>
                </div>
            </div>
        );
    }

    if (currentIndex >= discoveryData.length) {
        return (
            <div className="min-h-screen py-8 bg-black flex flex-col items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">No more content!</h1>
                    <p className="text-gray-400 mb-6">You've seen all available movies and shows.</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Liked: {likedItems.length} | Passed: {passedItems.length}
                    </p>
                    <button
                        onClick={handleReset}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 mx-auto transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    const currentItem = discoveryData[currentIndex];
    if (!currentItem) return null;

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
    } = currentItem;

    return (
        <div className="min-h-screen py-8 bg-black flex flex-col items-center justify-center px-4">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Discover</h1>
                <p className="text-white/70 text-sm">
                    Swipe right to like, left to pass
                </p>
                <p className="text-white/50 text-xs mt-1">
                    {currentIndex + 1} / {discoveryData.length}
                </p>
            </div>

            {/* Card Stack */}
            <div className="relative w-full max-w-sm mx-auto mb-8">
                {/* Next card (slightly behind) */}
                {currentIndex + 1 < discoveryData.length && (
                    <div 
                        className="absolute inset-0 bg-gray-800 rounded-2xl shadow-lg transform scale-95 -z-10"
                        style={{ top: '10px' }}
                    >
                        <div className="w-full h-full opacity-30 rounded-2xl bg-gray-700"></div>
                    </div>
                )}

                {/* Current card */}
                <div
                    ref={cardRef}
                    className="bg-gray-900 rounded-2xl shadow-2xl w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
                    style={{ height: '600px', touchAction: 'none' }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="relative h-2/3">
                        <img
                            src={poster_path ? `${img_300}/${poster_path}` : imagenotfound}
                            className="w-full h-full object-cover"
                            alt={title || name || "Movie poster"}
                            loading="lazy"
                            draggable={false}
                        />
                        <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                            {media_type === "tv" ? "TV Series" : "Movie"}
                        </span>
                        {vote_average > 0 && (
                            <span className="absolute top-4 right-4 flex items-center bg-yellow-400/90 text-black text-xs px-3 py-1 rounded-full font-semibold">
                                {vote_average.toFixed(1)}
                                <Star className="ml-1 w-3 h-3 fill-current" />
                            </span>
                        )}
                        
                        {/* Swipe indicators */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`absolute left-8 transform rotate-12 border-4 border-green-500 text-green-500 px-4 py-2 rounded-lg font-bold text-2xl transition-opacity ${swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'}`}>
                                LIKE
                            </div>
                            <div className={`absolute right-8 transform -rotate-12 border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg font-bold text-2xl transition-opacity ${swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'}`}>
                                PASS
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 h-1/3 flex flex-col">
                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">
                            {title || name}
                        </h2>
                        <div className="flex items-center text-sm text-gray-400 mb-3">
                            <span>
                                {first_air_date || release_date || "Unknown"}
                            </span>
                            {vote_count && (
                                <span className="ml-2">({vote_count} votes)</span>
                            )}
                        </div>
                        <p className="text-gray-300 text-sm flex-1 line-clamp-3 leading-relaxed">
                            {overview || "No overview available."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-6">
                <button
                    onClick={handlePass}
                    disabled={isAnimating}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-4 rounded-full transition-colors shadow-lg"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                
                <button
                    onClick={handleLike}
                    disabled={isAnimating}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-4 rounded-full transition-colors shadow-lg"
                >
                    <Heart className="w-6 h-6" />
                </button>
            </div>

            {/* Stats */}
            <div className="mt-6 flex gap-8 text-sm text-gray-400">
                <span>❤️ Liked: {likedItems.length}</span>
                <span>✕ Passed: {passedItems.length}</span>
            </div>

            <footer className="mt-8 text-gray-500 text-sm">
                <p className="text-center">made by jose idris</p>
            </footer>
        </div>
    );
}