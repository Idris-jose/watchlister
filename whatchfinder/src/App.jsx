import './App.css'
import Home1 from './Home.jsx';
import ForgotPassword from './Auth/ForgotPassword.jsx';
import SignUp from './Auth/Signup.jsx';
import  Login from './Auth/Login.jsx';
import SharedWatchlist from './SharedWatchlist.jsx';

import LandingPage from './Landingpage/landingpage.jsx';

import ProtectedRoute from './Routes/ProtectedRoute.jsx';
import PublicRoute from './Routes/PublicRoute.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from './Watchlistcontext.jsx';
import { AuthProvider } from './Auth/AuthContext.jsx';
import  Watchlist from './Watchlist.jsx'
export default function App() {
  return (
  
    
    <Router>
      <AuthProvider>
<WatchlistProvider>
     
         <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Signup" element={
            <PublicRoute>
          <SignUp />
            </PublicRoute>
            
            } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={
            <PublicRoute>
             <Login />
            </PublicRoute>
           
            
            } />
          <Route path="/home" element={
            <ProtectedRoute>
             <Home1 />
            </ProtectedRoute>
            
            
            } />
          <Route path="/Watchlist" element={
            <ProtectedRoute>
            <Watchlist />
            </ProtectedRoute>
           
            
            } />

            <Route path="/shared/:shareId" element={<SharedWatchlist />} />
    
         </Routes>
         </WatchlistProvider>
          </AuthProvider>
    </Router>
    
   
  );
}
