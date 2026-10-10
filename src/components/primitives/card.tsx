import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

export type CardProps = Omit<PressableProps, 'children'> & {
  children?: ReactNode;
  /** Card surface fill (mode-tinted). */
  surfaceColor?: string;
  /** Colored hairline — never gray (calm design rule). */
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Rounded-only card with a colored hairline and a gentle pressed state.
 * Non-pressable use: pass no onPress (renders as a plain View).
 */
export function Card({
  children,
  surfaceColor = '#FFFFFF',
  borderColor = 'transparent',
  disabled,
  style,
  ...rest
}: CardProps) {
  const pressable = 'onPress' in rest || 'onLongPress' in rest;

  if (!pressable) {
    return (
      <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }, style]}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: surfaceColor,
          borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
      {...rest}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
});
