import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Gentle haptic ticks for breath-phase boundaries (calm design rule:
 * light impact only, never buzzes hard — toggleable via toggle()).
 */
export function useHaptics(initialEnabled = true) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const tick = useCallback(() => {
    if (!enabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [enabled]);

  const done = useCallback(() => {
    if (!enabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return { tick, done, enabled, setEnabled, toggle };
}

