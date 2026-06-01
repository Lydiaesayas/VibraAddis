import { useEffect, useState } from "react";
import api from "../services/api";
import VenueCard from "../components/VenueCard";
import { useFavorites } from "../hooks/useFavorites";
import { Helmet } from "react-helmet-async";

function Favorites() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!favorites || favorites.length === 0) {
        setVenues([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/venues?ids=${favorites.join(",")}&limit=${favorites.length}`);
        const venuesData = response.data.venues || response.data;
        setVenues(venuesData);
      } catch (error) {
        console.error("Error fetching favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="bg-zinc-950 text-white min-h-screen pb-24">
      <Helmet>
        <title>My Favorites - VibraAddis</title>
        <meta name="description" content="Your saved and favorite venues on VibraAddis." />
      </Helmet>
      {/* HEADER */}
      <section className="relative pt-32 pb-12 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Favorites</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          The vibes you love, saved in one place.
        </p>
      </section>

      {/* VENUES GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center bg-zinc-900/50 p-12 rounded-[2rem] border border-zinc-800">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
            <p className="text-gray-400">Start exploring and tap the heart icon on venues you love!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <VenueCard key={venue._id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Favorites;
