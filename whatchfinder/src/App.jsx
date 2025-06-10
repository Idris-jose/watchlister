import './App.css'
import Home1 from './Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from './Watchlistcontext.jsx';
import  Watchlist from './Watchlist.jsx'
export default function App() {
  return (
    <WatchlistProvider>
    <Router>
         <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/Watchlist" element={<Watchlist />} />
          {/* Add more routes as needed */}
         </Routes>
       
    </Router>
    </WatchlistProvider>
    
  );
}
