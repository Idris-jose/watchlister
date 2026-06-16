
import { Film, Star, Tv, Trash2, RefreshCw } from 'lucide-react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w200';

function StarDisplay({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
        />
      ))}
    </div>
  );
}

export default function MovieCard({ entry, onRemove }) {
    
  const title = entry.title;
  const year = entry.release_date?.slice(0,4) || '';
  const isTV = entry.media_type === 'tv';

  return (
    <div className="group flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-white/5"
      style={{ border: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Poster */}
      <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800/80">
        {entry.poster_path ? (
          <img
            src={`${IMG_BASE}${entry.poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Film className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm line-clamp-2">{title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {year && <span className="text-gray-500 text-xs">{year}</span>}
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
            isTV ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'
          }`}>
            {isTV ? 'TV' : 'Film'}
          </span>
          {entry.rewatch && (
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-blue-900/40 text-blue-300" title="Rewatched">
              <RefreshCw className="w-2.5 h-2.5" />

            </span>
          )}
          <StarDisplay rating={entry.rating} />
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(entry.id)}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-400 md:text-gray-600 hover:bg-red-400/10 transition-all ml-auto flex-shrink-0"
        title="Remove from diary"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
