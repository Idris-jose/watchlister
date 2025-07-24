@@ .. @@
   return (
   )
-    <div className="min-h-screen bg-black p-8">
+    <div className="min-h-screen bg-black p-4 md:p-8 pb-20 md:pb-8">
       <div className="max-w-6xl mx-auto">
         <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
           <Star className="w-8 h-8 text-yellow-400 mr-3" />
@@ .. @@
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
           <div className="flex items-center bg-gray-900 rounded p-2 w-full sm:w-1/2">
             <Search className="w-5 h-5 text-gray-400 mr-2" />
@@ .. @@
           </div>
 
-          <div className="flex items-center gap-4">
+          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
             <label htmlFor="sort" className="text-white mr-2">Sort by:</label>
             <select
               id="sort"
@@ .. @@
               <option value="priority">Priority</option>
             </select>
 
-            <button
+            <div className="flex gap-2 w-full sm:w-auto">
+              <button
               onClick={handleClearAll}
-              className="bg-red-600 rounded hover:bg-red-700 text-white p-2 flex items-center gap-1"
+              className="bg-red-600 rounded hover:bg-red-700 text-white p-2 flex items-center gap-1 flex-1 sm:flex-none justify-center"
               aria-label="Clear all watchlist"
             >
               <Trash2 className="w-5 h-5" />
-              Clear All
+              <span className="hidden sm:inline">Clear All</span>
             </button>
 
-               <button
+              <button
         onClick={() => setShowShareModal(true)}
-        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
+        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-none justify-center"
       >
         <Share2 className="w-4 h-4" />
-        Share Watchlist
+        <span className="hidden sm:inline">Share Watchlist</span>
       </button>
+            </div>
           </div>
         </div>