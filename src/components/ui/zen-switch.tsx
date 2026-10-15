import React, { useEffect } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type ZenSwitchProps = {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  size?: 'xs' | 'sm' | 'default';
  style?: ViewStyle;
};

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 260,
  mass: 0.7,
};

const COLOR_ACTIVE = '#4E7158'; // zen-sage
const COLOR_INACTIVE = '#E8E4DA'; // calm soft stone

export function ZenSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  size = 'sm',
  style,
}: ZenSwitchProps) {
  const width = size === 'xs' ? 32 : size === 'sm' ? 36 : 40;
  const height = size === 'xs' ? 18 : size === 'sm' ? 20 : 22;
  const padding = 2;
  const thumbSize = height - padding * 2;
  const travelDistance = width - thumbSize - padding * 2;

  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, SPRING_CONFIG);
  }, [checked, progress]);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLOR_INACTIVE, COLOR_ACTIVE]
    );
    return {
      backgroundColor,
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * travelDistance }],
    };
  });

  const handlePress = () => {
    if (disabled || !onCheckedChange) return;
    onCheckedChange(!checked);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      disabled={disabled || !onCheckedChange}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.45 : pressed && onCheckedChange ? 0.9 : 1,
        },
        style,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            padding,
          },
          animatedTrackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
            },
            animatedThumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
});
