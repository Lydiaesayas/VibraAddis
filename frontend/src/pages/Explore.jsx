import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import videoBg from "../assets/videos/addis-night.mp4";
import nightclubImg from "../assets/images/nightclub.jpg";
import traditionalImg from "../assets/images/totot.jpg";
import VenueCard from "../components/VenueCard";
import VenueMap from "../components/VenueMap";

function Explore() {
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
        if (minRating > 0) queryParams.append("rating", minRating);

        const venueResponse = await api.get(`/venues?${queryParams.toString()}`);
        setVenues(venueResponse.data.venues || venueResponse.data);

        const eventResponse = await api.get("/events");
        setEvents(eventResponse.data.events || eventResponse.data);
      } catch (error) {
        console.error(error);
        import("react-hot-toast").then(({ toast }) => toast.error("Failed to load data"));
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, minRating]);

  return (
    <div className="bg-zinc-950 text-white">
      <Helmet>
        <title>Explore — VibraAddis</title>
        <meta name="description" content="Explore the best nightclubs, lounges, traditional cultural restaurants, and events in Addis Ababa. Find your vibe." />
      </Helmet>

      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover transition-opacity duration-1000"
        >
          <source src={videoBg} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold max-w-5xl leading-tight">
            Discover The
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"> Vibe </span>
            Of Addis
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mt-6 max-w-2xl">
            Explore nightlife, traditional culture,
            rooftop lounges, music, and entertainment across Addis Ababa.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button onClick={() => navigate("/nightclubs")} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 px-8 py-4 rounded-full text-lg font-bold">
              Explore Nightlife
            </button>

            <button onClick={() => navigate("/traditional")} className="backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 hover:border-purple-400 transition-all duration-300 px-8 py-4 rounded-full text-lg font-bold">
              Traditional Culture
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        <div
          onClick={() => navigate("/nightclubs")}
          className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
        >
          <div className="h-72 w-full overflow-hidden">
            <img
              src={nightclubImg}
              alt="Nightclubs"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 w-full p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
              Nightclubs
            </h2>
            <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              Discover DJs, rooftop lounges,
              artists, and trending nightlife spots in Addis.
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate("/traditional")}
          className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer"
        >
          <div className="h-72 w-full overflow-hidden">
            <img
              src={traditionalImg}
              alt="Traditional Houses"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 w-full p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
              Traditional Houses
            </h2>
            <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              Experience Ethiopian music,
              dance, food, coffee ceremony,
              and authentic cultural entertainment.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-12">
        <input
          type="text"
          placeholder="Search venues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 p-4 rounded-2xl mb-6 outline-none border border-zinc-800"
        />

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-3 rounded-2xl ${
              selectedCategory === "all" ? "bg-purple-600" : "bg-zinc-800"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedCategory("nightclub")}
            className={`px-6 py-3 rounded-2xl ${
              selectedCategory === "nightclub" ? "bg-purple-600" : "bg-zinc-800"
            }`}
          >
            Nightclubs
          </button>

          <button
            onClick={() => setSelectedCategory("traditional cultural restaurant")}
            className={`px-6 py-3 rounded-2xl ${
              selectedCategory === "traditional cultural restaurant"
                ? "bg-purple-600"
                : "bg-zinc-800"
            }`}
          >
            Traditional
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800">
            <span className="text-zinc-500 text-sm font-bold uppercase">Min Rating:</span>
            {[0, 3, 4, 4.5].map((rate) => (
              <button
                key={rate}
                onClick={() => setMinRating(rate)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  minRating === rate ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {rate === 0 ? "All" : rate}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold">
              Trending <span className="text-purple-500">Venues</span>
            </h2>
            <p className="text-gray-400 mt-2">Discover Addis nightlife & culture</p>
          </div>

          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-purple-500 px-6 py-3 rounded-2xl transition-all font-bold"
          >
            {showMap ? "📋 Show List" : "🗺️ View on Map"}
          </button>
        </div>

        {showMap ? (
          <div className="mb-12 animate-fade-in">
            <VenueMap venues={venues} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900 animate-pulse rounded-3xl border border-zinc-800"></div>
              ))
            ) : venues.length > 0 ? (
              venues.map((venue) => <VenueCard key={venue._id} venue={venue} />)
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                No venues found matching your criteria.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold">
            Upcoming <span className="text-purple-500">Events</span>
          </h2>
          <p className="text-gray-400">Discover what&apos;s happening in Addis</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-purple-400 mt-2">🎤 {event.artist}</p>
                <p className="text-gray-400 mt-2">📍 {event.venue}</p>
                <p className="text-gray-500 mt-4 text-sm">{event.description}</p>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-gray-300">📅 {new Date(event.date).toDateString()}</span>
                  <span className="text-yellow-400 font-semibold">🕒 {event.time}</span>
                </div>

                {event.featured && (
                  <div className="mt-5">
                    <span className="bg-purple-600 text-white text-xs px-4 py-2 rounded-full">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Explore;
