import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { AppMode } from '@/constants/theme';

type StarDot = {
  x: DimensionValue;
  y: DimensionValue;
  size: number;
  opacity?: number;
  color?: string;
};

/** Stationary background stars (completely still, 1.0px - 1.5px). */
const STATIC_STARS: StarDot[] = [
  { x: '6%', y: '5%', size: 1.2, opacity: 0.4 },
  { x: '18%', y: '8%', size: 1.1, opacity: 0.32 },
  { x: '31%', y: '4%', size: 1.3, opacity: 0.45, color: '#DBEAFE' },
  { x: '46%', y: '7%', size: 1.1, opacity: 0.35 },
  { x: '62%', y: '5%', size: 1.2, opacity: 0.4 },
  { x: '76%', y: '9%', size: 1.1, opacity: 0.32 },
  { x: '91%', y: '6%', size: 1.3, opacity: 0.42 },
  { x: '9%', y: '16%', size: 1.2, opacity: 0.38 },
  { x: '27%', y: '18%', size: 1.0, opacity: 0.3 },
  { x: '54%', y: '15%', size: 1.2, opacity: 0.36 },
  { x: '84%', y: '18%', size: 1.1, opacity: 0.34, color: '#DBEAFE' },
  { x: '14%', y: '29%', size: 1.2, opacity: 0.38 },
  { x: '39%', y: '27%', size: 1.0, opacity: 0.28 },
  { x: '68%', y: '28%', size: 1.1, opacity: 0.35 },
  { x: '93%', y: '31%', size: 1.2, opacity: 0.4 },
  { x: '7%', y: '44%', size: 1.1, opacity: 0.32 },
  { x: '22%', y: '48%', size: 1.2, opacity: 0.36 },
  { x: '79%', y: '46%', size: 1.1, opacity: 0.32 },
  { x: '91%', y: '51%', size: 1.2, opacity: 0.38 },
  { x: '11%', y: '63%', size: 1.2, opacity: 0.36 },
  { x: '32%', y: '66%', size: 1.0, opacity: 0.3 },
  { x: '73%', y: '64%', size: 1.2, opacity: 0.38, color: '#DBEAFE' },
  { x: '88%', y: '68%', size: 1.1, opacity: 0.34 },
  { x: '8%', y: '80%', size: 1.2, opacity: 0.4 },
  { x: '26%', y: '83%', size: 1.1, opacity: 0.32 },
  { x: '64%', y: '81%', size: 1.2, opacity: 0.36 },
  { x: '85%', y: '84%', size: 1.1, opacity: 0.34 },
  { x: '17%', y: '93%', size: 1.2, opacity: 0.38 },
  { x: '52%', y: '94%', size: 1.1, opacity: 0.32 },
  { x: '82%', y: '93%', size: 1.2, opacity: 0.38 },
];

/** Subtle Blink Group 1 — stationary stars that gently fade opacity only (no movement). */
const BLINK_STARS_1: StarDot[] = [
  { x: '13%', y: '10%', size: 1.7, color: '#FFFFFF' },
  { x: '52%', y: '11%', size: 1.6, color: '#93C5FD' },
  { x: '85%', y: '13%', size: 1.7, color: '#FFFFFF' },
  { x: '21%', y: '24%', size: 1.6, color: '#DBEAFE' },
  { x: '75%', y: '23%', size: 1.7, color: '#FFFFFF' },
  { x: '10%', y: '38%', size: 1.6, color: '#93C5FD' },
  { x: '87%', y: '41%', size: 1.7, color: '#FFFFFF' },
  { x: '16%', y: '56%', size: 1.6, color: '#DBEAFE' },
  { x: '83%', y: '59%', size: 1.7, color: '#FFFFFF' },
  { x: '23%', y: '75%', size: 1.6, color: '#93C5FD' },
  { x: '78%', y: '77%', size: 1.7, color: '#FFFFFF' },
  { x: '46%', y: '90%', size: 1.6, color: '#DBEAFE' },
];

/** Subtle Blink Group 2 — stationary stars that gently fade opacity out-of-phase. */
const BLINK_STARS_2: StarDot[] = [
  { x: '24%', y: '7%', size: 1.6, color: '#DBEAFE' },
  { x: '68%', y: '8%', size: 1.8, color: '#FFFFFF' },
  { x: '36%', y: '20%', size: 1.6, color: '#93C5FD' },
  { x: '89%', y: '25%', size: 1.7, color: '#FFFFFF' },
  { x: '15%', y: '35%', size: 1.7, color: '#DBEAFE' },
  { x: '81%', y: '36%', size: 1.6, color: '#93C5FD' },
  { x: '8%', y: '52%', size: 1.7, color: '#FFFFFF' },
  { x: '92%', y: '56%', size: 1.6, color: '#DBEAFE' },
  { x: '19%', y: '70%', size: 1.8, color: '#FFFFFF' },
  { x: '69%', y: '72%', size: 1.6, color: '#93C5FD' },
  { x: '35%', y: '87%', size: 1.7, color: '#FFFFFF' },
  { x: '74%', y: '89%', size: 1.6, color: '#DBEAFE' },
];

