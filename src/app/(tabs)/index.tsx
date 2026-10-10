import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Screen } from '@/components/primitives/screen';
import { TechniqueGlyph } from '@/components/session/technique-icon';
import { ThemedText } from '@/components/themed-text';
import {
  getMeditation,
  getTechnique,
  MEDITATIONS,
  TECHNIQUES,
  type TechniqueIcon,
} from '@/constants/techniques';
import {
  BreathColors,
  FontSize,
  FontWeight,
  Neutral,
  Radius,
  Spacing,
} from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useRecentSession } from '@/utils/recent-sessions';

function getGreeting(hour: number): { title: string; subtitle: string } {
  if (hour >= 5 && hour < 12) {
    return { title: 'Good morning', subtitle: 'Begin your day with a slow, steady breath.' };
  }
  if (hour >= 12 && hour < 17) {
    return { title: 'Good afternoon', subtitle: 'Pause your day. Settle where you are.' };
  }
  if (hour >= 17 && hour < 21) {
    return { title: 'Good evening', subtitle: 'Release the day in quiet rhythm.' };
  }
  return { title: 'Quiet night', subtitle: 'Slow your breathing and settle into rest.' };
}

type ResolvedRecent = {
  id: string;
  title: string;
  badge: string;
  icon: TechniqueIcon;
  mode: 'breathe' | 'meditate';
  route: string;
};

/**
 * Production Mindfulness Home:
 * - Compact header with brand + greeting.
 * - Horizontal swipeable recent-practice cards (1 box, slide to see more).
 * - Two polished Sanctuary gateway banners (Breathe & Meditate).
 */
