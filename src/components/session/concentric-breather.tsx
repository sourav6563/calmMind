import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
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

  // Gentle guidance hint for intuitive focus
  const subCue = isHold
    ? 'Rest in stillness'
    : scaleTarget > 1.05
    ? 'Breathe in slowly'
    : 'Release gently';

  // Zen Philosophy: The center is anchored in stillness (no jumping, shifting, or flickering)
  const [currentLabel, setCurrentLabel] = useState(phaseLabel);
  const [currentSubCue, setCurrentSubCue] = useState(subCue);

  // Soft Zen Ink Cross-Dissolve: old text dissolves softly, swaps at 0, new text emerges
  useEffect(() => {
    if (phaseLabel === currentLabel && subCue === currentSubCue) return;

    cancelAnimation(textOpacity);
    textOpacity.value = withTiming(
      0,
      { duration: 150, easing: Easing.out(Easing.sin) },
      (finished) => {
        if (finished) {
          runOnJS(setCurrentLabel)(phaseLabel);
          runOnJS(setCurrentSubCue)(subCue);
          textOpacity.value = withTiming(1, {
            duration: 240,
            easing: Easing.in(Easing.sin),
          });
        }
      }
    );
  }, [phaseLabel, subCue, currentLabel, currentSubCue, textOpacity]);

  // Smooth respiratory transitions on the outer halo rings
  useEffect(() => {
    if (isPaused) {
      cancelAnimation(animatedScale);
      cancelAnimation(holdPulse);
      return;
    }

    if (isHold) {
      // Subtle organic breathing micro-pulse on the outer rings only
      holdPulse.value = withRepeat(
        withTiming(1.025, {
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
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
  }, [phaseSeconds, scaleTarget, isHold, isPaused, animatedScale, holdPulse]);

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
      transform: [{ scale: 1 + (s - 1) * 0.75 }],
      opacity: 0.60 + (s - 1) * 0.30,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const displaySeconds = secondsLeft ?? phaseSeconds;

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

      {/* ── Inner Core Disc 3 (Frosted Washi-Cream Sanctuary — The Still Center) ── */}
      <View
        className="absolute rounded-full bg-white/95 border border-white/90 items-center justify-center shadow-md"
        style={{
          width: BASE_SIZE * 0.70,
          height: BASE_SIZE * 0.70,
          shadowColor: '#2C3E32',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          elevation: 4,
        }}>
        <Animated.View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            },
            animatedTextStyle,
          ]}>
          {/* Optional Nostril Cue Slot (Fixed Height: Zero Shifting) */}
          <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
            {cue ? (
              <View className="px-2.5 py-0.5 rounded-full bg-zen-sage/15 border border-zen-sage/20">
                <Text className="text-zen-sage text-[10px] font-semibold tracking-wider uppercase">
                  {cue === 'left' ? '👈 Left Side' : 'Right Side 👉'}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Primary Phase Label (Fixed Height Container: Zero Shifting) */}
          <View style={{ height: 32, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              className="text-zen-charcoal font-semibold text-center tracking-tight"
              style={{
                fontFamily: 'serif',
                fontSize: 22,
                color: '#222522',
              }}>
              {currentLabel}
            </Text>
          </View>

          {/* Sub-cue guiding text (Fixed Height Container: Zero Shifting) */}
          <View style={{ height: 18, justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
            <Text
              className="text-zen-muted text-[11px] font-normal text-center"
              style={{ color: '#657267' }}>
              {currentSubCue}
            </Text>
          </View>

          {/* Countdown timer badge (Fixed Placement) */}
          <View style={{ height: 26, justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
            <View className="px-2.5 py-0.5 rounded-full bg-zen-sage/10 border border-zen-sage/20 items-center justify-center">
              <Text
                className="text-zen-sage text-[11px] font-semibold"
                style={{ color: '#4E7158' }}>
                {displaySeconds}s
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
