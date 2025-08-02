import './App.css'
import Home1 from './Home.jsx';
import ForgotPassword from './Auth/ForgotPassword.jsx';
import SignUp from './Auth/Signup.jsx';
import Login from './Auth/Login.jsx';
import SharedWatchlist from './SharedWatchlist.jsx';
import Discover from './Discover.jsx';
import MobileBottomNav from './Navigation/MobileBottomNav.jsx';
import DesktopSidebarNav from './Navigation/DesktopSidebarNav.jsx';
import LandingPage from './Landingpage/landingpage.jsx';

import ProtectedRoute from './Routes/ProtectedRoute.jsx';
import PublicRoute from './Routes/PublicRoute.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { WatchlistProvider } from './Watchlistcontext.jsx';
import { AuthProvider } from './Auth/AuthContext.jsx';
import { SidebarProvider, useSidebar } from './SidebarContext.jsx';
import Watchlist from './Watchlist.jsx'

// Layout wrapper to conditionally show navigation
function AppLayout({ children }) {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  
  // Check if current path starts with any auth/landing pages
  const showNavigation = !['/login', '/signup', '/forgot-password', '/'].some(page => 
    location.pathname.startsWith(page) && (
      location.pathname === page || 
      location.pathname === page + '/' ||
      (page === '/' && location.pathname === '/')
    )
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {showNavigation && <DesktopSidebarNav />}
      
      {/* Main content area with dynamic spacing based on sidebar state */}
      <main className={`min-h-screen ${
        showNavigation 
          ? isCollapsed 
            ? 'lg:pl-20' 
            : 'lg:pl-64' 
          : ''
      } ${showNavigation ? 'pb-20 lg:pb-0' : ''}`}>
        {children}
      </main>
      
      {showNavigation && <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <WatchlistProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                } />
                <Route path="/discover" element={
                  <ProtectedRoute>
                    <Discover />
                  </ProtectedRoute>
                } />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Home1 />
                  </ProtectedRoute>
                } />
               
                <Route path="/watchlist" element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                } />
               
                <Route path="/shared/:shareId" element={<SharedWatchlist />} />
              </Routes>
            </AppLayout>
          </WatchlistProvider>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}