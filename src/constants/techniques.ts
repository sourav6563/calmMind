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
  | 'box'
  | 'moon'
  | 'waves'
  | 'channels'
  | 'breath'
  | 'scan'
  | 'heart'
  | 'focus';

export type Technique = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  /** One-line physiological benefit — shown prominently on the card. */
  benefit: string;
  /** When the user should choose this technique. */
  bestFor: string;
  phases: BreathPhase[];
  /** Default number of cycles per session. */
  cyclesDefault: number;
  /** Cycle options offered before starting (0 = unlimited). */
  cycleOptions: number[];
  /** Line icon shown on the card and intro sheet. */
  icon: TechniqueIcon;
  /** Per-technique orb tint — distinct emotional register per technique. */
  orbTint: { core: string; glow: string };
  /** 2–3 "how to" bullets for the pre-start intro sheet. */
  howTo: string[];
  /** Optional hand-position hint (e.g. alternate nostril). */
  handHint?: string;
};

export type Meditation = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  benefit: string;
  bestFor: string;
  /** Session length options in minutes. */
  durations: number[];
  /** Default duration in minutes. */
  durationDefault: number;
  /** Rotating guidance prompts shown during the session. */
  prompts: string[];
  /** Line icon shown on the card. */
  icon: TechniqueIcon;
  /** Per-practice tint — distinct register within the meditate palette. */
  orbTint: { core: string; glow: string };
};

const INFLATED = 1.18;
const DEFLATED = 1;

/** Eye-soothing soft Powder Moonlight Slate-Blue orb tint for all breathing techniques. */
const MOBILE_BLACK_TINT = { core: '#44627D', glow: '#728FA7' } as const;

/** Eye-soothing soft Powder Moonlight Slate-Blue tint for meditation practices. */
const MOBILE_MEDITATE_TINT = { core: '#44627D', glow: '#728FA7' } as const;

export const TECHNIQUES: Technique[] = [
  {
    id: 'physiological-sigh',
    name: 'Physiological Sigh',
    category: 'Relief',
    tagline: 'Two quick breaths in, one long sigh out',
    benefit: 'Fast stress relief',
    bestFor: 'Sudden stress or feeling overwhelmed',
    phases: [
      { label: 'Inhale', seconds: 2, scale: 1.1 },
      { label: 'Inhale', seconds: 1, scale: INFLATED },
      { label: 'Exhale', seconds: 5, scale: DEFLATED },
    ],
    cyclesDefault: 6,
    cycleOptions: [3, 6, 10, 0],
    icon: 'waves',
    orbTint: MOBILE_BLACK_TINT,
    howTo: [
      'Take a deep breath in through your nose',
      'Take a second quick sip of air on top to fill your lungs',
      'Let it all out in a slow, relaxing sigh through your mouth',
    ],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    category: 'Focus',
    tagline: '4 counts in, hold, out, hold',
    benefit: 'Stay calm and focused',
    bestFor: 'Work, study, or mental distractions',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED },
      { label: 'Hold', seconds: 4, scale: INFLATED, hold: true },
      { label: 'Exhale', seconds: 4, scale: DEFLATED },
      { label: 'Hold', seconds: 4, scale: DEFLATED, hold: true },
    ],
    cyclesDefault: 8,
    cycleOptions: [4, 8, 12, 0],
    icon: 'box',
    orbTint: MOBILE_BLACK_TINT,
    howTo: [
      'Breathe in slowly through your nose for 4 seconds',
      'Hold your breath gently for 4 seconds — relax your shoulders',
      'Breathe out for 4 seconds, then pause for 4 seconds before the next breath',
    ],
  },
  {
    id: 'four-seven-eight',
    name: '4-7-8 Breathing',
    category: 'Sleep',
    tagline: 'Gentle 4-7-8 count to wind down',
    benefit: 'Unwind into deep sleep',
    bestFor: 'Bedtime or racing thoughts at night',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED },
      { label: 'Hold', seconds: 7, scale: INFLATED, hold: true },
      { label: 'Exhale', seconds: 8, scale: DEFLATED },
    ],
    cyclesDefault: 4,
    cycleOptions: [4, 6, 8, 0],
    icon: 'moon',
    orbTint: MOBILE_BLACK_TINT,
    howTo: [
      'Breathe in quietly through your nose for 4 counts',
      'Hold your breath comfortably for 7 counts',
      'Breathe out slowly through your mouth for 8 counts',
    ],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    category: 'Balance',
    tagline: 'Smooth 5-second balanced rhythm',
    benefit: 'Smooth everyday calm',
    bestFor: 'Morning reset or work breaks',
    phases: [
      { label: 'Inhale', seconds: 5.5, scale: INFLATED },
      { label: 'Exhale', seconds: 5.5, scale: DEFLATED },
    ],
    cyclesDefault: 10,
    cycleOptions: [5, 10, 15, 0],
    icon: 'breath',
    orbTint: MOBILE_BLACK_TINT,
    howTo: [
      'Breathe in gently through your nose for 5.5 seconds',
      'Breathe out smoothly without pausing for 5.5 seconds',
      'Follow the gentle rise and fall of the circle',
    ],
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    category: 'Reset',
    tagline: 'Switch sides to clear a busy head',
    benefit: 'Clear a busy head',
    bestFor: 'Afternoon slump or overthinking',
    phases: [
      { label: 'Inhale', seconds: 4, scale: INFLATED, cue: 'left' },
      { label: 'Exhale', seconds: 4, scale: DEFLATED, cue: 'right' },
      { label: 'Inhale', seconds: 4, scale: INFLATED, cue: 'right' },
      { label: 'Exhale', seconds: 4, scale: DEFLATED, cue: 'left' },
    ],
    cyclesDefault: 6,
    cycleOptions: [4, 6, 10, 0],
    icon: 'channels',
    orbTint: MOBILE_BLACK_TINT,
    howTo: [
      'Rest your thumb and ring finger lightly beside your nose',
      'Close one side at a time as the circle guides you',
      'Keep each breath light, easy, and comfortable',
    ],
    handHint: 'Rest your thumb and ring finger gently beside your nose.',
  },
];

