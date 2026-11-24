interface GalaxyBackdropProps {
  awakened: boolean;
  intensified?: boolean;
  enableHeavyFilters: boolean;
}

export function GalaxyBackdrop({
  awakened,
  intensified = false,
  enableHeavyFilters,
}: GalaxyBackdropProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#03040c]"
      aria-hidden="true"
    >
      {/* Gradual reveal from nearly black into deep midnight purple & navy galaxy */}
      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-out ${
          awakened ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: intensified
            ? 'radial-gradient(ellipse 95% 80% at 50% 42%, rgba(91, 33, 182, 0.48) 0%, rgba(30, 27, 75, 0.72) 44%, rgba(6, 7, 22, 0.96) 82%, #03040c 100%)'
            : 'radial-gradient(ellipse 90% 75% at 50% 45%, rgba(76, 29, 149, 0.36) 0%, rgba(19, 17, 54, 0.75) 48%, rgba(5, 6, 18, 0.98) 85%, #03040c 100%)',
        }}
      />

      {/* Diagonal cosmic Milky Way / nebula band */}
      <div
        className={`absolute inset-[-20%] transition-opacity duration-[2400ms] ease-out ${
          awakened ? (intensified ? 'opacity-65' : 'opacity-45') : 'opacity-0'
        }`}
        style={{
          transform: 'rotate(-24deg)',
          background:
            'radial-gradient(ellipse 68% 28% at 50% 50%, rgba(168, 85, 247, 0.22) 0%, rgba(59, 130, 246, 0.14) 36%, rgba(236, 72, 153, 0.1) 62%, transparent 82%)',
        }}
      />

      {/* Drifting violet-pink nebula cloud */}
      <div
        className={`absolute -top-28 -left-24 w-[280px] h-[280px] sm:w-[460px] sm:h-[460px] rounded-full animate-ambient-slow transition-opacity duration-[2200ms] ${
          awakened ? 'opacity-50' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(192, 132, 252, 0.24) 0%, rgba(236, 72, 153, 0.1) 48%, transparent 74%)',
          filter: enableHeavyFilters ? 'blur(38px)' : undefined,
        }}
      />

      {/* Drifting blue-gold cosmic cloud */}
      <div
        className={`absolute -bottom-28 -right-24 w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] rounded-full animate-ambient-reverse transition-opacity duration-[2200ms] ${
          awakened ? 'opacity-45' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(96, 165, 250, 0.22) 0%, rgba(251, 191, 36, 0.08) 52%, transparent 75%)',
          filter: enableHeavyFilters ? 'blur(42px)' : undefined,
        }}
      />
    </div>
  );
}
