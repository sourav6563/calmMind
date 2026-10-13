import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/components/icons/ui-icons';
import { MeditationHalo } from '@/components/session/meditation-halo';
import { SessionScrubber } from '@/components/session/session-scrubber';
import { getMeditation, MEDITATIONS } from '@/constants/techniques';
import { useHaptics } from '@/hooks/use-haptics';
import { saveRecentSession } from '@/utils/recent-sessions';

const SUNSET_IMAGE = require('@/assets/images/zen_sunset_mist.jpg');

export default function ActiveMeditationSessionScreen() {
  const { practice: id, duration } = useLocalSearchParams<{ practice: string; duration?: string }>();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const meditation = getMeditation(id) ?? MEDITATIONS[2]; // Body Scan
  const [isPaused, setIsPaused] = useState(false);
  const parsedDuration = duration ? parseInt(duration, 10) : undefined;
  const sessionMinutes = parsedDuration && !isNaN(parsedDuration) ? parsedDuration : meditation.durationDefault;
  const totalSessionSeconds = sessionMinutes * 60;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    void saveRecentSession(meditation.id, 'meditate');
  }, [meditation.id]);

  // Rotating Prompts
  const [promptIndex, setPromptIndex] = useState(0);
  const prompts = meditation.prompts.length > 0 ? meditation.prompts : ['Rest in stillness…'];

  // Rotate prompt every 20 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [isPaused, prompts.length]);

  // Session timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev + 1 >= totalSessionSeconds) {
          clearInterval(timer);
          haptics.done();
          return totalSessionSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, totalSessionSeconds, haptics]);

  const handleClose = () => {
    haptics.tick();
    router.back();
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <View
      className="flex-1 bg-zen-charcoal relative"
      style={{ flex: 1, backgroundColor: '#211714', position: 'relative' }}>
      <StatusBar style="light" />

      {/* ── Background Twilight Artwork ─────────────────────────── */}
      <Image
        source={SUNSET_IMAGE}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        contentFit="cover"
        priority="high"
      />

      {/* ── Delicate Ambient Scrims (Top & Bottom Readability) ─── */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.12)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160 }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.65)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 }}
        pointerEvents="none"
      />
      <View
        className="absolute inset-0 bg-black/10"
        pointerEvents="none"
      />

      {/* ── Top Bar ───────────────────────────────────────────── */}
      <View
        className="px-6 flex-row items-center justify-between z-10"
        style={{ paddingTop: insets.top + 12 }}>
        <View className="w-10" />

        <View className="items-center">
          <Text
            className="text-white text-lg font-semibold tracking-wide drop-shadow-md"
            style={{ fontFamily: 'serif' }}>
            {meditation.name}
          </Text>
          <Text className="text-white/80 text-xs font-medium mt-0.5">
            {sessionMinutes} min
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close session"
          onPress={handleClose}
          className="w-10 h-10 rounded-full bg-white/20 border border-white/35 backdrop-blur-md items-center justify-center active:opacity-75">
          <CloseIcon size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* ── Center Radiant Meditation Halo ─────────────────────── */}
      <View className="flex-1 items-center justify-center px-6">
        <MeditationHalo
          currentPrompt={prompts[promptIndex]}
          isPaused={isPaused}
        />
      </View>

      {/* ── Bottom Scrubber Controls ─────────────────────────── */}
      <View
        className="w-full pb-8 z-10"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <SessionScrubber
          elapsedSeconds={elapsedSeconds}
          totalSeconds={totalSessionSeconds}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
        />
      </View>
    </View>
  );
}
