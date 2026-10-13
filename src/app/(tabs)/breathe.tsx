import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PracticeRow } from '@/components/ui/practice-row';
import { TECHNIQUES } from '@/constants/techniques';

export default function BreatheTabScreen() {
  const insets = useSafeAreaInsets();

  // Filter out any alias techniques for clean catalog display
  const practices = TECHNIQUES.filter((t) => t.id !== 'coherent' && t.id !== 'physiological-sigh');

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
          Breath
        </Text>
        <Text
          className="text-zen-muted text-sm mt-1 font-medium"
          style={{ color: '#6B7068', fontSize: 14, marginTop: 4 }}>
          Simple techniques to calm your nervous system
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: insets.bottom + 80,
        }}>
        {/* Practice Cards */}
        {practices.map((technique) => (
          <PracticeRow
            key={technique.id}
            title={technique.name}
            durationText={`${technique.estimatedMinutes} min`}
            icon={technique.icon}
            badgeColor={technique.badgeColor}
            onPress={() => {
              router.push(`/breathe/${technique.id}`);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
