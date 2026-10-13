import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecentPracticeCard } from '@/components/home/recent-practice-card';
import { BotanicalGlyph } from '@/components/icons/botanical-glyphs';
import { ChevronRightIcon, SettingsIcon } from '@/components/icons/ui-icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useRecentSession } from '@/utils/recent-sessions';

const LAKE_IMAGE = require('@/assets/images/zen_lake_mist.jpg');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const { recent, isNewUser, refresh } = useRecentSession();

  // Keep recent session always in sync when returning to Home
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const handleStartSession = (url: string) => {
    router.push(url as any);
  };

  return (
    <View
      className="flex-1 bg-zen-cream"
      style={{ flex: 1, backgroundColor: '#F7F5EE' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}>
        {/* ── 1. Top Landscape Artwork Banner ───────────────────────── */}
        <View
          className="w-full relative overflow-hidden"
          style={{ width: '100%', height: 460, position: 'relative' }}>
          <Image
            source={LAKE_IMAGE}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            contentPosition="center"
            priority="high"
          />

          {/* Soft Bottom Horizon Blend into Zen Cream */}
          <LinearGradient
            colors={['transparent', 'rgba(247, 245, 238, 0.3)', 'rgba(247, 245, 238, 0.8)', '#F7F5EE']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 }}
            pointerEvents="none"
          />

          {/* ── Top Right Settings Button ──────────────────────── */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={() => {
              haptics.tick();
              router.push('/settings');
            }}
            className="active:opacity-75"
            style={{
              position: 'absolute',
              top: insets.top + 12,
              right: 20,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              borderWidth: 1,
              borderColor: 'rgba(234, 230, 219, 0.9)',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#32281E',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
              zIndex: 10,
            }}>
            <SettingsIcon size={21} color="#222522" />
          </Pressable>

          {/* Centered Serif Title over serene landscape */}
          <View
            className="absolute inset-x-0 items-center justify-center px-6"
            style={{
              position: 'absolute',
              top: insets.top + 38,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}>
            <Text
              className="text-zen-charcoal text-4xl font-semibold tracking-wide"
              style={{
                fontFamily: 'serif',
                fontSize: 38,
                fontWeight: '600',
                color: '#222522',
                letterSpacing: 0.4,
              }}>
              calmMind
            </Text>
            <Text
              className="text-zen-muted text-sm mt-1.5 font-medium tracking-normal text-center"
              style={{
                color: '#6B7068',
                fontSize: 14,
                marginTop: 6,
                letterSpacing: 0.2,
              }}>
              A calmer mind. A kinder you.
            </Text>
          </View>
        </View>

        {/* ── 2. Hero: Recent / Daily Starter Practice Card ───────── */}
        <View className="px-5 -mt-8">
          <RecentPracticeCard
            recent={recent}
            isNewUser={isNewUser}
            onPressSession={handleStartSession}
          />
        </View>

        {/* ── 3. Dual Practice Exploration Cards (Side-by-Side) ───── */}
        <View className="px-5 mt-6">
          <Text
            className="text-zen-charcoal text-xl font-semibold mb-3 px-0.5"
            style={{ fontFamily: 'serif', fontSize: 19, fontWeight: '600', color: '#222522' }}>
            Practices
          </Text>

          <View className="flex-row gap-3">
            {/* 1. Breathe Card */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Breathe. Rhythms to calm your nervous system. 6 practices available."
              onPress={() => {
                haptics.tick();
                router.navigate('/(tabs)/breathe');
              }}
              className="flex-1 active:scale-[0.985]">
              <Card
                className="items-center justify-between"
                style={{
                  minHeight: 168,
                  paddingVertical: 16,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#EAE6DB',
                  shadowColor: '#32281E',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 1,
                }}>
                <Badge color="sage" size={44} className="mb-2">
                  <BotanicalGlyph icon="leaf" color="#4E7158" size={24} />
                </Badge>
                <Text
                  className="text-zen-charcoal text-base font-semibold"
                  style={{ fontFamily: 'serif', fontSize: 17, fontWeight: '600', color: '#222522' }}>
                  Breathe
                </Text>
                <Text
                  className="text-zen-muted text-xs text-center mt-0.5 mb-2.5 leading-4"
                  style={{ color: '#6B7068', fontSize: 11.5, lineHeight: 15 }}>
                  Rhythms to calm your nervous system
                </Text>

                {/* Footer Count & Chevron */}
                <View
                  className="flex-row items-center justify-between w-full pt-2 border-t border-zen-border/60"
                  style={{ borderTopWidth: 1, borderTopColor: '#EAE6DB', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    className="text-[11px] font-semibold text-zen-dim"
                    style={{ color: '#4E7158', fontSize: 11, fontWeight: '600' }}>
                    6 practices
                  </Text>
                  <ChevronRightIcon size={13} color="#9BA098" />
                </View>
              </Card>
            </Pressable>

            {/* 2. Meditate Card */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Meditate. Practices for inner peace and presence. 4 practices available."
              onPress={() => {
                haptics.tick();
                router.navigate('/(tabs)/meditate');
              }}
              className="flex-1 active:scale-[0.985]">
              <Card
                className="items-center justify-between"
                style={{
                  minHeight: 168,
                  paddingVertical: 16,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#EAE6DB',
                  shadowColor: '#32281E',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 1,
                }}>
                <Badge color="peach" size={44} className="mb-2">
                  <BotanicalGlyph icon="scan" color="#B36D48" size={24} />
                </Badge>
                <Text
                  className="text-zen-charcoal text-base font-semibold"
                  style={{ fontFamily: 'serif', fontSize: 17, fontWeight: '600', color: '#222522' }}>
                  Meditate
                </Text>
                <Text
                  className="text-zen-muted text-xs text-center mt-0.5 mb-2.5 leading-4"
                  style={{ color: '#6B7068', fontSize: 11.5, lineHeight: 15 }}>
                  Practices for inner peace & presence
                </Text>

                {/* Footer Count & Chevron */}
                <View
                  className="flex-row items-center justify-between w-full pt-2 border-t border-zen-border/60"
                  style={{ borderTopWidth: 1, borderTopColor: '#EAE6DB', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    className="text-[11px] font-semibold text-zen-dim"
                    style={{ color: '#B36D48', fontSize: 11, fontWeight: '600' }}>
                    4 practices
                  </Text>
                  <ChevronRightIcon size={13} color="#9BA098" />
                </View>
              </Card>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
