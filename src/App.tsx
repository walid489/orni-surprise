import { useCallback, useEffect, useRef, useState } from 'react';
import { CrystalOrb } from './components/CrystalOrb';
import { EnchantedFlower } from './components/EnchantedFlower';
import { GalaxyBackdrop } from './components/GalaxyBackdrop';
import {
  LuminousButterfly,
  type ButterflyPalette,
} from './components/LuminousButterfly';
import {
  MagicalCanvas,
  type ButterflyTrailPoint,
} from './components/MagicalCanvas';
import { MagicalEnvelope } from './components/MagicalEnvelope';
import { MagicalGiftBox } from './components/MagicalGiftBox';
import { MusicToggle } from './components/MusicToggle';
import { SecretLetterModal } from './components/SecretLetterModal';
import { UNIVERSE_CONFIG } from './config/universeConfig';
import { detectQualityProfile, type QualityProfile } from './utils/deviceQuality';
import { dreamyPiano } from './utils/dreamyPiano';

type FilmScene = 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5' | 'scene6';
type SwarmPhase = 'outer' | 'circle' | 'gather';

interface SwarmButterfly {
  id: number;
  outerX: number;
  outerY: number;
  circleX: number;
  circleY: number;
  gatherX: number;
  gatherY: number;
  size: number;
  palette: ButterflyPalette;
  flapDuration: string;
  bobDuration: string;
}

const SWARM_BUTTERFLIES: SwarmButterfly[] = [
  {
    id: 1,
    outerX: 8,
    outerY: 18,
    circleX: 14,
    circleY: 22,
    gatherX: 22,
    gatherY: 30,
    size: 52,
    palette: 'celestial',
    flapDuration: '0.48s',
    bobDuration: '3.6s',
  },
  {
    id: 2,
    outerX: 92,
    outerY: 20,
    circleX: 86,
    circleY: 22,
    gatherX: 78,
    gatherY: 30,
    size: 48,
    palette: 'rose',
    flapDuration: '0.44s',
    bobDuration: '3.9s',
  },
  {
    id: 3,
    outerX: 10,
    outerY: 82,
    circleX: 14,
    circleY: 78,
    gatherX: 24,
    gatherY: 70,
    size: 44,
    palette: 'violet',
    flapDuration: '0.52s',
    bobDuration: '4.1s',
  },
  {
    id: 4,
    outerX: 90,
    outerY: 80,
    circleX: 86,
    circleY: 78,
    gatherX: 76,
    gatherY: 70,
    size: 46,
    palette: 'garden',
    flapDuration: '0.46s',
    bobDuration: '3.7s',
  },
  {
    id: 5,
    outerX: 50,
    outerY: 6,
    circleX: 50,
    circleY: 14,
    gatherX: 50,
    gatherY: 25,
    size: 42,
    palette: 'rose',
    flapDuration: '0.5s',
    bobDuration: '4.2s',
  },
  {
    id: 6,
    outerX: 50,
    outerY: 94,
    circleX: 50,
    circleY: 86,
    gatherX: 50,
    gatherY: 75,
    size: 44,
    palette: 'celestial',
    flapDuration: '0.47s',
    bobDuration: '4.0s',
  },
];

const ORNI_LETTERS = UNIVERSE_CONFIG.recipientName.split('');

