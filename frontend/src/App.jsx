import {BrowserRouter,Routes, Route,useLocation} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import About from './pages/About';
import Explore from './pages/Explore';
import Nightclubs from './pages/Nightclubs';
import Traditional from './pages/Traditional';    
import VenueDetails from './pages/VenueDetails';
import Favorites from './pages/Favorites';
import ReactGA from "react-ga4";
import usePageTracking from './hooks/usePageTracking';

// Initialize Google Analytics with a placeholder Tracking ID
ReactGA.initialize("G-XXXXXXXXXX");

function AppContent() {
  usePageTracking();
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/admin";
  const isLandingRoute = location.pathname === "/";
  const hideNavbar = isAuthRoute || isLandingRoute;
  const mainClass = hideNavbar ? "" : "pt-20";

  return (
    <div className="min-h-screen bg-zinc-950">
      <Toaster position="top-center" />
      {!hideNavbar && <Navbar />}
      <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/nightclubs" element={<Nightclubs />} />
          <Route path="/traditional" element={<Traditional />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/venue/:id" element={<VenueDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
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