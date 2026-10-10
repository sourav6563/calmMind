import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { BreathPhase } from '@/constants/techniques';

export type BreathStatus = 'idle' | 'running' | 'paused' | 'done';

export type UseBreathPhaseOptions = {
  /** Whether the session is actively breathing. */
  running: boolean;
  /** Total cycles; 0 = unlimited. */
  cycles?: number;
  /** Fires when a cycle wraps back to the first phase. */
  onCycleEnd?: (cycle: number) => void;
  /** Fires when all cycles are complete. */
  onEnd?: () => void;
};

export type BreathPhaseState = {
  phase: BreathPhase;
  phaseIndex: number;
  /** 1-based current cycle. */
  cycle: number;
  /** 0..1 progress through the current phase. */
  progress: number;
  /** Seconds remaining in the current phase (ceil, min 1). */
  secondsLeft: number;
  status: BreathStatus;
  /** Reset back to round 1, phase 0. */
  reset: () => void;
};

/**
 * Phase state machine for breathing sessions.
 * Each phase ends at an absolute deadline, so pause/resume never drifts.
 */
export function useBreathPhase(
  phases: BreathPhase[],
  { running, cycles = 0, onCycleEnd, onEnd }: UseBreathPhaseOptions,
): BreathPhaseState {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  // Authoritative position — avoids stale closures in the scheduler.
  const posRef = useRef({ phaseIndex: 0, cycle: 1 });
  const deadlineRef = useRef(0);
  const pausedRemainingRef = useRef(0);
  // Last countdown second committed to state — state updates at 1/sec, not 60.
  const lastSecRef = useRef(-1);

  // Latest callbacks without destabilizing `advance` (which drives the scheduler).
  const callbacksRef = useRef({ onCycleEnd, onEnd });
  useEffect(() => {
    callbacksRef.current = { onCycleEnd, onEnd };
  });

  // Always a valid phase — guards the first render / empty config so
  // downstream components never touch `undefined.seconds` or `.label`.
  const safePhases: BreathPhase[] = useMemo(
    () => (phases.length > 0 ? phases : [{ label: 'Inhale', seconds: 4, scale: 1.18 }]),
    [phases],
  );
  const phase = safePhases[Math.min(phaseIndex, safePhases.length - 1)];

  const reset = useCallback(() => {
    posRef.current = { phaseIndex: 0, cycle: 1 };
    deadlineRef.current = 0;
    pausedRemainingRef.current = 0;
    lastSecRef.current = -1;
    setPhaseIndex(0);
    setCycle(1);
    setProgress(0);
    setFinished(false);
  }, []);

  /** Advance one phase; wraps cycles or finishes the session. */
  const advance = useCallback(() => {
    const pos = posRef.current;
    let nextIndex = pos.phaseIndex + 1;
    let nextCycle = pos.cycle;

    if (nextIndex >= safePhases.length) {
      nextIndex = 0;
      if (cycles > 0 && pos.cycle >= cycles) {
        // Session complete — park at start, stop scheduling.
        posRef.current = { phaseIndex: 0, cycle: pos.cycle };
        deadlineRef.current = 0;
        setPhaseIndex(0);
        setProgress(0);
        setFinished(true);
        callbacksRef.current.onEnd?.();
        return;
      }
      nextCycle = pos.cycle + 1;
      callbacksRef.current.onCycleEnd?.(pos.cycle);
    }

    posRef.current = { phaseIndex: nextIndex, cycle: nextCycle };
    deadlineRef.current = Date.now() + safePhases[nextIndex].seconds * 1000;
    lastSecRef.current = safePhases[nextIndex].seconds;
    setPhaseIndex(nextIndex);
    setCycle(nextCycle);
    setProgress(0);
  }, [safePhases, cycles]);

  // Scheduler — one rAF loop while running; rescheduled per phase via deps.
  useEffect(() => {
    if (!running || finished) return;

    if (pausedRemainingRef.current > 0) {
      deadlineRef.current = Date.now() + pausedRemainingRef.current;
      pausedRemainingRef.current = 0;
    } else if (deadlineRef.current === 0) {
      deadlineRef.current = Date.now() + safePhases[posRef.current.phaseIndex].seconds * 1000;
    }

    const phaseDuration = safePhases[posRef.current.phaseIndex].seconds * 1000;
    let frame = 0;
    const check = () => {
      const remain = deadlineRef.current - Date.now();
      if (remain <= 0) {
        advance();
      } else {
        // Commit state only when the displayed second changes — 1 update/sec
        // instead of 60 (a per-frame setState re-renders the whole session
        // screen and visibly janks the orb animation on mid-range phones).
        const p = Math.min(1, Math.max(0, 1 - remain / phaseDuration));
        const sec = Math.max(
          1,
          Math.ceil((1 - p) * safePhases[posRef.current.phaseIndex].seconds),
        );
        if (sec !== lastSecRef.current) {
          lastSecRef.current = sec;
          setProgress(p);
        }
        frame = requestAnimationFrame(check);
      }
    };
    frame = requestAnimationFrame(check);

    return () => cancelAnimationFrame(frame);
  }, [running, finished, phaseIndex, cycle, advance, safePhases]);

  // Pause: freeze the remaining time so resume continues mid-phase.
  useEffect(() => {
    if (!running && deadlineRef.current !== 0 && !finished) {
      pausedRemainingRef.current = Math.max(0, deadlineRef.current - Date.now());
      deadlineRef.current = 0;
    }
  }, [running, finished]);

  const secondsLeft = Math.max(1, Math.ceil((1 - progress) * phase.seconds));

  // Derived only from state — never reads refs during render.
  let status: BreathStatus = 'idle';
  if (finished) status = 'done';
  else if (running) status = 'running';
  else if (progress > 0) status = 'paused';

  return { phase, phaseIndex, cycle, progress, secondsLeft, status, reset };
}

