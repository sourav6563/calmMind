import { Stack } from 'expo-router';

import { Neutral } from '@/constants/theme';

/**
 * Tab-free Sanctuary Navigator:
 * Removes the redundant bottom tab bar so the Home Sanctuary fills the entire screen,
 * while `/breathe` and `/meditate` open as full-library catalog screens via "Explore all ›".
 */
export default function AppTabs() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: Neutral.spaceBlack },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="breathe" />
      <Stack.Screen name="meditate" />
    </Stack>
  );
}

