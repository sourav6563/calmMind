import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Volume2, VolumeX } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, Pressable, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BotanicalGlyph } from "@/components/icons/botanical-glyphs";
import { CloseIcon } from "@/components/icons/ui-icons";
import { ConcentricBreather } from "@/components/session/concentric-breather";
import { SessionScrubber } from "@/components/session/session-scrubber";
import { Badge } from "@/components/ui/badge";
import { getTechnique, TECHNIQUES } from "@/constants/techniques";
import { useBreathPhase } from "@/hooks/use-breath-phase";
import { useHaptics } from "@/hooks/use-haptics";
import { saveRecentSession } from "@/utils/recent-sessions";
import {
  modulateZenBreathscapePhase,
  pauseZenBreathscape,
  releaseZenBreathscape,
  resumeZenBreathscape,
  setZenBreathscapeMuted,
  slowDownZenBreathscape,
  startZenBreathscape,
  stopZenBreathscapeImmediately,
} from "@/utils/zen-chime";

const LAKE_IMAGE = require("@/assets/images/zen_lake_mist.jpg");

function formatPracticeTime(seconds: number): string {
  const mins = Math.max(1, Math.round(seconds / 60));
  return `${mins} min`;
}

export default function ActiveBreatheSessionScreen() {
  const {
    technique: id,
    cycles: cyclesParam,
    sound = "1",
    guidance,
  } = useLocalSearchParams<{
    technique: string;
    cycles?: string;
    sound?: string;
    guidance?: string;
  }>();

  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const technique = getTechnique(id) ?? TECHNIQUES[0];
  const parsedCycles =
    cyclesParam !== undefined
      ? parseInt(cyclesParam, 10)
      : technique.cyclesDefault;
  const targetCycles = !isNaN(parsedCycles)
    ? parsedCycles
    : technique.cyclesDefault;

  // Sound enabled by default unless explicitly 0 or silent
  const initialSoundActive = sound !== "0" && guidance !== "silent";
  const [isSoundMuted, setIsSoundMuted] = useState(!initialSoundActive);

  const cycleSeconds = technique.phases.reduce((sum, p) => sum + p.seconds, 0);
  const totalSessionSeconds =
    targetCycles > 0 ? cycleSeconds * targetCycles : 0;

  // Session state (permanent 3-second countdown to prepare posture & mind)
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [prepCount, setPrepCount] = useState<number>(3);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const isPrepping = prepCount > 0;
  const hasStartedBreathscapeRef = useRef(false);
  const hasTriggeredFinalSlowDownRef = useRef(false);
  const lastModulatedPhaseRef = useRef<{ cycle: number; phaseIndex: number }>({
    cycle: -1,
    phaseIndex: -1,
  });

  // Reanimated values for smooth 3s countdown swell (continuous single breath, zero bouncing)
  const prepScale = useSharedValue(1);
  const numberOpacity = useSharedValue(1);

  useEffect(() => {
    void saveRecentSession(technique.id, "breathe");
    return () => {
      stopZenBreathscapeImmediately();
      releaseZenBreathscape();
    };
  }, [technique.id]);

  // Start continuous Zen Breathscape ambient drone after prep countdown
  useEffect(() => {
    if (
      !isPrepping &&
      !isPaused &&
      !isCompleted &&
      !hasStartedBreathscapeRef.current
    ) {
      hasStartedBreathscapeRef.current = true;
      lastModulatedPhaseRef.current = { cycle: 1, phaseIndex: 0 };
      startZenBreathscape({
        isMuted: isSoundMuted,
        firstPhaseSeconds: technique.phases[0]?.seconds,
      });
    }
  }, [isPrepping, isPaused, isCompleted, isSoundMuted, technique.phases]);

  // Sync mute state immediately with ambient engine
  useEffect(() => {
    setZenBreathscapeMuted(isSoundMuted);
  }, [isSoundMuted]);

  // Continuous 3s expansive swell on the circular disk (single smooth breath)
  useEffect(() => {
    if (!isPrepping || isPaused) return;

    cancelAnimation(prepScale);
    prepScale.value = 1;
    prepScale.value = withTiming(1.12, {
      duration: 3000,
      easing: Easing.out(Easing.sin),
    });
  }, [isPrepping, isPaused, prepScale]);

  // Settling countdown (3 -> 2 -> 1 -> start) with soft digit cross-dissolve
  useEffect(() => {
    if (!isPrepping || isPaused) return;

    cancelAnimation(numberOpacity);
    numberOpacity.value = 0.35;
    numberOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    const timer = setInterval(() => {
      setPrepCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPrepping, prepCount, numberOpacity, isPaused]);

  const prepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: prepScale.value }],
  }));

  const numberAnimatedStyle = useAnimatedStyle(() => ({
    opacity: numberOpacity.value,
  }));

  // Breathing state machine (pure, peaceful practice with user's background sound)
  const phaseState = useBreathPhase(technique.phases, {
    running: !isPaused && !isPrepping && !isCompleted,
    cycles: targetCycles,
    onCycleEnd: () => {},
    onEnd: () => {
      // Gently dissolve remaining sound over 3.5 seconds as practice concludes
      slowDownZenBreathscape(3500);
      setIsCompleted(true);
    },
  });

  // Detect when practice enters the final breath phase of the final cycle (end time)
  const isFinalPhaseOfSession =
    !isPrepping &&
    targetCycles > 0 &&
    phaseState.cycle === targetCycles &&
    phaseState.phaseIndex === technique.phases.length - 1;

  // When end time comes in (final breath phase begins), start progressive audio slow-down
  useEffect(() => {
    if (
      isFinalPhaseOfSession &&
      !hasTriggeredFinalSlowDownRef.current &&
      !isPaused &&
      !isCompleted
    ) {
      hasTriggeredFinalSlowDownRef.current = true;
      const finalPhaseDurationMs = Math.max(
        3500,
        technique.phases[technique.phases.length - 1].seconds * 1000
      );
      slowDownZenBreathscape(finalPhaseDurationMs);
    }
  }, [isFinalPhaseOfSession, isPaused, isCompleted, technique.phases]);

  // Dynamic breath volume modulation (Option A: organic swell on Inhale, tranquil Hold, soft Exhale)
  useEffect(() => {
    if (isPrepping || isPaused || isCompleted || isFinalPhaseOfSession) return;

    // Guard: only modulate when the phase or cycle actually changes
    if (
      lastModulatedPhaseRef.current.cycle === phaseState.cycle &&
      lastModulatedPhaseRef.current.phaseIndex === phaseState.phaseIndex
    ) {
      return;
    }
    lastModulatedPhaseRef.current = {
      cycle: phaseState.cycle,
      phaseIndex: phaseState.phaseIndex,
    };

    const currentPhase = technique.phases[phaseState.phaseIndex];
    if (!currentPhase) return;

    const prevPhase =
      phaseState.phaseIndex > 0
        ? technique.phases[phaseState.phaseIndex - 1]
        : technique.phases[technique.phases.length - 1];

    const isHoldAfterExhale =
      !!currentPhase.hold &&
      (prevPhase?.label.toLowerCase().includes("exhale") ||
        currentPhase.scale <= 1.05);

    modulateZenBreathscapePhase({
      phaseLabel: currentPhase.label,
      durationSeconds: currentPhase.seconds,
      isHoldAfterExhale,
    });
  }, [
    isPrepping,
    isPaused,
    isCompleted,
    isFinalPhaseOfSession,
    phaseState.phaseIndex,
    phaseState.cycle,
    technique.phases,
  ]);

  // Pause / resume ambient soundscape with session controls
  useEffect(() => {
    if (isPrepping || isCompleted) return;
    if (isPaused) {
      pauseZenBreathscape();
    } else {
      if (isFinalPhaseOfSession && hasTriggeredFinalSlowDownRef.current) {
        // Resume slow-down across remaining seconds of the final phase
        const remainMs = Math.max(800, phaseState.secondsLeft * 1000);
        slowDownZenBreathscape(remainMs);
      } else {
        resumeZenBreathscape();
      }
    }
  }, [
    isPaused,
    isPrepping,
    isCompleted,
    isFinalPhaseOfSession,
    phaseState.secondsLeft,
  ]);

  // When session completes, smoothly and progressively dissolve audio to silence over 3.5s
  useEffect(() => {
    if (isCompleted) {
      slowDownZenBreathscape(3500);
    }
  }, [isCompleted]);

  // Elapsed timer
  useEffect(() => {
    if (isPaused || isPrepping || isCompleted) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (targetCycles > 0 && prev + 1 >= totalSessionSeconds) {
          return totalSessionSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isPrepping, isCompleted, targetCycles, totalSessionSeconds]);

  const handleClose = useCallback(() => {
    haptics.tick();
    if (isCompleted) {
      stopZenBreathscapeImmediately();
      router.back();
      return;
    }
    // Always pause and show confirmation dialog whenever cross button is tapped
    setIsPaused(true);
    setShowExitConfirm(true);
  }, [haptics, isCompleted]);

  const handleResumePractice = useCallback(() => {
    haptics.tick();
    setShowExitConfirm(false);
    setIsPaused(false);
  }, [haptics]);

  const handleConfirmExit = () => {
    haptics.tick();
    stopZenBreathscapeImmediately();
    releaseZenBreathscape();
    setShowExitConfirm(false);
    router.back();
  };

  const handleCompleteDone = () => {
    haptics.tick();
    stopZenBreathscapeImmediately();
    releaseZenBreathscape();
    router.back();
  };

  // Harmonize Android system back button & navigation gesture with in-app confirmation
  useEffect(() => {
    const onBackPress = () => {
      // If session is already completed, allow natural exit
      if (isCompleted) {
        return false;
      }
      // If confirmation dialog is already open, back button resumes practice
      if (showExitConfirm) {
        handleResumePractice();
        return true;
      }
      // Otherwise, pause practice and show confirmation dialog
      handleClose();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => subscription.remove();
  }, [isCompleted, showExitConfirm, handleClose, handleResumePractice]);

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleToggleMute = () => {
    haptics.tick();
    setIsSoundMuted((prev) => !prev);
  };

  const handleSkipPrep = () => {
    haptics.tick();
    cancelAnimation(prepScale);
    setPrepCount(0);
  };

  const completedRounds =
    targetCycles > 0 ? targetCycles : Math.max(1, phaseState.cycle);

  return (
    <View
      className="flex-1 bg-zen-cream relative"
      style={{ flex: 1, backgroundColor: "#F7F5EE", position: "relative" }}
    >
      <StatusBar style="dark" />

      {/* ── Background Landscape Artwork (Crisp Natural Watercolor) ── */}
      <Image
        source={LAKE_IMAGE}
        style={{ width: "100%", height: "100%", position: "absolute" }}
        contentFit="cover"
        priority="high"
      />

      {/* ── Zen Cream Ambient Scrims (Ensures Pure Legibility) ──── */}
      <LinearGradient
        colors={[
          "rgba(247, 245, 238, 0.75)",
          "rgba(247, 245, 238, 0.20)",
          "transparent",
        ]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140 }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[
          "transparent",
          "rgba(247, 245, 238, 0.25)",
          "rgba(247, 245, 238, 0.82)",
        ]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 170,
        }}
        pointerEvents="none"
      />
      <View className="absolute inset-0 bg-zen-cream/5" pointerEvents="none" />

      {/* ── Top Bar ───────────────────────────────────────────── */}
      <View
        className="px-6 flex-row items-center justify-between z-10"
        style={{ paddingTop: insets.top + 12 }}
      >
        {/* Quick In-Session Sound Mute Toggle */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSoundMuted ? "Unmute sound" : "Mute sound"}
          onPress={handleToggleMute}
          className="w-10 h-10 rounded-full bg-white/85 border border-zen-border/80 items-center justify-center active:scale-95 shadow-2xs"
        >
          {isSoundMuted ? (
            <VolumeX size={17} color="#6B7068" />
          ) : (
            <Volume2 size={17} color="#4E7158" />
          )}
        </Pressable>

        {/* Centered Session Info */}
        <View className="items-center">
          <Text
            className="text-zen-charcoal text-lg font-semibold tracking-wide"
            style={{ fontFamily: "serif" }}
          >
            {technique.name}
          </Text>
          <Text className="text-zen-sage text-xs font-semibold mt-0.5">
            {targetCycles > 0
              ? `Round ${Math.min(phaseState.cycle, targetCycles)} of ${targetCycles}`
              : `Round ${phaseState.cycle} · Free Flow`}
          </Text>
        </View>

        {/* Frosted Close Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close session"
          onPress={handleClose}
          className="w-10 h-10 rounded-full bg-white/85 border border-zen-border/80 items-center justify-center active:scale-95 shadow-2xs"
        >
          <CloseIcon size={18} color="#222522" />
        </Pressable>
      </View>

      {/* ── Center Content: Preparation vs Active Visualizer ──── */}
      <View className="flex-1 items-center justify-center px-6">
        {isPrepping ? (
          <View className="items-center justify-center gap-3">
            {/* Animated Pulsing Countdown Disk (Clean Round Geometry, Zero Squarish Elevation) */}
            <Animated.View
              style={[
                {
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: "rgba(78, 113, 88, 0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(78, 113, 88, 0.20)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                },
                prepAnimatedStyle,
              ]}
            >
              <View
                style={[
                  {
                    width: 74,
                    height: 74,
                    borderRadius: 37,
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    borderWidth: 1,
                    borderColor: "rgba(234, 230, 219, 0.95)",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  },
                  Platform.select({
                    ios: {
                      shadowColor: "#2C3E32",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.08,
                      shadowRadius: 10,
                    },
                    default: {},
                  }),
                ]}
              >
                <Animated.View
                  style={[
                    { alignItems: "center", justifyContent: "center" },
                    numberAnimatedStyle,
                  ]}
                >
                  <Text
                    className="text-zen-sage text-3xl font-semibold"
                    style={{ fontFamily: "serif" }}
                  >
                    {prepCount}
                  </Text>
                </Animated.View>
              </View>
            </Animated.View>

            <View className="items-center gap-1.5 mt-2">
              <Text
                className="text-zen-charcoal text-xl font-semibold tracking-wide text-center"
                style={{ fontFamily: "serif" }}
              >
                Get ready
              </Text>
              <Text className="text-zen-muted text-xs text-center max-w-[260px] leading-5 font-medium">
                Find a comfortable posture
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip preparation countdown"
              onPress={handleSkipPrep}
              className="mt-2 px-4 py-1.5 rounded-full bg-white/85 border border-zen-border/90 active:scale-95 shadow-2xs"
            >
              <Text className="text-zen-charcoal text-xs font-semibold">
                Skip
              </Text>
            </Pressable>
          </View>
        ) : (
          <ConcentricBreather
            phaseLabel={phaseState.phase.label}
            phaseSeconds={phaseState.phase.seconds}
            secondsLeft={phaseState.secondsLeft}
            scaleTarget={phaseState.phase.scale ?? 1.0}
            isHold={!!phaseState.phase.hold}
            cue={phaseState.phase.cue}
            isPaused={isPaused}
          />
        )}
      </View>

      {/* ── Bottom Timeline Scrubber & Controls ───────────────── */}
      <View
        className="w-full pb-8 z-10"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <SessionScrubber
          elapsedSeconds={elapsedSeconds}
          totalSeconds={
            targetCycles > 0 ? totalSessionSeconds : Math.max(elapsedSeconds, 1)
          }
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
        />
      </View>

      {/* ── Early Exit Confirmation Dialog ───────────────────── */}
      {showExitConfirm && (
        <View
          className="absolute inset-0 bg-black/40 items-center justify-center px-6 z-30"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <View className="w-full max-w-sm bg-zen-cream rounded-3xl p-6 items-center border border-zen-border shadow-2xl">
            <View className="w-12 h-12 rounded-full bg-zen-sage/10 items-center justify-center mb-3">
              <BotanicalGlyph icon="leaf" color="#4E7158" size={24} />
            </View>

            <Text
              className="text-zen-charcoal text-2xl font-semibold text-center mb-1.5"
              style={{ fontFamily: "serif" }}
            >
              Pause your practice?
            </Text>

            <Text className="text-zen-muted text-xs text-center leading-5 mb-5 px-2">
              {elapsedSeconds > 30
                ? `Take all the time you need. Your ${formatPracticeTime(elapsedSeconds)} of breathing will still be saved.`
                : "Take all the time you need. Would you like to resume or finish your practice?"}
            </Text>

            {/* Action Buttons: Soft Inset Pill Geometry (Option B) */}
            <View className="w-full gap-2.5 mt-1 items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Resume practice"
                onPress={handleResumePractice}
                className="w-[86%] max-w-[250px] h-12 rounded-full bg-zen-sage items-center justify-center active:bg-zen-sageHover active:scale-[0.98] shadow-xs"
              >
                <Text className="text-white text-sm font-semibold tracking-wide">
                  Resume Practice
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="End session"
                onPress={handleConfirmExit}
                className="w-[86%] max-w-[250px] h-12 rounded-full bg-white/80 border border-zen-border/90 items-center justify-center active:bg-white active:scale-[0.98]"
              >
                <Text className="text-zen-charcoal text-sm font-medium tracking-wide">
                  End Practice
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ── Completion Modal Overlay ──────────────────────────── */}
      {isCompleted && (
        <View
          className="absolute inset-0 bg-black/45 items-center justify-center px-6 z-30"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <View className="w-full max-w-sm bg-zen-cream rounded-3xl p-6 items-center border border-zen-border shadow-2xl">
            <View className="mb-4">
              <Badge color={technique.badgeColor} size={64}>
                <BotanicalGlyph
                  icon={technique.icon}
                  color="#4E7158"
                  size={32}
                />
              </Badge>
            </View>

            <Text
              className="text-zen-charcoal text-2xl font-semibold text-center mb-1"
              style={{ fontFamily: "serif" }}
            >
              Practice Complete
            </Text>

            <Text className="text-zen-muted text-xs text-center mb-6">
              Take a quiet moment to notice how you feel right now.
            </Text>

            {/* Session Stats */}
            <View className="w-full bg-white/95 rounded-2xl p-4 border border-zen-border mb-6 gap-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-zen-muted text-xs">Rounds Completed</Text>
                <Text className="text-zen-charcoal text-sm font-semibold">
                  {completedRounds} {completedRounds === 1 ? "round" : "rounds"}
                </Text>
              </View>

              <View className="h-[1px] bg-zen-border/70" />

              <View className="flex-row items-center justify-between">
                <Text className="text-zen-muted text-xs">Practice Time</Text>
                <Text className="text-zen-charcoal text-sm font-semibold">
                  {formatPracticeTime(elapsedSeconds)}
                </Text>
              </View>

              <View className="h-[1px] bg-zen-border/70" />

              <View className="flex-row items-center justify-between">
                <Text className="text-zen-muted text-xs">Technique</Text>
                <Text className="text-zen-sage text-sm font-semibold">
                  {technique.name}
                </Text>
              </View>
            </View>

            <View className="w-full items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Finish practice"
                onPress={handleCompleteDone}
                className="w-[86%] max-w-[250px] h-12 rounded-full bg-zen-sage items-center justify-center active:bg-zen-sageHover active:scale-[0.98] shadow-xs"
              >
                <Text className="text-white text-sm font-semibold tracking-wide">
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
