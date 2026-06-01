import { useState, useEffect } from "react";
import logoVideo from "../assets/videos/vibra-addis-logo.mp4";

function VibraAddisLogo({ size = "lg", className = "" }) {
  const [videoError, setVideoError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // More robust mobile detection and always use fallback on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      
      return isMobileDevice || isTouchDevice || isSmallScreen;
    };
    
    setUseFallback(checkMobile());
    
    // Also check for video support
    const checkVideoSupport = () => {
      const video = document.createElement('video');
      const canPlay = video.canPlayType('video/mp4');
      return canPlay === 'probably' || canPlay === 'maybe';
    };
    
    if (!checkVideoSupport()) {
      setUseFallback(true);
    }
  }, []);

  const dimensions = {
    sm: { box: "w-20 h-20", text: "text-2xl", waves: 48 },
    md: { box: "w-28 h-28", text: "text-3xl", waves: 64 },
    lg: { box: "w-36 h-36 md:w-44 md:h-44", text: "text-4xl md:text-5xl", waves: 80 },
  }[size] || { box: "w-36 h-36", text: "text-4xl", waves: 80 };

  // Fallback icon for mobile or when video fails
  const renderFallbackIcon = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-pink-600/30 animate-gradient">
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 animate-pulse">
          VA
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className={`relative ${dimensions.box} rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 p-[3px] shadow-[0_0_40px_rgba(168,85,247,0.45)]`}
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
          {useFallback || videoError ? (
            renderFallbackIcon()
          ) : (
            <video
              src={logoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              onError={() => {
                console.log('Video error, using fallback');
                setVideoError(true);
              }}
              onLoadStart={() => setVideoError(false)}
              onLoadedData={() => console.log('Video loaded successfully')}
            />
          )}
        </div>
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-500" style={{ animationDuration: "3s" }} />
      </div>

      <div className="text-center">
        <h1
          className={`font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 ${dimensions.text}`}
        >
          VibraAddis
        </h1>
        <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase">Feel Addis</p>
      </div>
    </div>
  );
}

export default VibraAddisLogo;
