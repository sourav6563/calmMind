import React from 'react';
import { View } from 'react-native';

import { ClockIcon, CompassIcon, SparkleIcon } from '@/components/icons/ui-icons';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

export type InfoCardProps = {
  durationText: string;
  benefitText?: string;
  bestForText?: string;
  badgeColor?: 'sage' | 'peach';
  className?: string;
};

export function InfoCard({
  durationText,
  benefitText,
  bestForText,
  badgeColor = 'sage',
  className = '',
}: InfoCardProps) {
  const iconColor = badgeColor === 'peach' ? '#B36D48' : '#4E7158';
  const badgeBg = badgeColor === 'peach' ? 'bg-zen-peach/10' : 'bg-zen-sage/10';

  return (
    <Card className={`p-4 bg-white/95 border-zen-border shadow-xs ${className}`}>
      {/* Duration Row */}
      <View className="flex-row items-center py-2">
        <View className={`w-8 h-8 rounded-full ${badgeBg} items-center justify-center mr-3`}>
          <ClockIcon size={16} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-zen-charcoal text-sm font-medium">
            {durationText}
          </Text>
        </View>
      </View>

      {benefitText && (
        <>
          <Separator className="my-1" />
          {/* Benefit Row */}
          <View className="flex-row items-center py-2">
            <View className={`w-8 h-8 rounded-full ${badgeBg} items-center justify-center mr-3`}>
              <SparkleIcon size={16} color={iconColor} />
            </View>
            <View className="flex-1">
              <Text className="text-zen-charcoal text-sm font-medium">
                {benefitText}
              </Text>
            </View>
          </View>
        </>
      )}

      {bestForText && (
        <>
          <Separator className="my-1" />
          {/* Best For Row */}
          <View className="flex-row items-center py-2">
            <View className={`w-8 h-8 rounded-full ${badgeBg} items-center justify-center mr-3`}>
              <CompassIcon size={16} color={iconColor} />
            </View>
            <View className="flex-1">
              <Text className="text-zen-charcoal text-sm font-medium">
                {bestForText}
              </Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}
