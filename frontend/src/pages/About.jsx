import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VibraAddisLogo from "../components/VibraAddisLogo";

function About() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Helmet>
        <title>About VibraAddis — Discover Addis Nightlife & Culture</title>
        <meta
          name="description"
          content="Learn how VibraAddis helps you discover nightclubs, traditional venues, events, and favorites in Addis Ababa."
        />
      </Helmet>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex justify-center mb-10">
          <VibraAddisLogo size="md" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6">
          What is{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            VibraAddis
          </span>
          ?
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed text-center mb-10">
          VibraAddis is your guide to Addis Ababa&apos;s nightlife and culture. Browse venues,
          filter by vibe, save favorites, view maps, and discover upcoming events — all in one place.
        </p>

        <div className="space-y-6 text-gray-400">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">🎧 Nightlife</h2>
            <p>Explore nightclubs, lounges, and trending spots with ratings and details.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">🪘 Traditional culture</h2>
            <p>Find cultural restaurants with music, dance, food, and authentic experiences.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">📅 Events & favorites</h2>
            <p>See upcoming events, save venues you love, and share places with friends.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">🛡️ For venue owners</h2>
            <p>Admins can log in to manage venues, events, and reservations from the dashboard.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Link
            to="/explore"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-lg transition-all"
          >
            Start Exploring
          </Link>
          <Link
            to="/"
            className="px-8 py-4 rounded-full border border-zinc-700 hover:border-purple-500 text-gray-300 hover:text-white font-bold text-lg transition-all"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
