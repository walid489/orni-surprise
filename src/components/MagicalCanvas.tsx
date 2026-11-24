import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { QualityProfile } from '../utils/deviceQuality';

export interface ButterflyTrailPoint {
  x: number;
  y: number;
  active: boolean;
}

interface MagicalCanvasProps {
  trailSourceRef: MutableRefObject<ButterflyTrailPoint>;
  burstTrigger: number;
  morphTrigger: number;
  quality: QualityProfile;
  intensity?: 'calm' | 'vivid';
}

interface Star {
  nx: number;
  ny: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

interface Firefly {
  nx: number;
  ny: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  pulseSpeed: number;
  hue: string;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface MorphParticle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  angularSpeed: number;
  tx: number;
  ty: number;
  age: number;
  swirlUntil: number;
  holdUntil: number;
  maxAge: number;
  size: number;
  color: string;
}

const STAR_COLORS = ['#ffffff', '#f5d0fe', '#bfdbfe', '#fde68a'];
const TRAIL_COLORS = [
  '244, 114, 182', // pink
  '192, 132, 252', // violet
  '96, 165, 250', // blue
  '253, 224, 71', // soft gold
  '255, 255, 255', // white
];
const FIREFLY_COLORS = [
  '244, 114, 182',
  '216, 180, 254',
  '147, 197, 253',
  '253, 230, 138',
];

function sampleOrniPoints(
  viewportW: number,
  viewportH: number,
  maxPoints: number
): Array<{ x: number; y: number }> {
  const offscreen = document.createElement('canvas');
  const boxW = Math.min(460, Math.floor(viewportW * 0.86));
  const boxH = 150;
  offscreen.width = boxW;
  offscreen.height = boxH;

  const octx = offscreen.getContext('2d');
  if (!octx) return [];

  const fontSize = Math.round(Math.min(100, Math.max(50, viewportW * 0.145)));
  octx.clearRect(0, 0, boxW, boxH);
  octx.fillStyle = '#ffffff';
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
  octx.fillText('ORNI', boxW / 2, boxH / 2);

  const imgData = octx.getImageData(0, 0, boxW, boxH).data;
  const candidates: Array<{ x: number; y: number }> = [];
  const step = viewportW < 640 ? 4 : 5;

  const offsetX = viewportW * 0.5 - boxW * 0.5 - (viewportW < 640 ? 12 : 18);
  const offsetY = viewportH * 0.5 - boxH * 0.5;

  for (let y = 0; y < boxH; y += step) {
    for (let x = 0; x < boxW; x += step) {
      const alpha = imgData[(y * boxW + x) * 4 + 3];
      if (alpha > 125) {
        candidates.push({ x: offsetX + x, y: offsetY + y });
      }
    }
  }

  if (candidates.length === 0) return [];

  const sampled: Array<{ x: number; y: number }> = [];
  const stride = Math.max(1, Math.floor(candidates.length / maxPoints));
  for (let i = 0; i < candidates.length && sampled.length < maxPoints; i += stride) {
    sampled.push(candidates[i]);
  }
  return sampled;
}

export function MagicalCanvas({
  trailSourceRef,
  burstTrigger,
  morphTrigger,
  quality,
  intensity = 'calm',
}: MagicalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const morphParticlesRef = useRef<MorphParticle[]>([]);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  // Radial fairy-dust burst
  useEffect(() => {
    if (burstTrigger === 0 || qualityRef.current.reducedMotion) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const count = qualityRef.current.burstParticleCount;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = 0.9 + Math.random() * 2.4;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 24,
        y: cy + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.2,
        life: 0,
        maxLife: 50 + Math.random() * 38,
        size: 1.6 + Math.random() * 2.2,
        color: TRAIL_COLORS[i % TRAIL_COLORS.length],
      });
    }
  }, [burstTrigger]);

  // Scene 4: Letter dissolves -> Particles swirl across screen -> Coalesce into "ORNI"
  useEffect(() => {
    if (morphTrigger === 0) {
      morphParticlesRef.current = [];
      return;
    }
    if (qualityRef.current.reducedMotion) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const targetPoints = sampleOrniPoints(
      width,
      height,
      qualityRef.current.morphParticleCount
    );

    const cx = width * 0.5;
    const cy = height * 0.5;
    const maxSwirlRadius = Math.min(width, height) * 0.42;

    morphParticlesRef.current = targetPoints.map((pt, idx) => {
      const startAngle = Math.random() * Math.PI * 2;
      const startRadius = 24 + Math.random() * maxSwirlRadius;
      return {
        x: cx + (Math.random() - 0.5) * Math.min(260, width * 0.65),
        y: cy + (Math.random() - 0.5) * 120,
        angle: startAngle,
        radius: startRadius,
        angularSpeed: (0.045 + Math.random() * 0.035) * (idx % 2 === 0 ? 1 : 0.85),
        tx: pt.x,
        ty: pt.y,
        age: 0,
        swirlUntil: 58 + Math.floor(Math.random() * 14),
        holdUntil: 155 + Math.floor(Math.random() * 24),
        maxAge: 210 + Math.floor(Math.random() * 28),
        size: width < 640 ? 1.8 + Math.random() * 1.2 : 2.1 + Math.random() * 1.5,
        color: TRAIL_COLORS[idx % TRAIL_COLORS.length],
      };
    });
  }, [morphTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const profile = qualityRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, profile.maxDpr);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, qualityRef.current.maxDpr);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (qualityRef.current.reducedMotion) {
        render();
      }
    };

    window.addEventListener('resize', resize);

    const stars: Star[] = Array.from({ length: profile.starCount }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      baseAlpha: 0.25 + Math.random() * 0.65,
      twinkleSpeed: 0.012 + Math.random() * 0.022,
      phase: Math.random() * Math.PI * 2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));

    const fireflies: Firefly[] = Array.from({ length: profile.fireflyCount }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      vx: (Math.random() - 0.5) * 0.00034,
      vy: -0.00016 - Math.random() * 0.00028,
      r: 1.5 + Math.random() * 2.1,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.026,
      hue: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
    }));

    let rafId = 0;
    let frame = 0;
    let paused = typeof document !== 'undefined' ? document.hidden : false;

    const render = () => {
      if (paused) return;

      frame += 1;
      ctx.clearRect(0, 0, width, height);

      const reduced = qualityRef.current.reducedMotion;

      // Distant twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = reduced
          ? s.baseAlpha
          : s.baseAlpha * (0.45 + 0.55 * Math.sin(frame * s.twinkleSpeed + s.phase));

        ctx.globalAlpha = Math.max(0.08, alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.nx * width, s.ny * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Floating glowing particles & cosmic dust
      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];
        if (!reduced) {
          f.nx += f.vx + Math.sin(frame * 0.015 + f.phase) * 0.00015;
          f.ny += f.vy;

          if (f.ny < -0.03) f.ny = 1.03;
          if (f.nx < -0.03) f.nx = 1.03;
          if (f.nx > 1.03) f.nx = -0.03;
        }

        const fx = f.nx * width;
        const fy = f.ny * height;
        const glowAlpha = reduced
          ? 0.45
          : 0.22 + 0.54 * (0.5 + 0.5 * Math.sin(frame * f.pulseSpeed + f.phase));

        const haloRadius = f.r * 5.0;
        const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, haloRadius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
        grad.addColorStop(0.35, `rgba(${f.hue}, ${glowAlpha * 0.65})`);
        grad.addColorStop(1, `rgba(${f.hue}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(fx, fy, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Butterfly luminous light trail
      const trailSource = trailSourceRef.current;
      if (!reduced && trailSource.active) {
        const emitCount =
          intensityRef.current === 'vivid' && qualityRef.current.tier === 'high'
            ? 2
            : 1;
        for (let e = 0; e < emitCount; e++) {
          if (particlesRef.current.length < qualityRef.current.maxTrailParticles) {
            particlesRef.current.push({
              x: trailSource.x + (Math.random() - 0.5) * 16,
              y: trailSource.y + (Math.random() - 0.5) * 16,
              vx: (Math.random() - 0.5) * 0.6,
              vy: (Math.random() - 0.5) * 0.6 - 0.16,
              life: 0,
              maxLife: 34 + Math.random() * 24,
              size: 1.5 + Math.random() * 2.1,
              color:
                TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
            });
          }
        }
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.85;
        const radius = p.size * (1 - progress * 0.45);

        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3.0);
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        pGrad.addColorStop(0.45, `rgba(${p.color}, ${alpha * 0.72})`);
        pGrad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3.0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scene 4: Swirling cosmic vortex -> ORNI letter formation
      const morphs = morphParticlesRef.current;
      const cx = width * 0.5;
      const cy = height * 0.48;
      for (let i = morphs.length - 1; i >= 0; i--) {
        const m = morphs[i];
        m.age += 1;
        if (m.age >= m.maxAge) {
          morphs.splice(i, 1);
          continue;
        }

        if (m.age < m.swirlUntil) {
          // Swirl gracefully around the screen in an expanding/contracting cosmic galaxy spiral
          m.angle += m.angularSpeed;
          const swirlX = cx + Math.cos(m.angle) * m.radius;
          const swirlY = cy + Math.sin(m.angle) * m.radius * 0.62;
          m.x += (swirlX - m.x) * 0.12;
          m.y += (swirlY - m.y) * 0.12;
        } else if (m.age < m.holdUntil) {
          // Coalesce smoothly into sampled "ORNI" coordinates
          m.x += (m.tx - m.x) * 0.085;
          m.y += (m.ty - m.y) * 0.085;
        } else {
          // Softly lift away into cosmic stardust
          m.y -= 0.35;
          m.x += Math.sin(m.age * 0.09 + i) * 0.25;
        }

        let alpha = 0.92;
        if (m.age < 12) {
          alpha = (m.age / 12) * 0.92;
        } else if (m.age >= m.holdUntil) {
          alpha =
            (1 - (m.age - m.holdUntil) / (m.maxAge - m.holdUntil)) * 0.85;
        }

        const halo = m.size * 2.9;
        const mGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, halo);
        mGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        mGrad.addColorStop(0.42, `rgba(${m.color}, ${alpha * 0.78})`);
        mGrad.addColorStop(1, `rgba(${m.color}, 0)`);

        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, halo, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused && !qualityRef.current.reducedMotion) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    resize();
    if (!qualityRef.current.reducedMotion) {
      render();
    }

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [trailSourceRef, quality.reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
