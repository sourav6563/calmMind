import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export type SectionHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  /** Optional right-aligned accessory (e.g., a text action). */
  accessory?: ReactNode;
};

/** Section title block — one consistent header treatment everywhere. */
export function SectionHeader({ title, subtitle, accessory, style, ...rest }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]} {...rest}>
      <View style={styles.textCol}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {accessory}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  textCol: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl + 6,
    paddingBottom: 2,
    fontWeight: FontWeight.semibold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm + 6,
    paddingBottom: 1,
  },
});
