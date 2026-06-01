import { Link, useLocation } from 'react-router-dom';

import logoVideo from "../assets/videos/vibra-addis-logo.mp4";

function Navbar() {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `relative transition-colors duration-300 ${
      isActive ? "text-purple-400 font-semibold" : "text-gray-300 hover:text-purple-300"
    }`;
  };

  return (  
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-4'>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-400 p-[2px] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300 overflow-hidden">
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
              <video src={logoVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-purple-400 transition-all duration-300">
            VibraAddis
          </h1>
        </Link>

        <div className="flex items-center gap-8 text-[15px] font-medium">
          <Link to="/about" className={getLinkClass("/about")}>
            About
            {location.pathname === "/about" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          <Link to="/explore" className={getLinkClass("/explore")}>
            Explore
            {location.pathname === "/explore" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          <Link to="/nightclubs" className={getLinkClass("/nightclubs")}>
            Nightclubs
            {location.pathname === "/nightclubs" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          <Link to="/traditional" className={getLinkClass("/traditional")}>
            Traditional
            {location.pathname === "/traditional" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          <Link to="/favorites" className={getLinkClass("/favorites")}>
            Favorites
            {location.pathname === "/favorites" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar
