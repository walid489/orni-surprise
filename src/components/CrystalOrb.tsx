import type { MouseEvent } from 'react';

interface CrystalOrbProps {
  visible: boolean;
  opening: boolean;
  interactive: boolean;
  onActivate: () => void;
}

const ORBIT_PARTICLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function CrystalOrb({
  visible,
  opening,
  interactive,
  onActivate,
}: CrystalOrbProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    e.currentTarget.blur();
    onActivate();
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-[1300ms] ease-out ${
        visible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      {/* Circular magical energy wave expanding outward on tap */}
      <div
        className={`absolute w-36 h-36 sm:w-52 sm:h-52 rounded-full border border-violet-300/65 pointer-events-none transition-all duration-[1400ms] ease-out ${
          opening ? 'scale-[2.6] opacity-0' : 'scale-90 opacity-0'
        }`}
        aria-hidden="true"
        style={{
          boxShadow: '0 0 24px rgba(168, 85, 247, 0.4)',
        }}
      />
      <div
        className={`absolute w-36 h-36 sm:w-52 sm:h-52 rounded-full border border-sky-300/50 pointer-events-none transition-all duration-[1750ms] delay-150 ease-out ${
          opening ? 'scale-[3.1] opacity-0' : 'scale-90 opacity-0'
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute w-36 h-36 sm:w-52 sm:h-52 rounded-full border border-amber-200/45 pointer-events-none transition-all duration-[2000ms] delay-300 ease-out ${
          opening ? 'scale-[3.5] opacity-0' : 'scale-90 opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Tiny light particles rotating rapidly around the orb when opening */}
      <div
        className={`absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full pointer-events-none transition-all duration-1000 ${
          opening ? 'opacity-100 scale-110 animate-orb-fast' : 'opacity-0 scale-75'
        }`}
        aria-hidden="true"
      >
        {ORBIT_PARTICLES.map((deg, idx) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full"
            style={{
              backgroundColor:
                idx % 3 === 0 ? '#fde68a' : idx % 3 === 1 ? '#f472b6' : '#93c5fd',
              transform: `rotate(${deg}deg) translateX(clamp(72px, min(20vw, 18vh), 118px))`,
              boxShadow: '0 0 10px rgba(244, 114, 182, 0.8)',
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={!interactive}
        aria-label="Touch the glowing crystal orb to discover"
        className={`relative group flex items-center justify-center w-[clamp(134px,min(38vw,34vh),216px)] h-[clamp(134px,min(38vw,34vh),216px)] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/90 ${
          interactive ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Outer soft pulsing purple & blue glow */}
        <div
          className={`absolute -inset-6 rounded-full transition-all duration-[1100ms] ease-out ${
            opening ? 'scale-150 opacity-100' : 'scale-100 opacity-80 animate-aura-pulse'
          }`}
          style={{
            background: opening
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.42) 0%, rgba(192, 132, 252, 0.45) 38%, rgba(96, 165, 250, 0.24) 64%, transparent 80%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.42) 0%, rgba(59, 130, 246, 0.24) 48%, transparent 74%)',
          }}
        />

        {/* Radiant inner core revealed as orb splits open */}
        <div
          className={`absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full transition-all duration-1000 ease-out ${
            opening ? 'scale-125 opacity-100' : 'scale-75 opacity-60'
          }`}
          style={{
            background:
              'radial-gradient(circle, #ffffff 0%, #fde68a 26%, #e879f9 58%, rgba(139, 92, 246, 0) 100%)',
          }}
        />

        {/* Upper Crystal Hemisphere with explicit 3D perspective */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden transition-all duration-[1200ms] ease-out"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 53%, 0 53%)',
            transform: opening
              ? 'perspective(700px) translateY(-2.2rem) rotateX(36deg) scale(0.95)'
              : 'perspective(700px) translateY(0) rotateX(0deg) scale(1)',
            opacity: opening ? 0 : 1,
            background:
              'radial-gradient(circle at 34% 26%, rgba(255, 255, 255, 0.45) 0%, rgba(168, 85, 247, 0.34) 30%, rgba(59, 130, 246, 0.28) 62%, rgba(17, 13, 46, 0.85) 100%)',
            border: '1.5px solid rgba(196, 181, 253, 0.5)',
            boxShadow:
              'inset 0 8px 22px rgba(255, 255, 255, 0.28), inset 0 -10px 24px rgba(139, 92, 246, 0.38)',
          }}
        >
          <div
            className="absolute top-[10%] left-[18%] w-[38%] h-[22%] rounded-full"
            style={{
              transform: 'rotate(-24deg)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>

        {/* Lower Crystal Hemisphere */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden transition-all duration-[1200ms] ease-out"
          style={{
            clipPath: 'polygon(0 49%, 100% 49%, 100% 100%, 0 100%)',
            transform: opening
              ? 'perspective(700px) translateY(2.2rem) rotateX(-36deg) scale(0.95)'
              : 'perspective(700px) translateY(0) rotateX(0deg) scale(1)',
            opacity: opening ? 0 : 1,
            background:
              'radial-gradient(circle at 50% 62%, rgba(244, 114, 182, 0.32) 0%, rgba(109, 40, 217, 0.45) 48%, rgba(12, 11, 38, 0.9) 100%)',
            border: '1.5px solid rgba(147, 197, 253, 0.42)',
            boxShadow: 'inset 0 -10px 24px rgba(96, 165, 250, 0.28)',
          }}
        />

        {/* Subtle rotation + internal moving light particles inside the glass orb */}
        <div
          className={`relative w-[82%] h-[82%] rounded-full border border-white/20 flex items-center justify-center transition-all duration-1000 ${
            opening ? 'scale-125 opacity-0' : 'scale-100 opacity-95 animate-orb-spin'
          }`}
        >
          <div className="w-[74%] h-[74%] rounded-full border border-sky-200/25 rotate-45" />
          <span
            className="absolute top-3 left-1/2 w-1.5 h-1.5 rounded-full bg-amber-100"
            style={{ boxShadow: '0 0 8px #fde68a' }}
          />
          <span
            className="absolute bottom-4 right-5 w-1.5 h-1.5 rounded-full bg-fuchsia-200"
            style={{ boxShadow: '0 0 8px #f472b6' }}
          />
          <span
            className="absolute top-1/2 left-3 w-1.5 h-1.5 rounded-full bg-sky-200"
            style={{ boxShadow: '0 0 8px #93c5fd' }}
          />
          <div
            className="w-3.5 h-3.5 rounded-full bg-white"
            style={{
              boxShadow:
                '0 0 18px 6px rgba(251, 191, 36, 0.55), 0 0 32px 10px rgba(192, 132, 252, 0.55)',
            }}
          />
        </div>
      </button>
    </div>
  );
}
