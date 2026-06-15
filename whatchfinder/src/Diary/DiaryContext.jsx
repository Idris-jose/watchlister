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
    <DiaryContext.Provider value={{ diary, diaryLoading, addDiaryEntry, removeDiaryEntry }}>
      {children}
    </DiaryContext.Provider>
  );
};
