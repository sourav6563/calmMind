import React from "react";
import { Pressable, View } from "react-native";

import { PlayPauseIcon } from "@/components/icons/ui-icons";
import { Text } from "@/components/ui/text";
import { useHaptics } from "@/hooks/use-haptics";

export type SessionScrubberProps = {
  elapsedSeconds: number;
  totalSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  className?: string;
};

export function SessionScrubber({
  isPaused,
  onTogglePause,
  className = "",
}: SessionScrubberProps) {
  const haptics = useHaptics();

  return (
    <View
      className={`w-full items-center justify-center ${className}`}
    >
      {/* Centered Frosted Play / Pause Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPaused ? "Resume session" : "Pause session"}
        onPress={() => {
          haptics.tick();
          onTogglePause();
        }}
        className="w-13 h-13 rounded-full bg-white/90 border border-zen-border/90 items-center justify-center active:scale-95 shadow-sm"
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
        }}
      >
        <PlayPauseIcon isPlaying={!isPaused} size={19} color="#222522" />
      </Pressable>

      {/* Discreet Zen Pause Indicator: No misleading seconds, zero layout shift */}
      <View className="h-5 mt-2 items-center justify-center">
        {isPaused ? (
          <Text className="text-zen-sage text-xs font-semibold tracking-wide">
            Paused
          </Text>
        ) : null}
      </View>
    </View>
  );
}
