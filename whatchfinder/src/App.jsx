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
    <>
      <div className="col-12 pt-5 text-amber-50 pb-3 mt-5 d-flex justify-content-center align-items-center">
        <input
          type="text"
          placeholder="search..."
          value={searchText} // Added controlled input
          onChange={Trigger}
          className="form-control-lg col-6 search bg-dark text-white border border-0"
        />
        <button
          className="btn btn-primary text-white mx-2 col-md-1 col-sm-2 py-2"
          onClick={Search}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="row justify-content-center">
        {content &&
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
              <div className="col-md-3 col-sm-4 py-3" id="card" key={id}>
                <div className="card bg-dark">
                  <img
                    src={poster_path ? `${img_300}/${poster_path}` : unavailable}
                    className="card-img-top pt-3 pb-0 px-3"
                    alt={title || name || "Movie poster"}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center fs-5">{title || name}</h5>
                    <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                      <div>{media_type === "tv" ? "TV" : "Movie"}</div>
                      <div>{first_air_date || release_date}</div>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
          {
                      content.length === 0 && (
                         <div className="text-danger text-amber-300 mt-2">No results found</div>
                      ) 
                    }
      </div>
    </>
  )
}

export default App