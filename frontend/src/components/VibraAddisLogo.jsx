import { useRef, useEffect } from "react";
import logoVideo from "../assets/videos/vibra-addis-logo.mp4";

function VibraAddisLogo({ size = "lg", className = "" }) {
  const videoRef = useRef(null);

  const dimensions = {
    sm: { box: "w-20 h-20", text: "text-2xl", waves: 48 },
    md: { box: "w-24 h-24 sm:w-28 sm:h-28", text: "text-2xl sm:text-3xl", waves: 64 },
    lg: { box: "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44", text: "text-3xl sm:text-4xl md:text-5xl", waves: 80 },
  }[size] || { box: "w-28 h-28 sm:w-36 sm:h-36", text: "text-3xl sm:text-4xl", waves: 80 };

  // Force-play on mobile — some mobile browsers need an explicit play() call
  // even with autoPlay + muted + playsInline attributes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented — try again on user interaction
          const retryPlay = () => {
            video.play().catch(() => {});
            document.removeEventListener("touchstart", retryPlay);
            document.removeEventListener("click", retryPlay);
          };
          document.addEventListener("touchstart", retryPlay, { once: true });
          document.addEventListener("click", retryPlay, { once: true });
        });
      }
    };

    // Try immediately
    tryPlay();

    // Also retry when the video data is loaded
    video.addEventListener("loadeddata", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, []);

  return (
    <div className={`flex flex-col items-center gap-3 sm:gap-4 ${className}`}>
      <div
        className={`relative ${dimensions.box} rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 p-[3px] shadow-[0_0_40px_rgba(168,85,247,0.45)]`}
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={logoVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ WebkitTransform: 'translateZ(0)' }}
          />
        </div>
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-500" style={{ animationDuration: "3s" }} />
      </div>

      <div className="text-center">
        <h1
          className={`font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 ${dimensions.text}`}
        >
          VibraAddis
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1 tracking-widest uppercase">Feel Addis</p>
      </div>
    </div>
  );
}

export default VibraAddisLogo;
