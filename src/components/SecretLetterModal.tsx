import { useEffect, useState } from 'react';
import { UNIVERSE_CONFIG } from '../config/universeConfig';

interface SecretLetterModalProps {
  open: boolean;
  onClose: () => void;
}

export function SecretLetterModal({ open, onClose }: SecretLetterModalProps) {
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setLetterOpen(false);
      return;
    }

    const id = window.setTimeout(() => setLetterOpen(true), 280);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Personal Secret Message"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 bg-black/75 backdrop-blur-md transition-opacity duration-500"
      style={{ perspective: '1000px' }}
    >
      {/* Small magical light behind the sealed mini letter */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none animate-aura-pulse"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle, rgba(253, 230, 138, 0.25) 0%, rgba(192, 132, 252, 0.26) 44%, transparent 74%)',
        }}
      />

      {/* Mysterious mini letter opening smoothly */}
      <div
        className={`relative my-auto w-[min(92vw,420px)] rounded-3xl px-6 py-7 sm:px-9 sm:py-10 text-center border border-amber-200/30 transition-all duration-1000 ease-out ${
          letterOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-75 translate-y-6'
        }`}
        style={{
          transform: letterOpen ? 'rotateX(0deg)' : 'rotateX(-35deg)',
          background:
            'linear-gradient(160deg, rgba(24, 14, 58, 0.96) 0%, rgba(12, 10, 36, 0.98) 60%, rgba(62, 22, 92, 0.95) 100%)',
          boxShadow:
            '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 36px rgba(192, 132, 252, 0.28), inset 0 1px 0 rgba(253, 230, 138, 0.3)',
        }}
      >
        <div
          className="mx-auto mb-5 w-10 h-10 rounded-full flex items-center justify-center border border-amber-200/40"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle, rgba(253, 230, 138, 0.35) 0%, rgba(168, 85, 247, 0.4) 100%)',
          }}
        >
          <span className="text-base">✦</span>
        </div>

        <p className="font-body text-[clamp(0.95rem,2.7vw,1.15rem)] leading-relaxed text-amber-50/95">
          {UNIVERSE_CONFIG.PERSONAL_SECRET_MESSAGE}
        </p>

        <div className="mt-7">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full text-sm font-medium text-fuchsia-100 whitespace-nowrap shrink-0 cursor-pointer border border-white/20 bg-white/8 hover:bg-white/15 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/90"
          >
            Back to Gift
          </button>
        </div>
      </div>
    </div>
  );
}