export default function App() {
  const [scene, setScene] = useState<FilmScene>('scene1');
  const [quality, setQuality] = useState<QualityProfile>(() =>
    detectQualityProfile()
  );

  // Canvas triggers
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [morphTrigger, setMorphTrigger] = useState(0);

  // Scene 1 & 2: Beginning Universe + Crystal Orb
  const [universeAwakened, setUniverseAwakened] = useState(false);
  const [introLine1Visible, setIntroLine1Visible] = useState(false);
  const [introLine2Visible, setIntroLine2Visible] = useState(false);
  const [orbVisible, setOrbVisible] = useState(false);
  const [orbOpening, setOrbOpening] = useState(false);
  const [heroButterflyActive, setHeroButterflyActive] = useState(false);

  // Scene 3: Secret Letter Envelope
  const [envelopeVisible, setEnvelopeVisible] = useState(false);
  const [envelopeTapped, setEnvelopeTapped] = useState(false);
  const [envelopeFlapOpen, setEnvelopeFlapOpen] = useState(false);
  const [letterCardRaised, setLetterCardRaised] = useState(false);
  const [letterCardUnfolded, setLetterCardUnfolded] = useState(false);
  const [letterDissolving, setLetterDissolving] = useState(false);

  // Scene 4: Galaxy Transformation & ORNI Reveal
  const [swarmActive, setSwarmActive] = useState(false);
  const [swarmPhase, setSwarmPhase] = useState<SwarmPhase>('outer');
  const [nameVisible, setNameVisible] = useState(false);

  // Scene 5: Secret Gift Box & Crystal Flower
  const [giftBoxVisible, setGiftBoxVisible] = useState(false);
  const [giftBoxOpening, setGiftBoxOpening] = useState(false);
  const [crystalFlowerVisible, setCrystalFlowerVisible] = useState(false);
  const [crystalFlowerOpen, setCrystalFlowerOpen] = useState(false);

  // Scene 6: Final Message + Secret Personal Message
  const [para1Visible, setPara1Visible] = useState(false);
  const [para2Visible, setPara2Visible] = useState(false);
  const [para3Visible, setPara3Visible] = useState(false);
  const [closingVisible, setClosingVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [secretModalOpen, setSecretModalOpen] = useState(false);

  // Audio controls (persists mute preference for current session)
  const [audioSupported] = useState(() => dreamyPiano.isSupported());
  const [isMuted, setIsMuted] = useState(() => dreamyPiano.isMuted());
  const [musicActive, setMusicActive] = useState(false);

  // Refs for timers, double-tap protection & 60fps butterfly motion
  const timersRef = useRef<number[]>([]);
  const lastTapRef = useRef<number>(0);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const trailSourceRef = useRef<ButterflyTrailPoint>({
    x: 0,
    y: 0,
    active: false,
  });
  const butterflyStateRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
    angle: 0,
    scale: 0.16,
    flightStartTime: 0,
  });

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timersRef.current.push(id);
    return id;
  }, []);

  const canAcceptTap = useCallback(() => {
    const now = performance.now();
    if (now - lastTapRef.current < 400) return false;
    lastTapRef.current = now;
    return true;
  }, []);

  const runScene1Intro = useCallback(() => {
    scheduleTimer(() => setUniverseAwakened(true), 120);
    scheduleTimer(() => setIntroLine1Visible(true), 700);
    scheduleTimer(() => setIntroLine2Visible(true), 2100);
    scheduleTimer(() => setOrbVisible(true), 2650);
  }, [scheduleTimer]);

  useEffect(() => {
    runScene1Intro();
    return () => {
      clearAllTimers();
      dreamyPiano.dispose();
    };
  }, [runScene1Intro, clearAllTimers]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateQuality = () => setQuality(detectQualityProfile());

    mq.addEventListener('change', updateQuality);
    window.addEventListener('resize', updateQuality);

    return () => {
      mq.removeEventListener('change', updateQuality);
      window.removeEventListener('resize', updateQuality);
    };
  }, []);

  // 60fps Hero Butterfly Choreography across Scenes 2-6
  useEffect(() => {
    if (!heroButterflyActive) {
      trailSourceRef.current.active = false;
      return;
    }

    if (scene === 'scene2' && butterflyStateRef.current.scale < 0.25) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      butterflyStateRef.current.x = w * 0.5;
      butterflyStateRef.current.y = h * 0.52;
      butterflyStateRef.current.scale = 0.16;
      butterflyStateRef.current.angle = 0;
      butterflyStateRef.current.flightStartTime = performance.now();
    }

    let rafId = 0;
    let paused = typeof document !== 'undefined' ? document.hidden : false;

    const clamp = (val: number, min: number, max: number) =>
      Math.max(min, Math.min(max, val));

    const tick = (now: number) => {
      if (paused) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 640;
      const mobileScale = isMobile ? clamp(w / 430, 0.72, 0.94) : 1;
      const st = butterflyStateRef.current;

      const padX = Math.max(52, w * 0.1);
      const padY = Math.max(52, h * 0.11);

      if (quality.reducedMotion) {
        const rx =
          scene === 'scene3' || scene === 'scene5' || scene === 'scene6'
            ? clamp(w * 0.5 + (isMobile ? 110 : 210), padX, w - padX)
            : w * 0.5;
        const ry =
          scene === 'scene3' || scene === 'scene5' || scene === 'scene6'
            ? clamp(h * 0.22, padY, h - padY)
            : h * 0.44;
        st.x = rx;
        st.y = ry;
        st.scale = 0.8 * mobileScale;
        st.angle = 0;
        if (heroContainerRef.current) {
          heroContainerRef.current.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -50%) scale(${st.scale}) rotate(0deg)`;
        }
        trailSourceRef.current = { x: st.x, y: st.y, active: false };
        return;
      }

      if (scene === 'scene2') {
        const elapsed = (now - st.flightStartTime) / 1000;
        if (elapsed < 0.85) {
          const targetX = w * 0.5;
          const targetY = h * 0.42;
          st.x += (targetX - st.x) * 0.08;
          st.y += (targetY - st.y) * 0.08;
          st.scale += (mobileScale - st.scale) * 0.08;
          st.angle += (0 - st.angle) * 0.1;
        } else {
          const fTime = elapsed - 0.85;
          const rx = Math.min(w * 0.34, 340);
          const ry = Math.min(h * 0.22, 180);
          const targetX = clamp(w * 0.5 + Math.sin(fTime * 1.65) * rx, padX, w - padX);
          const targetY = clamp(
            h * 0.44 +
              Math.sin(fTime * 3.1) * ry * 0.52 -
              Math.cos(fTime * 1.3) * ry * 0.3,
            padY,
            h - padY
          );
          const dx = targetX - st.x;
          st.x += dx * 0.09;
          st.y += (targetY - st.y) * 0.09;
          st.scale += (mobileScale - st.scale) * 0.08;
          st.angle += (clamp(dx * 1.1, -24, 24) - st.angle) * 0.1;
        }
        trailSourceRef.current = { x: st.x, y: st.y, active: true };
      } else if (scene === 'scene3') {
        const swayX = Math.sin(now * 0.0015) * (isMobile ? 10 : 14);
        const swayY = Math.cos(now * 0.0019) * (isMobile ? 8 : 11);
        const targetX = clamp(
          w * 0.5 + (isMobile ? 115 : 195) + swayX,
          padX,
          w - padX
        );
        const targetY = clamp(
          h * (isMobile ? 0.22 : 0.25) + swayY,
          padY,
          h - padY
        );
        st.x += (targetX - st.x) * 0.055;
        st.y += (targetY - st.y) * 0.055;
        st.scale += (mobileScale * 0.78 - st.scale) * 0.06;
        st.angle += (-14 + Math.sin(now * 0.0016) * 4 - st.angle) * 0.06;
        trailSourceRef.current = {
          x: st.x,
          y: st.y,
          active: Math.floor(now / 120) % 3 === 0,
        };
      } else if (scene === 'scene4') {
        const orbitAngle = now * 0.0015;
        const targetX = clamp(
          w * 0.5 + Math.cos(orbitAngle) * (isMobile ? 95 : 165),
          padX,
          w - padX
        );
        const targetY = clamp(
          h * 0.34 + Math.sin(orbitAngle * 1.5) * 28,
          padY,
          h - padY
        );
        const dx = targetX - st.x;
        st.x += dx * 0.065;
        st.y += (targetY - st.y) * 0.065;
        st.scale += (mobileScale * 0.85 - st.scale) * 0.06;
        st.angle += (clamp(dx * 0.9, -20, 20) - st.angle) * 0.08;
        trailSourceRef.current = { x: st.x, y: st.y, active: true };
      } else {
        // Scene 5 & 6: Float calmly around the gift box / final message without overlapping text
        const swayX = Math.sin(now * 0.0012) * (isMobile ? 8 : 16);
        const swayY = Math.cos(now * 0.0016) * (isMobile ? 6 : 12);
        const targetX = clamp(
          isMobile ? w * 0.84 + swayX : w * 0.5 + Math.min(270, w * 0.24) + swayX,
          padX,
          w - padX
        );
        const targetY = clamp(
          h * (isMobile ? 0.14 : 0.2) + swayY,
          padY,
          h - padY
        );
        st.x += (targetX - st.x) * 0.045;
        st.y += (targetY - st.y) * 0.045;
        st.scale += (mobileScale * 0.72 - st.scale) * 0.05;
        st.angle += (-12 + Math.sin(now * 0.0015) * 4 - st.angle) * 0.05;
        trailSourceRef.current = {
          x: st.x,
          y: st.y,
          active: Math.floor(now / 150) % 4 === 0,
        };
      }

      if (heroContainerRef.current) {
        heroContainerRef.current.style.transform = `translate3d(${st.x.toFixed(1)}px, ${st.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${st.scale.toFixed(3)}) rotate(${st.angle.toFixed(2)}deg)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [scene, heroButterflyActive, quality.reducedMotion]);

  // SCENE 1 -> SCENE 2 -> SCENE 3 (Crystal Orb -> Butterfly Emergence -> Secret Envelope)
  const handleOrbActivate = useCallback(() => {
    if (scene !== 'scene1' || !orbVisible || !canAcceptTap()) return;
    clearAllTimers();

    if (audioSupported) {
      dreamyPiano.start().then((started) => {
        if (started) setMusicActive(true);
      });
      dreamyPiano.playCrystalChime();
    }

    setScene('scene2');
    setOrbOpening(true);
    setBurstTrigger((prev) => prev + 1);

    scheduleTimer(() => {
      setHeroButterflyActive(true);
    }, 600);

    scheduleTimer(() => {
      setScene('scene3');
      setOrbVisible(false);
      setEnvelopeVisible(true);
    }, 3650);
  }, [scene, orbVisible, audioSupported, canAcceptTap, clearAllTimers, scheduleTimer]);

  // SCENE 3 Interaction: Tap the floating envelope -> rotate -> flap opens -> letter emerges & unfolds
  const handleOpenEnvelope = useCallback(() => {
    if (scene !== 'scene3' || envelopeTapped || !canAcceptTap()) return;
    clearAllTimers();

    if (audioSupported) {
      dreamyPiano.playCrystalChime();
    }

    setEnvelopeTapped(true);

    scheduleTimer(() => {
      setEnvelopeFlapOpen(true);
    }, 280);

    scheduleTimer(() => {
      setLetterCardRaised(true);
    }, 820);

    scheduleTimer(() => {
      setLetterCardUnfolded(true);
    }, 1250);
  }, [scene, envelopeTapped, audioSupported, canAcceptTap, clearAllTimers, scheduleTimer]);

  // SCENE 3 -> SCENE 4 -> SCENE 5 (Galaxy Transformation + ORNI Reveal -> Secret Gift Box)
  const handleContinueJourney = useCallback(() => {
    if (scene !== 'scene3' || !letterCardUnfolded || !canAcceptTap()) return;
    clearAllTimers();

    setLetterDissolving(true);
    setMorphTrigger((prev) => prev + 1);
    setScene('scene4');

    scheduleTimer(() => {
      setEnvelopeVisible(false);
      setSwarmActive(true);
      setSwarmPhase('circle');
    }, 280);

    scheduleTimer(() => {
      setSwarmPhase('gather');
    }, 1350);

    scheduleTimer(() => {
      setNameVisible(true);
      setBurstTrigger((prev) => prev + 1);
    }, 1850);

    // Transition to SCENE 5: Mysterious Gift Box
    scheduleTimer(() => {
      setScene('scene5');
      setNameVisible(false);
      setSwarmActive(false);
      setSwarmPhase('outer');
      setGiftBoxVisible(true);
    }, 4900);
  }, [scene, letterCardUnfolded, canAcceptTap, clearAllTimers, scheduleTimer]);

  // SCENE 5 -> SCENE 6 (Tap Gift Box -> Ribbons unwrap -> Lid opens -> Crystal Flower blooms -> Final Message)
  const handleOpenGift = useCallback(() => {
    if (scene !== 'scene5' || giftBoxOpening || !canAcceptTap()) return;
    clearAllTimers();

    if (audioSupported) {
      dreamyPiano.playCrystalChime();
    }

    setGiftBoxOpening(true);
    setBurstTrigger((prev) => prev + 1);

    scheduleTimer(() => {
      setCrystalFlowerVisible(true);
    }, 850);

    scheduleTimer(() => {
      setCrystalFlowerOpen(true);
    }, 1200);

    // SCENE 6: Final Secret Message + Floating Butterflies around message
    scheduleTimer(() => {
      setScene('scene6');
      setGiftBoxVisible(false);
      setSwarmActive(true);
      setSwarmPhase('circle');
    }, 2700);

    scheduleTimer(() => setPara1Visible(true), 3100);
    scheduleTimer(() => setPara2Visible(true), 4450);
    scheduleTimer(() => setPara3Visible(true), 5800);
    scheduleTimer(() => setClosingVisible(true), 6900);
    scheduleTimer(() => setActionsVisible(true), 7750);
  }, [scene, giftBoxOpening, audioSupported, canAcceptTap, clearAllTimers, scheduleTimer]);

  // Replay entire experience cleanly
  const handleReplay = useCallback(() => {
    if (!canAcceptTap()) return;
    clearAllTimers();
    dreamyPiano.stop();
    setMusicActive(false);

    setUniverseAwakened(false);
    setIntroLine1Visible(false);
    setIntroLine2Visible(false);
    setOrbVisible(false);
    setOrbOpening(false);
    setHeroButterflyActive(false);

    setEnvelopeVisible(false);
    setEnvelopeTapped(false);
    setEnvelopeFlapOpen(false);
    setLetterCardRaised(false);
    setLetterCardUnfolded(false);
    setLetterDissolving(false);

    setSwarmActive(false);
    setSwarmPhase('outer');
    setNameVisible(false);

    setGiftBoxVisible(false);
    setGiftBoxOpening(false);
    setCrystalFlowerVisible(false);
    setCrystalFlowerOpen(false);

    setPara1Visible(false);
    setPara2Visible(false);
    setPara3Visible(false);
    setClosingVisible(false);
    setActionsVisible(false);
    setSecretModalOpen(false);

    setMorphTrigger(0);
    trailSourceRef.current.active = false;
    butterflyStateRef.current.scale = 0.16;

    setScene('scene1');
    runScene1Intro();
  }, [canAcceptTap, clearAllTimers, runScene1Intro]);

  const handleToggleMusic = useCallback(() => {
    if (!audioSupported) return;

    // If audio hasn't started yet (e.g. Scene 1), tapping the music button starts it directly
    if (!dreamyPiano.isPlaying()) {
      setIsMuted(false);
      dreamyPiano.setMuted(false);
      dreamyPiano.start().then((started) => {
        if (started) setMusicActive(true);
      });
      return;
    }

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    dreamyPiano.setMuted(nextMuted);
  }, [audioSupported, isMuted]);

  const visibleSwarm = SWARM_BUTTERFLIES.slice(
    0,
    Math.max(3, quality.ambientButterflyCount)
  );

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-[#03040c] text-white flex flex-col items-center pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-8 select-none">
      {/* Deep Midnight Black, Navy & Purple Nebula Backdrop */}
      <GalaxyBackdrop
        awakened={universeAwakened}
        intensified={
          scene === 'scene2' ||
          scene === 'scene4' ||
          scene === 'scene5' ||
          scene === 'scene6'
        }
        enableHeavyFilters={quality.enableHeavyFilters}
      />

      {/* Adaptive Canvas: Stars, Cosmic Dust, Trails & Swirl-to-ORNI */}
      <MagicalCanvas
        trailSourceRef={trailSourceRef}
        burstTrigger={burstTrigger}
        morphTrigger={morphTrigger}
        quality={quality}
        intensity={scene === 'scene2' || scene === 'scene4' ? 'vivid' : 'calm'}
      />

      {/* Music Mute/Unmute Toggle */}
      <MusicToggle
        supported={audioSupported}
        isMuted={isMuted}
        isActive={musicActive}
        onToggle={handleToggleMusic}
      />

      {/* Hero Luminous Butterfly */}
      <div
        ref={heroContainerRef}
        className={`fixed top-0 left-0 pointer-events-none z-30 transition-opacity duration-700 ease-out ${
          heroButterflyActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translate3d(50vw, 50vh, 0) translate(-50%, -50%) scale(0.16)',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      >
        <LuminousButterfly
          size={130}
          palette="garden"
          flapDuration={scene === 'scene2' || scene === 'scene4' ? '0.38s' : '0.58s'}
          bobDuration="3.2s"
          glowIntensity="bright"
          enableDropShadow={quality.enableHeavyFilters}
        />
      </div>

      {/* Circular & Gathering Butterfly Swarm (Scene 4 & Scene 6) */}
      <div
        className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
        aria-hidden="true"
      >
        {visibleSwarm.map((b, i) => {
          const x =
            swarmPhase === 'gather'
              ? b.gatherX
              : swarmPhase === 'circle'
                ? b.circleX
                : b.outerX;
          const y =
            swarmPhase === 'gather'
              ? b.gatherY
              : swarmPhase === 'circle'
                ? b.circleY
                : b.outerY;

          return (
            <div
              key={b.id}
              className="absolute scale-75 sm:scale-100 transition-all duration-[1500ms] ease-out"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: swarmActive ? 0.82 : 0,
                transitionDelay: swarmActive ? `${i * 90}ms` : '0ms',
              }}
            >
              <LuminousButterfly
                size={b.size}
                palette={b.palette}
                flapDuration={b.flapDuration}
                bobDuration={b.bobDuration}
                glowIntensity="soft"
                enableDropShadow={quality.enableHeavyFilters}
              />
            </div>
          );
        })}
      </div>

      {/* Crystal Flower (Blooms in Scene 5 and remains gently glowing behind Scene 6) */}
      {(scene === 'scene5' || scene === 'scene6') && (
        <EnchantedFlower
          visible={crystalFlowerVisible}
          isOpen={crystalFlowerOpen}
        />
      )}

      {/* SCENE 1 & SCENE 2 — The Mysterious Beginning & The Crystal Secret */}
      {(scene === 'scene1' || scene === 'scene2') && (
        <section
          aria-label="The Mysterious Beginning"
          className="relative z-20 my-auto flex flex-col items-center text-center max-w-xl mx-auto"
        >
          <p
            className={`font-display text-[clamp(1.15rem,3.6vw,1.8rem)] font-normal tracking-wide text-fuchsia-100/85 transition-all duration-1000 ease-out ${
              introLine1Visible && !orbOpening
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            {UNIVERSE_CONFIG.scene1.introLine1}
          </p>

          <h1
            className={`font-display mt-1.5 text-[clamp(1.55rem,5.2vw,3rem)] font-medium tracking-wide text-white leading-tight [text-wrap:balance] mb-[clamp(1.1rem,3.5vh,2.25rem)] transition-all duration-1000 ease-out ${
              introLine2Visible && !orbOpening
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-3 pointer-events-none'
            }`}
            style={{
              textShadow:
                '0 0 24px rgba(192, 132, 252, 0.5), 0 0 46px rgba(96, 165, 250, 0.3)',
            }}
          >
            {UNIVERSE_CONFIG.scene1.introLine2}
          </h1>

          <CrystalOrb
            visible={orbVisible}
            opening={orbOpening}
            interactive={scene === 'scene1' && orbVisible}
            onActivate={handleOrbActivate}
          />

          <button
            type="button"
            onClick={handleOrbActivate}
            disabled={scene !== 'scene1' || !orbVisible}
            className={`mt-[clamp(1rem,3.5vh,2rem)] min-h-[44px] px-5 py-2 rounded-full font-body text-[clamp(0.875rem,2.4vw,1rem)] tracking-wide text-fuchsia-100/90 transition-all duration-1000 ease-out cursor-pointer hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/80 ${
              orbVisible && !orbOpening
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
            style={{ textShadow: '0 0 14px rgba(217, 70, 239, 0.45)' }}
          >
            {UNIVERSE_CONFIG.scene1.actionPrompt}
          </button>
        </section>
      )}

      {/* SCENE 3 — The Secret Letter */}
      {scene === 'scene3' && (
        <section aria-label="The Secret Letter" className="relative z-30 my-auto w-full">
          <MagicalEnvelope
            visible={envelopeVisible}
            tapped={envelopeTapped}
            flapOpen={envelopeFlapOpen}
            cardRaised={letterCardRaised}
            cardUnfolded={letterCardUnfolded}
            dissolving={letterDissolving}
            onOpenEnvelope={handleOpenEnvelope}
            onContinue={handleContinueJourney}
          />
        </section>
      )}

      {/* SCENE 4 — The Galaxy Transformation & ORNI Reveal */}
      {scene === 'scene4' && (
        <section
          aria-live="polite"
          className="relative z-30 my-auto w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-2"
        >
          <div
            className={`transition-all duration-[1100ms] ease-out ${
              nameVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 translate-y-3'
            }`}
          >
            <h1 className="font-display flex items-center justify-center gap-3 sm:gap-4 leading-none">
              <span className="inline-flex items-baseline tracking-[0.15em]">
                {ORNI_LETTERS.map((letter, idx) => (
                  <span
                    key={letter + idx}
                    className="inline-block text-[clamp(2.85rem,12vw,6.25rem)] font-semibold text-transparent bg-clip-text transition-all duration-700 ease-out"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, #ffffff 0%, #fde68a 26%, #f472b6 62%, #c084fc 85%, #93c5fd 100%)',
                      filter: quality.enableHeavyFilters
                        ? 'drop-shadow(0 0 24px rgba(232, 121, 249, 0.7))'
                        : undefined,
                      opacity: nameVisible ? 1 : 0,
                      transform: nameVisible
                        ? 'translateY(0) scale(1)'
                        : 'translateY(12px) scale(0.86)',
                      transitionDelay: nameVisible ? `${120 + idx * 120}ms` : '0ms',
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>

              <span
                className="inline-block text-[clamp(1.85rem,6.5vw,3.4rem)] transition-all duration-700 ease-out"
                style={{
                  opacity: nameVisible ? 1 : 0,
                  transform: nameVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(8px) scale(0.75)',
                  transitionDelay: nameVisible ? '650ms' : '0ms',
                }}
              >
                🦋
              </span>
            </h1>
          </div>
        </section>
      )}

      {/* SCENE 5 — The Secret Gift */}
      {scene === 'scene5' && (
        <section aria-label="The Secret Gift" className="relative z-30 my-auto w-full">
          <MagicalGiftBox
            visible={giftBoxVisible}
            opening={giftBoxOpening}
            onOpenGift={handleOpenGift}
          />
        </section>
      )}

      {/* SCENE 6 — The Final Secret Message */}
      {scene === 'scene6' && (
        <section
          aria-live="polite"
          className="relative z-30 my-auto w-full max-w-lg mx-auto flex flex-col items-center text-center px-2"
        >
          <div
            className="w-full rounded-3xl px-5 py-5 sm:px-9 sm:py-8 backdrop-blur-md border border-amber-100/20"
            style={{
              background:
                'linear-gradient(160deg, rgba(12, 10, 36, 0.8) 0%, rgba(56, 24, 98, 0.56) 55%, rgba(236, 72, 153, 0.16) 100%)',
              boxShadow:
                '0 18px 46px rgba(3, 4, 14, 0.65), inset 0 1px 0 rgba(253, 230, 138, 0.24)',
            }}
          >
            <p
              className={`font-body text-[clamp(0.92rem,2.5vw,1.1rem)] leading-relaxed text-slate-100 transition-all duration-1000 ease-out ${
                para1Visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
            >
              {UNIVERSE_CONFIG.scene6.paragraphs[0]}
            </p>

            <p
              className={`font-body mt-3.5 sm:mt-4 text-[clamp(0.92rem,2.5vw,1.1rem)] leading-relaxed text-fuchsia-100/95 transition-all duration-1000 ease-out ${
                para2Visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
            >
              {UNIVERSE_CONFIG.scene6.paragraphs[1]}
            </p>

            <p
              className={`mt-4 sm:mt-5 font-display text-[clamp(1.3rem,4.2vw,1.8rem)] font-medium tracking-wide text-amber-100 transition-all duration-1000 ease-out ${
                para3Visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
              style={{
                textShadow: '0 0 18px rgba(217, 70, 239, 0.45)',
              }}
            >
              {UNIVERSE_CONFIG.scene6.paragraphs[2]}
            </p>
          </div>

          <p
            className={`mt-4 sm:mt-5 font-display italic text-[clamp(0.95rem,3vw,1.25rem)] text-fuchsia-200/85 transition-all duration-1000 ease-out ${
              closingVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            {UNIVERSE_CONFIG.scene6.closingLine}
          </p>

          <div
            className={`mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ease-out ${
              actionsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <button
              type="button"
              onClick={() => setSecretModalOpen(true)}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full text-sm sm:text-base font-medium text-white whitespace-nowrap shrink-0 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03040c]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.42) 0%, rgba(236, 72, 153, 0.36) 60%, rgba(251, 191, 36, 0.28) 100%)',
                border: '1px solid rgba(253, 230, 138, 0.42)',
                boxShadow: '0 0 22px rgba(192, 132, 252, 0.32)',
              }}
            >
              {UNIVERSE_CONFIG.scene6.unlockSecretButton}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium text-fuchsia-100/90 whitespace-nowrap shrink-0 cursor-pointer border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/80"
            >
              {UNIVERSE_CONFIG.scene6.replayButton}
            </button>
          </div>
        </section>
      )}

      {/* Secret Personal Message Mini-Letter Overlay */}
      <SecretLetterModal
        open={secretModalOpen}
        onClose={() => setSecretModalOpen(false)}
      />
    </main>
  );
}
