import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BreathTabIcon, HomeIcon, MeditateTabIcon } from '@/components/icons/ui-icons';
import { useHaptics } from '@/hooks/use-haptics';

export type ZenTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

export function ZenTabBar({ state, descriptors, navigation }: ZenTabBarProps) {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const getTabInfo = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return {
          label: 'Home',
          renderIcon: (color: string) => <HomeIcon size={23} color={color} />,
        };
      case 'breathe':
        return {
          label: 'Breath',
          renderIcon: (color: string) => <BreathTabIcon size={23} color={color} />,
        };
      case 'meditate':
        return {
          label: 'Meditate',
          renderIcon: (color: string) => <MeditateTabIcon size={23} color={color} />,
        };
      default:
        return {
          label: 'Home',
          renderIcon: (color: string) => <HomeIcon size={23} color={color} />,
        };
    }
  };

  return (
    <View
      className="bg-zen-cream border-t border-zen-border flex-row items-center justify-around"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#F7F5EE',
        borderTopWidth: 1,
        borderTopColor: '#EAE6DB',
        paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8),
        paddingTop: 8,
      }}>
      {state.routes.map((route: { key: string; name: string }, index: number) => {
        const descriptor = descriptors[route.key];
        const isFocused = state.index === index;
        const tabInfo = getTabInfo(route.name);
        const label = descriptor?.options?.title ?? tabInfo.label;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            haptics.tick();
            navigation.navigate(route.name);
          }
        };

        const activeColor = '#4E7158';
        const inactiveColor = '#9BA098';
        const iconColor = isFocused ? activeColor : inactiveColor;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={descriptor?.options?.tabBarAccessibilityLabel ?? label}
            onPress={onPress}
            className="flex-1 items-center justify-center py-1 active:opacity-75"
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {tabInfo.renderIcon(iconColor)}
            <Text
              className={`text-xs mt-1 ${
                isFocused ? 'text-zen-sage font-semibold' : 'text-zen-dim font-medium'
              }`}
              style={{
                color: isFocused ? '#4E7158' : '#9BA098',
                fontSize: 12,
                marginTop: 4,
                fontWeight: isFocused ? '600' : '500',
              }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
