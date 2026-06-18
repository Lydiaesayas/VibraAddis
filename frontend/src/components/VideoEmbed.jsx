import { useState } from "react";

function VideoEmbed({ url, className = "" }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!url) return null;

  // Parse video URL to determine platform and extract ID
  const getVideoEmbed = (url) => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
      } else {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      }
      return {
        platform: "youtube",
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    }

    // Instagram
    if (url.includes("instagram.com")) {
      return {
        platform: "instagram",
        embedUrl: null, // Instagram requires API for embedding
        thumbnail: null,
      };
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      return {
        platform: "tiktok",
        embedUrl: null, // TikTok requires API for embedding
        thumbnail: null,
      };
    }

    // Direct MP4 video
    if (url.endsWith(".mp4")) {
      return {
        platform: "direct",
        embedUrl: url,
        thumbnail: null,
      };
    }

    return {
      platform: "unknown",
      embedUrl: null,
      thumbnail: null,
    };
  };

  const videoInfo = getVideoEmbed(url);

  if (videoInfo.platform === "unknown" || error) {
    return (
      <div className={`bg-zinc-800 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <p className="text-zinc-400 text-sm">Video not available</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 text-xs hover:underline mt-2 inline-block"
          >
            Watch on {videoInfo.platform === "instagram" ? "Instagram" : videoInfo.platform === "tiktok" ? "TikTok" : "external site"}
          </a>
        </div>
      </div>
    );
  }

  if (videoInfo.platform === "youtube") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <iframe
          className="w-full h-full object-cover"
          src={videoInfo.embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
        {loading && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  if (videoInfo.platform === "direct") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={videoInfo.embedUrl}
          onLoadStart={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onError={() => setError(true)}
        />
        {loading && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // Instagram and TikTok - show link to external
  return (
    <div className={`bg-zinc-900 flex items-center justify-center ${className}`}>
      <div className="text-center p-6">
        <p className="text-white font-semibold mb-2">
          {videoInfo.platform === "instagram" ? "📸 Instagram" : "🎵 TikTok"}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
        >
          Watch on {videoInfo.platform === "instagram" ? "Instagram" : "TikTok"}
        </a>
      </div>
    </div>
  );
}

export default VideoEmbed;
