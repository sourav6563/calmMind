import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

/**
 * Relaxing Background Sound Engine (Native Android)
 * Exclusively plays the user's relax-sound-4.mp3 during breath techniques
 * with dynamic breath swell (Option A: subtle +1.6 dB inhale swell, tranquil hold, -1.9 dB exhale release),
 * seamless loop, and synchronized end-time slow-down.
 */

const RELAX_SOUND_ASSET = require('@/assets/sounds/relax-sound-4.mp3');

// Calibrated volume levels for organic breath wave (total dynamic range ~10.6 dB)
// Provides clear, rich breath guidance while keeping start and end ultra-gentle
export const ZEN_AUDIO_LEVELS = {
  SOOTHING_BASELINE: 0.40,
  INHALE_PEAK: 0.75,      // Full, warm swell (+10.6 dB) - audible and serene
  EXHALE_TROUGH: 0.22,    // Gentle, soft, peaceful resting floor
  HOLD_FULL: 0.75,        // Rock-solid sustained plateau at full lung capacity
  HOLD_EMPTY: 0.22,       // Rock-solid quiet resting bed at empty lung capacity
} as const;

let soundPlayer: AudioPlayer | null = null;
let isMutedGlobal = false;
let isAudioConfigured = false;
let fadeInterval: ReturnType<typeof setInterval> | null = null;
let currentTargetVolume: number = ZEN_AUDIO_LEVELS.SOOTHING_BASELINE;
let isSlowDownActive = false;

function clearFade() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

/**
 * Smoothly ramps player volume using gentle raised-cosine curves.
 * Guarantees zero abrupt jumps: slow, peaceful start from 0.00 and slow dissolution at end.
 */
function rampVolume(
  player: AudioPlayer,
  fromVolume: number,
  toVolume: number,
  durationMs: number,
  modeOrOnComplete?: 'slow-in' | 'slow-out' | 'inhale' | 'exhale' | 'smooth' | (() => void),
  onComplete?: () => void
) {
  clearFade();
  let mode: 'slow-in' | 'slow-out' | 'inhale' | 'exhale' | 'smooth' = 'smooth';
  let callback = onComplete;

  if (typeof modeOrOnComplete === 'function') {
    callback = modeOrOnComplete;
  } else if (typeof modeOrOnComplete === 'string') {
    mode = modeOrOnComplete;
  }

  if (durationMs <= 0 || Math.abs(fromVolume - toVolume) < 0.004) {
    player.volume = Math.max(0, Math.min(1, toVolume));
    callback?.();
    return;
  }

  // Smooth 40ms tick rate (~25 updates/sec) for silky, click-free volume envelopes
  const intervalTime = 40;
  const steps = Math.max(12, Math.floor(durationMs / intervalTime));
  let step = 0;

  player.volume = Math.max(0, Math.min(1, fromVolume));

  fadeInterval = setInterval(() => {
    step++;
    const progress = Math.min(1, step / steps);
    let current: number;

    if (mode === 'slow-in') {
      // Very slow, soft gentle emergence from complete silence (starts with 0 slope)
      const curve = 0.5 - 0.5 * Math.cos(Math.PI * progress);
      current = fromVolume + (toVolume - fromVolume) * curve;
    } else if (mode === 'slow-out') {
      // Very slow, peaceful dissolution into complete silence (tapers with 0 slope)
      const curve = 0.5 + 0.5 * Math.cos(Math.PI * progress);
      current = toVolume + (fromVolume - toVolume) * curve;
    } else if (mode === 'inhale') {
      // Smooth gradual swell up to Inhale peak
      const curve = 0.5 - 0.5 * Math.cos(Math.PI * progress);
      current = fromVolume + (toVolume - fromVolume) * curve;
    } else if (mode === 'exhale') {
      // Smooth gradual decrescendo down to Exhale trough
      const curve = 0.5 + 0.5 * Math.cos(Math.PI * progress);
      current = toVolume + (fromVolume - toVolume) * curve;
    } else {
      const curve = 0.5 - 0.5 * Math.cos(Math.PI * progress);
      current = fromVolume + (toVolume - fromVolume) * curve;
    }

    player.volume = Math.max(0, Math.min(1, current));

    if (step >= steps) {
      clearFade();
      player.volume = Math.max(0, Math.min(1, toVolume));
      callback?.();
    }
  }, intervalTime);
}

async function configureAudioMode() {
  if (isAudioConfigured) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    isAudioConfigured = true;
  } catch {
    // Ignore audio mode configuration errors gracefully
  }
}

/**
 * Starts the relaxing background sound SLOWLY and GENTLY from absolute 0.00 silence.
 * Emerge like morning mist without any sudden loud entrance.
 */
export function startZenBreathscape(options?: {
  isMuted?: boolean;
  firstPhaseSeconds?: number;
}) {
  try {
    void configureAudioMode();
    isMutedGlobal = !!options?.isMuted;
    isSlowDownActive = false;
    currentTargetVolume = ZEN_AUDIO_LEVELS.INHALE_PEAK;

    if (!soundPlayer) {
      soundPlayer = createAudioPlayer(RELAX_SOUND_ASSET);
      soundPlayer.loop = true;
    }

    clearFade();

    if (isMutedGlobal) {
      soundPlayer.volume = 0;
    } else {
      // Guaranteed to start at absolute 0.00 volume (complete silence)
      soundPlayer.volume = 0;
      void soundPlayer.seekTo(0);
      soundPlayer.play();

      // Slow, gradual fade-in across the full duration of the first inhale (min 3.5s)
      const introDurationMs = Math.max(
        3200,
        (options?.firstPhaseSeconds ?? 4) * 1000
      );
      rampVolume(
        soundPlayer,
        0,
        ZEN_AUDIO_LEVELS.INHALE_PEAK,
        introDurationMs,
        'slow-in'
      );
    }
  } catch {
    // Graceful fallback
  }
}