/** Subtle Blink Group 3 — stationary stars that gently fade opacity on a slower cycle. */
const BLINK_STARS_3: StarDot[] = [
  { x: '39%', y: '9%', size: 1.7, color: '#FFFFFF' },
  { x: '79%', y: '14%', size: 1.6, color: '#DBEAFE' },
  { x: '8%', y: '23%', size: 1.7, color: '#FFFFFF' },
  { x: '61%', y: '22%', size: 1.5, color: '#93C5FD' },
  { x: '29%', y: '39%', size: 1.6, color: '#FFFFFF' },
  { x: '92%', y: '44%', size: 1.7, color: '#DBEAFE' },
  { x: '13%', y: '49%', size: 1.6, color: '#FFFFFF' },
  { x: '76%', y: '53%', size: 1.7, color: '#93C5FD' },
  { x: '12%', y: '74%', size: 1.6, color: '#FFFFFF' },
  { x: '88%', y: '75%', size: 1.7, color: '#DBEAFE' },
  { x: '15%', y: '88%', size: 1.6, color: '#93C5FD' },
  { x: '61%', y: '91%', size: 1.7, color: '#FFFFFF' },
];

/**
 * Clean Space Black starfield:
 * - Stars stay 100% still in their positions with subtle opacity-only blinking.
 * - 3 staggered, whisper-subtle falling stars (tiny star dot + faint 22px wisp tail)
 *   gently glide downward at different times and fade softly into the night sky.
 */
