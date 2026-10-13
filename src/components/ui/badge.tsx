import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

const badgeVariants = cva('items-center justify-center rounded-full', {
  variants: {
    variant: {
      sage: 'bg-zen-badge-sage',
      cyan: 'bg-zen-badge-cyan',
      blue: 'bg-zen-badge-blue',
      lavender: 'bg-zen-badge-lavender',
      peach: 'bg-zen-badge-peach',
      blush: 'bg-zen-badge-blush',
    },
    size: {
      default: 'h-12 w-12',
      sm: 'h-9 w-9',
      lg: 'h-16 w-16',
    },
  },
  defaultVariants: {
    variant: 'sage',
    size: 'default',
  },
});

export type BadgeColor = 'sage' | 'cyan' | 'blue' | 'lavender' | 'peach' | 'blush';

const COLOR_MAP: Record<BadgeColor, { bg: string; fg: string }> = {
  sage: { bg: '#E4ECE5', fg: '#4E7158' },
  cyan: { bg: '#E0EEF1', fg: '#3D7886' },
  blue: { bg: '#E2EBF5', fg: '#42709E' },
  lavender: { bg: '#EFE7F6', fg: '#76569B' },
  peach: { bg: '#F9EBE0', fg: '#B36D48' },
  blush: { bg: '#FCE6E6', fg: '#BA4C52' },
};

export type BadgeProps = ViewProps &
  Omit<VariantProps<typeof badgeVariants>, 'size'> & {
    color?: BadgeColor;
    size?: number | 'default' | 'sm' | 'lg';
    className?: string;
    children: React.ReactNode;
  };

export function Badge({
  color = 'sage',
  size = 48,
  variant,
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  const chosenVariant = variant ?? color;
  const { bg } = COLOR_MAP[color] ?? COLOR_MAP.sage;
  const isNumericSize = typeof size === 'number';
  const variantSize = typeof size === 'string' ? size : 'default';

  return (
    <View
      className={cn(badgeVariants({ variant: chosenVariant, size: variantSize }), className)}
      style={[
        isNumericSize
          ? {
              width: size,
              height: size,
              borderRadius: size / 2,
            }
          : undefined,
        { backgroundColor: bg },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

export function getBadgeFg(color: BadgeColor): string {
  return COLOR_MAP[color]?.fg ?? '#4E7158';
}
