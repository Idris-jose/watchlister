import { useState, useMemo } from 'react';
import { useDiary } from './DiaryContext';
import DiarySearchModal from './DiarySearchModal';
import MovieCard from '../components/Diary/MovieCard';
import { ChevronLeft, ChevronRight, Plus, Film, Star, Tv, Trash2, BookOpen, RefreshCw, Flame } from 'lucide-react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w200';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return { day: DAYS[d.getDay()], date: d.getDate() };
}

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

export default function DiaryPage() {
  const { diary, diaryLoading, removeDiaryEntry, streakData } = useDiary();
  const [showModal, setShowModal] = useState(false);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const goBack = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goForward = () => {
    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    if (isCurrentMonth) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  // Filter entries for this month and group by date
  const grouped = useMemo(() => {
    const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    const filtered = diary.filter(e => e.watchedDate?.startsWith(monthPrefix));

    // Group by watchedDate
    const map = {};
    filtered.forEach(entry => {
      if (!map[entry.watchedDate]) map[entry.watchedDate] = [];
      map[entry.watchedDate].push(entry);
    });

    // Sort dates newest first
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, entries]) => ({ date, entries }));
  }, [diary, viewYear, viewMonth]);

  const totalThisMonth = grouped.reduce((acc, g) => acc + g.entries.length, 0);

  return (
    <div className="min-h-screen overflow-x-hidden w-full" style={{ background: 'linear-gradient(160deg, #0b1220 0%, #0d1627 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pb-4"
        style={{
          paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
          background: 'linear-gradient(180deg, #0b1220 70%, transparent 100%)'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
              >
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white tracking-tight">Diary</h1>
                  {streakData?.currentStreak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
                      <Flame className="w-3 h-3 fill-orange-500 text-orange-500 animate-pulse" />
                      <span>{streakData.currentStreak} day streak</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {totalThisMonth > 0 && (
                    <p className="text-xs text-gray-500">{totalThisMonth} film{totalThisMonth !== 1 ? 's' : ''} this month</p>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          {/* Month Navigator */}
          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={goBack}
              className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-semibold text-base tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={goForward}
              disabled={isCurrentMonth}
              className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-32">
        {diaryLoading && (
          <div className="flex justify-center pt-20">
            <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}

        {!diaryLoading && grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-24 gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <BookOpen className="w-9 h-9 text-blue-400/40" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">No films logged</p>
              <p className="text-gray-500 text-sm mt-1">
                Tap <span className="text-blue-400">+ Log Film</span> to record what you watched in {MONTHS[viewMonth]}
              </p>
            </div>
          </div>
        )}

        {/* Diary entries — vertical timeline */}
        <div className="space-y-6 pt-2">
          {grouped.map(({ date, entries }) => {
            const { day, date: dayNum } = formatDay(date);
            return (
              <div key={date} className="flex gap-3 sm:gap-4 min-w-0 w-full">
                {/* Day badge — sticky left column */}
                <div className="flex flex-col items-center flex-shrink-0 w-14">
                  <div className="flex flex-col items-center px-2 py-2 rounded-2xl w-full"
                    style={{
                      background: 'rgba(59,130,246,0.10)',
                      border: '1px solid rgba(59,130,246,0.20)',
                    }}
                  >
                    <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">{day}</span>
                    <span className="text-white text-xl font-bold leading-none mt-0.5">{dayNum}</span>
                  </div>
                  {/* Vertical line */}
                  <div className="flex-1 w-px mt-2" style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.2) 0%, transparent 100%)', minHeight: '16px' }} />
                </div>

                {/* Movie cards */}
                <div className="flex-1 min-w-0 space-y-2 pb-2">
                  {entries.map(entry => (
                    <MovieCard key={entry.id} entry={entry} onRemove={removeDiaryEntry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search modal */}
      {showModal && <DiarySearchModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