export function StarfieldBackground(_props: { mode?: AppMode }) {
  const reduceMotion = useReducedMotion();

  const blink1 = useSharedValue(0.35);
  const blink2 = useSharedValue(0.8);
  const blink3 = useSharedValue(0.5);

  const fall1 = useSharedValue(0);
  const fall2 = useSharedValue(0);
  const fall3 = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(blink1);
      cancelAnimation(blink2);
      cancelAnimation(blink3);
      cancelAnimation(fall1);
      cancelAnimation(fall2);
      cancelAnimation(fall3);
      blink1.value = 0.65;
      blink2.value = 0.65;
      blink3.value = 0.65;
      fall1.value = 0;
      fall2.value = 0;
      fall3.value = 0;
      return;
    }

    const sine = Easing.inOut(Easing.sin);

    // Pure opacity blink — zero position or scale changes on stationary stars
    blink1.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 3400, easing: sine }),
        withTiming(0.22, { duration: 3400, easing: sine }),
      ),
      -1,
      true,
    );

    blink2.value = withDelay(
      1100,
      withRepeat(
        withSequence(
          withTiming(0.22, { duration: 4200, easing: sine }),
          withTiming(0.85, { duration: 4200, easing: sine }),
        ),
        -1,
        true,
      ),
    );

    blink3.value = withDelay(
      2100,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: 5000, easing: sine }),
          withTiming(0.25, { duration: 5000, easing: sine }),
        ),
        -1,
        true,
      ),
    );

    // Subtle falling star 1 (upper sky)
    fall1.value = withRepeat(
      withSequence(
        withDelay(
          1800,
          withTiming(1, { duration: 1900, easing: Easing.out(Easing.quad) }),
        ),
        withTiming(0, { duration: 0 }),
        withDelay(6200, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );

    // Subtle falling star 2 (mid-upper sky, staggered)
    fall2.value = withRepeat(
      withSequence(
        withDelay(
          5200,
          withTiming(1, { duration: 2100, easing: Easing.out(Easing.quad) }),
        ),
        withTiming(0, { duration: 0 }),
        withDelay(5800, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );

    // Subtle falling star 3 (lower-mid sky, staggered)
    fall3.value = withRepeat(
      withSequence(
        withDelay(
          8600,
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }),
        ),
        withTiming(0, { duration: 0 }),
        withDelay(4800, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(blink1);
      cancelAnimation(blink2);
      cancelAnimation(blink3);
      cancelAnimation(fall1);
      cancelAnimation(fall2);
      cancelAnimation(fall3);
    };
  }, [reduceMotion, blink1, blink2, blink3, fall1, fall2, fall3]);

  // Opacity ONLY — stationary stars never move from their spot
  const blinkStyle1 = useAnimatedStyle(() => ({
    opacity: blink1.value,
  }));

  const blinkStyle2 = useAnimatedStyle(() => ({
    opacity: blink2.value,
  }));

  const blinkStyle3 = useAnimatedStyle(() => ({
    opacity: blink3.value,
  }));

  // Subtle falling star 1: glides (-115px, +80px) along -35deg angle
  const fallStyle1 = useAnimatedStyle(() => {
    const p = fall1.value;
    return {
      opacity: interpolate(p, [0, 0.15, 0.7, 1], [0, 0.65, 0.4, 0]),
      transform: [
        { translateX: interpolate(p, [0, 1], [0, -115]) },
        { translateY: interpolate(p, [0, 1], [0, 80]) },
        { rotate: '-35deg' },
      ],
    };
  });

  // Subtle falling star 2: glides (-105px, +74px) along -35deg angle
  const fallStyle2 = useAnimatedStyle(() => {
    const p = fall2.value;
    return {
      opacity: interpolate(p, [0, 0.15, 0.7, 1], [0, 0.58, 0.35, 0]),
      transform: [
        { translateX: interpolate(p, [0, 1], [0, -105]) },
        { translateY: interpolate(p, [0, 1], [0, 74]) },
        { rotate: '-35deg' },
      ],
    };
  });

  // Subtle falling star 3: glides (-110px, +77px) along -35deg angle
  const fallStyle3 = useAnimatedStyle(() => {
    const p = fall3.value;
    return {
      opacity: interpolate(p, [0, 0.15, 0.7, 1], [0, 0.6, 0.36, 0]),
      transform: [
        { translateX: interpolate(p, [0, 1], [0, -110]) },
        { translateY: interpolate(p, [0, 1], [0, 77]) },
        { rotate: '-35deg' },
      ],
    };
  });

  return (
    <View style={styles.sky} pointerEvents="none">
      {/* Stationary background stars */}
      <View style={StyleSheet.absoluteFill}>
        {STATIC_STARS.map((s, idx) => (
          <View
            key={`s-${idx}`}
            style={[
              styles.dot,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                opacity: s.opacity ?? 0.35,
                backgroundColor: s.color ?? '#CBD5E1',
              },
            ]}
          />
        ))}
      </View>

      {/* Stationary blinking stars — group 1 */}
      <Animated.View style={[StyleSheet.absoluteFill, blinkStyle1]}>
        {BLINK_STARS_1.map((s, idx) => (
          <View
            key={`b1-${idx}`}
            style={[
              styles.dot,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                backgroundColor: s.color ?? '#FFFFFF',
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Stationary blinking stars — group 2 */}
      <Animated.View style={[StyleSheet.absoluteFill, blinkStyle2]}>
        {BLINK_STARS_2.map((s, idx) => (
          <View
            key={`b2-${idx}`}
            style={[
              styles.dot,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                backgroundColor: s.color ?? '#FFFFFF',
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Stationary blinking stars — group 3 */}
      <Animated.View style={[StyleSheet.absoluteFill, blinkStyle3]}>
        {BLINK_STARS_3.map((s, idx) => (
          <View
            key={`b3-${idx}`}
            style={[
              styles.dot,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                backgroundColor: s.color ?? '#FFFFFF',
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Subtle falling star 1 */}
      <Animated.View style={[styles.fallingWrap, { right: '18%', top: '10%' }, fallStyle1]}>
        <View style={styles.fallingHead} />
        <LinearGradient
          colors={['rgba(219, 234, 254, 0.55)', 'rgba(147, 197, 253, 0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fallingTail}
        />
      </Animated.View>

      {/* Subtle falling star 2 */}
      <Animated.View style={[styles.fallingWrap, { left: '42%', top: '22%' }, fallStyle2]}>
        <View style={styles.fallingHead} />
        <LinearGradient
          colors={['rgba(219, 234, 254, 0.5)', 'rgba(147, 197, 253, 0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fallingTail}
        />
      </Animated.View>

      {/* Subtle falling star 3 */}
      <Animated.View style={[styles.fallingWrap, { right: '14%', top: '62%' }, fallStyle3]}>
        <View style={styles.fallingHead} />
        <LinearGradient
          colors={['rgba(219, 234, 254, 0.5)', 'rgba(147, 197, 253, 0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fallingTail}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sky: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#05070B',
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  fallingWrap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fallingHead: {
    width: 1.8,
    height: 1.8,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
  },
  fallingTail: {
    width: 22,
    height: 1,
    borderRadius: 999,
  },
});
