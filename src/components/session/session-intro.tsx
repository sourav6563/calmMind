import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/primitives/button';
import { TechniqueGlyph } from '@/components/session/technique-icon';
import { ThemedText } from '@/components/themed-text';
import type { Technique } from '@/constants/techniques';
import {
  BreathColors,
  FontSize,
  FontWeight,
  Neutral,
  Radius,
  Spacing,
  type ModePalette,
} from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';

export type SessionIntroProps = {
  technique: Technique;
  palette: ModePalette;
  selectedCycles?: number;
  onSelectCycles?: (cycles: number) => void;
  onBegin: () => void;
};

/**
 * Serene, uncluttered pre-start intro sheet (clean single-card layout):
 * - Round Calm Blue emblem with soft halo
 * - Technique title & concise rhythm meta
 * - Minimal floating round picker chips
 * - Single peaceful How-To steps card
 * - Sleek Begin button
 */
export function SessionIntro({
  technique,
  palette,
  selectedCycles,
  onSelectCycles,
  onBegin,
}: SessionIntroProps) {
  const haptics = useHaptics();
  const [internalCycles, setInternalCycles] = useState(technique.cyclesDefault);
  const activeCycles = selectedCycles ?? internalCycles;

  const handleSelectCycles = (c: number) => {
    haptics.tick();
    setInternalCycles(c);
    onSelectCycles?.(c);
  };

  const starlight = palette.secondary;
  const totalSec = technique.phases.reduce((sum, p) => sum + p.seconds, 0);
  const estMinCalc = Math.max(1, Math.round((totalSec * activeCycles) / 60));

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.sheet}
      showsVerticalScrollIndicator={false}>
      {/* ── 1. Hero Emblem & Settled Title ── */}
      <View style={styles.heroSection}>
        <View
          style={[
            styles.emblemHalo,
            { backgroundColor: `${starlight}20`, borderColor: `${starlight}35` },
          ]}>
          <View style={[styles.iconWrap, { backgroundColor: palette.primary }]}>
            <TechniqueGlyph icon={technique.icon} size={30} />
          </View>
        </View>

        <ThemedText style={styles.title}>{technique.name}</ThemedText>
        <ThemedText style={styles.tagline}>{technique.tagline}</ThemedText>
      </View>

      {/* ── 2. The Practice Card (Rhythm Header + 3 Steps) ── */}
      <View style={styles.howBox}>
        {/* Subtle Rhythm Indicator with Highlighted Timings */}
        <View style={styles.rhythmRow}>
          <ThemedText style={styles.rhythmOverline}>✦ RHYTHM</ThemedText>
          <View style={styles.rhythmValues}>
            {technique.phases.map((p, idx) => (
              <View key={`${p.label}-${idx}`} style={styles.rhythmPhaseItem}>
                <ThemedText style={styles.rhythmText}>
                  {p.label}{' '}
                  <ThemedText style={[styles.rhythmSec, { color: palette.glow }]}>
                    {p.seconds}s
                  </ThemedText>
                </ThemedText>
                {idx < technique.phases.length - 1 && (
                  <ThemedText style={styles.rhythmDot}>·</ThemedText>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* 3 Clear Steps */}
        <View style={styles.stepsList}>
          {technique.howTo.map((step, i) => (
            <View key={step} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: `${starlight}22` }]}>
                <ThemedText style={styles.stepNumText}>{i + 1}</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>{step}</ThemedText>
            </View>
          ))}
        </View>

        {technique.handHint && (
          <View style={styles.hintBox}>
            <ThemedText style={styles.handHint}>
              Hand position: {technique.handHint}
            </ThemedText>
          </View>
        )}
      </View>

      {/* ── 3. Rounds Selector with Clear Settled Time ── */}
      {technique.cycleOptions.length > 0 && (
        <View style={styles.roundsSection}>
          <View style={styles.cyclesRow}>
            {technique.cycleOptions.map((c) => {
              const selected = c === activeCycles;
              const label = c === 0 ? '∞ Open' : `${c} rounds`;
              return (
                <Pressable
                  key={c}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={c === 0 ? 'Unlimited rounds' : `${c} rounds`}
                  onPress={() => handleSelectCycles(c)}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.cycleChip,
                    {
                      backgroundColor: selected ? palette.primary : Neutral.spaceGlass,
                      borderColor: selected ? palette.glow : Neutral.spaceHairline,
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}>
                  <ThemedText
                    style={[
                      styles.cycleChipText,
                      {
                        color: selected ? '#FFFFFF' : Neutral.starlightDim,
                        fontWeight: selected ? FontWeight.semibold : FontWeight.regular,
                      },
                    ]}>
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <ThemedText style={styles.estTimeText}>
            {activeCycles === 0 ? 'Continuous flow' : `~${estMinCalc} min session`}
          </ThemedText>
        </View>
      )}

      {/* ── 4. Sleek Begin Button ── */}
      <Button
        label="Begin"
        onPress={() => {
          haptics.tick();
          onBegin();
        }}
        color={palette.primary}
        size="lg"
        style={styles.begin}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  sheet: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: 0,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  emblemHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    lineHeight: 36,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
    color: Neutral.moonlightWhite,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  tagline: {
    textAlign: 'center',
    color: Neutral.starlightDim,
    fontSize: FontSize.sm,
    lineHeight: 20,
    paddingBottom: 1,
  },

  /* The Single How-To Card */
  howBox: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    backgroundColor: Neutral.spaceGlass,
    borderColor: Neutral.spaceHairline,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    alignSelf: 'stretch',
    maxWidth: 460,
  },
  rhythmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rhythmOverline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: FontWeight.semibold,
    color: BreathColors.glow,
    letterSpacing: 0.6,
  },
  rhythmValues: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 4,
    flexShrink: 1,
  },
  rhythmPhaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rhythmText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: Neutral.moonlightWhite,
    opacity: 0.88,
    paddingBottom: 1,
  },
  rhythmSec: {
    fontWeight: FontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  rhythmDot: {
    fontSize: 11.5,
    lineHeight: 16,
    color: Neutral.starlightDim,
    opacity: 0.5,
    paddingBottom: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(156, 181, 201, 0.12)',
    marginVertical: -2,
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: FontWeight.semibold,
    color: BreathColors.glow,
  },
  stepText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: Neutral.moonlightWhite,
    opacity: 0.92,
  },
  hintBox: {
    marginTop: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(114, 143, 167, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(156, 181, 201, 0.14)',
  },
  handHint: {
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Neutral.starlightDim,
  },

  /* Rounds Section */
  roundsSection: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  cyclesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  cycleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 36,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  cycleChipText: {
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
    paddingBottom: 1,
  },
  estTimeText: {
    fontSize: 12,
    lineHeight: 16,
    color: Neutral.starlightDim,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
    paddingBottom: 1,
  },

  /* Begin Button */
  begin: {
    alignSelf: 'stretch',
    maxWidth: 460,
    marginTop: 2,
  },
});




