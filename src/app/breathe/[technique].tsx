import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BotanicalGlyph } from "@/components/icons/botanical-glyphs";
import { BackArrowIcon } from "@/components/icons/ui-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZenSwitch } from "@/components/ui/zen-switch";
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
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Dynamic timing computation
  const cycleSeconds = technique.phases.reduce((sum, p) => sum + p.seconds, 0);

  const handleStart = () => {
    haptics.tick();
    router.push({
      pathname: "/breathe/session/[technique]",
      params: {
        technique: technique.id,
        cycles: String(selectedCycles),
        sound: soundEnabled ? "1" : "0",
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
        className="px-5 pt-3 pb-1 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 6 }}
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
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 4,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* ── 1. Hero Emblem ─────────────────────────────────── */}
        <View className="items-center mt-1 mb-2">
          <Badge color={technique.badgeColor} size={56}>
            <BotanicalGlyph icon={technique.icon} color="#4E7158" size={30} />
          </Badge>
        </View>

        {/* ── Title & Tagline ────────────────────────────────── */}
        <View className="items-center mb-3">
          <Text
            className="text-zen-charcoal text-2xl font-semibold text-center tracking-tight"
            style={{ fontFamily: "serif" }}
          >
            {technique.name}
          </Text>
          <Text className="text-zen-muted text-xs text-center mt-1.5 px-4 leading-4">
            {technique.tagline}
          </Text>
        </View>

        {/* ── 2. Breath Rhythm ───────────────────────────────── */}
        <View className="items-center mb-3.5">
          <View className="flex-row items-center bg-white/90 border border-zen-border/70 px-3.5 py-1.5 rounded-full shadow-2xs">
            {technique.phases.map((phase, idx) => (
              <React.Fragment key={`${phase.label}-${idx}`}>
                <View className="flex-row items-center gap-1">
                  <Text className="text-zen-muted text-[11px]">
                    {phase.label}
                  </Text>
                  <Text className="text-zen-sage text-[11px] font-semibold">
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

        {/* ── 3. Unified Practice Setup & Info Card ──────────── */}
        <Card className="p-3.5 bg-white/95 border-zen-border mb-3 shadow-xs">
          {/* Rounds Header */}
          <View className="mb-2 px-0.5">
            <Text className="text-zen-charcoal text-[11px] font-semibold uppercase tracking-wider">
              Rounds
            </Text>
          </View>

          {/* 4 Rounds Pills */}
          <View className="flex-row gap-2 mb-2.5">
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
                    cycles === 0 ? "Open flow" : `${cycles} rounds`
                  }
                  onPress={() => {
                    haptics.tick();
                    setSelectedCycles(cycles);
                  }}
                  className={`flex-1 py-1.5 px-1 rounded-xl items-center justify-center border active:scale-95 ${
                    isSelected
                      ? "bg-zen-sage border-zen-sage shadow-2xs"
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

          {/* Sound Toggle */}
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: soundEnabled }}
            accessibilityLabel="Sound"
            onPress={() => {
              haptics.tick();
              setSoundEnabled((prev) => !prev);
            }}
            className="flex-row items-center justify-between py-2 px-1 active:opacity-70"
          >
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="w-7 h-7 rounded-full bg-zen-sage/10 items-center justify-center shrink-0">
                {soundEnabled ? (
                  <Volume2 size={14} strokeWidth={1.8} color="#4E7158" />
                ) : (
                  <VolumeX size={14} strokeWidth={1.8} color="#9BA098" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-zen-charcoal text-xs font-medium">
                  Sound
                </Text>
                <Text className="text-zen-muted text-[10px]">
                  {soundEnabled ? "On" : "Muted"}
                </Text>
              </View>
            </View>
            <View pointerEvents="none">
              <ZenSwitch checked={soundEnabled} size="sm" />
            </View>
          </Pressable>

          {/* Integrated Purpose & Best For callouts */}
          <View className="pt-1 px-0.5 gap-2">
            <View className="flex-row items-start gap-2.5">
              <View className="w-1.5 h-1.5 rounded-full bg-zen-sage shrink-0 ml-1 mt-1.5" />
              <Text className="text-zen-charcoal text-xs flex-1 leading-4">
                <Text className="font-semibold text-zen-sage">Purpose: </Text>
                {technique.benefit}
              </Text>
            </View>

            <View className="flex-row items-start gap-2.5">
              <View className="w-1.5 h-1.5 rounded-full bg-zen-sage shrink-0 ml-1 mt-1.5" />
              <Text className="text-zen-charcoal text-xs flex-1 leading-4">
                <Text className="font-semibold text-zen-sage">
                  Best for:{" "}
                </Text>
                {technique.bestFor}
              </Text>
            </View>
          </View>
        </Card>

        {/* ── 4. How to Practice (Collapsible) ───────────────── */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="How to practice"
          onPress={() => {
            haptics.tick();
            setShowInstructions((prev) => !prev);
          }}
          className="bg-white/90 rounded-3xl border border-zen-border p-3.5 mb-2 active:opacity-90 shadow-2xs"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <View className="w-6 h-6 rounded-full bg-zen-sage/10 items-center justify-center">
                <BookOpen size={13} color="#4E7158" strokeWidth={1.8} />
              </View>
              <Text className="text-zen-charcoal text-sm font-semibold">
                How to practice
              </Text>
              <Text className="text-zen-muted text-xs">
                ({technique.howTo.length} steps)
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              {showInstructions ? (
                <ChevronUp size={16} color="#8B968E" />
              ) : (
                <ChevronDown size={16} color="#8B968E" />
              )}
            </View>
          </View>

          {showInstructions && (
            <View className="mt-3 pt-3 border-t border-zen-border/50 gap-3">
              {technique.howTo.map((step, idx) => (
                <View key={idx} className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full bg-zen-sage/12 items-center justify-center mr-2.5 mt-0.5 shrink-0">
                    <Text className="text-zen-sage text-xs font-semibold">
                      {idx + 1}
                    </Text>
                  </View>
                  <Text className="text-zen-charcoal text-xs leading-5 flex-1">
                    {step}
                  </Text>
                </View>
              ))}

              {technique.handHint && (
                <View className="flex-row items-start pt-2 border-t border-zen-border/40">
                  <View className="w-1.5 h-1.5 rounded-full bg-zen-sage shrink-0 ml-1 mt-1.5 mr-2.5" />
                  <Text className="text-zen-muted text-xs leading-4 flex-1">
                    <Text className="font-semibold text-zen-charcoal">
                      Hand position:{" "}
                    </Text>
                    {technique.handHint}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* ── Bottom Fixed Action Button ──────────────────────── */}
      <View
        className="absolute inset-x-0 bottom-0 pointer-events-box-none"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        {/* Ambient Mist Scrim (Bokashi - soft gradient fade when scrolled) */}
        <LinearGradient
          colors={["transparent", "rgba(247, 245, 238, 0.88)", "#F7F5EE"]}
          style={{
            position: "absolute",
            top: -24,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          pointerEvents="none"
        />
        <View className="px-6 pt-2">
          <Button
            variant="sage"
            size="pill"
            onPress={handleStart}
            className="w-full"
          >
            Begin
          </Button>
        </View>
      </View>
    </View>
  );
}
