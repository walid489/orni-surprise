// Original soft cinematic ambient piano & crystalline chime synthesizer using Web Audio API.
// Zero external audio dependencies — never relies on external URLs.

interface NoteEvent {
  freq: number;
  duration: number;
  delayAfter: number;
  velocity?: number;
}

const SESSION_MUTE_KEY = 'orni_universe_muted';

// Soft mysterious cinematic progression (Fmaj9 -> Dm9 -> Bbmaj7 -> Csus4/C)
const MELODY_SEQUENCE: NoteEvent[] = [
  { freq: 349.23, duration: 2.5, delayAfter: 540, velocity: 0.68 },
  { freq: 440.0, duration: 2.3, delayAfter: 540, velocity: 0.62 },
  { freq: 523.25, duration: 2.5, delayAfter: 540, velocity: 0.72 },
  { freq: 659.25, duration: 2.9, delayAfter: 680, velocity: 0.78 },
  { freq: 783.99, duration: 3.1, delayAfter: 940, velocity: 0.68 },

  { freq: 293.66, duration: 2.5, delayAfter: 540, velocity: 0.66 },
  { freq: 440.0, duration: 2.3, delayAfter: 540, velocity: 0.6 },
  { freq: 523.25, duration: 2.5, delayAfter: 540, velocity: 0.7 },
  { freq: 659.25, duration: 2.9, delayAfter: 680, velocity: 0.76 },
  { freq: 587.33, duration: 3.1, delayAfter: 960, velocity: 0.66 },

  { freq: 233.08, duration: 2.6, delayAfter: 560, velocity: 0.64 },
  { freq: 349.23, duration: 2.3, delayAfter: 540, velocity: 0.64 },
  { freq: 440.0, duration: 2.5, delayAfter: 540, velocity: 0.7 },
  { freq: 587.33, duration: 2.9, delayAfter: 700, velocity: 0.74 },
  { freq: 523.25, duration: 3.1, delayAfter: 940, velocity: 0.64 },

  { freq: 261.63, duration: 2.6, delayAfter: 560, velocity: 0.66 },
  { freq: 392.0, duration: 2.3, delayAfter: 540, velocity: 0.6 },
  { freq: 440.0, duration: 2.5, delayAfter: 540, velocity: 0.66 },
  { freq: 523.25, duration: 2.9, delayAfter: 680, velocity: 0.72 },
  { freq: 659.25, duration: 3.5, delayAfter: 1220, velocity: 0.64 },
];

function readSessionMute(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_MUTE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeSessionMute(muted: boolean) {
  try {
    window.sessionStorage.setItem(SESSION_MUTE_KEY, muted ? 'true' : 'false');
  } catch {
    // Storage may be unavailable in restricted contexts
  }
}

class DreamyPianoEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;
  private timerId: number | null = null;
  private chimeTimers: number[] = [];
  private stepIndex = 0;
  private playing = false;
  private muted = typeof window !== 'undefined' ? readSessionMute() : false;
  private readonly baseVolume = 0.13;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
    );
  }

  private ensureContext(): boolean {
    if (!this.isSupported()) return false;
    if (this.ctx) return true;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(
        this.muted ? 0.0001 : this.baseVolume,
        ctx.currentTime
      );

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1700, ctx.currentTime);
      filter.Q.setValueAtTime(0.7, ctx.currentTime);

      const delay = ctx.createDelay(1.5);
      delay.delayTime.setValueAtTime(0.44, ctx.currentTime);

      const feedback = ctx.createGain();
      feedback.gain.setValueAtTime(0.28, ctx.currentTime);

      const wetGain = ctx.createGain();
      wetGain.gain.setValueAtTime(0.32, ctx.currentTime);

      filter.connect(masterGain);
      filter.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wetGain);
      wetGain.connect(masterGain);
      masterGain.connect(ctx.destination);

      this.ctx = ctx;
      this.masterGain = masterGain;
      this.filterNode = filter;
      this.delayNode = delay;
      this.feedbackGain = feedback;
      return true;
    } catch {
      return false;
    }
  }

  private playNote(freq: number, duration: number, velocity = 0.7) {
    if (!this.ctx || !this.filterNode || this.muted) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    if (this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.11, now);

    const noteGain = this.ctx.createGain();
    const peak = 0.22 * velocity;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(peak, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(peak * 0.45, now + 0.45);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(noteGain);
    noteGain.connect(this.filterNode);

    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      osc2Gain.disconnect();
      noteGain.disconnect();
    };

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  public playCrystalChime() {
    if (!this.ensureContext() || !this.ctx || !this.filterNode || this.muted) {
      return;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => undefined);
    }
    const chimeFreqs = [783.99, 1046.5, 1318.51];
    chimeFreqs.forEach((freq, idx) => {
      const id = window.setTimeout(() => {
        this.playNote(freq, 1.8, 0.48);
      }, idx * 110);
      this.chimeTimers.push(id);
    });
  }

  private scheduleNext = () => {
    if (!this.playing) return;

    const event = MELODY_SEQUENCE[this.stepIndex];
    this.playNote(event.freq, event.duration, event.velocity ?? 0.7);
    this.stepIndex = (this.stepIndex + 1) % MELODY_SEQUENCE.length;

    this.timerId = window.setTimeout(this.scheduleNext, event.delayAfter);
  };

  public async start(): Promise<boolean> {
    if (!this.ensureContext() || !this.ctx) return false;

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
    } catch {
      return false;
    }

    if (this.playing) return true;
    this.playing = true;
    this.stepIndex = 0;

    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(
        this.muted ? 0.0001 : this.baseVolume,
        now,
        0.25
      );
    }

    this.scheduleNext();
    return true;
  }

  public stop() {
    this.playing = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.chimeTimers.length > 0) {
      this.chimeTimers.forEach((id) => window.clearTimeout(id));
      this.chimeTimers = [];
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.2);
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    writeSessionMute(muted);
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(
        muted ? 0.0001 : this.baseVolume,
        now,
        0.12
      );
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public dispose() {
    this.stop();
    if (this.delayNode) this.delayNode.disconnect();
    if (this.feedbackGain) this.feedbackGain.disconnect();
    if (this.filterNode) this.filterNode.disconnect();
    if (this.masterGain) this.masterGain.disconnect();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => undefined);
      this.ctx = null;
    }
  }
}

export const dreamyPiano = new DreamyPianoEngine();
