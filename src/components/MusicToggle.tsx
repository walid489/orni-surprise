import { Volume2, VolumeX } from 'lucide-react';

interface MusicToggleProps {
  supported: boolean;
  isMuted: boolean;
  isActive: boolean;
  onToggle: () => void;
}

export function MusicToggle({
  supported,
  isMuted,
  isActive,
  onToggle,
}: MusicToggleProps) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      aria-pressed={!isMuted && isActive}
      title={isMuted ? 'Unmute gentle piano' : 'Mute gentle piano'}
      className={`fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] sm:top-6 sm:right-6 z-40 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/80 ${
        isActive && !isMuted
          ? 'bg-fuchsia-500/15 border-fuchsia-300/35 text-fuchsia-100 shadow-[0_0_16px_rgba(217,70,239,0.24)] hover:bg-fuchsia-500/25'
          : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {isMuted || !isActive ? (
        <VolumeX className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Volume2 className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
