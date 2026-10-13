import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotanicalGlyph } from '@/components/icons/botanical-glyphs';
import { BackArrowIcon } from '@/components/icons/ui-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHaptics } from '@/hooks/use-haptics';

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const presets = ['₹49 ❤️', '₹99 ❤️', '₹199 ❤️'];

  const handleContribute = (amount: string) => {
    haptics.done();
    Alert.alert(
      'Thank You! ❤️',
      `Thank you so deeply for supporting calmMind with ${amount}. Your kindness helps keep this sanctuary ad-free and open for everyone.`,
    );
  };

  return (
    <View
      className="flex-1 bg-zen-cream"
      style={{ flex: 1, backgroundColor: '#F7F5EE' }}>
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <View
        className="px-5 pt-3 pb-3 flex-row items-center justify-between"
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

        <Text
          className="text-zen-charcoal text-lg font-semibold"
          style={{ fontFamily: 'serif' }}>
          Support
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 28,
          paddingTop: 16,
          paddingBottom: insets.bottom + 40,
        }}>
        {/* Botanical Leaf Emblem */}
        <View className="items-center mt-4 mb-4">
          <Badge color="sage" size={64}>
            <BotanicalGlyph icon="leaf" color="#4E7158" size={32} />
          </Badge>
        </View>

        {/* Title & Description */}
        <View className="items-center mb-8">
          <Text
            className="text-zen-charcoal text-2xl font-semibold text-center"
            style={{ fontFamily: 'serif' }}>
            Make a difference
          </Text>
          <Text className="text-zen-muted text-sm text-center mt-3 leading-6 px-2">
            This app is free and has no account required. If you&apos;ve found value in it, consider supporting its continued development.
          </Text>
        </View>

        {/* Contribution Buttons */}
        <View className="gap-3.5 mb-8">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              onPress={() => handleContribute(preset)}
              className="py-4 rounded-2xl bg-white border-zen-border shadow-xs">
              <Text className="text-zen-charcoal text-base font-semibold">
                {preset}
              </Text>
            </Button>
          ))}

          <Button
            variant="ghost"
            onPress={() => {
              haptics.tick();
              Alert.alert('Custom Contribution', 'Enter any amount you wish to support with.');
            }}
            className="py-3 rounded-2xl bg-transparent">
            <Text className="text-zen-muted text-sm font-medium">
              Choose your own amount
            </Text>
          </Button>
        </View>

        {/* Thank You Note & Botanical Accents */}
        <View className="items-center mt-6">
          <Text className="text-red-500 text-lg mb-1">❤️</Text>
          <Text
            className="text-zen-charcoal text-base font-semibold"
            style={{ fontFamily: 'serif' }}>
            Thank you
          </Text>
          <Text className="text-zen-muted text-xs mt-0.5">
            for supporting!
          </Text>

          {/* Botanical footer flourish */}
          <View className="flex-row items-center gap-4 mt-6 opacity-60">
            <BotanicalGlyph icon="leaf" color="#4E7158" size={24} />
            <BotanicalGlyph icon="lotus" color="#4E7158" size={24} />
            <BotanicalGlyph icon="leaf" color="#4E7158" size={24} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
