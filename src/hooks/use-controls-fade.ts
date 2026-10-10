import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { Motion } from '@/constants/theme';

export type ControlsFade = {
  /** Bind to the controls container style. */
  opacity: Animated.Value;
  /** Call on any touch to reveal the controls and restart the idle timer. */
  reveal: () => void;
};

/**
 * Session controls auto-fade (calm: uncluttered session screens).
 * Fades to 0 after 30s idle while running; any touch reveals them again.
 */
export function useControlsFade(running: boolean): ControlsFade {
  const [opacity] = useState(() => new Animated.Value(1));
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: Motion.fade,
      useNativeDriver: true,
    }).start();

    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (running) {
      fadeTimer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: Motion.fade,
          useNativeDriver: true,
        }).start();
      }, Motion.idleBeforeFade);
    }
  }, [running, opacity]);

  // Re-arm whenever running changes; cancel on unmount.
  useEffect(() => {
    reveal();
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [reveal]);

  return { opacity, reveal };
}
