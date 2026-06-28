import {BrowserRouter,Routes, Route,useLocation} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import Landing from './pages/Landing';
import About from './pages/About';
import Explore from './pages/Explore';
import Nightclubs from './pages/Nightclubs';
import Traditional from './pages/Traditional';    
import VenueDetails from './pages/VenueDetails';
import Favorites from './pages/Favorites';
import Reels from './pages/Reels';
import ListYourVenue from './pages/ListYourVenue';
import ReactGA from "react-ga4";
import usePageTracking from './hooks/usePageTracking';
// New user pages
import Register from './pages/Register';
import UserLogin from './pages/UserLogin';
import UserProfile from './pages/UserProfile';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Invoices from './pages/Invoices';
import AdminAnalytics from './pages/AdminAnalytics';
import OwnerDashboard from './pages/OwnerDashboard';

// Initialize Google Analytics with a placeholder Tracking ID
ReactGA.initialize("G-XXXXXXXXXX");

function AppContent() {
  usePageTracking();
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/admin" || location.pathname === "/user-login" || location.pathname === "/register";
  const isLandingRoute = location.pathname === "/";
  const isReelsRoute = location.pathname === "/reels";
  const isProfileRoute = location.pathname === "/profile" || location.pathname === "/invoices" || location.pathname === "/subscriptions" || location.pathname === "/admin-analytics" || location.pathname === "/owner";

  const hideTopNavbar = isAuthRoute || isLandingRoute || isReelsRoute;
  const hideBottomNavbar = isAuthRoute || isLandingRoute || isProfileRoute;
  const mainClass = hideTopNavbar ? "" : "pt-20";

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 md:pb-0">
      <Toaster position="top-center" />
      {!hideTopNavbar && <Navbar />}
      <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/list-your-venue" element={<ListYourVenue />} />
          <Route path="/nightclubs" element={<Nightclubs />} />
          <Route path="/traditional" element={<Traditional />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/venue/:id" element={<VenueDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/subscriptions" element={<SubscriptionPlans />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin-analytics" element={
            <ProtectedRoute>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/owner" element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!hideBottomNavbar && <BottomNavbar />}
    </div>
  );
}

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App;