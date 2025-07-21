import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase-config';

const COLLECTIONS = {
  USERS: 'users',
  WATCHLISTS: 'watchlists',
  WATCHED: 'watched'
};

export const initializeUser = async (userId, userEmail) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: userEmail,
        createdAt: new Date().toISOString(),
        watchlist: [],
        watched: [],
        achievements: []
      });
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
};

export const getUserWatchlist = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().watchlist || [];
    } else {
      console.error('User not found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

export const addToWatchlistDB = async (userId, movie) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const movieWithTimestamp = {
      ...movie,
      addedAt: new Date().toISOString()
    };

    await updateDoc(userRef, {
      watchlist: arrayUnion(movieWithTimestamp)
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlistDB = async (userId, movieId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const watchlist = userSnap.data().watchlist || [];
      const movieToRemove = watchlist.find(movie => movie.id === movieId);

      if (movieToRemove) {
        await updateDoc(userRef, {
          watchlist: arrayRemove(movieToRemove)
        });
      }
    }
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const clearWatchlistDB = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      watchlist: []
    });
  } catch (error) {
    console.error('Error clearing watchlist:', error);
    throw error;
  }
};

export const updateMoviePriorityDB = async (userId, movieId, newPriority) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const watchlist = userSnap.data().watchlist || [];
      const updatedWatchlist = watchlist.map(movie => 
        movie.id === movieId ? { ...movie, priority: newPriority } : movie
      );

      await updateDoc(userRef, {
        watchlist: updatedWatchlist
      });
    }
  } catch (error) {
    console.error('Error updating movie priority:', error);
    throw error;
  }
};

export const getUserWatched = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().watched || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting watched list:', error);
    throw error;
  }
};

export const addToWatchedDB = async (userId, movie) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const movieWithTimestamp = {
      ...movie,
      watchedAt: new Date().toISOString()
    };

    await updateDoc(userRef, {
      watched: arrayUnion(movieWithTimestamp)
    });
  } catch (error) {
    console.error('Error adding to watched:', error);
    throw error;
  }
};

export const removeFromWatchedDB = async (userId, movieId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const watched = userSnap.data().watched || [];
      const movieToRemove = watched.find(movie => movie.id === movieId);

      if (movieToRemove) {
        await updateDoc(userRef, {
          watched: arrayRemove(movieToRemove)
        });
      }
    }
  } catch (error) {
    console.error('Error removing from watched:', error);
    throw error;
  }
};

export const subscribeToUserData = (userId, callback) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  }, (error) => {
    console.error('Error in user data subscription:', error);
  });
};

export const updateUserAchievements = async (userId, achievement) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      achievements: arrayUnion({
        ...achievement,
        unlockedAt: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error updating achievements:', error);
    throw error;
  }
};