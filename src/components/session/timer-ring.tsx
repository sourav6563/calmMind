import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

import { FontSize, FontWeight, Motion, type ModePalette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type TimerRingProps = {
  /** Whole seconds remaining. */
  secondsLeft: number;
  /** 0..1 elapsed progress across the session. */
  progress: number;
  palette: ModePalette;
  size?: number;
  /** Center label (e.g., "10:00"). */
  label?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Meditation countdown ring — thin, non-distracting.
 * Runs on the UI thread; updates only when the target progress changes.
 */
export function TimerRing({
  secondsLeft,
  progress,
  palette,
  size = 220,
  label,
  style,
}: TimerRingProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 500,
      easing: Motion.easingOut,
    });
  }, [progress, animatedProgress]);

  const radius = size / 2 - 6;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeText = label ?? `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={palette.border === 'transparent' ? palette.secondary : palette.border}
          strokeWidth={4}
          fill="none"
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={palette.secondary}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={ringProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <ThemedText
        accessibilityLabel={`${minutes} minutes ${seconds} seconds remaining`}
        style={[styles.time, { color: palette.onSurface }]}>
        {timeText}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: FontSize.timer,
    lineHeight: 56,
    paddingBottom: 2,
    fontWeight: FontWeight.light,
    fontVariant: ['tabular-nums'],
  },
});
