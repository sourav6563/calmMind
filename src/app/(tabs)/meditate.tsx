import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { TechniqueCard } from '@/components/technique-card';
import { Screen } from '@/components/primitives/screen';
import { SectionHeader } from '@/components/primitives/section-header';
import { ThemedText } from '@/components/themed-text';
import { MEDITATIONS } from '@/constants/techniques';
import { FontSize, FontWeight, Neutral, modePalette, Radius, Spacing } from '@/constants/theme';
import { useColorSchemeName } from '@/hooks/use-color-scheme-name';

/** Full Meditation practice catalog — opened via 'Explore all ›' from Home. */
export default function MeditateScreen() {
  const scheme = useColorSchemeName();
  const palette = modePalette('meditate', scheme);

  return (
    <Screen mode="meditate" style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Home Sanctuary"
            hitSlop={8}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={({ pressed }) => [
              styles.backPill,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
            <ThemedText style={[styles.backArrow, { color: palette.glow }]}>‹</ThemedText>
            <ThemedText style={styles.backText}>Sanctuary</ThemedText>
          </Pressable>

          <View
            style={[
              styles.countBadge,
              { backgroundColor: `${palette.secondary}1A`, borderColor: `${palette.secondary}35` },
            ]}>
            <ThemedText style={[styles.countText, { color: palette.glow }]}>
              {MEDITATIONS.length} sittings
            </ThemedText>
          </View>
        </View>

        <SectionHeader
          title="Meditate"
          subtitle="Pick a quiet practice for your state of mind. Settle in."
        />

        {MEDITATIONS.map((m) => (
          <TechniqueCard
            key={m.id}
            name={m.name}
            category={m.category}
            subtitle={`${m.benefit} · ${m.durationDefault}m`}
            icon={m.icon}
            color={m.orbTint.core}
            accentColor={m.orbTint.glow}
            surfaceColor={Neutral.spaceGlass}
            borderColor={Neutral.spaceHairline}
            onPress={() => router.push(`/meditate/${m.id}`)}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  content: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  countText: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    paddingBottom: 1,
    fontWeight: FontWeight.semibold,
  },
});
