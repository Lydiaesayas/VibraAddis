import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VibraAddisLogo from "../components/VibraAddisLogo";
import { VIBRA_ADDIS_SOCIAL } from "../config/socialLinks";
import videoBg from "../assets/videos/addis-night.mp4";

function SocialIcon({ type }) {
  if (type === "instagram") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  if (type === "telegram") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.578.191l-8.533 7.701-.33 4.955c.488 0 .702-.223.974-.485l2.335-2.27 4.857 3.589c.895.493 1.538.239 1.76-.827l3.185-15.008c.326-1.306-.5-1.902-1.356-1.515z"/>
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    );
  }
  if (type === "tiktok") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    );
  }
  return null;
}

function Landing() {
  const socials = Object.values(VIBRA_ADDIS_SOCIAL);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Helmet>
        <title>VibraAddis — Feel Addis</title>
        <meta name="description" content="VibraAddis — discover nightlife and culture in Addis Ababa." />
      </Helmet>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoBg} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        <VibraAddisLogo size="lg" className="mb-12 animate-fade-in-up" />

        <nav
          className="w-full max-w-md flex flex-col gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
          aria-label="Main actions"
        >
          <Link
            to="/about"
            className="group flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-semibold text-lg shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300"
          >
            <span className="text-xl" aria-hidden>✨</span>
            About VibraAddis
          </Link>

          <Link
            to="/login"
            className="group flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 hover:border-purple-400/60 font-semibold text-lg transition-all duration-300"
          >
            <span className="text-xl opacity-70 group-hover:rotate-90 transition-transform duration-300" aria-hidden>⚙️</span>
            Admin Login
          </Link>

          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/15 hover:border-pink-400/50 hover:bg-white/10 font-semibold text-lg transition-all duration-300"
            >
              <SocialIcon type={social.icon} />
              Follow on {social.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Landing;
