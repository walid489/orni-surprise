import { useId } from 'react';

interface EnchantedFlowerProps {
  visible: boolean;
  isOpen: boolean;
}

const OUTER_PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const MID_PETAL_ANGLES = [30, 90, 150, 210, 270, 330];
const INNER_PETAL_ANGLES = [0, 72, 144, 216, 288];

export function EnchantedFlower({ visible, isOpen }: EnchantedFlowerProps) {
  const uid = useId().replace(/:/g, '');

  return (
    <div
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none transition-all duration-[1500ms] ease-out ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center w-[clamp(230px,min(82vw,68vh),470px)] h-[clamp(230px,min(82vw,68vh),470px)]">
        {/* Soft golden-violet-pink crystal aura */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-[2000ms] ease-out ${
            isOpen ? 'opacity-90 scale-115' : 'opacity-45 scale-75'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(232, 121, 249, 0.26) 36%, rgba(96, 165, 250, 0.16) 60%, transparent 78%)',
          }}
        />

        {/* 3D Layered Crystal Flower Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: isOpen
              ? 'rotateX(16deg) scale(1.05)'
              : 'rotateX(34deg) scale(0.84)',
            transition: 'transform 2.1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Radiant Soft Golden Core */}
          <div
            className={`absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full transition-all duration-[2000ms] ease-out ${
              isOpen ? 'opacity-90 scale-125' : 'opacity-40 scale-75'
            }`}
            style={{
              transform: 'translateZ(18px)',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(253,230,138,0.55) 34%, rgba(244,114,182,0.3) 65%, transparent 100%)',
            }}
          />

          {/* Outer Crystal Petals (Deep Sapphire Blue -> Amethyst Violet) */}
          {OUTER_PETAL_ANGLES.map((angle, i) => (
            <div
              key={`outer-${angle}`}
              className="absolute left-1/2 top-1/2 w-[26%] h-[46%]"
              style={{
                transformOrigin: '50% 92%',
                transformStyle: 'preserve-3d',
                transform: `translate(-50%, -92%) rotateZ(${angle}deg) rotateX(${isOpen ? -64 : -14}deg) translateZ(2px)`,
                transition: `transform 2.0s cubic-bezier(0.22, 1, 0.36, 1) ${i * 55}ms`,
              }}
            >
              <svg viewBox="0 0 80 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient
                    id={`crystal-outer-${uid}-${i}`}
                    x1="20%"
                    y1="0%"
                    x2="80%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.62" />
                    <stop offset="46%" stopColor="#818cf8" stopOpacity="0.46" />
                    <stop offset="100%" stopColor="#3b0764" stopOpacity="0.58" />
                  </linearGradient>
                </defs>
                <path
                  d="M40 4 L66 56 L58 110 L40 134 L22 110 L14 56 Z"
                  fill={`url(#crystal-outer-${uid}-${i})`}
                  stroke="rgba(196, 181, 253, 0.45)"
                  strokeWidth="1.2"
                />
                <path
                  d="M40 6 L40 132 M14 56 L40 72 L66 56"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="0.9"
                />
              </svg>
            </div>
          ))}

          {/* Mid Crystal Petals (Violet -> Luminous Pink) */}
          {MID_PETAL_ANGLES.map((angle, i) => (
            <div
              key={`mid-${angle}`}
              className="absolute left-1/2 top-1/2 w-[22%] h-[39%]"
              style={{
                transformOrigin: '50% 92%',
                transformStyle: 'preserve-3d',
                transform: `translate(-50%, -92%) rotateZ(${angle}deg) rotateX(${isOpen ? -48 : -8}deg) translateZ(10px)`,
                transition: `transform 1.9s cubic-bezier(0.22, 1, 0.36, 1) ${140 + i * 55}ms`,
              }}
            >
              <svg viewBox="0 0 80 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient
                    id={`crystal-mid-${uid}-${i}`}
                    x1="20%"
                    y1="0%"
                    x2="80%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#e879f9" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#581c87" stopOpacity="0.54" />
                  </linearGradient>
                </defs>
                <path
                  d="M40 6 L64 58 L54 112 L40 132 L26 112 L16 58 Z"
                  fill={`url(#crystal-mid-${uid}-${i})`}
                  stroke="rgba(245, 208, 254, 0.5)"
                  strokeWidth="1.2"
                />
                <path
                  d="M40 8 L40 130"
                  stroke="rgba(253, 230, 138, 0.3)"
                  strokeWidth="0.9"
                />
              </svg>
            </div>
          ))}

          {/* Inner Crystal Petals (Soft Gold & Pearlescent Pink) */}
          {INNER_PETAL_ANGLES.map((angle, i) => (
            <div
              key={`inner-${angle}`}
              className="absolute left-1/2 top-1/2 w-[17%] h-[31%]"
              style={{
                transformOrigin: '50% 92%',
                transformStyle: 'preserve-3d',
                transform: `translate(-50%, -92%) rotateZ(${angle}deg) rotateX(${isOpen ? -28 : 4}deg) translateZ(18px)`,
                transition: `transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${260 + i * 60}ms`,
              }}
            >
              <svg viewBox="0 0 80 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient
                    id={`crystal-inner-${uid}-${i}`}
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.72" />
                    <stop offset="52%" stopColor="#f472b6" stopOpacity="0.48" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <path
                  d="M40 10 L60 56 L52 108 L40 128 L28 108 L20 56 Z"
                  fill={`url(#crystal-inner-${uid}-${i})`}
                  stroke="rgba(255, 255, 255, 0.58)"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
