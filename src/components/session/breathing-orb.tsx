import { useEffect, useRef, type ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { BreathCue, BreathPhase } from '@/constants/techniques';
import { Motion, type ModePalette } from '@/constants/theme';

export type BreathingOrbProps = {
  phase: BreathPhase;
  /** Changes each phase — restarts the animation cycle. */
  phaseIndex: number;
  /** Phases per breath round. */
  phaseCount: number;
  running: boolean;
  palette: ModePalette;
  /** Per-technique tint (core + glow). */
  tint?: { core: string; glow: string };
  /** Nostril cue for alternate-nostril phases. */
  cue?: BreathCue;
  size?: number;
  /** Center content (phase label). */
  children?: ReactNode;
};

/**
 * Multi-layered organic lotus-flower breathing orb:
 * - Outer ambient aura & trailing ripple waves that follow the chest like air
 * - Counter-rotating soft-cornered lotus flower petals that bloom on inhale and fold on exhale
 * - Luminous 3D-shaded Calm Blue core sphere with inner specular bloom
 * - NO perimeter timer line — pure organic flower motion only
 * - Sinusoidal micro-pulse during breath holds so the orb always feels alive
 * - Exact linear phase clock so pause/resume never snaps or miscalculates time
 */
export function BreathingOrb({
  phase,
  phaseIndex,
  running,
  palette,
  tint,
  cue,
  size = 280,
  children,
}: BreathingOrbProps) {
  const reduceMotion = useReducedMotion();

  // Linear 0..1 clock for exact pause/resume timing calculation (no border timer ring).
  const phaseProgress = useSharedValue(0);
  // 0..1 normalized lung inflation (0 = deflated, 1 = full inhale).
  const breathLevel = useSharedValue(0);
  // Trailing air layers (~140ms and ~260ms behind the core).
  const haloLevel = useSharedValue(0);
  const rippleLevel = useSharedValue(0);
  // Hold-phase micro-pulse so breath retention feels buoyant, never frozen.
  const pulse = useSharedValue(0);
  // Slow continuous lotus petal rotation while session is active.
  const spin = useSharedValue(0);

  const duration = phase.seconds * 1000;
  const targetNorm = Math.min(
    1,
    Math.max(0, (phase.scale - Motion.orbMinScale) / (Motion.orbMaxScale - Motion.orbMinScale)),
  );

  const lastPhaseRef = useRef(-1);

  // Continuous slow lotus flower rotation while running.
  useEffect(() => {
    if (reduceMotion || !running) {
      cancelAnimation(spin);
      return;
    }
    spin.value = withRepeat(
      withTiming(spin.value + 360, {
        duration: 32000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(spin);
  }, [running, reduceMotion, spin]);

  // Hold micro-pulse — gentle sinusoidal oscillation during breath holds.
  useEffect(() => {
    if (reduceMotion || !running || !phase.hold) {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 450, easing: Easing.inOut(Easing.sin) });
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.028, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(-0.012, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [phase.hold, running, reduceMotion, pulse]);

  // Main breath choreography on phase change or pause/resume.
  useEffect(() => {
    if (reduceMotion) {
      breathLevel.value = targetNorm;
      haloLevel.value = targetNorm;
      rippleLevel.value = targetNorm;
      phaseProgress.value = 1;
      return;
    }

    if (running) {
      const isResumeSamePhase = phaseIndex === lastPhaseRef.current;
      lastPhaseRef.current = phaseIndex;

      const startProgress = isResumeSamePhase
        ? Math.min(0.98, Math.max(0, phaseProgress.value))
        : 0;
      const remainDur = Math.max(80, Math.round((1 - startProgress) * duration));
      const breathEase = Easing.bezier(0.37, 0, 0.63, 1);

      phaseProgress.value = startProgress;
      phaseProgress.value = withTiming(1, {
        duration: remainDur,
        easing: Easing.linear,
      });

      breathLevel.value = withTiming(targetNorm, {
        duration: remainDur,
        easing: breathEase,
      });

      const haloDelay = Math.min(140, Math.round(remainDur * 0.12));
      haloLevel.value = withDelay(
        haloDelay,
        withTiming(targetNorm, {
          duration: Math.max(160, remainDur - haloDelay),
          easing: breathEase,
        }),
      );

      const rippleDelay = Math.min(260, Math.round(remainDur * 0.2));
      rippleLevel.value = withDelay(
        rippleDelay,
        withTiming(targetNorm, {
          duration: Math.max(160, remainDur - rippleDelay),
          easing: breathEase,
        }),
      );
    } else {
      cancelAnimation(phaseProgress);
      cancelAnimation(breathLevel);
      cancelAnimation(haloLevel);
      cancelAnimation(rippleLevel);
    }
  }, [
    phaseIndex,
    targetNorm,
    running,
    duration,
    reduceMotion,
    phaseProgress,
    breathLevel,
    haloLevel,
    rippleLevel,
  ]);

  const baseCore = tint?.core ?? palette.primary;
  const coreDeep = deepen(baseCore, 0.24);
  const coreLight = soften(baseCore, 0.14);
  const coreSpecular = soften(baseCore, 0.28);
  const glowTint = tint?.glow ?? palette.glow;

  const coreColor = useDerivedValue(() =>
    interpolateColor(breathLevel.value, [0, 1], [coreDeep, coreLight]),
  );

  const petalColor = useDerivedValue(() =>
    interpolateColor(haloLevel.value, [0, 1], [baseCore, coreLight]),
  );

  // Outer ambient wave ripple (largest, softest).
  const rippleStyle = useAnimatedStyle(() => {
    const s = interpolate(rippleLevel.value, [0, 1], [0.62, 1.04]) + pulse.value * 0.8;
    return {
      transform: [{ scale: s }],
      backgroundColor: glowTint,
      opacity: interpolate(rippleLevel.value, [0, 1], [0.12, 0.26]),
    };
  });

  // Organic lotus flower petal layer A (rotates clockwise, blooms outward on inhale).
  const petalAStyle = useAnimatedStyle(() => {
    const s = interpolate(haloLevel.value, [0, 1], [0.62, 0.96]) + pulse.value * 0.7;
    return {
      transform: [{ scale: s }, { rotate: `${spin.value}deg` }],
      backgroundColor: petalColor.value,
      opacity: interpolate(haloLevel.value, [0, 1], [0.16, 0.3]),
    };
  });

  // Organic lotus flower petal layer B (offset 45deg, counter-rotates for harmonic bloom).
  const petalBStyle = useAnimatedStyle(() => {
    const s = interpolate(haloLevel.value, [0, 1], [0.6, 0.94]) + pulse.value * 0.6;
    return {
      transform: [{ scale: s }, { rotate: `${45 - spin.value * 0.85}deg` }],
      backgroundColor: petalColor.value,
      opacity: interpolate(haloLevel.value, [0, 1], [0.14, 0.25]),
    };
  });

  // Main core sphere (expands 0.66 -> 1.0 of coreSize for a visceral 51% diameter expansion).
  const coreStyle = useAnimatedStyle(() => {
    const s = interpolate(breathLevel.value, [0, 1], [0.66, 1.0]) + pulse.value;
    return {
      transform: [{ scale: s }],
      backgroundColor: coreColor.value,
      borderColor: `rgba(156, 181, 201, ${interpolate(breathLevel.value, [0, 1], [0.14, 0.28])})`,
    };
  });

  // Inner 3D specular highlight bloom.
  const innerBloomStyle = useAnimatedStyle(() => {
    const s = interpolate(breathLevel.value, [0, 1], [0.55, 1.02]) + pulse.value * 0.5;
    return {
      transform: [{ scale: s }, { translateY: -8 }],
      opacity: interpolate(breathLevel.value, [0, 1], [0.14, 0.3]),
    };
  });

  const auraSize = size * 0.94;
  const petalSize = size * 0.8;
  const petalRadius = petalSize * 0.35;
  const coreSize = size * 0.72;
  const innerSize = coreSize * 0.72;

  return (
    <View
      accessibilityLabel={`Breathing orb, ${phase.label}`}
      style={[styles.container, { width: size, height: size }]}>
      {/* Layer 1: Outer trailing air aura */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.circle,
          { width: auraSize, height: auraSize },
          rippleStyle,
        ]}
      />

      {/* Layer 2 & 3: Counter-rotating organic lotus flower petals */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.petal,
          { width: petalSize, height: petalSize, borderRadius: petalRadius },
          petalAStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.petal,
          { width: petalSize, height: petalSize, borderRadius: petalRadius },
          petalBStyle,
        ]}
      />

      {/* Layer 4: Luminous core sphere */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.circle,
          styles.coreBorder,
          { width: coreSize, height: coreSize },
          coreStyle,
          shadowStyle(baseCore),
        ]}>
        {/* Layer 5: Inner specular light bloom for 3D depth */}
        <Animated.View
          style={[
            styles.circle,
            {
              width: innerSize,
              height: innerSize,
              backgroundColor: coreSpecular,
            },
            innerBloomStyle,
          ]}
        />
      </Animated.View>

      {/* Center overlay: phase readout + nostril cue */}
      <View
        style={[frameStyles.center, { maxWidth: coreSize * 0.82 }]}
        pointerEvents="none">
        {children}
        {cue && <NostrilSide cue={cue} />}
      </View>
    </View>
  );
}

/**
 * Alternate-nostril indicator — clear LEFT / RIGHT pills with active indicator dot.
 */
function NostrilSide({ cue }: { cue: BreathCue }) {
  return (
    <View
      style={sideStyles.row}
      accessibilityLabel={cue === 'left' ? 'Left nostril' : 'Right nostril'}>
      {(['left', 'right'] as const).map((side) => {
        const active = cue === side;
        return (
          <View key={side} style={[sideStyles.pill, active && sideStyles.pillActive]}>
            {active && <View style={sideStyles.dot} />}
            <Text style={[sideStyles.pillText, active && sideStyles.pillTextActive]}>
              {side.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const frameStyles = StyleSheet.create({
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
  },
});

const sideStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});

/** Mix a hex color toward white by `amount` (0..1). */
function soften(hex: string, amount = 0.4): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Deepen a hex color toward rich midnight by `amount` (0..1). */
function deepen(hex: string, amount = 0.2): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c * (1 - amount));
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Colored drop shadow (never gray — per design rules). */
function shadowStyle(color: string) {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity: 0.38,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
    },
    default: {},
  });
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  petal: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreBorder: {
    borderWidth: 1.5,
  },
});
