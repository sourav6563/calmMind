/**
 * calmMind content config — single source of truth for techniques & practices.
 * Wellness framing only (no clinical claims).
 */

export type BreathCue = 'left' | 'right';

export type BreathPhase = {
  /** Display label shown inside the orb. */
  label: string;
  /** Phase duration in seconds. */
  seconds: number;
  /** Target orb scale for this phase (1 = deflated, 1.18 = inflated). */
  scale: number;
  /** Hold phases get a gentle micro-pulse so the orb never feels frozen. */
  hold?: boolean;
  /** Optional nostril cue for alternate-nostril breathing. */
  cue?: BreathCue;
};

export type TechniqueIcon =
  | 'leaf'
  | 'box'
  | 'waves'
  | 'wind'
  | 'lotus'
  | 'moon'
  | 'channels'
  | 'breath'
  | 'scan'
  | 'heart'
  | 'focus'
  | 'flower';

export type BadgeColor = 'sage' | 'cyan' | 'blue' | 'lavender' | 'peach' | 'blush';

export type Technique = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  benefit: string;
  bestFor: string;
  estimatedMinutes: number;
  badgeColor: BadgeColor;
  phases: BreathPhase[];
  cyclesDefault: number;
  cycleOptions: number[];
  icon: TechniqueIcon;
  orbTint: { core: string; glow: string };
  howTo: string[];
  handHint?: string;
};

export type Meditation = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  benefit: string;
  bestFor: string;
  badgeColor: BadgeColor;
  durations: number[];
  durationDefault: number;
  prompts: string[];
  icon: TechniqueIcon;
  orbTint: { core: string; glow: string };
};

const INFLATED = 1.18;
const DEFLATED = 1;

const ZEN_BREATHE_TINT = { core: '#4E7158', glow: '#D8E8DC' } as const;
const ZEN_MEDITATE_TINT = { core: '#C98A5B', glow: '#FDECE0' } as const;

export const TECHNIQUES: Technique[] = [
  {
    id: 'calm',
    name: 'Calm Breathing',
    category: 'Relax',
    tagline: 'A simple practice to relax your mind and body',
    benefit: 'Soothe nervous system',
    bestFor: 'Daily calm, letting go of tension',
    estimatedMinutes: 3,
    badgeColor: 'sage',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED },
      { label: 'Exhale', seconds: 6, scale: DEFLATED },
    ],
    cyclesDefault: 12,
    cycleOptions: [6, 12, 24, 0],
    icon: 'leaf',
    orbTint: ZEN_BREATHE_TINT,
    howTo: [
      'Inhale smoothly through your nose for 4 seconds',
      'Exhale slowly through your mouth or nose for 6 seconds',
      'Allow shoulders to drop with every exhale',
    ],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    category: 'Focus',
    tagline: '4 counts in, hold, out, hold',
    benefit: 'Stay calm and focused',
    bestFor: 'Work, study, or mental distractions',
    estimatedMinutes: 3,
    badgeColor: 'cyan',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED },
      { label: 'Hold', seconds: 4, scale: INFLATED, hold: true },
      { label: 'Exhale', seconds: 4, scale: DEFLATED },
      { label: 'Hold', seconds: 4, scale: DEFLATED, hold: true },
    ],
    cyclesDefault: 8,
    cycleOptions: [4, 8, 16, 0],
    icon: 'box',
    orbTint: ZEN_BREATHE_TINT,
    howTo: [
      'Breathe in slowly through your nose for 4 seconds',
      'Hold your breath gently for 4 seconds — relax your shoulders',
      'Breathe out for 4 seconds, then pause for 4 seconds before the next breath',
    ],
  },
  {
    id: 'four-seven-eight',
    name: '4 - 7 - 8',
    category: 'Sleep',
    tagline: 'Gentle 4-7-8 count to wind down',
    benefit: 'Unwind into deep sleep',
    bestFor: 'Bedtime or racing thoughts at night',
    estimatedMinutes: 3,
    badgeColor: 'blue',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED },
      { label: 'Hold', seconds: 7, scale: INFLATED, hold: true },
      { label: 'Exhale', seconds: 8, scale: DEFLATED },
    ],
    cyclesDefault: 8,
    cycleOptions: [4, 8, 16, 0],
    icon: 'waves',
    orbTint: ZEN_BREATHE_TINT,
    howTo: [
      'Breathe in quietly through your nose for 4 counts',
      'Hold your breath comfortably for 7 counts',
      'Breathe out slowly through your mouth for 8 counts',
    ],
  },
  {
    id: 'slow',
    name: 'Slow Breathing',
    category: 'Pacing',
    tagline: 'Deep 6-second breathing rhythm',
    benefit: 'Deep parasympathetic reset',
    bestFor: 'Lowering heart rate and grounding',
    estimatedMinutes: 3,
    badgeColor: 'lavender',
    phases: [
      { label: 'Inhale', seconds: 5, scale: INFLATED },
      { label: 'Hold', seconds: 2, scale: INFLATED, hold: true },
      { label: 'Exhale', seconds: 6, scale: DEFLATED },
    ],
    cyclesDefault: 12,
    cycleOptions: [6, 12, 24, 0],
    icon: 'wind',
    orbTint: ZEN_BREATHE_TINT,
    howTo: [
      'Inhale deeply and expand your chest for 5 seconds',
      'Brief 2 second pause',
      'Smooth 6 second exhale release',
    ],
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    category: 'Reset',
    tagline: 'Switch sides to clear a busy head',
    benefit: 'Clear a busy head',
    bestFor: 'Afternoon slump or overthinking',
    estimatedMinutes: 3,
    badgeColor: 'peach',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED, cue: 'left' },
      { label: 'Exhale', seconds: 4, scale: DEFLATED, cue: 'right' },
      { label: 'Inhale', seconds: 4, scale: INFLATED, cue: 'right' },
      { label: 'Exhale', seconds: 4, scale: DEFLATED, cue: 'left' },
    ],
    cyclesDefault: 8,
    cycleOptions: [4, 8, 16, 0],
    icon: 'lotus',
    orbTint: ZEN_BREATHE_TINT,
    howTo: [
      'Rest your thumb and ring finger lightly beside your nose',
      'Close one side at a time as the circle guides you',
      'Keep each breath light, easy, and comfortable',
    ],
    handHint: 'Rest your thumb and ring finger gently beside your nose.',
  },
  // Compatibility alias for coherent
  {
    id: 'coherent',
    name: 'Calm Breathing',
    category: 'Balance',
    tagline: 'Smooth balanced rhythm',
    benefit: 'Everyday calm',
    bestFor: 'Morning reset or work breaks',
    estimatedMinutes: 3,
    badgeColor: 'sage',
    phases: [
      { label: 'Inhale', seconds: 5.5, scale: INFLATED },
      { label: 'Exhale', seconds: 5.5, scale: DEFLATED },
    ],
    cyclesDefault: 12,
    cycleOptions: [6, 12, 24, 0],
    icon: 'leaf',
    orbTint: ZEN_BREATHE_TINT,
    howTo: ['Follow the gentle rise and fall of the circle'],
  },
];

