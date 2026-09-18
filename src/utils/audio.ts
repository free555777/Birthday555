// Web Audio API ambient romantic piano synthesizer & audio manager
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private volume: number = 0.5;
  private customAudio: HTMLAudioElement | null = null;
  private currentStep: number = 0;
  private listeners: Set<(playing: boolean) => void> = new Set();

  // Romantic progression in Db Major / Bb Minor (F, Ab, C, Eb, Db, etc.)
  private chords = [
    [138.59, 207.65, 261.63, 311.13, 415.30], // DbMaj9
    [110.00, 164.81, 220.00, 261.63, 329.63], // A7sus / F#m7
    [123.47, 185.00, 246.94, 293.66, 369.99], // Bm7 / G#m
    [103.83, 155.56, 207.65, 261.63, 311.13], // Ab6
    [116.54, 174.61, 233.08, 277.18, 349.23], // Bbm7
    [130.81, 196.00, 261.63, 329.63, 392.00], // C7sus / Eb
  ];

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(playing: boolean) {
    this.listeners.forEach((cb) => cb(playing));
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft bell/piano chime
  private playPianoNote(freq: number, startTime: number, duration: number = 3.5, velocity: number = 0.15) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm low-pass acoustic filtering
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(350, startTime + duration);

    // Sine with gentle triangle overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq, startTime);

    const amp = velocity * this.volume;
    noteGain.gain.setValueAtTime(0.0001, startTime);
    // Natural attack
    noteGain.gain.linearRampToValueAtTime(amp, startTime + 0.04);
    // Smooth acoustic decay
    noteGain.gain.exponentialRampToValueAtTime(amp * 0.4, startTime + 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    subOsc.stop(startTime + duration + 0.1);
  }

  private tick() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.currentStep % this.chords.length];
    const now = this.ctx.currentTime;

    // Arpeggiate notes gently
    chord.forEach((note, idx) => {
      const delay = idx * 0.35 + (Math.random() * 0.08);
      const vel = idx === 0 ? 0.22 : 0.14 - idx * 0.015;
      this.playPianoNote(note, now + delay, 4.0, Math.max(0.06, vel));
    });

    // Occasional high sparkle note
    if (Math.random() > 0.4) {
      const highNote = chord[Math.floor(Math.random() * chord.length)] * 2;
      this.playPianoNote(highNote, now + 1.8 + Math.random() * 0.5, 3.0, 0.08);
    }

    this.currentStep++;
    this.timer = window.setTimeout(() => this.tick(), 3200);
  }

  public play(customUrl?: string) {
    if (this.isPlaying) return;

    if (customUrl && customUrl.trim().length > 0) {
      if (!this.customAudio) {
        this.customAudio = new Audio(customUrl);
        this.customAudio.loop = true;
      }
      this.customAudio.volume = this.volume;
      this.customAudio.play().then(() => {
        this.isPlaying = true;
        this.notify(true);
      }).catch((e) => {
        console.warn('Custom audio playback failed, falling back to romantic piano synth:', e);
        this.startSynth();
      });
      return;
    }

    this.startSynth();
  }

  private startSynth() {
    this.initContext();
    this.isPlaying = true;
    this.notify(true);
    this.tick();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.notify(false);
  }

  public toggle(customUrl?: string) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(customUrl);
    }
  }

  public togglePlay(customUrl?: string) {
    this.toggle(customUrl);
  }

  public playChime() {
    this.playWishChime();
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play magical celebratory harp / chime when birthday candle is blown out!
  public playWishChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const celebrationNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];

    celebrationNotes.forEach((freq, i) => {
      this.playPianoNote(freq, now + i * 0.12, 3.0, 0.28);
    });
  }

  // Play satisfying wax seal crack sound with resonant crystalline chime
  public playWaxSealBreak() {
    this.initContext();
    if (!this.ctx || !this.gainNode) return;
    const now = this.ctx.currentTime;

    // 1. Crisp initial wax snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + 0.1);

    // 2. Resonant warm bell shimmer (528Hz love frequency + harmonic)
    this.playPianoNote(528, now + 0.04, 2.8, 0.22);
    this.playPianoNote(792, now + 0.14, 2.2, 0.14);
  }

  // Play gentle paper unfold rustle sound
  public playPaperRustle() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playPianoNote(440, now, 1.8, 0.12);
    this.playPianoNote(659.25, now + 0.08, 2.0, 0.15);
  }
}

export const romanticAudio = new RomanticAudioEngine();
export const audioEngine = romanticAudio;
