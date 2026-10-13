import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type MeditationHaloProps = {
  currentPrompt: string;
  isPaused?: boolean;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Harmonious, balanced size matching Zen minimalism proportions
const BASE_SIZE = Math.min(SCREEN_WIDTH * 0.62, 246);

export function MeditationHalo({ currentPrompt, isPaused = false }: MeditationHaloProps) {
  const pulse = useSharedValue(1);
  const promptOpacity = useSharedValue(1);
  const [displayedPrompt, setDisplayedPrompt] = useState(currentPrompt);

  // Smooth 6-second ambient breathing pulse
  useEffect(() => {
    if (isPaused) {
      cancelAnimation(pulse);
      return;
    }

    pulse.value = withRepeat(
      withTiming(1.08, {
        duration: 3500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [isPaused, pulse]);

  // Smooth cross-fade transition sequence when prompt changes
  useEffect(() => {
    if (currentPrompt === displayedPrompt) return;

    promptOpacity.value = withSequence(
      withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }, (finished) => {
        if (finished) {
          runOnJS(setDisplayedPrompt)(currentPrompt);
        }
      }),
      withTiming(1, { duration: 450, easing: Easing.in(Easing.ease) }),
    );
  }, [currentPrompt, displayedPrompt, promptOpacity]);

  const outerHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * 1.04 }],
    opacity: 0.35 + (pulse.value - 1) * 2.2,
  }));

  const midHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (pulse.value - 1) * 0.6 }],
    opacity: 0.55 + (pulse.value - 1) * 1.5,
  }));

  const innerDiscStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (pulse.value - 1) * 0.25 }],
  }));

  const promptTextStyle = useAnimatedStyle(() => ({
    opacity: promptOpacity.value,
    transform: [{ scale: 0.96 + promptOpacity.value * 0.04 }],
  }));

  return (
    <View
      className="items-center justify-center"
      style={{ width: BASE_SIZE * 1.15, height: BASE_SIZE * 1.15 }}>
      {/* ── 1. Outermost Warm Twilight Aura ── */}
      <Animated.View
        className="absolute rounded-full bg-[#E8A87C]/25"
        style={[
          {
            width: BASE_SIZE * 1.10,
            height: BASE_SIZE * 1.10,
          },
          outerHaloStyle,
        ]}
      />

      {/* ── 2. Mid Frosted Peach / Amber Halo ── */}
      <Animated.View
        className="absolute rounded-full border border-white/60 bg-[#F4D2BA]/30 shadow-md"
        style={[
          {
            width: BASE_SIZE * 0.88,
            height: BASE_SIZE * 0.88,
          },
          midHaloStyle,
        ]}
      />

      {/* ── 3. Inner Frosted Sanctuary Disc ── */}
      <Animated.View
        className="absolute rounded-full bg-white/95 border border-white/90 items-center justify-center p-6 shadow-2xl"
        style={[
          {
            width: BASE_SIZE * 0.70,
            height: BASE_SIZE * 0.70,
          },
          innerDiscStyle,
        ]}>
        <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, promptTextStyle]}>
          <Text
            className="text-zen-charcoal font-medium text-center leading-6 px-1"
            style={{
              fontFamily: 'serif',
              fontSize: 18,
              color: '#222522',
              textAlign: 'center',
            }}>
            {displayedPrompt}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
