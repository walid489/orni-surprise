import { useId } from 'react';
import type { CSSProperties } from 'react';

export type ButterflyPalette = 'violet' | 'rose' | 'celestial' | 'garden';

interface LuminousButterflyProps {
  size?: number;
  flapDuration?: string;
  bobDuration?: string;
  palette?: ButterflyPalette;
  className?: string;
  glowIntensity?: 'soft' | 'bright';
  enableDropShadow?: boolean;
}

const PALETTES: Record<
  ButterflyPalette,
  {
    upperStart: string;
    upperMid: string;
    upperEnd: string;
    lowerStart: string;
    lowerEnd: string;
    vein: string;
    glow: string;
    body: string;
  }
> = {
  garden: {
    upperStart: '#93c5fd',
    upperMid: '#a855f7',
    upperEnd: '#f472b6',
    lowerStart: '#60a5fa',
    lowerEnd: '#ec4899',
    vein: '#fdf4ff',
    glow: 'rgba(192, 132, 252, 0.56)',
    body: '#f5d0fe',
  },
  violet: {
    upperStart: '#fbcfe8',
    upperMid: '#e879f9',
    upperEnd: '#7c3aed',
    lowerStart: '#c084fc',
    lowerEnd: '#60a5fa',
    vein: '#fdf4ff',
    glow: 'rgba(217, 70, 239, 0.5)',
    body: '#f5d0fe',
  },
  rose: {
    upperStart: '#fff1f2',
    upperMid: '#f472b6',
    upperEnd: '#9333ea',
    lowerStart: '#f9a8d4',
    lowerEnd: '#a78bfa',
    vein: '#fff1f2',
    glow: 'rgba(244, 114, 182, 0.45)',
    body: '#fce7f3',
  },
  celestial: {
    upperStart: '#e0f2fe',
    upperMid: '#93c5fd',
    upperEnd: '#7c3aed',
    lowerStart: '#a5b4fc',
    lowerEnd: '#f0abfc',
    vein: '#f0f9ff',
    glow: 'rgba(147, 197, 253, 0.45)',
    body: '#e0e7ff',
  },
};

export function LuminousButterfly({
  size = 120,
  flapDuration = '0.52s',
  bobDuration = '3.6s',
  palette = 'violet',
  className = '',
  glowIntensity = 'bright',
  enableDropShadow = true,
}: LuminousButterflyProps) {
  const uid = useId().replace(/:/g, '');
  const colors = PALETTES[palette];

  const styleVars = {
    '--flap-duration': flapDuration,
    '--bob-duration': bobDuration,
  } as CSSProperties;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size, ...styleVars }}
      aria-hidden="true"
    >
      {/* Pure radial gradient halo (zero expensive CSS blur filter for mobile GPU speed) */}
      <div
        className="absolute inset-0 rounded-full animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, rgba(139, 92, 246, 0.16) 44%, transparent 72%)`,
          transform: glowIntensity === 'bright' ? 'scale(1.38)' : 'scale(1.12)',
        }}
      />

      <div className="relative w-full h-full animate-gentle-bob flex items-center justify-center">
        <svg
          viewBox="0 0 200 180"
          className="w-full h-full overflow-visible"
          style={
            enableDropShadow && glowIntensity === 'bright'
              ? { filter: `drop-shadow(0 0 10px ${colors.glow})` }
              : undefined
          }
        >
          <defs>
            <linearGradient id={`upper-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.upperStart} stopOpacity="0.96" />
              <stop offset="48%" stopColor={colors.upperMid} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colors.upperEnd} stopOpacity="0.82" />
            </linearGradient>

            <linearGradient id={`lower-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.lowerStart} stopOpacity="0.92" />
              <stop offset="100%" stopColor={colors.lowerEnd} stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor={colors.body} />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {/* Left Wings */}
          <g className="animate-wing-left" style={{ transformOrigin: '100px 92px' }}>
            <path
              d="M97 86 C76 42, 22 18, 16 52 C12 76, 46 96, 95 94 Z"
              fill={`url(#upper-${uid})`}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.2"
            />
            <path
              d="M96 96 C66 96, 26 112, 38 140 C48 164, 84 146, 97 108 Z"
              fill={`url(#lower-${uid})`}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.1"
            />
            <path
              d="M94 87 C68 68, 42 52, 26 48 M92 90 C66 80, 42 74, 24 68 M94 99 C72 110, 56 124, 46 138"
              fill="none"
              stroke={colors.vein}
              strokeOpacity="0.48"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="34" cy="48" r="3" fill="#ffffff" fillOpacity="0.75" />
            <circle cx="27" cy="60" r="1.8" fill="#fdf4ff" fillOpacity="0.65" />
            <circle cx="48" cy="136" r="2.3" fill="#ffffff" fillOpacity="0.68" />
          </g>

          {/* Right Wings */}
          <g className="animate-wing-right" style={{ transformOrigin: '100px 92px' }}>
            <path
              d="M103 86 C124 42, 178 18, 184 52 C188 76, 154 96, 105 94 Z"
              fill={`url(#upper-${uid})`}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.2"
            />
            <path
              d="M104 96 C134 96, 174 112, 162 140 C152 164, 116 146, 103 108 Z"
              fill={`url(#lower-${uid})`}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.1"
            />
            <path
              d="M106 87 C132 68, 158 52, 174 48 M108 90 C134 80, 158 74, 176 68 M106 99 C128 110, 144 124, 154 138"
              fill="none"
              stroke={colors.vein}
              strokeOpacity="0.48"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="166" cy="48" r="3" fill="#ffffff" fillOpacity="0.75" />
            <circle cx="173" cy="60" r="1.8" fill="#fdf4ff" fillOpacity="0.65" />
            <circle cx="152" cy="136" r="2.3" fill="#ffffff" fillOpacity="0.68" />
          </g>

          {/* Body & Antennae */}
          <g>
            <path
              d="M99 68 C94 52, 86 42, 79 38"
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="79" cy="38" r="1.7" fill="#fbcfe8" />

            <path
              d="M101 68 C106 52, 114 42, 121 38"
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="121" cy="38" r="1.7" fill="#fbcfe8" />

            <ellipse cx="100" cy="78" rx="3.4" ry="8" fill={`url(#body-${uid})`} />
            <path
              d="M97.4 85 C97.2 104, 98.2 120, 100 126 C101.8 120, 102.8 104, 102.6 85 Z"
              fill={`url(#body-${uid})`}
            />
            <circle cx="100" cy="69" r="3" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </div>
  );
}
