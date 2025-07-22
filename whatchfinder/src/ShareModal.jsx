import React, { useState, useEffect } from 'react';
import { useWatchlist } from './Watchlistcontext.jsx';
import { X, Copy, Share2, Users, Eye } from 'lucide-react';

const ShareModal = ({ isOpen, onClose }) => {
  const { 
    shareSettings, 
    enableSharing, 
    disableSharing, 
    updateSharingSettings,
    watchlist 
  } = useWatchlist();
  
  const [shareTitle, setShareTitle] = useState(shareSettings.shareTitle || "My Watchlist");
  const [allowCopying, setAllowCopying] = useState(shareSettings.allowCopying ?? true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shareSettings.shareId) {
      setShareUrl(`${window.location.origin}/shared/${shareSettings.shareId}`);
    }
  }, [shareSettings.shareId]);

  const handleEnableSharing = async () => {
    try {
      const result = await enableSharing(shareTitle, allowCopying);
      setShareUrl(result.shareUrl);
    } catch (error) {
      console.error('Failed to enable sharing:', error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateSharingSettings({
        ...shareSettings,
        shareTitle,
        allowCopying
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Watchlist
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Watchlist Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              {watchlist.length} movies/shows in your watchlist
            </p>
          </div>

          {/* Share Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Title
            </label>
            <input
              type="text"
              value={shareTitle}
              onChange={(e) => setShareTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Awesome Watchlist"
            />
          </div>

          {/* Settings */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowCopying}
                onChange={(e) => setAllowCopying(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Allow others to copy my watchlist
              </span>
            </label>
          </div>

          {/* Share Actions */}
          {!shareSettings.isPublic ? (
            <button
              onClick={handleEnableSharing}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enable Sharing
            </button>
          ) : (
            <div className="space-y-3">
              {/* Share URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <span className="text-green-600 text-sm">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {shareSettings.viewCount || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {shareSettings.copyCount || 0} copies
                </div>
              </div>

              {/* Update Settings */}
              <button
                onClick={handleUpdateSettings}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Update Settings
              </button>

              {/* Disable Sharing */}
              <button
                onClick={disableSharing}
                className="w-full bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
              >
                Disable Sharing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
