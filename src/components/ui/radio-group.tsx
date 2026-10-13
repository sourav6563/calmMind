import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { cn } from '@/lib/utils';

export type RadioOption<T extends string = string> = {
  id: T;
  label: string;
};

export type RadioGroupProps<T extends string = string> = {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  direction?: 'vertical' | 'horizontal';
  className?: string;
};

export function RadioGroup<T extends string = string>({
  options,
  value,
  onChange,
  direction = 'vertical',
  className = '',
}: RadioGroupProps<T>) {
  const haptics = useHaptics();

  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={(val) => {
        haptics.tick();
        onChange(val as T);
      }}
      className={cn(
        'bg-white rounded-2xl p-2 border border-zen-border shadow-xs',
        direction === 'horizontal' ? 'flex-row items-center justify-around' : '',
        className,
      )}>
      {options.map((option, index) => {
        const isSelected = option.id === value;
        return (
          <RadioGroupPrimitive.Item
            key={option.id}
            value={option.id}
            asChild>
            <Pressable
              onPress={() => {
                if (!isSelected) {
                  haptics.tick();
                  onChange(option.id);
                }
              }}
              className={cn(
                'flex-row items-center p-3.5 rounded-xl active:opacity-80',
                direction === 'horizontal' ? 'flex-1 justify-center' : '',
                direction === 'vertical' && index < options.length - 1 ? 'border-b border-zen-border/50' : '',
              )}>
              {/* Custom Zen Radio Circle */}
              <View
                className={cn(
                  'w-5 h-5 rounded-full border items-center justify-center mr-3',
                  isSelected ? 'border-zen-sage bg-zen-sageSoft' : 'border-zen-dim/60 bg-transparent',
                )}>
                <RadioGroupPrimitive.Indicator asChild>
                  <View className="w-2.5 h-2.5 rounded-full bg-zen-sage" />
                </RadioGroupPrimitive.Indicator>
              </View>

              <Text
                className={cn(
                  'text-base',
                  isSelected ? 'text-zen-charcoal font-semibold' : 'text-zen-muted font-medium',
                )}>
                {option.label}
              </Text>
            </Pressable>
          </RadioGroupPrimitive.Item>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}
