import { motion, AnimatePresence } from "framer-motion";
import ContentCard from "./ContentCard";

export default function SearchResults({
  searchResults = [],
  setSelectedMovie,
  setModalOpen,
  fetchMovieDetails,
  fetchTrailers,
  img_300,
  img_500,
  imagenotfound,
}) {
  return (
    <motion.div
      layout
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6"
    >
      <AnimatePresence>
        {searchResults.map((item, index) => (
          <ContentCard
            key={`${item.id}-${item.media_type}-${index}`}
            item={item}
            onShowDetails={(movie) => {
              setSelectedMovie(movie);
              setModalOpen(true);
              fetchMovieDetails(movie.id, movie.media_type);
              fetchTrailers(movie.id, movie.media_type);
            }}
            img_300={img_300}
            imagenotfound={imagenotfound}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}