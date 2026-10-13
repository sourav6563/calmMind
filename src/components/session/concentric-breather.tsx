import React, { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type ConcentricBreatherProps = {
  phaseLabel: string;
  phaseSeconds: number;
  secondsLeft?: number;
  scaleTarget: number;
  isHold?: boolean;
  cue?: 'left' | 'right';
  isPaused?: boolean;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Balanced, elegant size leaving generous calm negative space
const BASE_SIZE = Math.min(SCREEN_WIDTH * 0.52, 206);

export function ConcentricBreather({
  phaseLabel,
  phaseSeconds,
  secondsLeft,
  scaleTarget,
  isHold = false,
  cue,
  isPaused = false,
}: ConcentricBreatherProps) {
  const animatedScale = useSharedValue(1);
  const holdPulse = useSharedValue(1);
  const textOpacity = useSharedValue(1);

  // Smooth respiratory transitions & organic curves
  useEffect(() => {
    if (isPaused) {
      cancelAnimation(animatedScale);
      cancelAnimation(holdPulse);
      return;
    }

    // Gentle text opacity transition on phase change
    textOpacity.value = withSequence(
      withTiming(0.2, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 260, easing: Easing.in(Easing.quad) }),
    );

    if (isHold) {
      // Subtle organic breathing micro-pulse during hold phases so it feels alive
      holdPulse.value = withRepeat(
        withTiming(1.02, {
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
    } else {
      holdPulse.value = withTiming(1, { duration: 250 });

      // Balanced respiratory expansion: Inhale expands gently to 1.18; Exhale returns to 1.0
      const isExhale = scaleTarget < 1.05;
      const targetScaleValue = isExhale ? 1.0 : 1.18;

      // Inhale expands with gentle swell; Exhale relaxes with smooth release
      const easing = isExhale
        ? Easing.bezier(0.35, 0.0, 0.22, 1.0)
        : Easing.bezier(0.33, 0.0, 0.20, 1.0);

      animatedScale.value = withTiming(targetScaleValue, {
        duration: Math.max(phaseSeconds * 1000, 400),
        easing,
      });
    }
  }, [phaseLabel, phaseSeconds, scaleTarget, isHold, isPaused, animatedScale, holdPulse, textOpacity]);

  // Outermost halo ring — subtle expansive mint aura with soft opacity wave
  const outerRingStyle = useAnimatedStyle(() => {
    const s = animatedScale.value * holdPulse.value;
    return {
      transform: [{ scale: 1 + (s - 1) * 1.10 }],
      opacity: 0.40 + (s - 1) * 0.40,
    };
  });

  // Middle frosted ring — organic intermediate dampening
  const midRingStyle = useAnimatedStyle(() => {
    const s = animatedScale.value * holdPulse.value;
    return {
      transform: [{ scale: 1 + (s - 1) * 0.80 }],
      opacity: 0.60 + (s - 1) * 0.30,
    };
  });

  // Inner core disc — solid frosted glass sanctuary
  const innerDiscStyle = useAnimatedStyle(() => {
    const s = animatedScale.value * holdPulse.value;
    return {
      transform: [{ scale: 1 + (s - 1) * 0.55 }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const displaySeconds = secondsLeft ?? phaseSeconds;

  // Gentle guidance hint for intuitive focus
  const subCue = isHold
    ? 'Rest in stillness'
    : scaleTarget > 1.05
    ? 'Breathe in slowly'
    : 'Release gently';

  return (
    <View
      className="items-center justify-center"
      style={{ width: BASE_SIZE * 1.20, height: BASE_SIZE * 1.20 }}>
      {/* ── Outer Concentric Ring 1 (Translucent Sage Aura Ripple) ── */}
      <Animated.View
        className="absolute rounded-full border border-zen-sage/20 bg-zen-sage/10 shadow-sm"
        style={[
          {
            width: BASE_SIZE * 1.08,
            height: BASE_SIZE * 1.08,
          },
          outerRingStyle,
        ]}
      />

      {/* ── Mid Concentric Ring 2 (Frosted White & Sage Glass) ── */}
      <Animated.View
        className="absolute rounded-full border border-white/80 bg-white/60 shadow-sm"
        style={[
          {
            width: BASE_SIZE * 0.88,
            height: BASE_SIZE * 0.88,
          },
          midRingStyle,
        ]}
      />

      {/* ── Inner Core Disc 3 (Frosted Washi-Cream Sanctuary) ── */}
      <Animated.View
        className="absolute rounded-full bg-white/95 border border-white/90 items-center justify-center shadow-md"
        style={[
          {
            width: BASE_SIZE * 0.70,
            height: BASE_SIZE * 0.70,
            shadowColor: '#2C3E32',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 4,
          },
          innerDiscStyle,
        ]}>
        <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, animatedTextStyle]}>
          {/* Optional Nostril Cue */}
          {cue && (
            <View className="mb-1 px-2.5 py-0.5 rounded-full bg-zen-sage/15 border border-zen-sage/20">
              <Text className="text-zen-sage text-[10px] font-semibold tracking-wider uppercase">
                {cue === 'left' ? '👈 Left Side' : 'Right Side 👉'}
              </Text>
            </View>
          )}

          {/* Primary Phase Label */}
          <Text
            className="text-zen-charcoal font-semibold text-center tracking-tight"
            style={{
              fontFamily: 'serif',
              fontSize: 21,
              color: '#222522',
            }}>
            {phaseLabel}
          </Text>

          {/* Sub-cue guiding text */}
          <Text className="text-zen-muted text-[10px] font-normal mt-0.5 text-center">
            {subCue}
          </Text>

          {/* Countdown timer badge */}
          <View className="mt-1 px-2.5 py-0.5 rounded-full bg-zen-sage/10 border border-zen-sage/20 items-center justify-center">
            <Text
              className="text-zen-sage text-[11px] font-semibold"
              style={{ color: '#4E7158' }}>
              {displaySeconds}s
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
