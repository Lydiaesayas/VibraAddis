import { Link, useLocation } from 'react-router-dom';

function BottomNavbar() {
  const location = useLocation();

  const navItems = [
    {
      path: '/explore',
      label: 'Explore',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-all duration-300 ${
            isActive ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
    {
      path: '/reels',
      label: 'Reels',
      icon: (isActive) => (
        <svg
          className={`w-7 h-7 transition-all duration-300 ${
            isActive ? 'text-pink-500 scale-115 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      path: '/list-your-venue',
      label: 'List',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-all duration-300 ${
            isActive ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-gray-400'
          }`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      path: '/favorites',
      label: 'Favorites',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-all duration-300 ${
            isActive ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-gray-400'
          }`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      path: '/about',
      label: 'About',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-all duration-300 ${
            isActive ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.6)] px-2 py-2 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const isListItem = item.path === '/list-your-venue';
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1 py-1 px-2 focus:outline-none select-none"
          >
            <div className="relative flex items-center justify-center h-7 w-7">
              {item.icon(isActive)}
              {isActive && (
                <span
                  className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full animate-pulse ${
                    isListItem ? 'bg-amber-400' : 'bg-purple-500'
                  }`}
                />
              )}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 ${
                isActive
                  ? isListItem
                    ? 'text-amber-400'
                    : 'text-white'
                  : 'text-zinc-500'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default BottomNavbar;
