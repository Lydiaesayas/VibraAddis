import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import toast from "react-hot-toast";

/* ─── Hardcoded plans — renders instantly, API enriches if available ───── */
const FALLBACK_PLANS = [
  {
    id: "spotlight",
    step: 1,
    title: "Spotlight Listing",
    tagline: "Get on the map",
    price: "15,000 ETB / month",
    features: [
      "Venue profile on VibraAddis",
      "Search & category placement",
      "Basic photo gallery",
      "Customer reviews enabled",
    ],
  },
  {
    id: "campaign",
    step: 2,
    title: "2-Week Campaign",
    tagline: "Turn one night into two weeks of hype",
    price: "35,000 ETB / event",
    features: [
      "Everything in Spotlight",
      "10-day teaser countdown",
      "5-day aggressive reels push",
      "2-day urgency & FOMO posts",
      "Event-night live coverage",
    ],
  },
  {
    id: "celebrity",
    step: 3,
    title: "Celebrity Night Branding",
    tagline: "Host the biggest nights in Addis",
    price: "50,000 ETB / month",
    features: [
      "Featured homepage placement",
      "Celebrity night promotion",
      "Priority explore ranking",
      "Brand story on About page",
    ],
  },
  {
    id: "signature",
    step: 4,
    title: "Signature Events",
    tagline: "Build recurring iconic nights",
    price: "40,000 ETB / month",
    features: [
      "Custom event series branding",
      "Weekly event calendar slots",
      "Push notifications to favorites",
      "Signature night badges",
    ],
  },
  {
    id: "content",
    step: 5,
    title: "Cinematic Content",
    tagline: "20–40 content pieces per night",
    price: "60,000 ETB / night",
    features: [
      "Professional videographer",
      "Reel creator on-site",
      "Photographer coverage",
      "Content uploaded to your profile",
    ],
  },
  {
    id: "fomo",
    step: 6,
    title: "VIP FOMO Package",
    tagline: "Everyone important was there — except me",
    price: "85,000 ETB / month",
    features: [
      "Full strategy from steps 1–5",
      "Viral moment planning",
      "VIP birthday & bottle show promos",
      "Reels feed priority + social push",
      "Dedicated account manager",
    ],
  },
];

/* ─── Plan icons ──────────────────────────────────────────────────────── */
const icons = {
  spotlight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  campaign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  celebrity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  signature: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  content: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  fomo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
};

const POPULAR_PLAN = "fomo";

const stats = [
  { value: "9+", label: "Venues Listed" },
  { value: "50K+", label: "Monthly Views" },
  { value: "24hr", label: "Response Time" },
];

