"use client";

/**
 * Tiny procedural sound engine using the Web Audio API.
 * No assets, no dependency — synthesizes short, friendly tones.
 */

type Note = {
  freq: number;
  dur: number;
  delay?: number;
  gain?: number;
  type?: OscillatorType;
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  enabled = true;

  private getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  setEnabled(b: boolean) {
    this.enabled = b;
  }

  play(notes: Note[]) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type ?? "sine";
      osc.frequency.value = n.freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = now + (n.delay ?? 0);
      const peak = n.gain ?? 0.18;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(peak, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);
      osc.start(t0);
      osc.stop(t0 + n.dur + 0.05);
    }
  }
}

const engine = new SoundEngine();

export function setSoundEnabled(b: boolean) {
  engine.setEnabled(b);
}

const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const A4 = 440;
const F4 = 349.23;
const D4 = 293.66;

export function playCorrect() {
  engine.play([
    { freq: C5, dur: 0.12, gain: 0.16, type: "triangle" },
    { freq: E5, dur: 0.14, delay: 0.05, gain: 0.16, type: "triangle" },
    { freq: G5, dur: 0.18, delay: 0.1, gain: 0.18, type: "triangle" },
  ]);
}

export function playWrong() {
  engine.play([
    { freq: A4, dur: 0.14, gain: 0.12, type: "sine" },
    { freq: F4, dur: 0.18, delay: 0.08, gain: 0.12, type: "sine" },
  ]);
}

export function playClick() {
  engine.play([
    { freq: 880, dur: 0.05, gain: 0.07, type: "square" },
  ]);
}

export function playPop() {
  engine.play([
    { freq: 660, dur: 0.06, gain: 0.1, type: "triangle" },
    { freq: 990, dur: 0.07, delay: 0.04, gain: 0.08, type: "triangle" },
  ]);
}

export function playLevelUp() {
  engine.play([
    { freq: C5, dur: 0.12, gain: 0.16, type: "triangle" },
    { freq: E5, dur: 0.12, delay: 0.08, gain: 0.16, type: "triangle" },
    { freq: G5, dur: 0.12, delay: 0.16, gain: 0.16, type: "triangle" },
    { freq: C6, dur: 0.28, delay: 0.24, gain: 0.2, type: "triangle" },
  ]);
}

export function playRegroup() {
  // Two rising notes for "things combining"
  engine.play([
    { freq: D4, dur: 0.1, gain: 0.12, type: "sine" },
    { freq: A4, dur: 0.18, delay: 0.08, gain: 0.14, type: "sine" },
    { freq: E5, dur: 0.18, delay: 0.16, gain: 0.14, type: "triangle" },
  ]);
}

export function playBreak() {
  // Two descending notes for "thing breaking apart"
  engine.play([
    { freq: G5, dur: 0.08, gain: 0.12, type: "sawtooth" },
    { freq: D4, dur: 0.18, delay: 0.06, gain: 0.1, type: "sawtooth" },
  ]);
}
