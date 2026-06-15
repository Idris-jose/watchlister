import { useState, useEffect, useRef, useCallback } from 'react';
import { useDiary } from './DiaryContext';
import { useWatchlist } from '../Watchlistcontext';
import { Search, X, Star, Calendar, Film, Tv, Check, ChevronLeft } from 'lucide-react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w200';

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(value === star ? null : star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function DiarySearchModal({ onClose }) {
  const { addDiaryEntry } = useDiary();
  const { API_KEY } = useWatchlist();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [watchedDate, setWatchedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rating, setRating] = useState(null);
  const [saving, setSaving] = useState(false);

  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(q)}&page=1&include_adult=false`
      );
      const data = await res.json();
      setResults((data.results || []).filter(r => r.media_type !== 'person').slice(0, 12));
    } catch { setResults([]); }
    finally { setIsSearching(false); }
  }, [API_KEY]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 350);
  };

  const handleSelect = (movie) => {
    setSelected(movie);
    setQuery('');
    setResults([]);
  };

  const handleLog = async () => {
    if (!selected || !watchedDate) return;
    setSaving(true);
    await addDiaryEntry(selected, watchedDate, rating);
    setSaving(false);
    onClose();
  };

  const getYear = (item) => {
    const d = item.release_date || item.first_air_date || '';
    return d.slice(0, 4);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="relative mx-auto w-full max-w-lg flex flex-col mt-auto sm:mt-16 sm:mb-auto rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d1b2e 0%, #0b1220 100%)',
          border: '1px solid rgba(99,179,237,0.15)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/10 flex-shrink-0">
          {selected ? (
            <button
              onClick={() => { setSelected(null); setRating(null); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          ) : (
            <h2 className="text-lg font-bold text-white tracking-tight">Log a Film</h2>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search view */}
        {!selected && (
          <div className="flex flex-col overflow-hidden flex-1">
            <div className="px-5 py-4 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Search for a film or TV show…"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-400/50 border-t-blue-400 rounded-full animate-spin" />
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-2">
              {results.length === 0 && query && !isSearching && (
                <p className="text-center text-gray-500 text-sm pt-8">No results found</p>
              )}
              {results.length === 0 && !query && (
                <div className="flex flex-col items-center justify-center pt-12 gap-3">
                  <Film className="w-10 h-10 text-gray-700" />
                  <p className="text-gray-500 text-sm">Start typing to find a film</p>
                </div>
              )}
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 w-full p-3 rounded-2xl text-left hover:bg-white/8 transition-all group"
                >
                  {/* Poster */}
                  <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    {item.poster_path ? (
                      <img
                        src={`${IMG_BASE}${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Film className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate group-hover:text-blue-300 transition-colors">
                      {item.title || item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-xs">{getYear(item)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.media_type === 'tv'
                          ? 'bg-purple-900/50 text-purple-300'
                          : 'bg-blue-900/50 text-blue-300'
                      }`}>
                        {item.media_type === 'tv' ? 'TV' : 'Film'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm view */}
        {selected && (
          <div className="flex flex-col overflow-y-auto flex-1 px-5 py-6 gap-6">
            {/* Selected movie card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                {selected.poster_path ? (
                  <img
                    src={`${IMG_BASE}${selected.poster_path}`}
                    alt={selected.title || selected.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Film className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-semibold">{selected.title || selected.name}</p>
                <p className="text-gray-400 text-sm">{getYear(selected)}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  selected.media_type === 'tv'
                    ? 'bg-purple-900/50 text-purple-300'
                    : 'bg-blue-900/50 text-blue-300'
                }`}>
                  {selected.media_type === 'tv' ? 'TV Show' : 'Film'}
                </span>
              </div>
            </div>

            {/* Date picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                Date watched
              </label>
              <input
                type="date"
                value={watchedDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setWatchedDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/60 transition-all appearance-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Star rating */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <Star className="w-4 h-4" />
                Rating (optional)
              </label>
              <StarRating value={rating} onChange={setRating} />
              {rating && (
                <p className="text-xs text-gray-500 mt-2">{rating} / 5 — tap again to clear</p>
              )}
            </div>

            {/* Log button */}
            <button
              onClick={handleLog}
              disabled={saving || !watchedDate}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: saving
                  ? 'rgba(59,130,246,0.4)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                boxShadow: '0 0 24px rgba(59,130,246,0.3)',
              }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {saving ? 'Logging…' : 'Add to Diary'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
