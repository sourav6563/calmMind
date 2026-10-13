import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotanicalGlyph } from '@/components/icons/botanical-glyphs';
import { BackArrowIcon } from '@/components/icons/ui-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InfoCard } from '@/components/ui/info-card';
import { getMeditation, MEDITATIONS } from '@/constants/techniques';
import { useHaptics } from '@/hooks/use-haptics';

export default function MeditateDetailScreen() {
  const { practice: id } = useLocalSearchParams<{ practice: string }>();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const meditation = getMeditation(id) ?? MEDITATIONS[2]; // Default to Body Scan

  const handleStart = () => {
    haptics.tick();
    router.push(`/meditate/session/${meditation.id}`);
  };

  const meditationSteps = [
    'Find a quiet space and settle into an upright, relaxed posture.',
    'Rest your hands naturally on your lap and soften your eyes.',
    'Let your breathing flow naturally without attempting to control it.',
    'Rest your awareness with the gentle prompts appearing on screen.',
  ];

  return (
    <View
      className="flex-1 bg-zen-cream"
      style={{ flex: 1, backgroundColor: '#F7F5EE' }}>
      {/* ── Top Bar ────────────────────────────────────────── */}
      <View
        className="px-5 pt-3 pb-2 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => {
            haptics.tick();
            router.back();
          }}
          className="w-10 h-10 rounded-full items-center justify-center -ml-2 active:opacity-60">
          <BackArrowIcon size={22} color="#222522" />
        </Pressable>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: insets.bottom + 110,
        }}>
        {/* Centered Botanical Emblem */}
        <View className="items-center mt-2 mb-4">
          <Badge color={meditation.badgeColor} size={68}>
            <BotanicalGlyph icon={meditation.icon} color="#B36D48" size={36} />
          </Badge>
        </View>

        {/* Title & Description */}
        <View className="items-center mb-6">
          <Text
            className="text-zen-charcoal text-2xl font-semibold text-center"
            style={{ fontFamily: 'serif' }}>
            {meditation.name}
          </Text>
          <Text className="text-zen-muted text-sm text-center mt-2 px-4 leading-5">
            {meditation.tagline}
          </Text>
        </View>

        {/* Info Card (Metadata) */}
        <View className="mb-6">
          <InfoCard
            durationText={`${meditation.durationDefault} minutes`}
            benefitText={meditation.benefit}
            bestForText={meditation.bestFor}
            badgeColor="peach"
          />
        </View>

        {/* Step-by-Step Instructions */}
        <View className="mb-6">
          <Text className="text-zen-charcoal text-base font-semibold mb-3">
            Mindful guidance
          </Text>
          <Card className="p-4 bg-white/90 border-zen-border gap-3">
            {meditationSteps.map((step, idx) => (
              <View key={idx} className="flex-row items-start">
                <View className="w-6 h-6 rounded-full bg-zen-peach/10 items-center justify-center mr-3 mt-0.5 shrink-0">
                  <Text className="text-zen-peach text-xs font-semibold">
                    {idx + 1}
                  </Text>
                </View>
                <Text className="text-zen-charcoal text-sm leading-5 flex-1">
                  {step}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* ── Bottom Fixed Action Button ──────────────────────── */}
      <View
        className="absolute inset-x-0 bottom-0 px-6 bg-zen-cream/95 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button
          variant="sage"
          size="pill"
          onPress={handleStart}
          className="w-full">
          Start Meditation
        </Button>
      </View>
    </View>
  );
}
