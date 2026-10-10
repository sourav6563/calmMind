import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { SessionComplete } from '@/components/session/session-complete';
import { TimerRing } from '@/components/session/timer-ring';
import { Button } from '@/components/primitives/button';
import { Screen } from '@/components/primitives/screen';
import { ThemedText } from '@/components/themed-text';
import { getMeditation } from '@/constants/techniques';
import { FontSize, FontWeight, Radius, Spacing, modePalette } from '@/constants/theme';
import { useColorSchemeName } from '@/hooks/use-color-scheme-name';
import { useControlsFade } from '@/hooks/use-controls-fade';
import { useHaptics } from '@/hooks/use-haptics';
import { useSessionTimer } from '@/hooks/use-session-timer';
import { saveRecentSession } from '@/utils/recent-sessions';

/**
 * Meditation session — same skeleton as the breathing session, lavender palette.
 * Countdown ring + rotating prompt + minimal controls.
 */
export default function MeditateSessionScreen() {
  const { practice: practiceId } = useLocalSearchParams<{ practice: string }>();
  const practice = getMeditation(practiceId);
  const scheme = useColorSchemeName();
  const palette = useMemo(() => modePalette('meditate', scheme), [scheme]);
  const haptics = useHaptics();

  useEffect(() => {
    if (practice?.id) {
      void saveRecentSession(practice.id, 'meditate');
    }
  }, [practice?.id]);

  const [durationMin, setDurationMin] = useState(practice?.durationDefault ?? 10);
  const [running, setRunning] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const totalSeconds = durationMin * 60;

  // Calm completion when the countdown ends (invoked from the ticker).
  // Plain function on purpose — stored in a ref inside the timer, no memo needed.
  const handleFinished = () => {
    setRunning(false);
    setShowComplete(true);
    haptics.done();
  };

  const timer = useSessionTimer(totalSeconds, running && !showComplete, handleFinished);

  // Controls auto-fade while running.
  const { opacity: controlsOpacity, reveal: revealControls } = useControlsFade(running);

  if (!practice) {
    return (
      <Screen mode="meditate" style={styles.missing}>
        <ThemedText type="subtitle">Practice not found</ThemedText>
        <Button label="Go back" onPress={() => router.back()} />
      </Screen>
    );
  }

  // Rotating guidance prompt based on elapsed progress.
  const promptIndex = Math.min(
    Math.floor(timer.progress * practice.prompts.length),
    practice.prompts.length - 1,
  );
  const prompt = practice.prompts[Math.max(0, promptIndex)];

  const elapsedMin = Math.floor((totalSeconds - timer.secondsLeft) / 60);

  return (
    <Screen mode="meditate" edges={['top', 'bottom']} style={styles.container} onTouchStart={revealControls}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => {
            haptics.tick();
            router.back();
          }}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backPill,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <ThemedText style={[styles.backArrow, { color: palette.glow }]}>‹</ThemedText>
          <ThemedText style={styles.backText}>Back</ThemedText>
        </Pressable>

        <ThemedText style={styles.headerTitle}>{practice.name}</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Duration picker — only before starting */}
      {!running && timer.secondsLeft === totalSeconds && !showComplete && (
        <View style={styles.durationRow}>
          {practice.durations.map((min) => (
            <Pressable
              key={min}
              accessibilityRole="button"
              accessibilityLabel={`${min} minutes`}
              onPress={() => {
                haptics.tick();
                setDurationMin(min);
                timer.reset();
              }}
              style={({ pressed }) => [
                styles.durationChip,
                {
                  backgroundColor: min === durationMin ? palette.primary : palette.surface,
                  borderColor: min === durationMin ? palette.glow : palette.border,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}>
              <ThemedText
                style={[
                  styles.durationText,
                  { color: min === durationMin ? '#FFFFFF' : palette.onSurface },
                ]}>
                {min} min
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}

      {/* Timer ring */}
      <View style={styles.ringWrap}>
        <TimerRing
          secondsLeft={timer.secondsLeft}
          progress={timer.progress}
          palette={palette}
          size={240}
        />
      </View>

      {/* Guidance prompt */}
      <View style={styles.promptWrap}>
        <ThemedText style={styles.prompt} numberOfLines={2}>
          {running || timer.progress > 0 ? prompt : practice.benefit}
        </ThemedText>
      </View>

      {/* Controls */}
      <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
        <Button
          label={running ? 'Pause' : timer.progress > 0 ? 'Resume' : 'Begin'}
          onPress={() => setRunning((r) => !r)}
          color={palette.primary}
          size="lg"
          style={styles.mainBtn}
        />
        {(running || (timer.progress > 0 && !timer.finished)) && (
          <Button label="End session" variant="ghost" color={palette.secondary} onPress={() => setShowComplete(true)} />
        )}
      </Animated.View>

      {showComplete && (
        <SessionComplete
          palette={palette}
          lines={[
            practice.name,
            `${Math.max(1, elapsedMin)} ${elapsedMin === 1 ? 'minute' : 'minutes'}`,
          ]}
          onDone={() => router.back()}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    marginBottom: 4,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  backArrow: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: FontWeight.light,
  },
  backText: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
  },
  headerTitle: {
    fontSize: FontSize.md,
    lineHeight: 22,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 68,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  durationChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    minHeight: 40,
    justifyContent: 'center',
  },
  durationText: {
    fontSize: FontSize.sm,
    lineHeight: 18,
    fontWeight: FontWeight.semibold,
  },
  ringWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptWrap: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  prompt: {
    fontSize: FontSize.lg,
    textAlign: 'center',
    lineHeight: FontSize.lg + 8,
    paddingBottom: 2,
  },
  controls: {
    gap: Spacing.two,
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
  mainBtn: {
    alignSelf: 'stretch',
  },
});
