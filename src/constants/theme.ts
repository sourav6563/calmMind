import '@/global.css';

import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

/**
 * calmMind Zen design tokens — single source of truth.
 * Warm, organic Japanese & Nordic mindfulness palette.
 */
export const ZenColors = {
  background: '#F7F5EE',
  backgroundSecondary: '#EFECE3',
  cardSurface: '#FFFFFF',
  cardBorder: '#EAE6DB',
  cardShadow: 'rgba(50, 40, 30, 0.04)',

  primarySage: '#4E7158',
  primarySageHover: '#42624B',
  primarySageSoft: '#E4ECE5',

  textPrimary: '#222522',
  textSecondary: '#6B7068',
  textMuted: '#9BA098',

  badges: {
    sage: { bg: '#E4ECE5', fg: '#4E7158' },
    cyan: { bg: '#E0EEF1', fg: '#3D7886' },
    blue: { bg: '#E2EBF5', fg: '#42709E' },
    lavender: { bg: '#EFE7F6', fg: '#76569B' },
    peach: { bg: '#F9EBE0', fg: '#B36D48' },
    blush: { bg: '#FCE6E6', fg: '#BA4C52' },
  },
} as const;

/** Base neutrals */
export const Neutral = {
  spaceBlack: '#141A17',
  spaceGlass: 'rgba(255, 255, 255, 0.75)',
  spaceSurface: '#FFFFFF',
  spaceSurfaceRaised: '#F7F5EE',
  moonlightWhite: '#222522',
  starlightDim: '#6B7068',
  spaceHairline: '#EAE6DB',

  warmOffWhite: '#F7F5EE',
  charcoal: '#222522',
  textDim: '#6B7068',
  hairline: '#EAE6DB',
  nightBackground: '#141A17',
  nightSurface: '#1D2420',
  nightSurfaceRaised: '#242D28',
  nightText: '#EAF0EC',
  nightTextDim: '#8B968E',
  nightHairline: 'rgba(255, 255, 255, 0.08)',
} as const;

export const BreathColors = {
  primary: '#4E7158',
  secondary: '#6B9075',
  glow: '#D8E8DC',
  surface: '#FFFFFF',
  surfaceBorder: '#EAE6DB',
  onSurface: '#222522',
  darkPrimary: '#5E8569',
  darkSurface: '#1D2420',
  darkGlow: '#2F4536',
} as const;

export const MeditateColors = {
  primary: '#4E7158',
  secondary: '#6B9075',
  glow: '#F9EBE0',
  surface: '#FFFFFF',
  surfaceBorder: '#EAE6DB',
  onSurface: '#222522',
  darkPrimary: '#5E8569',
  darkSurface: '#1D2420',
  darkGlow: '#3B332B',
} as const;

export const Colors = {
  light: {
    text: ZenColors.textPrimary,
    background: ZenColors.background,
    backgroundElement: ZenColors.cardSurface,
    backgroundSelected: ZenColors.primarySageSoft,
    textSecondary: ZenColors.textSecondary,
    hairline: ZenColors.cardBorder,
    tint: ZenColors.primarySage,
  },
  dark: {
    text: '#EAF0EC',
    background: '#141A17',
    backgroundElement: '#1D2420',
    backgroundSelected: '#242D28',
    textSecondary: '#8B968E',
    hairline: 'rgba(255, 255, 255, 0.08)',
    tint: '#5E8569',
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

export function modePalette(mode: AppMode, scheme: ColorScheme): ModePalette {
  const isDark = scheme === 'dark';
  if (mode === 'breathe') {
    return {
      primary: isDark ? BreathColors.darkPrimary : BreathColors.primary,
      deep: isDark ? '#1F3025' : '#395340',
      secondary: BreathColors.secondary,
      glow: isDark ? BreathColors.darkGlow : BreathColors.glow,
      surface: isDark ? BreathColors.darkSurface : BreathColors.surface,
      border: isDark ? Neutral.nightHairline : BreathColors.surfaceBorder,
      onSurface: isDark ? '#EAF0EC' : BreathColors.onSurface,
    };
  }
  return {
    primary: isDark ? MeditateColors.darkPrimary : MeditateColors.primary,
    deep: isDark ? '#2E2720' : '#5C4436',
    secondary: MeditateColors.secondary,
    glow: isDark ? MeditateColors.darkGlow : MeditateColors.glow,
    surface: isDark ? MeditateColors.darkSurface : MeditateColors.surface,
    border: isDark ? Neutral.nightHairline : MeditateColors.surfaceBorder,
    onSurface: isDark ? '#EAF0EC' : MeditateColors.onSurface,
  };
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'ui-rounded',
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

export const Radius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

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

export const Motion = {
  nav: 400,
  sessionEnter: 700,
  complete: 1000,
  fade: 500,
  idleBeforeFade: 30_000,
  orbMinScale: 1,
  orbMaxScale: 1.18,
  easing: Easing.inOut(Easing.ease),
  easingOut: Easing.out(Easing.ease),
} as const;

export const TouchTarget = {
  min: 48,
  sleep: 56,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
