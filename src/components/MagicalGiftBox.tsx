import type { MouseEvent } from 'react';
import { UNIVERSE_CONFIG } from '../config/universeConfig';

interface MagicalGiftBoxProps {
  visible: boolean;
  opening: boolean;
  onOpenGift: () => void;
}

export function MagicalGiftBox({
  visible,
  opening,
  onOpenGift,
}: MagicalGiftBoxProps) {
  const handleTap = (e: MouseEvent<HTMLButtonElement>) => {
    if (opening) return;
    e.currentTarget.blur();
    onOpenGift();
  };

  return (
    <div
      className={`relative z-30 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
        visible
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
      }`}
      style={{ perspective: '950px' }}
    >
      <p
        className={`font-display text-[clamp(1.5rem,5vw,2.6rem)] font-medium tracking-wide text-white mb-[clamp(1rem,3vh,2.25rem)] transition-all duration-700 ${
          opening ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'
        }`}
        style={{
          textShadow: '0 0 22px rgba(192, 132, 252, 0.5)',
        }}
      >
        {UNIVERSE_CONFIG.scene5.title}
      </p>

      {/* Interactive 3D Floating Dark Violet & Golden Ribbon Gift Box */}
      <button
        type="button"
        onClick={handleTap}
        disabled={opening}
        aria-label="Open your little magical gift box"
        className={`relative group flex items-center justify-center w-[clamp(138px,min(38vw,32vh),204px)] h-[clamp(138px,min(38vw,32vh),204px)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/90 rounded-2xl ${
          opening ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        {/* Outer aura */}
        <div
          className={`absolute -inset-6 rounded-full transition-all duration-[1200ms] ease-out ${
            opening ? 'scale-150 opacity-100' : 'scale-100 opacity-75 animate-aura-pulse'
          }`}
          style={{
            background: opening
              ? 'radial-gradient(circle, rgba(253, 230, 138, 0.45) 0%, rgba(232, 121, 249, 0.35) 45%, transparent 76%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.36) 0%, rgba(251, 191, 36, 0.16) 52%, transparent 76%)',
          }}
        />

        <div className="relative w-[84%] h-[84%] animate-gentle-bob flex flex-col items-center justify-end">
          {/* Emerging soft golden-violet light beam when lid opens */}
          <div
            className={`absolute bottom-12 w-24 sm:w-32 h-28 sm:h-32 rounded-full pointer-events-none transition-all duration-[1200ms] ease-out ${
              opening ? 'opacity-100 scale-125 -translate-y-8' : 'opacity-0 scale-75'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(253,230,138,0.65) 35%, rgba(217,70,239,0.28) 68%, transparent 100%)',
            }}
          />

          {/* 3D Gift Lid with Golden Bow */}
          <div
            className="relative z-20 w-[108%] h-[24%] rounded-xl border border-amber-200/45 transition-all duration-[1100ms] ease-out"
            style={{
              transformOrigin: 'top center',
              transform: opening
                ? 'perspective(700px) translateY(-34px) rotateX(-110deg) scale(0.95)'
                : 'perspective(700px) translateY(4px) rotateX(0deg)',
              opacity: opening ? 0 : 1,
              background:
                'linear-gradient(135deg, #4c1d95 0%, #2e1065 60%, #581c87 100%)',
              boxShadow:
                '0 10px 24px rgba(3, 4, 14, 0.65), inset 0 1px 0 rgba(253, 230, 138, 0.4)',
            }}
          >
            <div
              className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 sm:w-5 transition-all duration-700 ${
                opening ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
              }`}
              style={{
                background:
                  'linear-gradient(180deg, #fde68a 0%, #f59e0b 55%, #b45309 100%)',
              }}
            />

            <div
              className={`absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 transition-all duration-700 ${
                opening ? 'scale-50 opacity-0 -translate-y-4' : 'scale-100 opacity-100'
              }`}
            >
              <span
                className="w-5 h-4 sm:w-6 sm:h-5 rounded-full border-2 border-amber-200/80 -rotate-12"
                style={{
                  background: 'rgba(251, 191, 36, 0.28)',
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.55)',
                }}
              />
              <span
                className="w-5 h-4 sm:w-6 sm:h-5 rounded-full border-2 border-amber-200/80 rotate-12"
                style={{
                  background: 'rgba(251, 191, 36, 0.28)',
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.55)',
                }}
              />
            </div>
          </div>

          {/* 3D Gift Base Box */}
          <div
            className="relative z-10 w-full h-[64%] rounded-b-2xl rounded-t-md border border-violet-300/30 overflow-hidden transition-all duration-1000"
            style={{
              opacity: opening ? 0.25 : 1,
              transform: opening ? 'scale(0.92) translateY(12px)' : 'scale(1)',
              background:
                'linear-gradient(160deg, #3b0764 0%, #1e1042 58%, #13092b 100%)',
              boxShadow:
                '0 20px 44px rgba(3, 4, 14, 0.78), inset 0 1px 0 rgba(245, 208, 254, 0.25)',
            }}
          >
            <div
              className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 sm:w-5 transition-all duration-700 ${
                opening ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
              }`}
              style={{
                background:
                  'linear-gradient(90deg, #d97706 0%, #fde68a 50%, #d97706 100%)',
                boxShadow: '0 0 14px rgba(251, 191, 36, 0.4)',
              }}
            />
            <div
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 transition-all duration-700 ${
                opening ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'
              }`}
              style={{
                background:
                  'linear-gradient(180deg, #fde68a 0%, #f59e0b 55%, #b45309 100%)',
              }}
            />
          </div>
        </div>
      </button>

      {/* Action Button */}
      <div
        className={`mt-[clamp(1rem,3vh,2rem)] transition-all duration-700 ${
          opening ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          type="button"
          onClick={handleTap}
          disabled={opening}
          className="inline-flex items-center justify-center min-h-[46px] px-7 py-3 rounded-full text-sm sm:text-base font-medium text-white whitespace-nowrap shrink-0 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03040c]"
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.42) 0%, rgba(236, 72, 153, 0.34) 55%, rgba(251, 191, 36, 0.32) 100%)',
            border: '1px solid rgba(253, 230, 138, 0.45)',
            boxShadow: '0 0 24px rgba(251, 191, 36, 0.25)',
          }}
        >
          {UNIVERSE_CONFIG.scene5.openGiftButton}
        </button>
      </div>
    </div>
  );
}
