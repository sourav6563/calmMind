import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Button } from '@/components/primitives/button';
import { ThemedText } from '@/components/themed-text';
import { FontSize, FontWeight, Radius, Spacing, type ModePalette } from '@/constants/theme';

export type SessionCompleteProps = {
  title?: string;
  /** Summary lines, e.g. ["8 cycles", "2 min 8 sec"]. */
  lines: string[];
  palette: ModePalette;
  /** Optional per-technique accent override. */
  accentColor?: string;
  onDone: () => void;
};

/**
 * Calm completion — 1s gentle overshoot, no confetti or badges.
 * Communicates accomplishment in motion without jarring energy.
 */
export function SessionComplete({
  title = 'Well done',
  lines,
  palette,
  accentColor,
  onDone,
}: SessionCompleteProps) {
  const scale = useSharedValue(0.96);
  const starlight = palette.secondary;
  const buttonColor = accentColor ?? palette.primary;

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 120 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(5, 7, 14, 0.92)' }]} accessibilityViewIsModal>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View
          style={[
            styles.orb,
            {
              backgroundColor: `${starlight}26`,
            },
          ]}>
          <View
            style={[
              styles.orbInner,
              {
                backgroundColor: palette.primary,
              },
            ]}
          />
        </View>

        <ThemedText style={styles.title}>{title}</ThemedText>

        <View style={styles.lines}>
          {lines.map((line) => (
            <ThemedText key={line} themeColor="textSecondary" style={styles.line}>
              {line}
            </ThemedText>
          ))}
        </View>

        <Button label="Done" onPress={onDone} color={buttonColor} size="lg" style={styles.doneBtn} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: 360,
  },
  orb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  orbInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  title: {
    fontSize: FontSize.xl,
    lineHeight: 36,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  lines: {
    gap: Spacing.one,
    alignItems: 'center',
  },
  line: {
    fontSize: FontSize.md,
    lineHeight: 22,
    paddingBottom: 1,
    textAlign: 'center',
  },
  doneBtn: {
    marginTop: Spacing.four,
    minWidth: 200,
    borderRadius: Radius.pill,
  },
});
