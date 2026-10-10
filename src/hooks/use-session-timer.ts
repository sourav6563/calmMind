import { useCallback, useEffect, useRef, useState } from 'react';

export type SessionTimer = {
  /** Whole seconds remaining (0 when finished). */
  secondsLeft: number;
  /** 0..1 elapsed progress across the whole session. */
  progress: number;
  finished: boolean;
  /** Back to full duration (call when the duration picker changes). */
  reset: () => void;
};

/**
 * Countdown timer for meditation sessions with pause/resume.
 * Uses an absolute deadline, frozen while paused, so time is never lost or leaked.
 * Duration changes are applied by the parent calling reset() from an event handler.
 */
export function useSessionTimer(
  totalSeconds: number,
  running: boolean,
  onFinished?: () => void,
): SessionTimer {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [finished, setFinished] = useState(false);
  const deadlineRef = useRef(0);
  const pausedRemainingRef = useRef(0);

  // Keep the latest completion callback without re-arming the ticker.
  const finishedCbRef = useRef(onFinished);
  useEffect(() => {
    finishedCbRef.current = onFinished;
  });

  // Main ticker — only active while running.
  useEffect(() => {
    if (!running || finished) return;

    // Resume: rebuild the deadline from the frozen remainder.
    if (pausedRemainingRef.current > 0) {
      deadlineRef.current = Date.now() + pausedRemainingRef.current * 1000;
      pausedRemainingRef.current = 0;
    } else if (deadlineRef.current === 0) {
      deadlineRef.current = Date.now() + totalSeconds * 1000;
    }

    const id = setInterval(() => {
      const remainMs = deadlineRef.current - Date.now();
      if (remainMs <= 0) {
        setSecondsLeft(0);
        setFinished(true);
        clearInterval(id);
        finishedCbRef.current?.();
      } else {
        setSecondsLeft(Math.ceil(remainMs / 1000));
      }
    }, 250);

    return () => clearInterval(id);
  }, [running, finished, totalSeconds]);

  // Pause: freeze the remaining time.
  useEffect(() => {
    if (!running && deadlineRef.current !== 0 && !finished) {
      pausedRemainingRef.current = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
      deadlineRef.current = 0;
    }
  }, [running, finished]);

  const reset = useCallback(() => {
    deadlineRef.current = 0;
    pausedRemainingRef.current = 0;
    setFinished(false);
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  return {
    secondsLeft,
    progress: totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0,
    finished,
    reset,
  };
}

