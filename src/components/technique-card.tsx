import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { TechniqueGlyph } from '@/components/session/technique-icon';
import { ThemedText } from '@/components/themed-text';
import type { TechniqueIcon } from '@/constants/techniques';
import {
  BreathColors,
  FontSize,
  FontWeight,
  Neutral,
  Radius,
  Spacing,
} from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';

export type TechniqueCardProps = {
  name: string;
  /** Goal or mental state category, e.g. "Focus", "Sleep", "Stress Reset". */
  category?: string;
  /** Concise single-line purpose & duration, e.g. "Steady focus under pressure · ~2 min". */
  subtitle?: string;
  /** Legacy alias for purpose / physiological benefit. */
  benefit?: string;
  /** Legacy alias for recommendation. */
  bestFor?: string;
  /** Legacy alias for duration / rhythm metadata. */
  meta?: string;
  /** Optional rhythm/duration pill badge. */
  badge?: string;
  /** Core emblem color (Calm Blue). */
  color?: string;
  /** Complementary luminous blue accent. */
  accentColor?: string;
  surfaceColor?: string;
  borderColor?: string;
  /** Line icon for this technique. */
  icon: TechniqueIcon;
  onPress: () => void;
};

/**
 * Serene, minimalist card for breathing techniques and meditation practices.
 * 2-row layout: Title + Category badge on Row 1, clean purpose & duration on Row 2.
 */
export function TechniqueCard({
  name,
  category,
  subtitle,
  benefit,
  bestFor,
  meta,
  badge,
  color,
  accentColor,
  surfaceColor,
  borderColor,
  icon,
  onPress,
}: TechniqueCardProps) {
  const haptics = useHaptics();
  const accent = accentColor ?? Neutral.starlightDim;
  const emblemFill = color || BreathColors.primary;
  const cardBg = surfaceColor ?? Neutral.spaceGlass;
  const cardBorder = borderColor ?? Neutral.spaceHairline;

  const displaySubtitle =
    subtitle ??
    (bestFor
      ? bestFor.replace(/^Best for:\s*/i, '')
      : benefit ?? meta);

  const displayBadge = category ?? badge;

  const handlePress = () => {
    haptics.tick();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}${displayBadge ? `, ${displayBadge}` : ''}. ${displaySubtitle ?? ''}`}
      onPress={handlePress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}>
      {/* Icon Emblem Halo */}
      <View style={styles.iconOuter}>
        <View style={[styles.iconInner, { backgroundColor: emblemFill }]}>
          <TechniqueGlyph icon={icon} color="#FFFFFF" size={19} />
        </View>
      </View>

      {/* Main Content: 2 clean lines */}
      <View style={styles.textCol}>
        {/* Row 1: Technique Name + Category Badge */}
        <View style={styles.headerRow}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {name}
          </ThemedText>
          {displayBadge ? (
            <View style={styles.categoryPill}>
              <ThemedText style={styles.categoryText}>{displayBadge}</ThemedText>
            </View>
          ) : null}
        </View>

        {/* Row 2: Purpose & Duration (Single line) */}
        {displaySubtitle ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.subtitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            {displaySubtitle}
          </ThemedText>
        ) : null}
      </View>

      {/* Trailing Action Chevron */}
      <ThemedText style={[styles.chevron, { color: accent }]}>›</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: Radius.lg,
    borderWidth: 1,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Neutral.spaceBlack,
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 1.5 },
      default: {},
    }),
  },
  iconOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(114, 143, 167, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(156, 181, 201, 0.18)',
  },
  iconInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    fontSize: FontSize.md,
    lineHeight: 22,
    paddingBottom: Platform.select({ android: 2, default: 1 }),
    fontWeight: FontWeight.semibold,
    color: Neutral.moonlightWhite,
    flexShrink: 1,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(114, 143, 167, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(156, 181, 201, 0.18)',
  },
  categoryText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: FontWeight.semibold,
    color: BreathColors.glow,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    paddingBottom: 1,
    color: Neutral.starlightDim,
  },
  chevron: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: FontWeight.light,
    opacity: 0.6,
    marginLeft: 2,
  },
});



