export const MidnightBackground = () => {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-blue-200/60 animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full bg-blue-300/20 blur-3xl animate-pulse-slow" />
          <div className="absolute inset-4 rounded-full bg-blue-200/30 blur-2xl" />
          <div className="absolute inset-8 rounded-full bg-blue-100/40 blur-xl" />
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_30px_rgba(96,165,250,0.5)]"
          >
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#moonGradient)"
              className="animate-glow"
            />
            <circle cx="60" cy="40" r="8" fill="rgba(30, 58, 138, 0.2)" />
            <circle cx="45" cy="55" r="5" fill="rgba(30, 58, 138, 0.15)" />
            <circle cx="55" cy="65" r="6" fill="rgba(30, 58, 138, 0.1)" />
            <defs>
              <radialGradient id="moonGradient" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="50%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#93c5fd" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-950/20 to-transparent" />
    </div>
  );
};
