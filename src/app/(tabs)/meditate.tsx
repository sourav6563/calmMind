import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PracticeRow } from '@/components/ui/practice-row';
import { MEDITATIONS } from '@/constants/techniques';

export default function MeditateTabScreen() {
  const insets = useSafeAreaInsets();

  // Filter out any legacy alias for clean catalog display
  const practices = MEDITATIONS.filter((m) => m.id !== 'focused-attention');

  return (
    <View
      className="flex-1 bg-zen-cream"
      style={{ flex: 1, backgroundColor: '#F7F5EE' }}>
      {/* ── Zen Header ─────────────────────────────────────────── */}
      <View
        className="px-6 pb-2"
        style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 12 }}>
        <Text
          className="text-zen-charcoal text-3xl font-semibold"
          style={{ fontFamily: 'serif', fontSize: 32, fontWeight: '600', color: '#222522' }}>
          Meditate
        </Text>
        <Text
          className="text-zen-muted text-sm mt-1 font-medium"
          style={{ color: '#6B7068', fontSize: 14, marginTop: 4 }}>
          Find peace, presence, and stillness within
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: insets.bottom + 80,
        }}>
        {/* Meditation Cards */}
        {practices.map((meditation) => (
          <PracticeRow
            key={meditation.id}
            title={meditation.name}
            durationText={`${meditation.durationDefault} min`}
            icon={meditation.icon}
            badgeColor={meditation.badgeColor}
            onPress={() => {
              router.push(`/meditate/${meditation.id}`);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
