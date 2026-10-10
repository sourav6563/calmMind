import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Motion, Neutral } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const SpaceTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Neutral.spaceBlack,
    card: Neutral.spaceSurface,
    border: Neutral.spaceHairline,
    text: Neutral.moonlightWhite,
  },
};

/**
 * Root layout — Space Black theme with tabs group plus immersive session routes.
 * Sessions fade in slowly (800ms) — a deliberate slow-down before practice begins.
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={SpaceTheme}>
      <StatusBar style="light" />
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Neutral.spaceBlack } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="breathe/[technique]"
          options={{ animation: 'fade', animationDuration: Motion.sessionEnter }}
        />
        <Stack.Screen
          name="meditate/[practice]"
          options={{ animation: 'fade', animationDuration: Motion.sessionEnter }}
        />
      </Stack>
    </ThemeProvider>
  );
}

