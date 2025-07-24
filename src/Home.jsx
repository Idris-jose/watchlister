@@ .. @@
   return (
-    <div className="min-h-screen py-8 bg-black flex flex-col items-center">
+    <div className="min-h-screen py-8 pb-20 md:pb-8 bg-black flex flex-col items-center">
       {/* Movie Modal */}
       <MovieModal
         open={modalOpen}
@@ .. @@
         <img src={logo} alt="WatchFinder Logo" className="w-70 " />
 
          <div className="col-span-full text-center text-white/70 font-medium text-lg mt-3">
-              Search for movies or TV shows to get started
+              <span className="hidden md:inline">Search for movies or TV shows to get started</span>
+              <span className="md:hidden">Discover trending movies and shows</span>
             </div>
 
         <div className="flex items-center bg-gray-900 rounded p-2 lg:w-2xl md:w-xl mt-3 mb-3 sm:w-lg">
@@ .. @@
           />
         </div>
 
-        <Link to="/Watchlist">
+        <Link to="/Watchlist" className="hidden md:block">
           <div className="absolute top-5 right-5 flex items-center">
             <Clapperboard className='text-white w-8 h-8' />
             {number > 0 && (
@@ .. @@
           </div>
         </Link>
       </div>