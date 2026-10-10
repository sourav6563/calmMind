import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edges } from 'react-native-safe-area-context';

import { StarfieldBackground } from '@/components/primitives/starfield-background';
import { Colors, type AppMode } from '@/constants/theme';
import { useColorSchemeName } from '@/hooks/use-color-scheme-name';

export type ScreenProps = ViewProps & {
  /** When set, tunes the cosmic nebula glow to the active mode. */
  mode?: AppMode;
  /** Safe-area edges to apply. Sessions opt out of top/bottom when immersive. */
  edges?: Edges;
};

/**
 * Base screen container — Deep Space Black canvas with twinkling StarfieldBackground.
 */
export function Screen({ children, style, mode, edges = ['top', 'bottom'], ...rest }: ScreenProps) {
  const scheme = useColorSchemeName();
  const background = Colors[scheme].background;

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: background }]}>
      <StarfieldBackground mode={mode} />
      <View style={[styles.content, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
