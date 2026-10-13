import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';

export type PillOption = {
  id: string | number;
  label: string;
};

export type PillSelectorProps = {
  options: PillOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  className?: string;
};

export function PillSelector({
  options,
  selectedValue,
  onSelect,
  className = '',
}: PillSelectorProps) {
  const haptics = useHaptics();

  return (
    <View className={`flex-row items-center gap-3 ${className}`}>
      {options.map((option) => {
        const isSelected = option.id === selectedValue;
        return (
          <Pressable
            key={String(option.id)}
            accessibilityRole="button"
            onPress={() => {
              haptics.tick();
              onSelect(option.id);
            }}
            className={`flex-1 py-3 px-4 rounded-full items-center justify-center border active:opacity-85 ${
              isSelected
                ? 'bg-zen-sage border-zen-sage shadow-xs'
                : 'bg-white border-zen-border shadow-xs'
            }`}>
            <Text
              className={`text-sm ${
                isSelected ? 'text-white font-semibold' : 'text-zen-charcoal font-medium'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