export type BreathModulationOptions = {
  phaseLabel: string;
  durationSeconds: number;
  isHoldAfterExhale?: boolean;
};

/**
 * Dynamically modulates ambient volume to mirror the breath (Option A):
 * - Inhale: powerful yet soothing swell up to 0.85 (+12.6 dB)
 * - Hold: rock-solid sustained plateau with ZERO drifting
 * - Exhale: soft, peaceful decrescendo down to 0.20
 */
export function modulateZenBreathscapePhase({
  phaseLabel,
  durationSeconds,
  isHoldAfterExhale = false,
}: BreathModulationOptions) {
  if (isSlowDownActive || isMutedGlobal || !soundPlayer) {
    return;
  }

  const durationMs = Math.max(600, durationSeconds * 1000);
  const normalized = phaseLabel.toLowerCase();

  if (normalized.includes('hold')) {
    // STILLNESS: Freeze / sustain at peak or trough without any drifting!
    const holdTarget = isHoldAfterExhale
      ? ZEN_AUDIO_LEVELS.HOLD_EMPTY
      : ZEN_AUDIO_LEVELS.HOLD_FULL;
    currentTargetVolume = holdTarget;
    clearFade();
    soundPlayer.volume = holdTarget;
    return;
  }

  if (normalized.includes('inhale')) {
    currentTargetVolume = ZEN_AUDIO_LEVELS.INHALE_PEAK;
    rampVolume(
      soundPlayer,
      soundPlayer.volume,
      ZEN_AUDIO_LEVELS.INHALE_PEAK,
      durationMs,
      'inhale'
    );
  } else if (normalized.includes('exhale')) {
    currentTargetVolume = ZEN_AUDIO_LEVELS.EXHALE_TROUGH;
    rampVolume(
      soundPlayer,
      soundPlayer.volume,
      ZEN_AUDIO_LEVELS.EXHALE_TROUGH,
      durationMs,
      'exhale'
    );
  }
}

/**
 * Pauses background sound with a soft 350ms fade-out.
 */
export function pauseZenBreathscape() {
  try {
    if (soundPlayer) {
      rampVolume(soundPlayer, soundPlayer.volume, 0, 350, 'slow-out', () => {
        soundPlayer?.pause();
      });
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Resumes background sound with a soft 1.2-second fade back to the current phase target.
 */
export function resumeZenBreathscape() {
  try {
    if (soundPlayer && !isMutedGlobal) {
      soundPlayer.play();
      rampVolume(soundPlayer, soundPlayer.volume, currentTargetVolume, 1200, 'slow-in');
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Toggles or updates mute state with smooth volume transitions.
 */
export function setZenBreathscapeMuted(isMuted: boolean) {
  isMutedGlobal = isMuted;
  try {
    if (soundPlayer) {
      if (isMuted) {
        rampVolume(soundPlayer, soundPlayer.volume, 0, 300, 'slow-out', () => {
          soundPlayer?.pause();
        });
      } else {
        soundPlayer.play();
        rampVolume(soundPlayer, 0, currentTargetVolume, 1200, 'slow-in');
      }
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Smoothly and progressively dissolves the background sound to complete silence
 * during the final breathing phase leading right up to session completion.
 */
export function slowDownZenBreathscape(
  durationMs: number = 3500,
  onComplete?: () => void
) {
  isSlowDownActive = true;
  try {
    if (soundPlayer && !isMutedGlobal) {
      const dissolveDuration = Math.max(3000, durationMs);
      rampVolume(
        soundPlayer,
        soundPlayer.volume,
        0,
        dissolveDuration,
        'slow-out',
        () => {
          soundPlayer?.pause();
          onComplete?.();
        }
      );
    } else {
      onComplete?.();
    }
  } catch {
    onComplete?.();
  }
}

/**
 * Alias for backward compatibility.
 */
export const slowDownAndStopZenBreathscape = slowDownZenBreathscape;

/**
 * Immediately silences and halts the background sound with 0 latency.
 * Guaranteed zero audio playing when the completion popup appears.
 */
export function stopZenBreathscapeImmediately() {
  clearFade();
  isSlowDownActive = false;
  try {
    if (soundPlayer) {
      soundPlayer.volume = 0;
      soundPlayer.pause();
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Graceful completion stop alias.
 */
export function playClosingGong() {
  stopZenBreathscapeImmediately();
}

/**
 * Releases native audio player to free memory when leaving the session screen.
 */
export function releaseZenBreathscape() {
  clearFade();
  isSlowDownActive = false;
  if (soundPlayer) {
    try {
      soundPlayer.volume = 0;
      soundPlayer.pause();
      soundPlayer.release();
    } catch {
      // ignore
    }
    soundPlayer = null;
  }
}

// Clean no-ops to eliminate any extra synthetic sound effects
export function playBreathWave(_phase?: 'inhale' | 'hold' | 'exhale') {}
export function playOpeningBell() {}
export function playZenChime(_type?: string) {}
export const releaseZenChimes = releaseZenBreathscape;

