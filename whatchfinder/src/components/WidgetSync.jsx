import { useEffect, useRef } from 'react';
import { useWatchlist } from '../Watchlistcontext';
import { useDiary } from '../Diary/DiaryContext';
import { syncWidgetData } from '../lib/widgetBridge';

/**
 * Invisible component that sits inside both WatchlistProvider and DiaryProvider.
 * Runs a single unified syncWidgetData() call whenever any relevant data changes,
 * so the home screen widgets always get a complete, consistent snapshot.
 */
export default function WidgetSync() {
  const { watchlist, watched } = useWatchlist();
  const { diary, streakData } = useDiary();

  // Debounce ref so rapid consecutive state changes only fire one sync
  const debounceTimer = useRef(null);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const nextUp = [...watchlist].sort(
        (a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)
      )[0];

      syncWidgetData({
        // Streak
        streakCurrent: streakData?.currentStreak ?? 0,
        streakHoursRemaining: streakData?.hoursRemaining ?? 0,

        // Counts
        watchlistCount: watchlist.length,
        watchedCount: watched.length,
        diaryCount: diary.length,

        // Next Up
        nextUpTitle: nextUp?.title || nextUp?.name || '',
        nextUpPriority: nextUp?.priority || 'medium',
        nextUpYear: (nextUp?.release_date || nextUp?.first_air_date || '').slice(0, 4),
        nextUpType: nextUp?.media_type === 'tv' ? 'TV' : 'Film',
      });
    }, 500); // wait 500ms for all state to settle

    return () => clearTimeout(debounceTimer.current);
  }, [watchlist, watched, diary, streakData]);

  return null; // renders nothing
}
