import type { MouseEvent } from 'react';
import { UNIVERSE_CONFIG } from '../config/universeConfig';

interface MagicalEnvelopeProps {
  visible: boolean;
  tapped: boolean;
  flapOpen: boolean;
  cardRaised: boolean;
  cardUnfolded: boolean;
  dissolving: boolean;
  onOpenEnvelope: () => void;
  onContinue: () => void;
}

export function MagicalEnvelope({
  visible,
  tapped,
  flapOpen,
  cardRaised,
  cardUnfolded,
  dissolving,
  onOpenEnvelope,
  onContinue,
}: MagicalEnvelopeProps) {
  const handleEnvelopeTap = (e: MouseEvent<HTMLButtonElement>) => {
    if (tapped) return;
    e.currentTarget.blur();
    onOpenEnvelope();
  };

  // Single unified transform for raising & unfolding the letter card (prevents CSS translate+transform double-offset bug)
  const cardTransform = cardRaised
    ? cardUnfolded
      ? 'translateY(-4.4rem) rotateX(0deg) scaleY(1)'
      : 'translateY(-2.8rem) rotateX(-46deg) scaleY(0.76)'
    : 'translateY(1rem) rotateX(-68deg) scaleY(0.65)';

  return (
    <div
      className={`relative z-30 flex flex-col items-center justify-center w-[min(90vw,400px)] mx-auto transition-all duration-1000 ease-out ${
        dissolving
          ? 'opacity-0 scale-110 pointer-events-none'
          : visible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
      }`}
      style={{ perspective: '1050px' }}
    >
      {/* Gentle floating motion + subtle tap rotation */}
      <div
        className="relative w-full flex flex-col items-center animate-gentle-bob transition-transform duration-700 ease-out"
        style={{
          transform: tapped && !flapOpen ? 'rotateZ(-2.5deg) rotateY(8deg)' : undefined,
        }}
      >
        {/* Soft aura behind envelope */}
        <div
          className="absolute -inset-6 rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle, rgba(192, 132, 252, 0.28) 0%, rgba(251, 191, 36, 0.14) 50%, transparent 74%)',
          }}
        />

        {/* Envelope Body (fluid height for portrait + landscape phones) */}
        <div className="relative w-full h-[clamp(176px,32vh,240px)] mt-[clamp(3.75rem,11vh,5.5rem)]">
          {/* Interactive tap target over closed envelope */}
          {!tapped && (
            <button
              type="button"
              onClick={handleEnvelopeTap}
              aria-label="Tap the glowing envelope to open your secret letter"
              className="absolute inset-0 z-40 rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/90"
            />
          )}

          {/* Envelope Back Interior */}
          <div
            className="absolute inset-0 rounded-2xl border border-amber-200/35"
            style={{
              background:
                'linear-gradient(160deg, #24124d 0%, #110a2e 60%, #271354 100%)',
              boxShadow:
                '0 18px 46px rgba(3, 4, 14, 0.72), 0 0 28px rgba(168, 85, 247, 0.25)',
            }}
          />

          {/* Rising & Unfolding Letter Card */}
          <div
            className={`absolute left-2.5 right-2.5 sm:left-4 sm:right-4 rounded-2xl px-4 py-5 sm:px-7 sm:py-7 text-center border border-amber-100/30 transition-all duration-[1150ms] ease-out ${
              cardRaised ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'
            }`}
            style={{
              transformOrigin: 'bottom center',
              transform: cardTransform,
              background:
                'linear-gradient(165deg, rgba(32, 20, 72, 0.97) 0%, rgba(18, 13, 46, 0.98) 65%, rgba(68, 26, 98, 0.96) 100%)',
              boxShadow:
                '0 16px 38px rgba(3, 4, 14, 0.68), inset 0 1px 0 rgba(253, 230, 138, 0.32)',
            }}
          >
            <p className="font-display text-[clamp(1.25rem,4.5vw,1.75rem)] font-medium text-amber-100 tracking-wide">
              {UNIVERSE_CONFIG.scene3.greeting}
            </p>
            <p className="font-body mt-2 text-[clamp(0.9rem,2.6vw,1.1rem)] leading-relaxed text-fuchsia-100/95">
              {UNIVERSE_CONFIG.scene3.body}
            </p>

            <div className="mt-4 sm:mt-5">
              <button
                type="button"
                onClick={onContinue}
                disabled={!cardUnfolded || dissolving}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full text-sm sm:text-base font-medium text-white whitespace-nowrap shrink-0 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#130f30]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(236, 72, 153, 0.42) 0%, rgba(139, 92, 246, 0.46) 60%, rgba(251, 191, 36, 0.32) 100%)',
                  border: '1px solid rgba(253, 230, 138, 0.45)',
                  boxShadow: '0 0 20px rgba(217, 70, 239, 0.32)',
                }}
              >
                {UNIVERSE_CONFIG.scene3.continueButton}
              </button>
            </div>
          </div>

          {/* Front Envelope Pocket */}
          <svg
            viewBox="0 0 400 240"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-2xl overflow-hidden"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="env-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e1664" />
                <stop offset="100%" stopColor="#160c3a" />
              </linearGradient>
              <linearGradient id="env-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3c1f7d" />
                <stop offset="100%" stopColor="#1b0f45" />
              </linearGradient>
            </defs>
            <polygon points="0,0 200,132 0,240" fill="url(#env-left)" opacity="0.96" />
            <polygon points="400,0 200,132 400,240" fill="url(#env-left)" opacity="0.96" />
            <polygon
              points="0,240 200,118 400,240"
              fill="url(#env-bottom)"
              stroke="rgba(253, 230, 138, 0.35)"
              strokeWidth="1.4"
            />
          </svg>

          {/* Realistic 3D Opening Top Flap */}
          <div
            className="absolute top-0 left-0 right-0 h-[55%] pointer-events-none"
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transform: flapOpen ? 'rotateX(-174deg)' : 'rotateX(0deg)',
              zIndex: flapOpen ? 10 : 30,
              transition:
                'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), z-index 0.4s step-end',
            }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 400 140"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="env-flap" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#581c87" />
                  <stop offset="55%" stopColor="#361670" />
                  <stop offset="100%" stopColor="#22114f" />
                </linearGradient>
              </defs>
              <path
                d="M2,0 L398,0 L200,132 Z"
                fill="url(#env-flap)"
                stroke="rgba(253, 230, 138, 0.42)"
                strokeWidth="1.5"
              />
            </svg>

            <div
              className={`absolute left-1/2 bottom-2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-opacity duration-500 ${
                flapOpen ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                background:
                  'radial-gradient(circle, #fef3c7 0%, #f59e0b 55%, #7c3aed 100%)',
                boxShadow: '0 0 18px rgba(251, 191, 36, 0.65)',
              }}
            >
              <span className="text-xs text-white" aria-hidden="true">
                ✦
              </span>
            </div>
          </div>
        </div>

        {/* Interactive tap hint button below closed envelope */}
        <button
          type="button"
          onClick={handleEnvelopeTap}
          disabled={tapped}
          className={`mt-4 min-h-[44px] px-4 py-2 rounded-full font-body text-sm tracking-wide text-amber-100/90 transition-all duration-700 cursor-pointer hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80 ${
            !tapped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          style={{ textShadow: '0 0 12px rgba(251, 191, 36, 0.4)' }}
        >
          {UNIVERSE_CONFIG.scene3.tapHint}
        </button>
      </div>
    </div>
  );
}
