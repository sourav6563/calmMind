import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { BreathPhase } from '@/constants/techniques';
import { FontSize, FontWeight } from '@/constants/theme';

export type PhaseLabelProps = {
  phase: BreathPhase;
  /** Re-fade on each change. */
  phaseIndex: number;
  color?: string;
  /** Optional muted line under the label. */
  hint?: string;
  hintColor?: string;
};

/**
 * Minimalist phase readout centered inside the orb: silky opacity + gentle
 * scale bloom on each phase change.
 */
export function PhaseLabel({
  phase,
  phaseIndex,
  color = '#FFFFFF',
  hint,
  hintColor,
}: PhaseLabelProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.94);

  useEffect(() => {
    opacity.value = 0;
    scale.value = 0.94;

    const easeOut = Easing.out(Easing.cubic);
    opacity.value = withTiming(1, { duration: 420, easing: easeOut });
    scale.value = withTiming(1, { duration: 420, easing: easeOut });
  }, [phaseIndex, phase.label, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animStyle]}>
      <Animated.Text
        accessibilityRole="text"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={[styles.label, { color }]}>
        {phase.label}
      </Animated.Text>
      {hint && (
        <Animated.Text style={[styles.hint, { color: hintColor ?? color }]}>
          {hint}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.xl,
    lineHeight: 36,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 4,
  },
});




