export type AnimationTier = 'high' | 'balanced' | 'lightweight';

export interface QualityProfile {
  tier: AnimationTier;
  reducedMotion: boolean;
  maxDpr: number;
  starCount: number;
  fireflyCount: number;
  maxTrailParticles: number;
  morphParticleCount: number;
  burstParticleCount: number;
  ambientButterflyCount: number;
  enableHeavyFilters: boolean;
}

export function detectQualityProfile(): QualityProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'balanced',
      reducedMotion: false,
      maxDpr: 1.5,
      starCount: 60,
      fireflyCount: 16,
      maxTrailParticles: 72,
      morphParticleCount: 130,
      burstParticleCount: 28,
      ambientButterflyCount: 4,
      enableHeavyFilters: false,
    };
  }

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = Boolean(nav.connection?.saveData);
  const isSmallScreen = window.innerWidth < 640;

  if (reducedMotion || saveData || cores <= 2 || memory <= 2) {
    return {
      tier: 'lightweight',
      reducedMotion,
      maxDpr: 1,
      starCount: 38,
      fireflyCount: 10,
      maxTrailParticles: 40,
      morphParticleCount: 82,
      burstParticleCount: 18,
      ambientButterflyCount: 3,
      enableHeavyFilters: false,
    };
  }

  if (isSmallScreen || cores <= 4 || memory <= 4) {
    return {
      tier: 'balanced',
      reducedMotion: false,
      maxDpr: 1.5,
      starCount: 64,
      fireflyCount: 16,
      maxTrailParticles: 76,
      morphParticleCount: 135,
      burstParticleCount: 30,
      ambientButterflyCount: 4,
      enableHeavyFilters: false,
    };
  }

  return {
    tier: 'high',
    reducedMotion: false,
    maxDpr: 2,
    starCount: 110,
    fireflyCount: 26,
    maxTrailParticles: 130,
    morphParticleCount: 210,
    burstParticleCount: 44,
    ambientButterflyCount: 6,
    enableHeavyFilters: true,
  };
}