export const MEDITATIONS: Meditation[] = [
  {
    id: 'breath-awareness',
    name: 'Breath Awareness',
    category: 'Calm',
    tagline: 'Rest on your natural breath',
    benefit: 'Center a wandering mind',
    bestFor: 'Everyday centering and quiet time',
    durations: [5, 10, 15],
    durationDefault: 10,
    icon: 'breath',
    orbTint: MOBILE_MEDITATE_TINT,
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
    tagline: 'Notice and soften your whole body',
    benefit: 'Release body tension',
    bestFor: 'Tired muscles, evening wind-down, or bedtime',
    durations: [10, 20],
    durationDefault: 10,
    icon: 'scan',
    orbTint: MOBILE_MEDITATE_TINT,
    prompts: [
      'Relax the face and jaw',
      'Soften the shoulders and arms',
      'Let the chest and belly be heavy',
      'Release the hips and legs',
      'Feel the feet resting on the earth',
      'Rest in the whole body',
    ],
  },
  {
    id: 'loving-kindness',
    name: 'Loving-Kindness',
    category: 'Kindness',
    tagline: 'Send warmth to yourself and others',
    benefit: 'Warmth & emotional ease',
    bestFor: 'Hard days, self-criticism, or heavy feelings',
    durations: [10, 15],
    durationDefault: 10,
    icon: 'heart',
    orbTint: MOBILE_MEDITATE_TINT,
    prompts: [
      'May I be calm and at ease',
      'May the people I love be calm and at ease',
      'May everyone here be calm and at ease',
      'May all beings be calm and at ease',
    ],
  },
  {
    id: 'focused-attention',
    name: 'Focused Attention',
    category: 'Focus',
    tagline: 'Count each breath from one to ten',
    benefit: 'Train sharp focus',
    bestFor: 'Deep work, study sessions, or clearing brain fog',
    durations: [5, 10, 15],
    durationDefault: 10,
    icon: 'focus',
    orbTint: MOBILE_MEDITATE_TINT,
    prompts: [
      'Inhale… and exhale',
      'Count one',
      'Count two',
      'Count three',
      'Start again at one whenever you drift',
    ],
  },
];

export function getTechnique(id: string | undefined): Technique | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}

export function getMeditation(id: string | undefined): Meditation | undefined {
  return MEDITATIONS.find((m) => m.id === id);
}
