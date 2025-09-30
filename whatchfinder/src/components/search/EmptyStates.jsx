import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <div className="text-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-white text-lg">Searching...</p>
    </div>
  );
}

export function InitialState() {
  return (
    <div className="text-center py-16">
      <h3 className="text-2xl font-bold text-white mb-2">Search for Movies & TV Shows</h3>
      <p className="text-gray-400">Enter a title, genre, or keyword to get started</p>
    </div>
  );
}

export function NoResults() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">😔</div>
      <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
      <p className="text-gray-400 mb-6">Try adjusting your search terms</p>
    </div>
  );
}