export const MEDITATIONS: Meditation[] = [
  {
    id: 'silent',
    name: 'Silent Meditation',
    category: 'Silence',
    tagline: 'Quiet space for natural contemplation',
    benefit: 'Rest without external guidance',
    bestFor: 'Experienced practitioners and deep stillness',
    badgeColor: 'blue',
    durations: [5, 10, 15, 20],
    durationDefault: 10,
    icon: 'lotus',
    orbTint: ZEN_MEDITATE_TINT,
    prompts: [
      'Rest in stillness',
      'Observe thoughts passing like clouds',
      'Return to this moment',
      'Silence is your anchor',
    ],
  },
  {
    id: 'breath-awareness',
    name: 'Breath Awareness',
    category: 'Calm',
    tagline: 'Rest on your natural breath',
    benefit: 'Center a wandering mind',
    bestFor: 'Everyday centering and quiet time',
    badgeColor: 'sage',
    durations: [5, 10, 15],
    durationDefault: 10,
    icon: 'wind',
    orbTint: ZEN_MEDITATE_TINT,
    prompts: [
      'Notice the breath as it is',
      'Feel the belly rise and fall',
      'Let each exhale soften you',
      'When the mind wanders, return gently',
      'Nothing to fix — just breathe',
    ],
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    category: 'Relax',
    tagline: 'Bring your attention to different parts of your body',
    benefit: 'Release body tension',
    bestFor: 'Tired muscles, evening wind-down, or bedtime',
    badgeColor: 'peach',
    durations: [10, 12, 20],
    durationDefault: 12,
    icon: 'scan',
    orbTint: ZEN_MEDITATE_TINT,
    prompts: [
      'Notice your feet resting on the earth…',
      'Release any tension in your legs and hips…',
      'Soften the belly and chest…',
      'Let the shoulders drop naturally…',
      'Relax the jaw, temples, and forehead…',
      'Rest in whole-body awareness…',
    ],
  },
  {
    id: 'loving-kindness',
    name: 'Loving Kindness',
    category: 'Kindness',
    tagline: 'Send warmth to yourself and others',
    benefit: 'Warmth & emotional ease',
    bestFor: 'Hard days, self-criticism, or heavy feelings',
    badgeColor: 'blush',
    durations: [10, 15],
    durationDefault: 10,
    icon: 'heart',
    orbTint: ZEN_MEDITATE_TINT,
    prompts: [
      'May I be calm and at ease',
      'May the people I love be safe and well',
      'May everyone here be free from suffering',
      'May all beings be calm and at peace',
    ],
  },
  {
    id: 'open-awareness',
    name: 'Open Awareness',
    category: 'Presence',
    tagline: 'Expand perception to the sounds and space around you',
    benefit: 'Vast mental clarity',
    bestFor: 'Clearing mental fog and broadening perspective',
    badgeColor: 'lavender',
    durations: [10, 15, 20],
    durationDefault: 15,
    icon: 'flower',
    orbTint: ZEN_MEDITATE_TINT,
    prompts: [
      'Open your awareness to all sounds around you',
      'Notice the vast space holding everything',
      'Rest as the gentle observer',
      'Everything rises and dissolves naturally',
    ],
  },
  // Compatibility alias
  {
    id: 'focused-attention',
    name: 'Focused Attention',
    category: 'Focus',
    tagline: 'Count each breath from one to ten',
    benefit: 'Train sharp focus',
    bestFor: 'Deep work or clearing brain fog',
    badgeColor: 'blue',
    durations: [5, 10, 15],
    durationDefault: 10,
    icon: 'focus',
    orbTint: ZEN_MEDITATE_TINT,
    prompts: [
      'Inhale… and exhale',
      'Count one…',
      'Count two…',
      'Start again whenever you drift',
    ],
  },
];

export function getTechnique(id: string | undefined): Technique | undefined {
  if (!id) return undefined;
  return TECHNIQUES.find((t) => t.id === id) ?? (id === 'coherent' ? TECHNIQUES[0] : undefined);
}

export function getMeditation(id: string | undefined): Meditation | undefined {
  if (!id) return undefined;
  return MEDITATIONS.find((m) => m.id === id);
}
