import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function ContentCard({
  item,
  onShowDetails,
  img_300,
  imagenotfound,
}) {
  const { title, name, poster_path, first_air_date, release_date, media_type, vote_average } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group"
      onClick={() => onShowDetails(item)}
    >
      <div className="relative">
        <img
          src={poster_path ? `${img_300}${poster_path}` : imagenotfound}
          alt={title || name}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        {vote_average > 0 && (
          <div className="absolute top-2 left-2 flex items-center bg-yellow-400/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-xs font-bold">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {vote_average.toFixed(1)}
          </div>
        )}

        {/* Media Type */}
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium">
          {media_type === "tv" ? "TV" : "Movie"}
        </div>

        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="font-semibold text-sm truncate">{title || name}</h3>
          {(first_air_date || release_date) && (
            <p className="text-gray-300 text-xs mt-1">
              {new Date(first_air_date || release_date).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}