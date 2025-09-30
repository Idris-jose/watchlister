import './App.css'
import { useEffect } from 'react';
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
import SearchPage from './components/search/SearchPage.jsx';


import Watchlist from './Watchlist.jsx'

// SEO utilities and component
const SITE_NAME = 'Watchlister';
const DEFAULT_DESC = 'Watchlister - track, discover, and enjoy movies and TV shows. Create and share watchlists.';

function Seo({
  title,
  description,
  canonical,
  noindex = false,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  jsonLd
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

    // Title
    document.title = title ? title : SITE_NAME;

    const setMetaName = (name, content) => {
      if (!content) return;
      let m = document.querySelector(`meta[name="${name}"]`);
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute('name', name);
        document.head.appendChild(m);
      }
      m.setAttribute('content', content);
    };

    const setMetaProperty = (property, content) => {
      if (!content) return;
      let m = document.querySelector(`meta[property="${property}"]`);
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute('property', property);
        document.head.appendChild(m);
      }
      m.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
      if (!href) return;
      let l = document.querySelector(`link[rel="${rel}"]`);
      if (!l) {
        l = document.createElement('link');
        l.setAttribute('rel', rel);
        document.head.appendChild(l);
      }
      l.setAttribute('href', href);
    };

    // Basic meta
    setMetaName('description', description || DEFAULT_DESC);
    setMetaName('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMetaProperty('og:site_name', SITE_NAME);
    setMetaProperty('og:type', ogType);
    setMetaProperty('og:title', title || SITE_NAME);
    setMetaProperty('og:description', description || DEFAULT_DESC);
    setMetaProperty('og:url', canonicalUrl);
    if (ogImage) setMetaProperty('og:image', ogImage);

    // Twitter
    setMetaName('twitter:card', twitterCard);
    setMetaName('twitter:title', title || SITE_NAME);
    setMetaName('twitter:description', description || DEFAULT_DESC);
    if (ogImage) setMetaName('twitter:image', ogImage);

    // Canonical
    setLink('canonical', canonicalUrl);

    // JSON-LD
    const scriptId = 'seo-jsonld';
    let script = document.getElementById(scriptId);
    if (jsonLd) {
      const json = Array.isArray(jsonLd) ? { "@context": "https://schema.org", "@graph": jsonLd } : jsonLd;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(json);
    } else if (script) {
      script.remove();
    }
  }, [title, description, canonical, noindex, ogType, ogImage, twitterCard, jsonLd]);

  return null;
}

function getRouteMeta(pathname) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = `${baseUrl}${pathname}`;
  const ogImage = `${baseUrl}/favicon.svg`;

  // Defaults
  let meta = {
    title: SITE_NAME,
    description: DEFAULT_DESC,
    canonical,
    noindex: false,
    ogType: 'website',
    ogImage,
    jsonLd: null,
  };

  if (pathname === '/') {
    meta.title = 'Watchlister — Discover and track movies & TV shows';
    meta.description = 'Discover, track, and enjoy movies and TV shows. Create, manage, and share your watchlists with friends.';
    meta.jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  } else if (pathname.startsWith('/shared/')) {
    meta.title = 'Shared Watchlist — Watchlister';
    meta.description = 'View a watchlist shared with you on Watchlister.';
    meta.ogType = 'article';
    meta.jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Shared Watchlist",
      "url": canonical
    };
  } else if (pathname === '/discover') {
    meta.title = 'Discover — Watchlister';
    meta.description = 'Personalized movie and TV recommendations.';
    meta.noindex = true; // gated content
  } else if (pathname === '/search') {
    meta.title = 'Search — Watchlister';
    meta.description = 'Search movies and TV shows on Watchlister.';
    meta.noindex = true; // gated content
  } else if (pathname === '/watchlist') {
    meta.title = 'Your Watchlist — Watchlister';
    meta.description = 'Your saved movies and TV shows.';
    meta.noindex = true; // user-specific
    meta.ogType = 'profile';
  } else if (pathname === '/login') {
    meta.title = 'Login — Watchlister';
    meta.description = 'Login to access your Watchlister account.';
    meta.noindex = true;
  } else if (pathname === '/signup') {
    meta.title = 'Create Account — Watchlister';
    meta.description = 'Sign up to start creating and sharing watchlists.';
    meta.noindex = true;
  } else if (pathname === '/forgot-password') {
    meta.title = 'Reset Password — Watchlister';
    meta.description = 'Reset your Watchlister account password.';
    meta.noindex = true;
  }

  return meta;
}

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

  const meta = getRouteMeta(location.pathname);

  return (
    <div className="min-h-screen bg-gray-900">
      <Seo 
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        noindex={meta.noindex}
        ogType={meta.ogType}
        ogImage={meta.ogImage}
        jsonLd={meta.jsonLd}
      />
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
                    <SearchPage />
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