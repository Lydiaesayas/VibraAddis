import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useFavorites } from "../hooks/useFavorites";
import {
  FaHeart,
  FaRegHeart,
  FaCalendarCheck,
  FaInfoCircle,
  FaShareAlt,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

function Reels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [bookingVenue, setBookingVenue] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: 2,
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await api.get("/venues/reels/feed");
        setItems(response.data || []);
      } catch (error) {
        console.error("Error fetching reels feed", error);
        toast.error("Failed to load reels");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleShare = async (item) => {
    const shareUrl = item.url;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.venueName,
          text: `Check out ${item.venueName} on VibraAddis!`,
          url: shareUrl,
        });
      } catch {
        /* cancelled */
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingVenue) return;
    setBookingSubmitting(true);
    try {
      await api.post("/reservations", { ...bookingData, venue: bookingVenue._id });
      setBookingRef("VIBRA-" + Math.random().toString(36).substr(2, 6).toUpperCase());
      setBookingSuccess(true);
      toast.success("Booking requested!");
    } catch {
      toast.error("Failed to book table");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const openBooking = (item) => {
    setBookingVenue({ _id: item.venueId, name: item.venueName });
    setBookingSuccess(false);
    setBookingData({ name: "", email: "", phone: "", date: "", guests: 2 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold tracking-widest text-sm uppercase text-purple-400">Loading Reels...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 px-6 text-center">
        <span className="text-6xl mb-4">🎬</span>
        <h2 className="text-2xl font-bold text-white mb-2">No Reels Yet</h2>
        <p className="max-w-md">Run the database seed to load nightclub social content.</p>
        <Link to="/explore" className="mt-6 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold">
          Explore Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center overflow-hidden">
      <Helmet>
        <title>VibraAddis Reels — Live Vibe Feed</title>
      </Helmet>

      <div className="w-full h-screen md:h-[calc(100vh-80px)] md:max-w-[420px] md:rounded-[40px] md:border-[10px] md:border-zinc-800 md:shadow-[0_0_50px_rgba(168,85,247,0.25)] relative overflow-hidden bg-black flex flex-col">
        <div
          ref={containerRef}
          className="flex-1 h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => {
            const favorited = isFavorite(item.venueId);
            const isInstagram = item.platform === "instagram";
            const isTiktok = item.platform === "tiktok";

            return (
              <div
                key={item._id}
                data-index={index}
                className="reel-slide w-full h-full relative snap-start bg-zinc-950"
                style={{ height: "100%" }}
              >
                <img
                  src={item.image}
                  alt={item.venueName}
                  className="absolute inset-0 w-full h-full object-cover z-0 scale-105 blur-sm opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/90 z-10" />

                <div className="absolute inset-0 z-15 flex flex-col items-center justify-center px-8">
                  <div className="w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black relative">
                    <img src={item.image} alt="" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 gap-4 p-6">
                      {isInstagram && <FaInstagram className="text-5xl text-pink-500" />}
                      {isTiktok && <FaTiktok className="text-5xl text-white" />}
                      <p className="text-white font-bold text-center text-lg">{item.venueName}</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-sm hover:scale-105 transition-transform"
                      >
                        Watch on {isTiktok ? "TikTok" : "Instagram"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-purple-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {item.type === "story" ? "Story" : "Reel"}
                  </span>
                </div>

                <div className="absolute bottom-6 left-4 right-4 z-20 flex items-end justify-between gap-4">
                  <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-[78%]">
                    <span className="text-purple-400 text-xs font-black uppercase tracking-widest mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-black mb-1 truncate">{item.venueName}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-300 mb-2">
                      <FaMapMarkerAlt className="text-pink-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <span className="bg-zinc-800/80 px-2 py-0.5 rounded-lg text-yellow-400 font-bold">
                        ★ {item.rating}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Link
                        to={`/venue/${item.venueId}`}
                        className="text-xs bg-white text-black font-black px-4 py-2 rounded-full hover:bg-purple-500 hover:text-white transition-all flex items-center gap-1"
                      >
                        <FaInfoCircle /> Details
                      </Link>
                      <button
                        onClick={() => openBooking(item)}
                        className="text-xs backdrop-blur-md bg-purple-500/35 border border-purple-500/50 hover:bg-purple-500 font-black px-4 py-2 rounded-full transition-all flex items-center gap-1 text-white"
                      >
                        <FaCalendarCheck /> Book
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs border border-white/30 px-4 py-2 rounded-full font-bold hover:bg-white/10"
                      >
                        Open
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 items-center pb-2">
                    <button
                      onClick={() => toggleFavorite(item.venueId)}
                      className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-black/60 active:scale-90 transition-all"
                    >
                      {favorited ? (
                        <FaHeart className="text-red-500 text-xl animate-pulse" />
                      ) : (
                        <FaRegHeart className="text-white text-xl" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-black/60 active:scale-90 transition-all"
                    >
                      <FaShareAlt className="text-white text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {bookingVenue && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-[2rem] shadow-2xl relative">
            <button
              onClick={() => setBookingVenue(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white text-xl"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center p-4">
                <div className="text-5xl mb-4">🎟️</div>
                <h4 className="font-extrabold text-white text-2xl mb-1">Booking Confirmed!</h4>
                <p className="text-purple-400 font-mono mb-4">{bookingRef}</p>
                <div className="bg-white p-3 rounded-xl inline-block mb-4">
                  <QRCodeCanvas value={bookingRef} size={130} />
                </div>
                <button
                  onClick={() => setBookingVenue(null)}
                  className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h3 className="text-2xl font-black text-white mb-4">Book at {bookingVenue.name}</h3>
                <input
                  required
                  placeholder="Full Name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm outline-none focus:border-purple-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs outline-none focus:border-purple-500"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs outline-none focus:border-purple-500"
                  />
                </div>
                <input
                  required
                  type="datetime-local"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full bg-white text-black py-3.5 rounded-xl font-bold disabled:opacity-50"
                >
                  {bookingSubmitting ? "Reserving..." : "Confirm Reservation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reels;
