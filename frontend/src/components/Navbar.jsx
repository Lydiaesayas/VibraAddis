import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoMark from './LogoMark';

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `relative transition-colors duration-300 whitespace-nowrap text-[14px] ${
      isActive ? 'text-purple-400 font-semibold' : 'text-gray-300 hover:text-purple-300'
    }`;
  };

  const getMobileLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `block w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
      isActive
        ? 'bg-purple-500/15 text-purple-400 font-semibold border border-purple-500/30'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;
  };

  // Regular nav links (no List Venue — it gets its own CTA button)
  const navLinks = [
    { path: '/explore',     label: 'Explore'     },
    { path: '/reels',       label: 'Reels'       },
    { path: '/nightclubs',  label: 'Nightclubs'  },
    { path: '/traditional', label: 'Traditional' },
    { path: '/favorites',   label: 'Favorites'   },
    { path: '/about',       label: 'About'       },
  ];

  const isListActive = location.pathname === '/list-your-venue';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-400 p-[2px] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300 overflow-hidden">
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
              <LogoMark className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-purple-400 transition-all duration-300">
            VibraAddis
          </h1>
        </Link>

        {/* Desktop: nav links + CTA button */}
        <div className="hidden md:flex items-center gap-5 font-medium">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className={getLinkClass(path)}>
              {label}
              {location.pathname === path && (
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full animate-pulse ${
                  path === '/favorites' ? 'bg-red-500' : 'bg-purple-500'
                }`} />
              )}
            </Link>
          ))}

          {/* List Your Venue — amber CTA button, always visible */}
          <Link
            to="/list-your-venue"
            className={`ml-2 px-4 py-2 rounded-full text-[13px] font-black uppercase tracking-wide transition-all duration-300 whitespace-nowrap ${
              isListActive
                ? 'bg-amber-400 text-black shadow-[0_0_18px_rgba(251,191,36,0.5)]'
                : 'bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 hover:text-amber-200'
            }`}
          >
            ⭐ List Your Venue
          </Link>
        </div>

        {/* Mobile: hamburger + quick List button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/list-your-venue"
            className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-amber-500/15 border border-amber-500/40 text-amber-300 whitespace-nowrap"
          >
            ⭐ List
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors duration-200"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-[2px] bg-gray-300 rounded-full transition-all duration-300 ${mobileOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] bg-gray-300 rounded-full mt-1 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-gray-300 rounded-full mt-1 transition-all duration-300 ${mobileOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[57px] bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed left-0 right-0 top-[57px] z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-out ${
          mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {/* List Venue as a highlighted row at the top of mobile menu */}
          <Link
            to="/list-your-venue"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 mb-2 ${
              isListActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            <span>⭐</span> List Your Venue
          </Link>

          {navLinks.map(({ path, label }, i) => (
            <Link
              key={path}
              to={path}
              className={getMobileLinkClass(path)}
              style={{ animationDelay: mobileOpen ? `${i * 50}ms` : '0ms' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
