import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWatchlist } from './Watchlistcontext.jsx';
import { ArrowLeft, Copy, Eye, Users, Calendar } from 'lucide-react';

const SharedWatchlist = () => {
  const { shareId } = useParams();
  const { getSharedWatchlistData, copyWatchlistFromShare, img_300 } = useWatchlist();
  
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const loadSharedWatchlist = async () => {
      try {
        const data = await getSharedWatchlistData(shareId);
        setSharedData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      loadSharedWatchlist();
    }
  }, [shareId, getSharedWatchlistData]);

  const handleCopyWatchlist = async () => {
    setCopying(true);
    try {
      await copyWatchlistFromShare(shareId);
    } catch (error) {
      console.error('Failed to copy watchlist:', error);
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading shared watchlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Watchlist Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {sharedData.shareTitle}
              </h1>
              <p className="text-gray-600 mb-4">
                Shared by <span className="font-medium">{sharedData.ownerName}</span>
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {sharedData.viewCount} views
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {sharedData.copyCount} copies
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(sharedData.sharedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {sharedData.allowCopying && (
              <button
                onClick={handleCopyWatchlist}
                disabled={copying}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                {copying ? 'Copying...' : 'Copy to My Watchlist'}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {sharedData.watchlist.length}
            </h3>
            <p className="text-gray-600">Movies/Shows</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {sharedData.watched.length}
            </h3>
            <p className="text-gray-600">Already Watched</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {sharedData.watchlist.length - sharedData.watched.length}
            </h3>
            <p className="text-gray-600">To Watch</p>
          </div>
        </div>

        {/* Watchlist */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Watchlist</h2>
          
          {sharedData.watchlist.length === 0 ? (
            <p className="text-gray-500 text-center py-8">This watchlist is empty</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sharedData.watchlist.map((movie) => (
                <div key={movie.id} className="relative">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200">
                    {movie.poster_path ? (
                      <img
                        src={`${img_300}${movie.poster_path}`}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                  
                  <p className="text-xs text-gray-500">
                    {movie.release_date || movie.first_air_date 
                      ? new Date(movie.release_date || movie.first_air_date).getFullYear()
                      : 'N/A'
                    }
                  </p>
                  
                  {movie.priority && (
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      movie.priority === 'high' ? 'bg-red-100 text-red-800' :
                      movie.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {movie.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedWatchlist;