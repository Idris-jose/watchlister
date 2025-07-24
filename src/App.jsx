@@ .. @@
 import './App.css'
 import Home1 from './Home.jsx';
 import ForgotPassword from './Auth/ForgotPassword.jsx';
 import SignUp from './Auth/Signup.jsx';
 import  Login from './Auth/Login.jsx';
 import SharedWatchlist from './SharedWatchlist.jsx';
+import BottomNavigation from './components/BottomNavigation.jsx';
 
 import LandingPage from './Landingpage/landingpage.jsx';
 
@@ .. @@
          </Routes>
          </WatchlistProvider>
          </AuthProvider>
+      <BottomNavigation />
     </Router>
     
    
   );
 }