import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ZenColors } from '@/constants/theme';

import { Platform, StatusBar as RNStatusBar } from 'react-native';
import * as SystemUI from 'expo-system-ui';

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(ZenColors.background);

if (Platform.OS === 'android') {
  RNStatusBar.setTranslucent(true);
  RNStatusBar.setBackgroundColor('transparent');
}

const ZenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: ZenColors.background,
    card: ZenColors.cardSurface,
    border: ZenColors.cardBorder,
    text: ZenColors.textPrimary,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={ZenTheme}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: ZenColors.background },
          animation: 'fade',
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="breathe/[technique]" />
        <Stack.Screen name="breathe/session/[technique]" />
        <Stack.Screen name="meditate/[practice]" />
        <Stack.Screen name="meditate/session/[practice]" />
        <Stack.Screen name="support" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
