# TODO: Fix Search Folder Issues and Add Constants

## Steps to Complete:
- [x] Add the provided constants (API_KEY, img_300, img_500, imagenotfound) at the top of SearchPage.jsx
- [x] Replace the environment variable API key with the API_KEY constant in the fetch call
- [x] Import useWatchlist hook in SearchPage.jsx for fetchMovieDetails and fetchTrailers
- [x] Add state for selectedMovie and modalOpen in SearchPage.jsx
- [x] Update SearchResults call to pass correct props: likedItems, handleLike (renamed from toggleLike), setSelectedMovie, setModalOpen, fetchMovieDetails, fetchTrailers, img_300, img_500, imagenotfound
- [x] Update MovieModal call to use movie={selectedMovie}, open={modalOpen}, onClose to set modalOpen false and selectedMovie null, onAddToWatchlist to call handleLike, isLiked check, and add img_500, imagenotfound
- [x] Test the search functionality to ensure images load correctly and API calls work with the new key
