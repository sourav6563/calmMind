import '@/global.css';

import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

/**
 * calmMind design tokens — single source of truth.
 * Design filter: "Does this make the user feel calmer?" If no, it doesn't ship.
 * Neuroscience-based palette: no pure black/white, colored shadows, never gray.
 */

/** Base neutrals — Clean Space Black canvas with translucent Space-Glass surfaces and soft moonlight typography. */
export const Neutral = {
  spaceBlack: '#05070B',
  spaceGlass: 'rgba(10, 16, 26, 0.42)',
  spaceSurface: 'rgba(10, 16, 26, 0.46)',
  spaceSurfaceRaised: 'rgba(20, 32, 45, 0.65)',
  moonlightWhite: '#E8EFF7',
  starlightDim: '#728FA7',
  spaceHairline: 'rgba(156, 181, 201, 0.20)',
  /** Legacy aliases kept for compatibility — all mapped to Space Black. */
  warmOffWhite: '#05070B',
  charcoal: '#E8EFF7',
  textDim: '#728FA7',
  hairline: 'rgba(156, 181, 201, 0.20)',
  nightBackground: '#05070B',
  nightSurface: 'rgba(10, 16, 26, 0.46)',
  nightSurfaceRaised: 'rgba(20, 32, 45, 0.65)',
  nightText: '#E8EFF7',
  nightTextDim: '#728FA7',
  nightHairline: 'rgba(156, 181, 201, 0.20)',
} as const;

/**
 * Breathe — Clean Space Black paired with soft Powder Moonlight Slate-Blue (#44627D / #728FA7 / #9CB5C9).
 */
export const BreathColors = {
  primary: '#44627D',
  secondary: '#728FA7',
  glow: '#9CB5C9',
  surface: Neutral.spaceSurface,
  surfaceBorder: Neutral.spaceHairline,
  onSurface: '#E8EFF7',
  /** Dark / sleep variant. */
  darkPrimary: '#44627D',
  darkSurface: Neutral.spaceSurface,
  darkGlow: '#9CB5C9',
} as const;

/**
 * Meditate — Clean Space Black paired with soft Powder Moonlight Slate-Blue.
 */
export const MeditateColors = {
  primary: '#44627D',
  secondary: '#728FA7',
  glow: '#9CB5C9',
  surface: Neutral.spaceSurface,
  surfaceBorder: Neutral.spaceHairline,
  onSurface: '#E8EFF7',
  /** Dark / sleep variant. */
  darkPrimary: '#44627D',
  darkSurface: Neutral.spaceSurface,
  darkGlow: '#9CB5C9',
} as const;

export const Colors = {
  light: {
    text: Neutral.moonlightWhite,
    background: Neutral.spaceBlack,
    backgroundElement: Neutral.spaceSurface,
    backgroundSelected: Neutral.spaceSurfaceRaised,
    textSecondary: Neutral.starlightDim,
    hairline: Neutral.spaceHairline,
    tint: BreathColors.primary,
  },
  dark: {
    text: Neutral.moonlightWhite,
    background: Neutral.spaceBlack,
    backgroundElement: Neutral.spaceSurface,
    backgroundSelected: Neutral.spaceSurfaceRaised,
    textSecondary: Neutral.starlightDim,
    hairline: Neutral.spaceHairline,
    tint: BreathColors.primary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ColorScheme = 'light' | 'dark';
export type AppMode = 'breathe' | 'meditate';

export type ModePalette = {
  primary: string;
  deep: string;
  secondary: string;
  glow: string;
  surface: string;
  border: string;
  onSurface: string;
};

/** Mode palette — Clean Space Black canvas with eye-soothing Moonlight Slate-Blue accents. */
export function modePalette(mode: AppMode, _scheme: ColorScheme): ModePalette {
  if (mode === 'breathe') {
    return {
      primary: BreathColors.primary,
      deep: '#2F475D',
      secondary: BreathColors.secondary,
      glow: BreathColors.glow,
      surface: BreathColors.surface,
      border: BreathColors.surfaceBorder,
      onSurface: BreathColors.onSurface,
    };
  }
  return {
    primary: MeditateColors.primary,
    deep: '#2F475D',
    secondary: MeditateColors.secondary,
    glow: MeditateColors.glow,
    surface: MeditateColors.surface,
    border: MeditateColors.surfaceBorder,
    onSurface: MeditateColors.onSurface,
  };
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  twelve: 12,
  three: 16,
  four: 24,
  five: 32,
  fortyEight: 48,
  six: 64,
} as const;

/** Rounded-only geometry — circles and ovals as base primitives. */
export const Radius = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

/** Type scale (16 = body base). */
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
  timer: 48,
} as const;

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  semibold: '600' as const,
};

/** Motion — slow, smooth, never snappy (physiological design). */
export const Motion = {
  /** Screen-to-screen nav. */
  nav: 500,
  /** Entering a session — deliberate slow-down. */
  sessionEnter: 800,
  /** Gentle completion overshoot, no confetti/badges. */
  complete: 1000,
  /** Control auto-fade. */
  fade: 600,
  /** Idle before controls auto-fade. */
  idleBeforeFade: 30_000,
  /** Orb scale range over a breath phase. */
  orbMinScale: 1,
  orbMaxScale: 1.18,
  easing: Easing.inOut(Easing.ease),
  easingOut: Easing.out(Easing.ease),
} as const;

/** Minimum touch targets (sleep mode uses the larger size). */
export const TouchTarget = {
  min: 48,
  sleep: 56,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

