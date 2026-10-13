import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AppearanceIcon,
  BackArrowIcon,
  BellIcon,
  ChevronRightIcon,
  DocIcon,
  HeartBadgeIcon,
  InfoIcon,
  LockIcon,
  SoundIcon,
} from "@/components/icons/ui-icons";
import { Card } from "@/components/ui/card";
import { useHaptics } from "@/hooks/use-haptics";

type SettingsRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  showBorder?: boolean;
};

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  showBorder = true,
}: SettingsRowProps) {
  const haptics = useHaptics();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        haptics.tick();
        onPress();
      }}
      className={`flex-row items-center justify-between p-4 bg-white active:bg-zen-cream/60 ${
        showBorder ? "border-b border-zen-border" : ""
      }`}
    >
      <View
        className="flex-row items-center flex-1 pr-2"
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          paddingRight: 8,
        }}
      >
        <View
          className="w-9 h-9 rounded-full bg-zen-cream items-center justify-center mr-3.5"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#F7F5EE",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          {icon}
        </View>
        <View className="flex-1" style={{ flex: 1 }}>
          <Text
            className="text-zen-charcoal text-base font-semibold"
            style={{ fontSize: 16, fontWeight: "600", color: "#222522" }}
          >
            {title}
          </Text>
          <Text
            className="text-zen-muted text-xs mt-0.5"
            style={{ fontSize: 12, color: "#6B7068", marginTop: 2 }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <ChevronRightIcon size={18} color="#9BA098" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  return (
    <View
      className="flex-1 bg-zen-cream"
      style={{ flex: 1, backgroundColor: "#F7F5EE" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <View
        className="px-5 pt-3 pb-3 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8, paddingHorizontal: 20 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={() => {
            haptics.tick();
            router.back();
          }}
          className="w-10 h-10 rounded-full items-center justify-center -ml-2 active:opacity-60"
        >
          <BackArrowIcon size={22} color="#222522" />
        </Pressable>

        <Text
          className="text-zen-charcoal text-xl font-semibold"
          style={{
            fontFamily: "serif",
            fontSize: 22,
            fontWeight: "600",
            color: "#222522",
          }}
        >
          Settings
        </Text>

        {/* Balance spacer */}
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Settings Group Card */}
        <Card className="overflow-hidden p-0 mb-6">
          <SettingsRow
            icon={<SoundIcon size={19} color="#4E7158" />}
            title="Sound"
            subtitle="Nature, Rain, Ocean..."
            onPress={() => {
              Alert.alert(
                "Soundscapes",
                "Soothing nature ambient sounds are enabled.",
              );
            }}
          />

          <SettingsRow
            icon={<BellIcon size={19} color="#4E7158" />}
            title="Notifications"
            subtitle="Gentle reminders"
            onPress={() => {
              Alert.alert(
                "Gentle Reminders",
                "Daily mindfulness reminders can be scheduled here.",
              );
            }}
          />

          <SettingsRow
            icon={<AppearanceIcon size={19} color="#4E7158" />}
            title="Appearance"
            subtitle="Light / Dark mode"
            onPress={() => {
              Alert.alert(
                "Appearance",
                "calmMind adapts seamlessly to your device theme.",
              );
            }}
          />

          <SettingsRow
            icon={<HeartBadgeIcon size={20} />}
            title="Support the app ❤️"
            subtitle="Help keep this app free"
            onPress={() => {
              router.push("/support");
            }}
          />

          <SettingsRow
            icon={<InfoIcon size={19} color="#4E7158" />}
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => {
              Alert.alert(
                "calmMind",
                "A calmer mind. A kinder you.\nVersion 1.0.0",
              );
            }}
          />

          <SettingsRow
            icon={<LockIcon size={19} color="#4E7158" />}
            title="Privacy"
            subtitle="Your data matters"
            onPress={() => {
              Alert.alert(
                "Privacy",
                "calmMind does not track you. No account required. All session logs stay on your device.",
              );
            }}
          />

          <SettingsRow
            icon={<DocIcon size={19} color="#4E7158" />}
            title="Terms"
            subtitle="Read our terms of use"
            showBorder={false}
            onPress={() => {
              Alert.alert(
                "Terms of Use",
                "calmMind is dedicated to personal wellness and peace of mind.",
              );
            }}
          />
        </Card>
      </ScrollView>
    </View>
  );
}
