import { Tabs } from 'expo-router';
import React from 'react';

import { ZenTabBar } from '@/components/navigation/zen-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <ZenTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="breathe"
        options={{
          title: 'Breath',
        }}
      />
      <Tabs.Screen
        name="meditate"
        options={{
          title: 'Meditate',
        }}
      />
    </Tabs>
  );
}
