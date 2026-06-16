import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import VenueMap from "../components/VenueMap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../hooks/useFavorites";
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton, WhatsappIcon, XIcon, FacebookIcon } from "react-share";
import { QRCodeCanvas } from "qrcode.react";
import { Helmet } from "react-helmet-async";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = venue ? isFavorite(venue._id) : false;
  
  // Review Form State
  const [formData, setFormData] = useState({
    userName: "",
    rating: 5,
    comment: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Reservation Form State
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: 2
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    const fetchVenueAndReviews = async () => {
      try {
        const venueRes = await api.get(`/venues/${id}`);
        setVenue(venueRes.data);

        const reviewsRes = await api.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueAndReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reviews", { ...formData, venueId: id });
      const reviewsRes = await api .get(`/reviews/${id}`);
      setReviews(reviewsRes.data);
      setFormData({ userName: "", rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingSubmitting(true);
    try {
      await api.post("/reservations", { ...bookingData, venue: id });
      setBookingRef("VIBRA-" + Math.random().toString(36).substr(2, 6).toUpperCase());
      setBookingSuccess(true);
      // We will leave the ticket open until they close it
      // setTimeout(() => setBookingSuccess(false), 5000); 
    } catch (error) {
      console.error("Error booking:", error);
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-bold tracking-widest animate-pulse">LOADING THE VIBE...</div>;
  if (!venue) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Venue not found</div>;

  return (
    <div className="bg-zinc-950 text-white min-h-screen pb-20">
      <Helmet>
        <title>{venue.name} - VibraAddis</title>
        <meta name="description" content={venue.description || `Discover ${venue.name} in Addis Ababa.`} />
      </Helmet>
      {/* HERO HEADER */}
      <section className="relative h-[70vh] overflow-hidden">
        {venue.video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={venue.video} type="video/mp4" />
          </video>
        ) : (
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={venue.image} 
            alt={venue.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-purple-400 uppercase tracking-widest text-xs font-bold bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 backdrop-blur-md">
                  {venue.category}
                </span>
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md flex items-center gap-2 ${
                  venue.vibeStatus === 'Closed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  venue.vibeStatus === 'Crowded' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    venue.vibeStatus === 'Closed' ? 'bg-red-400' :
                    venue.vibeStatus === 'Crowded' ? 'bg-orange-400' :
                    'bg-green-400'
                  }`}></span>
                  {venue.vibeStatus || 'Chill'}
                </span>
              </div>
              <button 
                onClick={() => toggleFavorite(venue._id)}
                className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors"
              >
                {favorited ? (
                  <FaHeart className="text-red-500 text-3xl" />
                ) : (
                  <FaRegHeart className="text-white text-3xl" />
                )}
              </button>
            </div>


            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">{venue.name}</h1>
            
            <div className="flex flex-wrap items-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="font-bold text-2xl">{venue.rating}</span>
                <span className="text-zinc-500 text-sm">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-purple-500">📍</span>
                <span>{venue.location}</span>
              </div>
              {venue.website && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-purple-500">🌐</span>
                  <a 
                    href={venue.website.startsWith('http') ? venue.website : `https://${venue.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-purple-400 transition-colors underline decoration-purple-500/30 underline-offset-4"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 mt-16">
        {/* LEFT: INFO & REVIEWS */}
        <div className="lg:col-span-8">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
              The Experience
            </h2>
            <p className="text-zinc-400 text-xl leading-relaxed font-medium">
              {venue.description || "Experience the absolute best of Addis Ababa's vibrant scene here."}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              {venue.tags?.map((tag, i) => (
                <span key={i} className="bg-zinc-900/50 border border-zinc-800 px-5 py-2 rounded-2xl text-sm text-zinc-300 hover:border-purple-500/50 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* GALLERY SECTION */}
          {venue.gallery && venue.gallery.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                Gallery
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {venue.gallery.map((imgUrl, i) => (
                  <div key={i} className="h-48 rounded-2xl overflow-hidden border border-zinc-800">
                    <img src={imgUrl} alt={`${venue.name} ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MAP SECTION */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
              Location
            </h2>
            <VenueMap venues={[venue]} />
          </section>

          <hr className="border-zinc-800/50 mb-16" />

          {/* REVIEWS LIST */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">What People Say</h2>
              <div className="h-px flex-1 bg-zinc-800/50 mx-6"></div>
            </div>

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="bg-zinc-900/30 p-12 rounded-3xl border border-dashed border-zinc-800 text-center">
                  <p className="text-zinc-500 italic text-lg">No reviews yet. Be the first to share the vibe!</p>
                </div>
              ) : (
                reviews.map((review, index) => (
                  <motion.div 
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-purple-400 transition-colors">{review.userName}</h4>
                          <span className="text-xs text-zinc-500 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="bg-zinc-800/80 px-4 py-2 rounded-2xl text-yellow-400 text-sm font-black border border-zinc-700/50">
                        ⭐ {review.rating}
                      </div>
                    </div>
                    <p className="text-zinc-300 text-lg leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* RIGHT: FORMS */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            
            {/* RESERVATION FORM */}
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/20 transition-colors"></div>
              
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📅</span> Book a Table
              </h3>
              
              <AnimatePresence>
                {bookingSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-zinc-950 border border-purple-500/30 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(168,85,247,0.15)] relative"
                  >
                    <button 
                      onClick={() => {
                        setBookingSuccess(false);
                        setBookingData({ name: "", email: "", phone: "", date: "", guests: 2 });
                      }}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                    >
                      ✕
                    </button>
                    <div className="text-4xl mb-4">🎟️</div>
                    <h4 className="font-bold text-white text-xl mb-1">VIP Ticket Confirmed</h4>
                    <p className="text-purple-400 font-mono mb-6 tracking-widest">{bookingRef}</p>
                    
                    <div className="bg-white p-4 rounded-xl inline-block mb-6">
                      <QRCodeCanvas value={bookingRef} size={150} />
                    </div>

                    <div className="text-left bg-zinc-900 p-4 rounded-xl space-y-2 text-sm">
                      <p className="flex justify-between"><span className="text-zinc-500">Name:</span> <span className="font-bold">{bookingData.name}</span></p>
                      <p className="flex justify-between"><span className="text-zinc-500">Guests:</span> <span className="font-bold">{bookingData.guests}</span></p>
                      <p className="flex justify-between"><span className="text-zinc-500">Date:</span> <span className="font-bold">{new Date(bookingData.date).toLocaleString()}</span></p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-zinc-700"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="email" 
                        required
                        placeholder="Email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-zinc-700 text-sm"
                      />
                      <input 
                        type="tel" 
                        required
                        placeholder="Phone"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-zinc-700 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="datetime-local" 
                        required
                        value={bookingData.date}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all text-sm text-zinc-400"
                      />
                      <input 
                        type="number" 
                        min="1"
                        required
                        placeholder="Guests"
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-zinc-700"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={bookingSubmitting}
                      className="w-full bg-white text-black py-4 rounded-2xl font-black hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                    >
                      {bookingSubmitting ? "Requesting..." : "Confirm Booking"}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>

            {/* REVIEW FORM */}
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
              <h3 className="text-xl font-bold mb-6 text-zinc-400">Rate the Vibe</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <input 
                  type="text" 
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Your Name"
                />

                <select 
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all text-zinc-400"
                >
                  <option value="5">⭐⭐⭐⭐⭐ Elite</option>
                  <option value="4">⭐⭐⭐⭐ Great</option>
                  <option value="3">⭐⭐⭐ Decent</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Bad</option>
                </select>

                <textarea 
                  rows="3"
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all resize-none placeholder:text-zinc-700"
                  placeholder="Tell us everything..."
                ></textarea>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Review"}
                </button>
              </form>
            </div>

            {/* VENUE SOCIAL REELS */}
            {venue.socialPosts?.length > 0 && (
              <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
                <h3 className="text-xl font-bold mb-4 text-white">Social Reels & Posts</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {venue.socialPosts.map((post) => (
                    <a
                      key={post.externalId}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 hover:border-purple-500 rounded-2xl p-4 transition-all"
                    >
                      <span className="text-2xl">{post.platform === "tiktok" ? "🎵" : "📸"}</span>
                      <div>
                        <p className="font-bold text-sm capitalize">{post.platform} {post.type}</p>
                        <p className="text-zinc-500 text-xs truncate">Watch on {post.platform}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL SHARING */}
            <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
              <h3 className="text-xl font-bold mb-4 text-white">Share the Vibe</h3>
              <p className="text-zinc-500 text-sm mb-6">Invite your friends and plan the night out.</p>
              <div className="flex justify-center gap-4">
                <WhatsappShareButton url={window.location.href} title={`Check out ${venue.name} on VibraAddis!`}>
                  <WhatsappIcon size={48} round />
                </WhatsappShareButton>
                <TwitterShareButton url={window.location.href} title={`Check out ${venue.name} on VibraAddis!`}>
                  <XIcon size={48} round />
                </TwitterShareButton>
                <FacebookShareButton url={window.location.href} quote={`Check out ${venue.name} on VibraAddis!`}>
                  <FacebookIcon size={48} round />
                </FacebookShareButton>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDetails;
