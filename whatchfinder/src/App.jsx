import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);
  const [page] = useState(1); // Added missing page state
  
  // Added missing image constants
  const img_300 = "https://image.tmdb.org/t/p/w300";
  const unavailable = "https://via.placeholder.com/300x450?text=No+Image";
 
  const fetchSearch = async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=56185e1e9a25474a6cf2f5748dfb6ebf&language=en-US&query=${searchText}&page=${page}&include_adult=false`
      );
      const { results } = await data.json();
      setContent(results || []); // Added fallback for empty results
    } catch (error) {
      console.error("Error fetching data:", error);
      setContent([]);
    }
  };

  useEffect(() => {
    if (searchText.trim()) { // Only fetch if there's search text
      fetchSearch();
    }
  }, [searchText]); // Added searchText as dependency
 
  const Trigger = (e) => {
    setSearchText(e.target.value);
  };
 
  const Search = () => {
    if (searchText.trim()) { // Only search if there's text
      fetchSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold text-amber-700 mb-4 drop-shadow">WatchFinder</h1>
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            value={searchText}
            onChange={Trigger}
            className="flex-1 px-4 py-2 rounded-l-xl border-t-2 border-b-2 border-l-2 border-amber-400 focus:outline-none text-gray-800 bg-white shadow"
          />
          <button
            className="bg-amber-400 hover:bg-amber-500 text-white px-6 rounded-r-xl font-semibold transition-colors"
            onClick={Search}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {content && content.length > 0 ? (
            content.map((Val) => {
              const {
                name,
                title,
                poster_path,
                first_air_date,
                release_date,
                media_type,
                id,
              } = Val;
              return (
                <div
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200"
                  key={id}
                >
                  <img
                    src={poster_path ? `${img_300}/${poster_path}` : unavailable}
                    className="w-full h-72 object-cover"
                    alt={title || name || "Movie poster"}
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-amber-700 text-center mb-2 truncate">
                      {title || name}
                    </h5>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="px-2 py-1 bg-amber-100 rounded-full">
                        {media_type === "tv" ? "TV" : "Movie"}
                      </span>
                      <span>
                        {first_air_date || release_date || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-amber-700 font-semibold text-xl mt-8">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App