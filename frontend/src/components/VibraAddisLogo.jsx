import LogoMark from "./LogoMark";

function VibraAddisLogo({ size = "lg", className = "" }) {
  const dimensions = {
    sm: { box: "w-20 h-20", text: "text-2xl" },
    md: { box: "w-24 h-24 sm:w-28 sm:h-28", text: "text-2xl sm:text-3xl" },
    lg: { box: "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44", text: "text-3xl sm:text-4xl md:text-5xl" },
  }[size] || { box: "w-28 h-28 sm:w-36 sm:h-36", text: "text-3xl sm:text-4xl" };

  return (
    <div className={`flex flex-col items-center gap-3 sm:gap-4 ${className}`}>
      <div
        className={`relative ${dimensions.box} rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 p-[3px] shadow-[0_0_40px_rgba(168,85,247,0.45)]`}
      >
        <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
          <LogoMark className="w-full h-full" />
        </div>
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-500 pointer-events-none"
          style={{ animationDuration: "3s" }}
        />
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
