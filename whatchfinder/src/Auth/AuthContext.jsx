import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase-config'; // You need to import these
import { signInWithPopup, createUserWithEmailAndPassword,sendPasswordResetEmail, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';

import toast, { Toaster } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const isDemoUser = user?.email === "demo@yourapp.com";

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      console.log('User created:', userCredential.user.uid);
    } catch (error) {
      console.error('Sign up error:', error.message);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      console.log('User signed in:', userCredential.user.uid);
    } catch (error) {
      console.error('Sign in error:', error.message);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

   const handleDemoLogin = async () => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, "demo@yourapp.com", "demopassword")
      toast.success("🎉 Logged in as demo user!")
    } catch (error) {
      console.error("Demo login error:", error.message)
      toast.error("❌ Demo login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Google sign in successful!');
      navigate('/home'); 
      console.log('Google sign in successful:', result.user.displayName);
    } catch (error) {
      console.error('Google sign in error:', error.message);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      // Optional: Custom action code settings
      url: 'http://localhost:5173/login', // Where user goes after reset
      handleCodeInApp: false, // Let Firebase handle the reset page
    });
    return { success: true, message: 'Password reset email sent!' };
  } catch (error) {
    let errorMessage = 'Failed to send reset email';
    
    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, message: errorMessage };
  }
};

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.message);
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      email,
      password,
      isAuthenticated,
      setEmail,
      setPassword,
      setError,
      signUp,
      signIn,
      signInWithGoogle,
      sendPasswordReset,
      logout,
      handleDemoLogin,
    }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};