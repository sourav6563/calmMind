import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { BotanicalGlyph } from '@/components/icons/botanical-glyphs';
import { ClockIcon, PlayIcon, SparkleIcon } from '@/components/icons/ui-icons';
import { Badge, getBadgeFg } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getMeditation, getTechnique, MEDITATIONS, TECHNIQUES } from '@/constants/techniques';
import { useHaptics } from '@/hooks/use-haptics';
import type { RecentSessionItem } from '@/utils/recent-sessions';

export type RecentPracticeCardProps = {
  recent: RecentSessionItem;
  isNewUser: boolean;
  onPressSession: (url: string) => void;
};

export function RecentPracticeCard({
  recent,
  isNewUser,
  onPressSession,
}: RecentPracticeCardProps) {
  const haptics = useHaptics();

  const isBreathe = recent.mode === 'breathe';
  const technique = isBreathe ? getTechnique(recent.id) ?? TECHNIQUES[0] : null;
  const meditation = !isBreathe ? getMeditation(recent.id) ?? MEDITATIONS[2] : null;

  const title = technique?.name ?? meditation?.name ?? 'Box Breathing';
  const duration = technique?.estimatedMinutes ?? meditation?.durationDefault ?? 4;
  const icon = technique?.icon ?? meditation?.icon ?? 'box';
  const badgeColor = technique?.badgeColor ?? meditation?.badgeColor ?? 'sage';
  const categoryLabel = isBreathe ? 'Breath' : 'Meditation';
  const sessionUrl = isBreathe
    ? `/breathe/session/${technique?.id ?? 'box'}`
    : `/meditate/session/${meditation?.id ?? 'body-scan'}`;

  const fgColor = getBadgeFg(badgeColor);

  const handlePress = () => {
    haptics.tick();
    onPressSession(sessionUrl);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${isNewUser ? 'Daily starter' : 'Recent practice'}: ${title}, ${categoryLabel}, ${duration} minutes. Tap to begin.`}
      onPress={handlePress}
      className="active:scale-[0.985]">
      <Card
        className="overflow-hidden"
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#EAE6DB',
          shadowColor: '#32281E',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}>
        <View className="flex-row items-center justify-between">
          {/* Left: Botanical Emblem + Title & Meta */}
          <View className="flex-row items-center flex-1 pr-2.5">
            <Badge color={badgeColor} size={44} className="mr-3">
              <BotanicalGlyph icon={icon} color={fgColor} size={23} />
            </Badge>

            <View className="flex-1">
              {/* Overline Status Tag */}
              <View className="flex-row items-center gap-1 mb-0.5">
                {isNewUser ? (
                  <SparkleIcon size={11} color="#4E7158" />
                ) : (
                  <ClockIcon size={11} color="#8B9088" />
                )}
                <Text
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    letterSpacing: 0.6,
                    color: isNewUser ? '#4E7158' : '#8B9088',
                  }}>
                  {isNewUser ? 'Daily Starter' : 'Recent Practice'}
                </Text>
              </View>

              {/* Practice Name */}
              <Text
                className="text-zen-charcoal text-lg font-semibold"
                style={{
                  fontFamily: 'serif',
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#222522',
                  letterSpacing: -0.2,
                }}
                numberOfLines={1}>
                {title}
              </Text>

              {/* Clean Meta: Category & Duration */}
              <Text
                className="text-zen-muted text-xs mt-0.5 font-medium"
                style={{ color: '#6B7068', fontSize: 12 }}>
                {categoryLabel} • {duration} min
              </Text>
            </View>
          </View>

          {/* Right: Tactile Action Button */}
          <View
            className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-full active:opacity-90"
            style={{
              backgroundColor: '#4E7158',
              shadowColor: '#4E7158',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <PlayIcon size={11} color="#FFFFFF" />
            <Text
              className="text-xs font-semibold text-white tracking-wide"
              style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
              {isNewUser ? 'Begin' : 'Resume'}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
