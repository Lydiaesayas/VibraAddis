import { useEffect, useState } from "react";
import API from "../services/api";
import nightclubImg from "../assets/images/nightclub.jpg";
import VenueCard from "../components/VenueCard";
import { Helmet } from "react-helmet-async";

function Nightclubs() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNightclubs = async () => {
      try {
        const response = await API.get("/venues?category=nightclub&limit=100");
        const venuesData = response.data.venues || response.data;
        setVenues(venuesData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNightclubs();
  }, []);

  return (
    <div className="bg-zinc-950 text-white min-h-screen pb-24">
      <Helmet>
        <title>Nightclubs in Addis Ababa - VibraAddis</title>
        <meta name="description" content="Discover the hottest nightclubs, elite lounges, and late-night spots in Addis Ababa." />
      </Helmet>
      {/* HERO SECTION */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <img
          src={nightclubImg}
          alt="Nightclubs in Addis"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950"></div>
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Addis <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Nightlife</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the hottest clubs, lounges, and late-night spots in the city.
          </p>
        </div>
      </section>

      {/* VENUES GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No nightclubs found.</div>
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

export default Nightclubs;
