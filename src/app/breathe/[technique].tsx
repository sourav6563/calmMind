import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Path, Rect, Svg } from 'react-native-svg';

import { Button } from '@/components/primitives/button';
import { Screen } from '@/components/primitives/screen';
import { BreathingOrb } from '@/components/session/breathing-orb';
import { PhaseLabel } from '@/components/session/phase-label';
import { SessionComplete } from '@/components/session/session-complete';
import { SessionIntro } from '@/components/session/session-intro';
import { ThemedText } from '@/components/themed-text';
import { getTechnique } from '@/constants/techniques';
import { FontSize, FontWeight, Motion, Radius, Spacing, modePalette } from '@/constants/theme';
import { useBreathPhase } from '@/hooks/use-breath-phase';
import { useColorSchemeName } from '@/hooks/use-color-scheme-name';
import { useControlsFade } from '@/hooks/use-controls-fade';
import { useHaptics } from '@/hooks/use-haptics';
import { saveRecentSession } from '@/utils/recent-sessions';

/**
 * Breathing session — minimalist, gallery-calm stage.
 * Pure round 5-layer Obsidian + Aurora Teal orb is the sole focus.
 */
const BREATH_ORB_SIZE = 276;

export default function BreatheSessionScreen() {
  const { technique: techniqueId } = useLocalSearchParams<{ technique: string }>();
  const technique = getTechnique(techniqueId);
  const scheme = useColorSchemeName();
  const palette = useMemo(() => modePalette('breathe', scheme), [scheme]);
  const haptics = useHaptics();

  useEffect(() => {
    if (technique?.id) {
      void saveRecentSession(technique.id, 'breathe');
    }
  }, [technique?.id]);

  const [selectedCycles, setSelectedCycles] = useState(technique?.cyclesDefault ?? 0);
  const [running, setRunning] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const startedAtRef = useRef(0);

  const totalCycles = selectedCycles;
  const aurora = palette.secondary;

  const handleEnd = () => {
    setRunning(false);
    setShowComplete(true);
    haptics.done();
  };

  const breath = useBreathPhase(technique?.phases ?? [], {
    running,
    cycles: totalCycles,
    onEnd: handleEnd,
  });

  // Gentle tick on each phase boundary (eyes-closed usability).
  const prevPhaseRef = useRef(-1);
  useEffect(() => {
    if (running && breath.phaseIndex !== prevPhaseRef.current) {
      haptics.tick();
      prevPhaseRef.current = breath.phaseIndex;
    }
  }, [breath.phaseIndex, running, haptics]);

  // Session elapsed clock.
  useEffect(() => {
    if (running && startedAtRef.current === 0) {
      startedAtRef.current = Date.now() - elapsedSec * 1000;
    }
    if (!running || showComplete) return;
    const id = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [running, showComplete, elapsedSec]);

  // Controls auto-fade while running (calm: uncluttered session screen).
  const { opacity: controlsOpacity, reveal: revealControls } = useControlsFade(running);

  // Session entry — 800ms bloom-in.
  const [enterOpacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(enterOpacity, {
      toValue: 1,
      duration: Motion.sessionEnter,
      useNativeDriver: true,
    }).start();
  }, [enterOpacity]);

  if (!technique) {
    return (
      <Screen mode="breathe" style={styles.missing}>
        <ThemedText type="subtitle">Technique not found</ThemedText>
        <Button label="Go back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const summaryMin = Math.floor(elapsedSec / 60);
  const summarySec = elapsedSec % 60;

  if (showIntro) {
    return (
      <Screen mode="breathe" edges={['top', 'bottom']} style={styles.container}>
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
        </View>
        <SessionIntro
          technique={technique}
          palette={palette}
          selectedCycles={selectedCycles}
          onSelectCycles={setSelectedCycles}
          onBegin={() => {
            setShowIntro(false);
            startedAtRef.current = Date.now();
            setRunning(true);
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      mode="breathe"
      edges={['top', 'bottom']}
      style={styles.container}
      onTouchStart={revealControls}>
      <Animated.View style={[styles.root, { opacity: enterOpacity }]}>
        {/* Minimal header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close session"
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

          <View
            style={[
              styles.roundBadge,
              {
                backgroundColor: `${palette.secondary}18`,
                borderColor: `${palette.secondary}35`,
              },
            ]}>
            <ThemedText style={[styles.roundBadgeText, { color: palette.glow }]}>
              {totalCycles > 0
                ? `Round ${breath.cycle} of ${totalCycles}`
                : `Round ${breath.cycle}`}
            </ThemedText>
          </View>
        </View>

        {/* Breath stage — pure round concentric orb + minimal phase dots + quiet timer */}
        <View style={styles.stage}>
          <BreathingOrb
            phase={breath.phase}
            phaseIndex={breath.phaseIndex}
            phaseCount={technique.phases.length}
            running={running && !showComplete}
            palette={palette}
            tint={technique.orbTint}
            cue={breath.phase.cue}
            size={BREATH_ORB_SIZE}>
            <PhaseLabel phase={breath.phase} phaseIndex={breath.phaseIndex} />
          </BreathingOrb>

          {/* Subtle round phase indicator dots */}
          <View style={styles.dotsRow}>
            {technique.phases.map((p, idx) => {
              const active = idx === breath.phaseIndex;
              return (
                <View
                  key={`${p.label}-${idx}`}
                  style={[
                    styles.phaseDot,
                    {
                      backgroundColor: active ? aurora : palette.onSurface,
                      opacity: active ? 1 : 0.18,
                      transform: [{ scale: active ? 1.25 : 1 }],
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Quiet countdown */}
          <ThemedText style={styles.timer}>
            {breath.secondsLeft}
            <ThemedText style={[styles.timerUnit, { color: aurora }]}>s</ThemedText>
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
            {technique.name}
          </ThemedText>
        </View>

        {/* Minimalist control — Obsidian circle with Aurora Teal halo; fixed-height End slot */}
        <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
          <PausePlayButton
            paused={!running}
            fill={palette.primary}
            aurora={aurora}
            onPress={() => {
              haptics.tick();
              setRunning((r) => !r);
            }}
          />
          <View style={styles.endSlot}>
            {breath.status === 'paused' && (
              <Button
                label="End session"
                variant="ghost"
                color={aurora}
                onPress={handleEnd}
              />
            )}
          </View>
        </Animated.View>
      </Animated.View>

      {showComplete && (
        <SessionComplete
          palette={palette}
          accentColor={palette.primary}
          lines={[
            technique.name,
            `${breath.cycle} ${breath.cycle === 1 ? 'round' : 'rounds'}`,
            summaryMin > 0 ? `${summaryMin} min ${summarySec} sec` : `${summarySec} seconds`,
          ]}
          onDone={() => router.back()}
        />
      )}
    </Screen>
  );
}

/** Circular Calm Blue pause / play control framed by a soft blue halo. */
function PausePlayButton({
  paused,
  fill,
  aurora,
  onPress,
}: {
  paused: boolean;
  fill: string;
  aurora: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={paused ? 'Resume' : 'Pause'}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        ctrlStyles.outerHalo,
        {
          backgroundColor: `${aurora}22`,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}>
      <View
        style={[
          ctrlStyles.circle,
          {
            backgroundColor: fill,
          },
        ]}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
          {paused ? (
            <Path d="M8.5 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L10 4.64A1 1 0 0 0 8.5 5.5Z" />
          ) : (
            <>
              <Rect x={6.5} y={5} width={4} height={14} rx={1.6} />
              <Rect x={13.5} y={5} width={4} height={14} rx={1.6} />
            </>
          )}
        </Svg>
      </View>
    </Pressable>
  );
}

const ctrlStyles = StyleSheet.create({
  outerHalo: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  root: {
    flex: 1,
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
  roundBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  roundBadgeText: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.one,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timer: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.light,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    lineHeight: FontSize.xl + 8,
    paddingBottom: 2,
    opacity: 0.92,
  },
  timerUnit: {
    fontSize: FontSize.sm,
    lineHeight: 18,
    fontWeight: FontWeight.semibold,
  },
  caption: {
    fontSize: FontSize.sm,
    lineHeight: 18,
    paddingBottom: 1,
    opacity: 0.78,
  },
  controls: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  endSlot: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




