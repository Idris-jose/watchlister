import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import { addToDiaryDB, removeFromDiaryDB, subscribeToUserData } from '../firestoreservices';

const DiaryContext = createContext();

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) throw new Error('useDiary must be used within DiaryProvider');
  return context;
};

export const DiaryProvider = ({ children }) => {
  const { user } = useAuth();
  const [diary, setDiary] = useState([]);
  const [diaryLoading, setDiaryLoading] = useState(false);

  const [streakData, setStreakData] = useState({ currentStreak: 0, hoursRemaining: 0 });

  // Subscribe to real-time diary updates
  useEffect(() => {
    if (!user) {
      setDiary([]);
      return;
    }

    setDiaryLoading(true);
    const unsubscribe = subscribeToUserData(user.uid, (userData) => {
      setDiary(userData.diary || []);
      setDiaryLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user]);

  // Calculate streak dynamically whenever diary changes or over time
  useEffect(() => {
    if (diary.length === 0) {
      setStreakData({ currentStreak: 0, hoursRemaining: 0 });
      return;
    }

    const calculateStreak = (diaryEntries) => {
      const sorted = [...diaryEntries]
        .filter(e => e.loggedAt)
        .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());

      if (sorted.length === 0) return { currentStreak: 0, hoursRemaining: 0 };

      const getLocalDateString = (isoString) => {
        const d = new Date(isoString);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      let streak = 0;
      let lastLogTime = null;
      let lastLogDateStr = "";

      for (const entry of sorted) {
        const entryTime = new Date(entry.loggedAt).getTime();
        const entryLocalDateStr = getLocalDateString(entry.loggedAt);

        if (lastLogTime === null) {
          streak = 1;
          lastLogTime = entryTime;
          lastLogDateStr = entryLocalDateStr;
        } else {
          const diffHrs = (entryTime - lastLogTime) / (1000 * 60 * 60);
          if (diffHrs > 36) {
            streak = 1; // resets if gap between consecutive entries is > 36h
          } else if (entryLocalDateStr !== lastLogDateStr) {
            streak += 1;
          }
          lastLogTime = entryTime;
          lastLogDateStr = entryLocalDateStr;
        }
      }

      const now = new Date().getTime();
      const timeSinceLastLog = (now - lastLogTime) / (1000 * 60 * 60);

      if (timeSinceLastLog > 36) {
        return { currentStreak: 0, hoursRemaining: 0 };
      } else {
        const hoursRemaining = Math.max(0, 36 - timeSinceLastLog);
        return { currentStreak: streak, hoursRemaining };
      }
    };

    setStreakData(calculateStreak(diary));

    // Update countdown timer every minute
    const interval = setInterval(() => {
      setStreakData(calculateStreak(diary));
    }, 60000);

    return () => clearInterval(interval);
  }, [diary]);

  const addDiaryEntry = async (movie, watchedDate, rating = null, rewatch = false) => {
    if (!user) {
      toast.error('Please sign in to log films');
      return;
    }

    const entry = {
      id: `${movie.id}-${Date.now()}`,
      movieId: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      media_type: movie.media_type || (movie.title ? 'movie' : 'tv'),
      release_date: movie.release_date || movie.first_air_date || '',
      watchedDate: watchedDate, // ISO date string: "2026-06-15"
      rating: rating,
      rewatch: rewatch,
      loggedAt: new Date().toISOString(),
    };

    try {
      await addToDiaryDB(user.uid, entry);
      toast.success(`"${entry.title}" logged to your diary!`);
    } catch (err) {
      console.error('Error adding diary entry:', err);
      toast.error('Failed to log film. Please try again.');
    }
  };

  const removeDiaryEntry = async (entryId) => {
    if (!user) return;
    try {
      await removeFromDiaryDB(user.uid, entryId);
      toast.success('Entry removed from diary');
    } catch (err) {
      console.error('Error removing diary entry:', err);
      toast.error('Failed to remove entry.');
    }
  };

  return (
    <DiaryContext.Provider value={{ diary, diaryLoading, addDiaryEntry, removeDiaryEntry, streakData }}>
      {children}
    </DiaryContext.Provider>
  );
};
