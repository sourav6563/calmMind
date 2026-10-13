import React from 'react';
import { Circle, Path, Rect, Svg } from 'react-native-svg';

import type { TechniqueIcon } from '@/constants/techniques';

export type BotanicalGlyphProps = {
  icon: TechniqueIcon;
  color?: string;
  size?: number;
};

/**
 * Botanical & Mindfulness line icons — gentle, organic, high-legibility strokes:
 * - leaf: botanical stem with calming teardrop leaf
 * - box: soft rounded square with balanced rhythm dots
 * - waves: gentle rhythmic breathing ripples
 * - wind: serene breeze airflow streams
 * - lotus: delicate blossoming sacred lotus petals
 * - scan: seated meditating figure / body contour
 * - heart: soft compassionate open heart outline
 * - flower: 8-petal blooming open awareness
 * - moon: peaceful crescent moon
 * - channels: alternate nostril left/right harmony
 */
export function BotanicalGlyph({ icon, color = '#4E7158', size = 28 }: BotanicalGlyphProps) {
  const stroke = {
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      {icon === 'leaf' && (
        <>
          {/* Main Leaf Contour */}
          <Path
            d="M8 28c0-10 7-18 19-20 1 12-7 19-19 20Z"
            {...stroke}
          />
          {/* Gentle Central Vein */}
          <Path d="M12 24c4-5 9-9 15-16" {...stroke} strokeWidth={1.8} />
          <Path d="M16 19c2.5-1 5-1 7-2" {...stroke} strokeWidth={1.4} opacity={0.7} />
        </>
      )}

      {icon === 'box' && (
        <>
          <Rect x={7} y={7} width={22} height={22} rx={6} {...stroke} />
          <Circle cx={18} cy={7} r={1.5} fill={color} />
          <Circle cx={29} cy={18} r={1.5} fill={color} />
          <Circle cx={18} cy={29} r={1.5} fill={color} />
          <Circle cx={7} cy={18} r={1.5} fill={color} />
        </>
      )}

      {icon === 'waves' && (
        <>
          <Path d="M6 14c3-3 6-3 9 0s6 3 9 0 6-3 9 0" {...stroke} />
          <Path d="M6 22c3-3 6-3 9 0s6 3 9 0 6-3 9 0" {...stroke} />
        </>
      )}

      {icon === 'wind' && (
        <>
          {/* Airflow 1 */}
          <Path d="M5 13h17a4 4 0 1 0-4-4" {...stroke} />
          {/* Airflow 2 */}
          <Path d="M7 19h20a3.5 3.5 0 1 0-3.5-3.5" {...stroke} />
          {/* Airflow 3 */}
          <Path d="M9 25h13a3 3 0 1 1-3 3" {...stroke} />
        </>
      )}

      {icon === 'lotus' && (
        <>
          {/* Central Petal */}
          <Path d="M18 6c-3 6-3 14 0 19 3-5 3-13 0-19Z" {...stroke} />
          {/* Left Petal */}
          <Path d="M16 23c-6-1-10-6-10-12 5 2 9 6 10 12Z" {...stroke} />
          {/* Right Petal */}
          <Path d="M20 23c6-1 10-6 10-12-5 2-9 6-10 12Z" {...stroke} />
          {/* Gentle water/base arc */}
          <Path d="M10 27c5 2 11 2 16 0" {...stroke} strokeWidth={1.8} />
        </>
      )}

      {icon === 'scan' && (
        <>
          {/* Head */}
          <Circle cx={18} cy={9} r={4} {...stroke} />
          {/* Torso & Shoulders in lotus pose */}
          <Path d="M12 27c1-6 3-10 6-10s5 4 6 10" {...stroke} />
          {/* Crossed legs / Base */}
          <Path d="M7 27c3-2 8-2 11-1 3-1 8-1 11 1-2 2-7 2-11 2s-9 0-11-2Z" {...stroke} />
        </>
      )}

      {icon === 'heart' && (
        <Path
          d="M18 30S6 22 6 13a6.5 6.5 0 0 1 12-3.5A6.5 6.5 0 0 1 30 13c0 9-12 17-12 17Z"
          {...stroke}
        />
      )}

      {icon === 'flower' && (
        <>
          <Circle cx={18} cy={18} r={3} fill={color} />
          {/* 8 radiating delicate petals */}
          <Path d="M18 7v4M18 25v4M7 18h4M25 18h4" {...stroke} />
          <Path d="M10 10l3 3M23 23l3 3M10 26l3-3M23 13l3-3" {...stroke} strokeWidth={1.8} />
        </>
      )}

      {icon === 'breath' && (
        <>
          <Circle cx={18} cy={18} r={12} {...stroke} opacity={0.35} />
          <Circle cx={18} cy={18} r={7} {...stroke} opacity={0.75} />
          <Circle cx={18} cy={18} r={2.5} fill={color} />
        </>
      )}

      {icon === 'moon' && (
        <>
          <Path d="M23 7a11 11 0 1 0 6 19 12 12 0 0 1-6-19Z" {...stroke} />
          <Circle cx={14} cy={13} r={1} fill={color} opacity={0.7} />
        </>
      )}

      {icon === 'channels' && (
        <>
          <Path d="M11 7c-4 6-4 16 0 22" {...stroke} />
          <Path d="M25 7c4 6 4 16 0 22" {...stroke} />
          <Circle cx={18} cy={18} r={2} fill={color} />
        </>
      )}

      {icon === 'focus' && (
        <>
          <Circle cx={18} cy={18} r={12} {...stroke} opacity={0.4} />
          <Circle cx={18} cy={18} r={7} {...stroke} opacity={0.7} />
          <Circle cx={18} cy={18} r={2.5} fill={color} />
        </>
      )}
    </Svg>
  );
}
