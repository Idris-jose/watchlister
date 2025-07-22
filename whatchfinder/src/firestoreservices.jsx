import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase-config';
import { v4 as uuidv4 } from 'uuid';

const COLLECTIONS = {
  USERS: 'users',
  WATCHLISTS: 'watchlists',
  WATCHED: 'watched'
};


export const generateShareId = () => {
  return uuidv4(); 
};

export const enableWatchlistSharing = async (userId, shareTitle = "My Watchlist") => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const shareId = generateShareId();
    
    await updateDoc(userRef, {
      shareSettings: {
        isPublic: true,
        shareId: shareId,
        allowCopying: true,
        shareTitle: shareTitle,
        sharedAt: new Date().toISOString(),
        viewCount: 0,
        copyCount: 0
      }
    });
    
    return shareId;
  } catch (error) {
    console.error('Error enabling sharing:', error);
    throw error;
  }
};
export const disableWatchlistSharing = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      shareSettings: {
        isPublic: false,
        shareId: null,
        allowCopying: false,
        shareTitle: null,
        sharedAt: null,
        viewCount: 0,
        copyCount: 0
      }
    });
  } catch (error) {
    console.error('Error disabling sharing:', error);
    throw error;
  }
};


export const getSharedWatchlist = async (shareId) => {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, where('shareSettings.shareId', '==', shareId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Shared watchlist not found');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    if (!userData.shareSettings?.isPublic) {
      throw new Error('This watchlist is no longer public');
    }
 
    await updateDoc(userDoc.ref, {
      'shareSettings.viewCount': (userData.shareSettings.viewCount || 0) + 1
    });
    
    return {
      watchlist: userData.watchlist || [],
      watched: userData.watched || [],
      shareTitle: userData.shareSettings.shareTitle,
      ownerName: userData.displayName || userData.email.split('@')[0],
      sharedAt: userData.shareSettings.sharedAt,
      allowCopying: userData.shareSettings.allowCopying,
      viewCount: (userData.shareSettings.viewCount || 0) + 1,
      copyCount: userData.shareSettings.copyCount || 0
    };
  } catch (error) {
    console.error('Error getting shared watchlist:', error);
    throw error;
  }
};

export const copySharedWatchlist = async (userId, shareId) => {
  try {
    const sharedData = await getSharedWatchlist(shareId);
    
    if (!sharedData.allowCopying) {
      throw new Error('This watchlist cannot be copied');
    }
    
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const currentWatchlist = userSnap.data().watchlist || [];
      const newMovies = sharedData.watchlist.filter(
        sharedMovie => !currentWatchlist.some(movie => movie.id === sharedMovie.id)
      );
      
      if (newMovies.length > 0) {
        await updateDoc(userRef, {
          watchlist: arrayUnion(...newMovies.map(movie => ({
            ...movie,
            addedAt: new Date().toISOString(),
            copiedFrom: shareId
          })))
        });
        
        // Increment copy count for the original owner
        const usersRef = collection(db, COLLECTIONS.USERS);
        const q = query(usersRef, where('shareSettings.shareId', '==', shareId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const ownerDoc = querySnapshot.docs[0];
          const ownerData = ownerDoc.data();
          await updateDoc(ownerDoc.ref, {
            'shareSettings.copyCount': (ownerData.shareSettings.copyCount || 0) + 1
          });
        }
      }
      
      return newMovies.length;
    }
  } catch (error) {
    console.error('Error copying shared watchlist:', error);
    throw error;
  }
};

export const updateShareSettings = async (userId, settings) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      shareSettings: {
        ...settings,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating share settings:', error);
    throw error;
  }
};

export const initializeUser = async (userId, userEmail) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: userEmail,
        displayName: userEmail.split('@')[0], 
        createdAt: new Date().toISOString(),
        watchlist: [],
        watched: [],
        achievements: [],
        shareSettings: {
          isPublic: false,
          shareId: null,
          allowCopying: true,
          shareTitle: "My Watchlist",
          viewCount: 0,
          copyCount: 0
        }
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