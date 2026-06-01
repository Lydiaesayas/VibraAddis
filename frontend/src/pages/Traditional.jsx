import { useEffect, useState } from "react";
import api from "../services/api";
import traditionalImg from "../assets/images/traditional.jpg";
import VenueCard from "../components/VenueCard";
import { Helmet } from "react-helmet-async";

function Traditional() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraditional = async () => {
      try {
        const response = await api.get("/venues?category=traditional cultural restaurant&limit=100");
        const venuesData = response.data.venues || response.data;
        setVenues(venuesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraditional();
  }, []);

  return (
    <div className="bg-zinc-950 text-white min-h-screen pb-24">
      <Helmet>
        <title>Traditional Venues in Addis Ababa - VibraAddis</title>
        <meta name="description" content="Experience the rich culture of Ethiopia. Find traditional restaurants, live bands, and cultural dance shows in Addis Ababa." />
      </Helmet>
      {/* HERO SECTION */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <img
          src={traditionalImg}
          alt="Traditional Culture in Addis"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950"></div>
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Ethiopian <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">Heritage</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience authentic cuisine, music, and the famous coffee ceremony.
          </p>
        </div>
      </section>

      {/* VENUES GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No traditional venues found.</div>
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

export default Traditional;
