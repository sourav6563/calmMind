import { Platform, Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { BreathColors, FontWeight, FontSize, Radius, Spacing, TouchTarget } from '@/constants/theme';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  /** primary = filled accent pill, ghost = soft outline. */
  variant?: 'primary' | 'ghost';
  /** Accent color (defaults to calm blue). */
  color?: string;
  /** Text/outline color when on accent background. */
  onColor?: string;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

/**
 * Calm button — pill shape, 48px min touch target, gentle press feedback (no bounce).
 */
export function Button({
  label,
  variant = 'primary',
  color = BreathColors.primary,
  onColor = '#FFFFFF',
  size = 'md',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const height = size === 'lg' ? TouchTarget.sleep + 8 : TouchTarget.min;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height,
          backgroundColor: isPrimary ? color : 'transparent',
          borderWidth: isPrimary ? 0 : 1.5,
          borderColor: isPrimary ? 'transparent' : color,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
      {...rest}>
      <Text
        style={[
          styles.label,
          size === 'lg' && styles.labelLg,
          { color: isPrimary ? onColor : color },
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: FontWeight.semibold,
    paddingBottom: Platform.select({ android: 1, default: 0 }),
  },
  labelLg: {
    fontSize: FontSize.lg,
    lineHeight: 26,
    paddingBottom: Platform.select({ android: 1, default: 0 }),
  },
});
