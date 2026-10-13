import React from 'react';
import { Pressable, View } from 'react-native';

import { BotanicalGlyph } from '@/components/icons/botanical-glyphs';
import { ChevronRightIcon } from '@/components/icons/ui-icons';
import { Badge, getBadgeFg } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import type { BadgeColor, TechniqueIcon } from '@/constants/techniques';
import { useHaptics } from '@/hooks/use-haptics';

export type PracticeRowProps = {
  title: string;
  durationText: string;
  icon: TechniqueIcon;
  badgeColor?: BadgeColor;
  onPress: () => void;
  className?: string;
};

export function PracticeRow({
  title,
  durationText,
  icon,
  badgeColor = 'sage',
  onPress,
  className = '',
}: PracticeRowProps) {
  const haptics = useHaptics();
  const fgColor = getBadgeFg(badgeColor);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${durationText}`}
      onPress={() => {
        haptics.tick();
        onPress();
      }}
      className={`bg-white rounded-2xl p-4 mb-3 border border-zen-border flex-row items-center justify-between active:opacity-90 active:scale-[0.99] shadow-sm ${className}`}>
      <View className="flex-row items-center flex-1 pr-3">
        <Badge color={badgeColor} size={48}>
          <BotanicalGlyph icon={icon} color={fgColor} size={24} />
        </Badge>
        <View className="ml-4 flex-1">
          <Text
            className="text-zen-charcoal text-base font-semibold"
            numberOfLines={1}>
            {title}
          </Text>
          <Text
            className="text-zen-muted text-xs mt-0.5">
            {durationText}
          </Text>
        </View>
      </View>
      <ChevronRightIcon size={18} color="#9BA098" />
    </Pressable>
  );
}
