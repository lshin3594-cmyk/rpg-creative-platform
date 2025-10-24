interface Vein {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  color: string;
  delay: string;
}

interface BackgroundVeinsProps {
  veins: Vein[];
}

export const BackgroundVeins = ({ veins }: BackgroundVeinsProps) => {
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {veins.map((vein, index) => (
        <line
          key={index}
          x1={vein.x1}
          y1={vein.y1}
          x2={vein.x2}
          y2={vein.y2}
          stroke={vein.color}
          strokeWidth="3"
          filter="url(#glow)"
          style={{
            animation: `pulse-slow 3s ease-in-out infinite`,
            animationDelay: vein.delay
          }}
        />
      ))}
    </svg>
  );
};
