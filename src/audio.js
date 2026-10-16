// Procedural Web Audio Engine (No external sound files required)
import { store } from './state.js';

class AudioEngine {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  canPlay() {
    return store.isSoundEnabled();
  }

  playTick() {
    if (!this.canPlay()) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  playKeypress() {
    if (!this.canPlay()) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  playSuccessChime() {
    if (!this.canPlay()) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    } catch (e) {}
  }

  playWarpBlast() {
    if (!this.canPlay()) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Heavy sub-bass drop & rise
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(65, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.6);
      sub.frequency.exponentialRampToValueAtTime(140, now + 1.8);

      subGain.gain.setValueAtTime(0.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.3, now + 0.8);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 2.5);

      // 2. White noise whoosh filter sweep
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3;
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(400, now + 2.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.25, now + 0.6);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 2.2);

      // 3. High harmonic chime flourish
      const highChimes = [1046.5, 1318.5, 1567.98, 2093.0];
      highChimes.forEach((freq, idx) => {
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const cTime = now + 1.0 + idx * 0.12;

        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, cTime);

        chimeGain.gain.setValueAtTime(0.12, cTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, cTime + 0.7);

        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chime.start(cTime);
        chime.stop(cTime + 0.7);
      });
    } catch (e) {}
  }
}

export const sound = new AudioEngine();
