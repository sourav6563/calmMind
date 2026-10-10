import { Stack } from 'expo-router';

import { Neutral } from '@/constants/theme';

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