export default function HomeScreen() {
  const haptics = useHaptics();
  const greeting = useMemo(() => getGreeting(new Date().getHours()), []);
  const { recentList, isNewUser, refresh } = useRecentSession();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  // Resolve recent sessions into display-ready items (up to 3)
  const recents: ResolvedRecent[] = useMemo(() => {
    return recentList.slice(0, 3).map((item) => {
      if (item.mode === 'breathe') {
        const t = getTechnique(item.id) ?? TECHNIQUES[0];
        const totalSec = t.phases.reduce((s, p) => s + p.seconds, 0);
        const estMin = Math.max(1, Math.round((totalSec * t.cyclesDefault) / 60));
        const rhythm = t.phases.map((p) => p.seconds).join('·');
        return {
          id: t.id,
          title: t.name,
          badge: `${rhythm}s · ${estMin}m`,
          icon: t.icon,
          mode: 'breathe' as const,
          route: `/breathe/${t.id}`,
        };
      }
      const m = getMeditation(item.id) ?? MEDITATIONS[0];
      return {
        id: m.id,
        title: m.name,
        badge: `${m.durationDefault}m`,
        icon: m.icon,
        mode: 'meditate' as const,
        route: `/meditate/${m.id}`,
      };
    });
  }, [recentList]);

  return (
    <Screen mode="breathe" style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* ── Header ────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <ThemedText style={styles.brandText}>calmMind</ThemedText>
          </View>
          <ThemedText style={styles.greetTitle}>{greeting.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.greetSub}>
            {greeting.subtitle}
          </ThemedText>
        </View>

        {/* ── Recent Practices (horizontal slide) ── */}
        <View style={styles.section}>
          <ThemedText style={styles.overline}>
            {isNewUser ? '✦ GET STARTED' : '✦ RECENT'}
          </ThemedText>

          {isNewUser ? (
            /* ── First-time Welcome Card ── */
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start Coherent Breathing"
              onPress={() => {
                haptics.tick();
                router.push('/breathe/coherent');
              }}
              style={({ pressed }) => [
                styles.welcomeCard,
                { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
              ]}>
              <View style={styles.emblemOuter}>
                <View style={styles.emblemInner}>
                  <TechniqueGlyph icon="breath" color="#FFFFFF" size={20} />
                </View>
              </View>
              <View style={styles.welcomeText}>
                <ThemedText style={styles.welcomeTitle}>Coherent Breathing</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  5.5s in · 5.5s out · 2 min — a gentle place to begin
                </ThemedText>
              </View>
              <View style={styles.welcomeAction}>
                <ThemedText style={styles.welcomeActionLabel}>Begin ›</ThemedText>
              </View>
            </Pressable>
          ) : (
            /* ── Single-Card Carousel for Recents ── */
            <RecentCarousel recents={recents} onResume={(route) => {
              haptics.tick();
              router.push(route as any);
            }} />
          )}
        </View>

        {/* ── Sanctuaries: Breathe & Meditate ──── */}
        <View style={styles.section}>
          <ThemedText style={styles.overline}>✦ EXPLORE</ThemedText>

          <View style={styles.sanctuaryStack}>
            <SanctuaryBanner
              title="Breathe"
              count={`${TECHNIQUES.length} rhythms`}
              preview="Relief · Focus · Sleep · Balance · Reset"
              icon="breath"
              onPress={() => {
                haptics.tick();
                router.push('/breathe');
              }}
            />
            <SanctuaryBanner
              title="Meditate"
              count={`${MEDITATIONS.length} practices`}
              preview="Calm · Relax · Kindness · Focus"
              icon="heart"
              onPress={() => {
                haptics.tick();
                router.push('/meditate');
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

/* ── Recent Carousel: single card, swipe through pages ── */
const CARD_PADDING_H = Spacing.three;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_PADDING_H = 20;
const CAROUSEL_WIDTH = Math.min(SCREEN_WIDTH - SCREEN_PADDING_H * 2, 460);

function RecentCarousel({
  recents,
  onResume,
}: {
  recents: ResolvedRecent[];
  onResume: (route: string) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const idx = Math.round(offsetX / CAROUSEL_WIDTH);
      setActiveIdx(idx);
    },
    [],
  );

  return (
    <View style={styles.carouselOuter}>
      <View style={styles.carouselCard}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.carouselPages}>
          {recents.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Resume ${item.title}`}
              onPress={() => onResume(item.route)}
              style={({ pressed }) => [
                styles.carouselPage,
                { width: CAROUSEL_WIDTH, opacity: pressed ? 0.88 : 1 },
              ]}>
              {/* Top: icon emblem + mode pill */}
              <View style={styles.carouselTopRow}>
                <View style={styles.emblemOuterCompact}>
                  <View style={styles.emblemInnerCompact}>
                    <TechniqueGlyph icon={item.icon} color="#FFFFFF" size={17} />
                  </View>
                </View>
                <View style={styles.badgePill}>
                  <ThemedText style={styles.badgePillText}>
                    {item.mode === 'breathe' ? 'Breathe' : 'Meditate'}
                  </ThemedText>
                </View>
              </View>

              {/* Middle: title + badge */}
              <View style={styles.carouselMid}>
                <ThemedText style={styles.carouselTitle} numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.carouselBadge}>{item.badge}</ThemedText>
              </View>

              {/* Bottom: resume button */}
              <View style={styles.resumePill}>
                <ThemedText style={styles.resumePillText}>Resume ›</ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Dot indicators */}
        {recents.length > 1 && (
          <View style={styles.carouselDots}>
            {recents.map((item, i) => (
              <View
                key={item.id}
                style={[
                  styles.carouselDot,
                  i === activeIdx && styles.carouselDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/* ── Sanctuary Banner Component ── */
function SanctuaryBanner({
  title,
  count,
  preview,
  icon,
  onPress,
}: {
  title: string;
  count: string;
  preview: string;
  icon: TechniqueIcon;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.sanctuaryCard,
        {
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}>
      <View style={styles.emblemOuter}>
        <View style={styles.emblemInner}>
          <TechniqueGlyph icon={icon} color="#FFFFFF" size={22} />
        </View>
      </View>

      <View style={styles.sanctuaryTextCol}>
        <View style={styles.sanctuaryTitleRow}>
          <ThemedText style={styles.sanctuaryTitle}>{title}</ThemedText>
          <View style={styles.badgePill}>
            <ThemedText style={styles.badgePillText}>{count}</ThemedText>
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {preview}
        </ThemedText>
      </View>

      <ThemedText style={styles.chevron}>›</ThemedText>
    </Pressable>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: SCREEN_PADDING_H,
  },
  scroll: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },

  /* Header */
  header: { gap: 4 },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: BreathColors.glow,
  },
  brandText: {
    fontSize: FontSize.sm,
    lineHeight: 18,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    color: BreathColors.glow,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  greetTitle: {
    fontSize: FontSize.xxl,
    lineHeight: FontSize.xxl + 8,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
  },
  greetSub: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm + 6,
    marginTop: 2,
  },

  /* Sections */
  section: { gap: Spacing.two },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    color: Neutral.starlightDim,
    letterSpacing: 0.9,
  },

  /* Emblem Primitives (matching TechniqueCard) */
  emblemOuter: {
    borderRadius: 999,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(114, 143, 167, 0.16)',
  },
  emblemInner: {
    borderRadius: 999,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BreathColors.primary,
  },
  emblemOuterCompact: {
    borderRadius: 999,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(114, 143, 167, 0.16)',
  },
  emblemInnerCompact: {
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BreathColors.primary,
  },

  /* Badges & Action Pills */
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(114, 143, 167, 0.15)',
  },
  badgePillText: {
    fontSize: 11,
    lineHeight: 15,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    color: Neutral.starlightDim,
    letterSpacing: 0.2,
  },
  chevron: {
    fontSize: FontSize.xl,
    lineHeight: 28,
    fontWeight: FontWeight.light,
    color: Neutral.starlightDim,
    opacity: 0.8,
  },

  /* Welcome (new user) */
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: Radius.lg,
    borderWidth: 1,
    backgroundColor: Neutral.spaceGlass,
    borderColor: Neutral.spaceHairline,
    ...Platform.select({
      ios: {
        shadowColor: Neutral.spaceBlack,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  welcomeText: { flex: 1, gap: 2 },
  welcomeTitle: {
    fontSize: FontSize.md,
    lineHeight: 22,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
  },
  welcomeAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(114, 143, 167, 0.18)',
    borderWidth: 1,
    borderColor: Neutral.spaceHairline,
  },
  welcomeActionLabel: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    color: Neutral.moonlightWhite,
  },

  /* Recent Carousel (single card) */
  carouselOuter: {
    borderRadius: Radius.lg,
    ...Platform.select({
      ios: {
        shadowColor: Neutral.spaceBlack,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  carouselCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    backgroundColor: Neutral.spaceGlass,
    borderColor: Neutral.spaceHairline,
    overflow: 'hidden',
  },
  carouselPages: {
    // pages laid out horizontally, each fills CAROUSEL_WIDTH
  },
  carouselPage: {
    paddingHorizontal: CARD_PADDING_H,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two + 4,
    gap: Spacing.two,
  },
  carouselTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carouselMid: { gap: 2 },
  carouselTitle: {
    fontSize: FontSize.lg,
    lineHeight: 26,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
  },
  carouselBadge: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    paddingBottom: 1,
    color: Neutral.starlightDim,
    fontVariant: ['tabular-nums'],
  },
  resumePill: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(114, 143, 167, 0.18)',
    borderWidth: 1,
    borderColor: Neutral.spaceHairline,
    marginTop: 2,
  },
  resumePillText: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
    color: Neutral.moonlightWhite,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: Spacing.two,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(156, 181, 201, 0.24)',
  },
  carouselDotActive: {
    backgroundColor: BreathColors.glow,
    width: 16,
    borderRadius: 3,
  },

  /* Sanctuary Banners */
  sanctuaryStack: { gap: Spacing.two + 2 },
  sanctuaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: Radius.lg,
    borderWidth: 1,
    backgroundColor: Neutral.spaceGlass,
    borderColor: Neutral.spaceHairline,
    ...Platform.select({
      ios: {
        shadowColor: Neutral.spaceBlack,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  sanctuaryTextCol: { flex: 1, gap: 3 },
  sanctuaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sanctuaryTitle: {
    fontSize: FontSize.lg,
    lineHeight: 26,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
  },
});