/* ─── Plan Card ─────────────────────────────────────────────────────────── */
function PlanCard({ plan, selected, onClick }) {
  const isPopular = plan.id === POPULAR_PLAN;
  return (
    <button
      type="button"
      id={`plan-${plan.id}`}
      onClick={() => onClick(plan.id)}
      className={`relative text-left rounded-3xl border p-6 transition-all duration-300 group cursor-pointer ${
        selected
          ? "border-amber-400 bg-gradient-to-b from-amber-500/15 to-amber-900/10 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          : "border-zinc-800 bg-zinc-900/50 hover:border-amber-500/40 hover:bg-zinc-900/80"
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
          ⭐ Most Popular
        </span>
      )}

      <div className="flex items-start justify-between mb-4 mt-1">
        <span className={`font-black text-3xl transition-colors ${selected ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-500/60"}`}>
          {plan.step}
        </span>
        <span className={`transition-colors ${selected ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-500/60"}`}>
          {icons[plan.id]}
        </span>
      </div>

      <h2 className="text-lg font-bold text-white mb-0.5">{plan.title}</h2>
      <p className="text-amber-300/70 text-xs font-semibold mb-3">{plan.tagline}</p>
      <p className="text-2xl font-black text-amber-400 mb-4">{plan.price}</p>

      <ul className="space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="text-zinc-400 text-sm flex gap-2 items-start">
            <span className="text-amber-500 shrink-0 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-4 pt-4 border-t border-amber-500/20">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">✓ Selected</span>
        </div>
      )}
    </button>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
function ListYourVenue() {
  // Start with fallback plans immediately — no loading flash
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [selectedPlan, setSelectedPlan] = useState("spotlight");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    venueName: "",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Try to enrich from API — silently falls back if backend is sleeping
  useEffect(() => {
    api
      .get("/subscriptions/plans")
      .then((res) => {
        if (res.data && res.data.length > 0) setPlans(res.data);
      })
      .catch(() => {
        // Silently keep fallback plans — no error toast
      });
  }, []);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/subscriptions/request", { ...form, planId: selectedPlan });
      setSubmitted(true);
      toast.success("Request sent! We'll contact you within 24 hours.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 outline-none focus:border-amber-500 transition-colors duration-200 text-sm";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Helmet>
        <title>List Your Venue — VibraAddis</title>
        <meta
          name="description"
          content="Nightclubs and lounges pay to be listed on VibraAddis. Choose a subscription plan and reach Addis nightlife seekers."
        />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Now Accepting Venues
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-4">
            <span className="text-amber-400">Get Your</span>
            <br />
            <span className="text-white">Venue on the Map</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            Join Addis Ababa's premier nightlife discovery platform. Strategic promotion that fills your venue every night.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-amber-400">{s.value}</div>
                <div className="text-zinc-500 text-xs uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick scroll CTA */}
          <a
            href="#request-form"
            className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-sm hover:from-amber-400 transition-all"
          >
            Request Your Listing →
          </a>
        </div>
      </section>

      {/* ── Plans Grid ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Choose Your Plan</h2>
          <p className="text-zinc-500 text-sm">Click a plan to select it, then fill out the form below.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onClick={setSelectedPlan}
            />
          ))}
        </div>
      </section>

      {/* ── Request Form ─────────────────────────────────────────────────── */}
      <section id="request-form" className="max-w-2xl mx-auto px-6 pb-28 md:pb-20">

        {/* Sticky selected-plan pill */}
        {selectedPlanData && (
          <div className="sticky top-20 z-10 mb-6 flex justify-center pointer-events-none">
            <div className="inline-flex items-center gap-3 bg-zinc-900/95 backdrop-blur-md border border-amber-500/30 rounded-full px-5 py-2.5 shadow-xl pointer-events-auto">
              <span className="text-amber-400">{icons[selectedPlan]}</span>
              <span className="text-white font-bold text-sm">{selectedPlanData.title}</span>
              <span className="text-amber-400 font-black text-sm">— {selectedPlanData.price}</span>
            </div>
          </div>
        )}

        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-[2rem] p-8 shadow-2xl">
          {submitted ? (
            /* ── Success state ─── */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-black text-white mb-2">Request Received!</h3>
              <p className="text-zinc-400 mb-1">
                Our team will contact{" "}
                <span className="text-amber-400 font-bold">{form.contactName || "you"}</span> within 24 hours.
              </p>
              <p className="text-zinc-500 text-sm mb-8">
                Venue: <span className="text-white font-semibold">{form.venueName}</span> ·{" "}
                Plan: <span className="text-amber-400 font-semibold">{selectedPlanData?.title}</span>
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ venueName: "", contactName: "", email: "", phone: "", message: "" });
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black hover:from-amber-400 transition-all"
              >
                Submit Another
              </button>
            </div>
          ) : (
            /* ── Form ─── */
            <>
              <h3 className="text-2xl font-black text-center mb-1">Request Your Listing</h3>
              <p className="text-zinc-400 text-center text-sm mb-8">
                Selected plan:{" "}
                <span className="text-amber-400 font-bold">
                  {selectedPlanData?.title || selectedPlan}
                </span>
                {" · "}
                <span className="text-amber-300">{selectedPlanData?.price}</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  id="venue-name"
                  required
                  placeholder="Venue / Nightclub Name"
                  value={form.venueName}
                  onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                  className={inputClass}
                />
                <input
                  id="contact-name"
                  required
                  placeholder="Your Name (Contact Person)"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className={inputClass}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    id="contact-email"
                    required
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    id="contact-phone"
                    required
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <textarea
                  id="venue-message"
                  placeholder="Tell us about your venue — vibe, capacity, social handles… (optional)"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />

                <button
                  id="submit-listing"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-base hover:from-amber-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    `Submit Request — ${selectedPlanData?.price || ""} →`
                  )}
                </button>
              </form>

              <p className="text-center text-zinc-600 text-xs mt-6 italic">
                One night. One password. Access Granted.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default ListYourVenue;
