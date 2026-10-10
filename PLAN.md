# calmMind — Build Plan (Breath & Meditation App)

> Android production app (Play Store). Expo SDK 57.0.27, RN 0.86.3, Expo Router.
> **Design filter:** *"Does this make the user feel calmer?"* If no, it doesn't ship.
> This file is the single source of truth for design decisions across sessions.

---

## Design System

### Colors (neuroscience-based — no pure black/white anywhere)

```ts
// BREATHE — blue lowers heart rate (parasympathetic)
primary   #4A90E2   secondary #00ACC1   glow #E0F7FA   surface #F4FAFD

// MEDITATE — lavender → introspection
primary   #7C6FF0   secondary #BF55EC   glow #F0E6FF   surface #F8F5FE

// SHARED NEUTRALS (light)
background #F7F5F2   text #1C1C1E   textDim #6B6B76   hairline #E8E5E1

// DARK / SLEEP (60% of meditation happens at bedtime)
background #0D1B2A   surface #16283D   text #E9E4DA
breathPrimary #5B9BD5   meditatePrimary #9B8CFF
```

- Orb shifts hue **per phase** (inhale lighter/cooler → exhale deeper) — visual feedback without words.
- Shadows use colored overlays, never gray.

### Type & Spacing (8-pt grid)

```
Type: 12 / 14 / 16 / 20 / 28 / 40   (16 = body)
Weights: 400 body, 600 titles, 300 timer numerals
Timer: 40–56px Light · Phase label: 20px SemiBold uppercase
Radius: sm 12, md 20, lg 28, pill 999 (rounded-only, circles as base primitive)
Spacing: 4/8/12/16/24/32/48/64 · Touch min: 48px (sleep: 56px)
```

### Motion (physiological design — slow, smooth, never snappy)

```
Session entry transition: 800ms ease-out (deliberate slow-down)
List nav: 500ms ease-out
Orb inhale: scale 1.0 → 1.18 over technique's inhale seconds, Easing.inOut(Easing.ease)
Session complete: 1000ms scale 1.0→1.02→1.0 gentle overshoot (NO confetti/badges)
Controls auto-fade after 30s idle
Reduced motion: static ring + text-only phase guide (mandatory accessibility)
Haptic: light tick on phase boundary (toggleable)
```

### UX Rules (Calm/Headspace/Exhale patterns)

- **One organizing idea:** the responsive orb = core interaction + brand asset.
- Session screen minimal: orb + phase label + timer + one pause button.
- 1–2 taps to start a session.
- Both session screens share ONE skeleton (`SessionScreen`), only palette swaps.
- No clinical claims — "relax/focus/sleep" language only (Play Store compliance).

---

## Tech Decisions

| Slot | Decision | Rejected (why) |
|---|---|---|
| Styling | Extended `theme.ts` tokens + StyleSheet | NativeWind (build-tooling risk, consistency) |
| Components | Custom primitives on ThemedView/ThemedText | Paper/gluestack (branded design diverges) |
| Animation | Reanimated 4.5.1 (installed) | Moti (stale, pre-RN4), Skia (charts only), Lottie |
| Drawing | react-native-svg | — |

**Installed:** `react-native-svg`, `expo-linear-gradient`, `expo-haptics`, `@react-native-async-storage/async-storage` (all Expo Go compatible).

**Deferred (Phase 9):** `expo-av` + `appwrite` for sound/backend.

---

## Content

### Breathing (4) — config in `src/constants/techniques.ts`

```
Phase = { label, seconds, scale, cue? } · Technique = { id, name, tagline, benefit, phases[], cyclesDefault, tint }
```

1. **Box Breathing** — 4-4-4-4 (focus)
2. **4-7-8** — sleep (parasympathetic)
3. **Physiological Sigh** — fast stress reset (double inhale + long exhale)
4. **Alternate Nostril** — balance (left/right cue dots, build last)

### Meditation (4)

1. Breath Awareness (5/10/15) · 2. Body Scan (10/20) · 3. Loving-Kindness (10/15) · 4. Focused Attention (5/10/15)
Session = countdown ring + prompt text + duration picker + pause.

---

## Screens (Expo Router)

```
src/app/
├── _layout.tsx              root Stack (ThemeProvider)
├── (tabs)/
│   ├── _layout.tsx          NativeTabs: Home | Breathe | Meditate
│   ├── index.tsx            Home hub: orb + two cards
│   ├── breathe.tsx          4 technique cards (blue tint)
│   └── meditate.tsx         4 practice cards (lavender tint)
├── breathe/[technique].tsx  Session (immersive, outside tabs)
└── meditate/[practice].tsx  Session (same skeleton, lavender)
```
Remove template `explore.tsx`; repurpose tab icons.

### File structure

```
src/constants/theme.ts            [EDIT] palettes, radii, Motion
src/constants/techniques.ts       [NEW]  content config
src/components/primitives/        [NEW]  screen, button, card, section-header
src/components/session/           [NEW]  breathing-orb, phase-label, cycle-dots, timer-ring
src/components/technique-card.tsx [NEW]
src/hooks/use-breath-phase.ts     [NEW]  phase state machine
src/hooks/use-haptics.ts          [NEW]
src/hooks/use-session-timer.ts    [NEW]  countdown + pause
```

---

## Phases

- ✅ **0. Setup** — PLAN.md, install 4 packages, expo-doctor 18/18
- ✅ **1. Tokens** — extend theme.ts + global.css, dark/sleep support
- ✅ **2. Primitives** — Screen, Button, Card, SectionHeader
- ✅ **3. Breathing engine** — use-breath-phase, BreathingOrb (SVG+Reanimated+hue-shift+reduced-motion), PhaseLabel, CycleDots, haptics
- ✅ **4. Breathe flow** — tabs layout (Home|Breathe|Meditate), Home hub, list, session, complete-state
- ✅ **5. Meditate flow** — list, session, TimerRing, duration picker, rotating prompts
- ✅ **6. Polish** — 800ms session fade transition, control auto-fade (30s), dark mode, a11y labels, explore.tsx removed
- ✅ **7. Validate** — `tsc --noEmit` 0, `expo lint` 0, `expo-doctor` 18/18, Android export bundle OK
- ☐ **8. Play Store** — app.json polish, EAS production AAB, listing (needs EAS account)
- ☐ **9. Deferred** — AppWrite + expo-av sound, history UI, mood check

---

## Risks

| Risk | Mitigation |
|---|---|
| Node v23.5.0 vs RN 0.86 engine warning | Dev OK; EAS cloud controls node — revisit at Phase 8 |
| Alternate nostril complexity | Build last; fallback = left/right cue dots |
| No clinical claims | Copy review in Phase 6 |

## Assumptions

4+4 techniques · v1.0 offline & free (no paywall) · English only · blue→breathe, lavender→meditate.
