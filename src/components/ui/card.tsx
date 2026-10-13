import React from 'react';
import { Text, type TextProps, View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export function Card({ className, style, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        'rounded-3xl border border-zen-border bg-white p-5 shadow-sm',
        className,
      )}
      style={style}
      {...props}
    />
  );
}

export function CardHeader({ className, style, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex flex-col space-y-1.5 pb-3', className)}
      style={style}
      {...props}
    />
  );
}

export function CardTitle({ className, style, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        'text-xl font-semibold leading-none tracking-tight text-zen-charcoal',
        className,
      )}
      style={[{ fontFamily: 'serif' }, style]}
      {...props}
    />
  );
}

export function CardDescription({ className, style, ...props }: TextProps) {
  return (
    <Text
      className={cn('text-sm text-zen-muted', className)}
      style={style}
      {...props}
    />
  );
}

export function CardContent({ className, style, ...props }: ViewProps) {
  return (
    <View
      className={cn('pt-0', className)}
      style={style}
      {...props}
    />
  );
}

export function CardFooter({ className, style, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex flex-row items-center pt-3', className)}
      style={style}
      {...props}
    />
  );
}
