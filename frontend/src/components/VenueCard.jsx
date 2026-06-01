import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../hooks/useFavorites";

function VenueCard({ venue }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(venue._id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(venue._id);
  };

  return (
    <div
      onClick={() => navigate(`/venue/${venue._id}`)}
      className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
        
        {/* FAVORITE BUTTON */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-colors"
        >
          {favorited ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-white text-xl" />
          )}
        </button>
        
        {/* VIBE STATUS BADGE */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
            venue.vibeStatus === 'Closed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
            venue.vibeStatus === 'Crowded' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
            'bg-green-500/20 text-green-400 border-green-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              venue.vibeStatus === 'Closed' ? 'bg-red-400' :
              venue.vibeStatus === 'Crowded' ? 'bg-orange-400' :
              'bg-green-400'
            }`}></span>
            {venue.vibeStatus || 'Chill'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <span className="text-xs uppercase tracking-widest text-purple-400">
          {venue.category}
        </span>

        <h3 className="text-2xl font-bold mt-2">
          {venue.name}
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          📍 {venue.location}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-yellow-400 font-semibold">
            ⭐ {venue.rating}
          </span>

          {venue.featured && (
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {venue.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-zinc-800 text-gray-300 text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VenueCard;
