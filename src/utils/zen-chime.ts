import { Platform } from 'react-native';

/**
 * Zen Chime Synthesizer
 * Generates soothing, organic acoustic bell and singing bowl harmonics
 * using the Web Audio API on web/supported environments, with zero native dependency overhead.
 */

type ChimeType = 'inhale' | 'hold' | 'exhale' | 'transition' | 'complete';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== 'web' && typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a resonant, meditative singing bowl bell harmonic.
 */
export function playZenChime(type: ChimeType, volume = 0.35) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    let fundamental = 432;
    let duration = 2.0;

    switch (type) {
      case 'inhale':
        // Soft rising, opening tone (432 Hz)
        fundamental = 432;
        duration = 2.2;
        break;
      case 'hold':
        // High clarity chime (528 Hz)
        fundamental = 528;
        duration = 1.8;
        break;
      case 'exhale':
        // Grounding, warm settling bell (324 Hz)
        fundamental = 324;
        duration = 2.5;
        break;
      case 'transition':
        // Subtle interval bell (384 Hz)
        fundamental = 384;
        duration = 1.6;
        break;
      case 'complete':
        // Full harmonic singing bowl (432 Hz deep gong)
        fundamental = 432;
        duration = 3.8;
        break;
    }

    // Master Gain for smooth attack & exponential fade-out
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // Fundamental tone (Sine wave)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(fundamental, now);

    // Harmonic overtone 1 (Singing bowl resonance at 2.76x fundamental)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(fundamental * 2.76, now);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.75);

    // Harmonic overtone 2 (Warm octave at 2x fundamental)
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(fundamental * 2, now);

    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(0.12, now);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.85);

    // Wire up nodes
    osc1.connect(masterGain);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc3.connect(gain3);
    gain3.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
    osc3.stop(now + duration + 0.05);
  } catch {
    // Ignore audio playback failure gracefully
  }
}
