import type { ColorScheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Normalizes RN's color scheme (light | dark | null | 'unspecified') to 'light' | 'dark'. */
export function useColorSchemeName(): ColorScheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
