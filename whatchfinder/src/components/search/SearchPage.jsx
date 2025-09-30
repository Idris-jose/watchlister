import { useState, useEffect } from "react";
import SearchHeader from "./SearchHeader";
import SearchResults from "./SearchResults";
import MovieModal from "./MovieModal";
import { LoadingState, NoResults } from "./EmptyStates";
import { useWatchlist } from "../../Watchlistcontext";

const API_KEY = "56185e1e9a25474a6cf2f5748dfb6ebf";
const img_300 = "https://image.tmdb.org/t/p/w300";
const img_500 = "https://image.tmdb.org/t/p/w500";
const imagenotfound = "https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const { addToWatchlist, removeFromWatchlist, watchlist, fetchMovieDetails, fetchTrailers } = useWatchlist();

  // Check if item is in watchlist
  const isInWatchlist = (itemId) => {
    return watchlist.some(item => item.id === itemId);
  };

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchResults(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchResults = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${pageNum}`
      );
      const data = await res.json();
      const processedResults = (data.results || [])
        .filter(item => item.poster_path)
        .map(item => ({
          ...item,
          media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
        }));
      if (pageNum === 1) {
        setSearchResults(processedResults);
      } else {
        setSearchResults((prev) => [...prev, ...processedResults]);
      }
      setPage(pageNum);
      setHasSearched(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (val) => {
    setSearchQuery(val);
    setHasSearched(false);
  };

  const loadMore = () => fetchResults(page + 1);

  const toggleWatchlist = (item) => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SearchHeader
        searchQuery={searchQuery}
        handleSearchInput={handleSearchInput}
        hasSearched={hasSearched}
        searchResults={searchResults}
        watchlistCount={watchlist.length}
      />

      {loading ? (
        <LoadingState />
      ) : hasSearched && searchResults.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <SearchResults
          searchResults={searchResults}
          setSelectedMovie={setSelectedMovie}
          setModalOpen={setModalOpen}
          fetchMovieDetails={fetchMovieDetails}
          fetchTrailers={fetchTrailers}
          img_300={img_300}
          img_500={img_500}
          imagenotfound={imagenotfound}
          loadMore={loadMore}
        />
      )}

      <MovieModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMovie(null);
        }}
        movie={selectedMovie}
        onAddToWatchlist={toggleWatchlist}
        isLiked={selectedMovie && isInWatchlist(selectedMovie.id)}
        img_500={img_500}
        imagenotfound={imagenotfound}
      />
    </div>
  );
}