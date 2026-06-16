import { useRef, useEffect, useState } from "react";
import logoVideo from "../assets/videos/vibra-addis-logo.mp4";
import logoImage from "../assets/images/logo.jpg";

function LogoSvg({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="logoFallbackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M18 55 Q28 25 38 55 T58 55 T78 55"
        stroke="url(#logoFallbackGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <text x="50" y="58" textAnchor="middle" fill="url(#logoFallbackGrad)" fontSize="36" fontWeight="800">
        V
      </text>
    </svg>
  );
}

function LogoMark({ className = "w-full h-full", useVideo = true }) {
  const videoRef = useRef(null);
  const [mode, setMode] = useState(useVideo ? "video" : "image");

  useEffect(() => {
    if (mode !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setMode("image"));
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("error", () => setMode("image"));

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, [mode]);

  if (mode === "video") {
    return (
      <video
        ref={videoRef}
        src={logoVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`${className} object-cover`}
        style={{ WebkitTransform: "translateZ(0)" }}
        onError={() => setMode("image")}
      />
    );
  }

  if (mode === "image") {
    return (
      <img
        src={logoImage}
        alt="VibraAddis"
        className={`${className} object-cover`}
        onError={() => setMode("svg")}
      />
    );
  }

  return <LogoSvg className={`${className} p-[18%]`} />;
}

export default LogoMark;
