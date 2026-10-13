import { router, useLocalSearchParams } from "expo-router";
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    Timer,
    Volume2,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BotanicalGlyph } from "@/components/icons/botanical-glyphs";
import { BackArrowIcon } from "@/components/icons/ui-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTechnique, TECHNIQUES } from "@/constants/techniques";
import { useHaptics } from "@/hooks/use-haptics";

export default function BreatheDetailScreen() {
  const { technique: id } = useLocalSearchParams<{ technique: string }>();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const technique = getTechnique(id) ?? TECHNIQUES[0];

  // Core configurations
  const [selectedCycles, setSelectedCycles] = useState<number>(
    technique.cyclesDefault,
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [prepCountdown, setPrepCountdown] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Dynamic timing computation
  const cycleSeconds = technique.phases.reduce((sum, p) => sum + p.seconds, 0);
  const estMinutes =
    selectedCycles === 0
      ? null
      : Math.max(1, Math.round((cycleSeconds * selectedCycles) / 60));

  const handleStart = () => {
    haptics.tick();
    router.push({
      pathname: "/breathe/session/[technique]",
      params: {
        technique: technique.id,
        cycles: String(selectedCycles),
        sound: soundEnabled ? "1" : "0",
        prep: prepCountdown ? "1" : "0",
      },
    });
  };

  return (
    <View
      className="flex-1 bg-zen-cream"
      style={{ flex: 1, backgroundColor: "#F7F5EE" }}
    >
      {/* ── Top Bar ────────────────────────────────────────── */}
      <View
        className="px-5 pt-3 pb-2 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => {
            haptics.tick();
            router.back();
          }}
          className="w-10 h-10 rounded-full items-center justify-center -ml-2 active:opacity-60"
        >
          <BackArrowIcon size={22} color="#222522" />
        </Pressable>

        <View className="px-3 py-1 rounded-full bg-zen-sage/10 border border-zen-sage/15">
          <Text className="text-zen-sage text-[11px] font-semibold tracking-wider uppercase">
            {technique.category}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 8,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* ── 1. Hero ────────────────────────────────────────── */}
        <View className="items-center mt-1 mb-3">
          <Badge color={technique.badgeColor} size={64}>
            <BotanicalGlyph icon={technique.icon} color="#4E7158" size={32} />
          </Badge>
        </View>

        <View className="items-center mb-3">
          <Text
            className="text-zen-charcoal text-2xl font-semibold text-center tracking-tight"
            style={{ fontFamily: "serif" }}
          >
            {technique.name}
          </Text>
          <Text className="text-zen-muted text-xs text-center mt-1 px-4 leading-5">
            {technique.tagline}
          </Text>
        </View>

        {/* ── 2. Breath Rhythm ───────────────────────────────── */}
        <View className="items-center mb-3">
          <View className="flex-row items-center bg-white/80 border border-zen-border/70 px-4 py-1.5 rounded-full shadow-2xs">
            {technique.phases.map((phase, idx) => (
              <React.Fragment key={`${phase.label}-${idx}`}>
                <View className="flex-row items-center gap-1">
                  <Text className="text-zen-muted text-xs">{phase.label}</Text>
                  <Text className="text-zen-sage text-xs font-semibold">
                    {phase.seconds}s
                  </Text>
                </View>
                {idx < technique.phases.length - 1 && (
                  <Text className="text-zen-muted/30 text-xs mx-1.5">·</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── 2b. Quick Focus Cue ────────────────────────────── */}
        <View className="items-center mb-4 px-3">
          <Text className="text-zen-sage text-[11px] font-medium text-center tracking-wide">
            ✦ {technique.benefit}
          </Text>
        </View>

        {/* ── 3. Simple Setup Card ───────────────────────────── */}
        <View className="bg-white/95 rounded-2xl p-4 border border-zen-border shadow-xs mb-3.5">
          {/* Rounds Header */}
          <View className="flex-row items-center justify-between mb-2 px-0.5">
            <Text className="text-zen-charcoal text-xs font-semibold uppercase tracking-wider text-[11px]">
              Rounds
            </Text>
            <Text className="text-zen-muted text-xs">
              {selectedCycles === 0 ? "Free flow" : `${estMinutes} min`}
            </Text>
          </View>

          {/* 4 Rounds Pills */}
          <View className="flex-row gap-2 mb-3.5">
            {technique.cycleOptions.map((cycles) => {
              const isSelected = selectedCycles === cycles;
              const calcMin =
                cycles === 0
                  ? null
                  : Math.max(1, Math.round((cycleSeconds * cycles) / 60));

              return (
                <Pressable
                  key={cycles}
                  accessibilityRole="button"
                  accessibilityLabel={
                    cycles === 0 ? "Open" : `${cycles} rounds`
                  }
                  onPress={() => {
                    haptics.tick();
                    setSelectedCycles(cycles);
                  }}
                  className={`flex-1 py-2 px-1 rounded-xl items-center justify-center border active:scale-95 ${
                    isSelected
                      ? "bg-zen-sage border-zen-sage shadow-xs"
                      : "bg-zen-cream/40 border-zen-border/60"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? "text-white" : "text-zen-charcoal"
                    }`}
                  >
                    {cycles === 0 ? "Open" : cycles}
                  </Text>
                  <Text
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? "text-white/80" : "text-zen-muted"
                    }`}
                  >
                    {cycles === 0 ? "Flow" : `${calcMin}m`}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="h-[1px] bg-zen-border/40 mb-1" />

          {/* Sound Toggle */}
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: soundEnabled }}
            accessibilityLabel="Sound"
            onPress={() => {
              haptics.tick();
              setSoundEnabled((prev) => !prev);
            }}
            className="flex-row items-center justify-between py-2.5 px-0.5 active:opacity-75"
          >
            <View className="flex-row items-center gap-2.5">
              <View className="w-7 h-7 rounded-full bg-zen-sage/10 items-center justify-center">
                <Volume2 size={13} color="#4E7158" />
              </View>
              <View>
                <Text className="text-zen-charcoal text-xs font-semibold">
                  Sound
                </Text>
                <Text className="text-zen-muted text-[10px] mt-0.5">
                  Play sound while breathing
                </Text>
              </View>
            </View>

            <View
              className={`px-2.5 py-0.5 rounded-full border ${
                soundEnabled
                  ? "bg-zen-sage/15 border-zen-sage/30"
                  : "bg-zen-cream border-zen-border"
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  soundEnabled ? "text-zen-sage" : "text-zen-muted"
                }`}
              >
                {soundEnabled ? "On" : "Off"}
              </Text>
            </View>
          </Pressable>

          <View className="h-[1px] bg-zen-border/30 my-0.5" />

          {/* 3s Countdown Toggle */}
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: prepCountdown }}
            accessibilityLabel="3s countdown"
            onPress={() => {
              haptics.tick();
              setPrepCountdown((prev) => !prev);
            }}
            className="flex-row items-center justify-between py-2.5 px-0.5 active:opacity-75"
          >
            <View className="flex-row items-center gap-2.5">
              <View className="w-7 h-7 rounded-full bg-zen-sage/10 items-center justify-center">
                <Timer size={13} color="#4E7158" />
              </View>
              <View>
                <Text className="text-zen-charcoal text-xs font-semibold">
                  3s Countdown
                </Text>
                <Text className="text-zen-muted text-[10px] mt-0.5">
                  Pause before starting
                </Text>
              </View>
            </View>

            <View
              className={`px-2.5 py-0.5 rounded-full border ${
                prepCountdown
                  ? "bg-zen-sage/15 border-zen-sage/30"
                  : "bg-zen-cream border-zen-border"
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  prepCountdown ? "text-zen-sage" : "text-zen-muted"
                }`}
              >
                {prepCountdown ? "On" : "Off"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── 4. Simple How-To Collapsible ───────────────────── */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="How to practice"
          onPress={() => {
            haptics.tick();
            setShowInstructions((prev) => !prev);
          }}
          className="bg-white/80 rounded-2xl p-3 border border-zen-border/70 mb-3 active:opacity-85 shadow-2xs"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <BookOpen size={15} color="#4E7158" />
              <Text className="text-zen-charcoal text-xs font-semibold">
                How to practice
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              {showInstructions ? (
                <ChevronUp size={14} color="#8B968E" />
              ) : (
                <ChevronDown size={14} color="#8B968E" />
              )}
            </View>
          </View>

          {showInstructions && (
            <View className="mt-2.5 pt-2.5 border-t border-zen-border/50 gap-2">
              {technique.howTo.map((step, idx) => (
                <View key={idx} className="flex-row items-start gap-2">
                  <Text className="text-zen-sage text-xs font-semibold">
                    {idx + 1}.
                  </Text>
                  <Text className="text-zen-charcoal text-xs leading-4 flex-1">
                    {step}
                  </Text>
                </View>
              ))}

              {technique.handHint && (
                <Text className="text-zen-muted text-[11px] italic">
                  💡 Hint: {technique.handHint}
                </Text>
              )}

              <View className="mt-1 bg-zen-sage/10 p-2 rounded-xl">
                <Text className="text-zen-charcoal text-[11px] leading-4">
                  <Text className="font-semibold text-zen-sage">Benefit: </Text>
                  {technique.benefit}.
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* ── Bottom Action Button ─────────────────────────────── */}
      <View
        className="absolute inset-x-0 bottom-0 px-6 bg-zen-cream/95 pt-2.5 border-t border-zen-border/40"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <Button
          variant="sage"
          size="pill"
          onPress={handleStart}
          className="w-full shadow-sm"
        >
          {selectedCycles === 0
            ? "Start Practice"
            : `Start · ${selectedCycles} Rounds (${estMinutes}m)`}
        </Button>
      </View>
    </View>
  );
}
