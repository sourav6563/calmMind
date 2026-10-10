import { Circle, Path, Rect, Svg } from 'react-native-svg';

import type { TechniqueIcon } from '@/constants/techniques';

export type TechniqueIconProps = {
  icon: TechniqueIcon;
  color?: string;
  size?: number;
};

/**
 * Line icons for breathing techniques & meditation practices — calm, clear,
 * high-legibility stroke iconography that communicates purpose at a glance:
 *  - box:      balanced geometric square with 4 phase rhythm dots
 *  - moon:     crescent moon + subtle night star (sleep & wind-down)
 *  - waves:    two stepping inhales + long descending exhale sigh wave (stress reset)
 *  - channels: two symmetrical airflow streams in harmony (mental balance)
 *  - breath:   concentric resonant breath rings (HRV & coherence)
 *  - scan:     body contour with gentle horizontal awareness sweep
 *  - heart:    compassionate open heart outline
 *  - focus:    concentric bullseye target
 */
export function TechniqueGlyph({ icon, color = '#FFFFFF', size = 40 }: TechniqueIconProps) {
  const stroke = {
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {icon === 'box' && (
        <>
          <Rect x={11} y={11} width={26} height={26} rx={7} {...stroke} />
          {/* 4 cardinal phase markers: Inhale, Hold, Exhale, Hold */}
          <Circle cx={24} cy={11} r={1.8} fill={color} />
          <Circle cx={37} cy={24} r={1.8} fill={color} />
          <Circle cx={24} cy={37} r={1.8} fill={color} />
          <Circle cx={11} cy={24} r={1.8} fill={color} />
        </>
      )}
      {icon === 'moon' && (
        <>
          <Path
            d="M30 8a14 14 0 1 0 8 25A16 16 0 0 1 30 8Z"
            {...stroke}
          />
          {/* Gentle twinkling sleep star */}
          <Path d="M35 13v5M32.5 15.5h5" {...stroke} strokeWidth={1.8} opacity={0.8} />
        </>
      )}
      {icon === 'waves' && (
        <>
          {/* Inhale 1 + Inhale 2: two stepping wave peaks */}
          <Path
            d="M8 25c3.5-5 7-5 10.5 0s7 5 10.5 0"
            {...stroke}
            strokeWidth={2.4}
          />
          {/* Long grounding exhale sigh release */}
          <Path
            d="M29 25c4-7 10-7 13 1"
            {...stroke}
            strokeWidth={2.4}
          />
          {/* Grounding gentle baseline */}
          <Path
            d="M14 34c6-2 14-2 20 0"
            {...stroke}
            strokeWidth={1.8}
            opacity={0.45}
          />
        </>
      )}
      {icon === 'channels' && (
        <>
          {/* Left airflow stream */}
          <Path d="M15 9c-5 7.5-5 22.5 0 30" {...stroke} />
          {/* Right airflow stream */}
          <Path d="M33 9c5 7.5 5 22.5 0 30" {...stroke} />
          {/* Central balance harmony arcs & anchor */}
          <Path d="M18 19c6 3 6 11 0 14" {...stroke} opacity={0.5} strokeWidth={1.8} />
          <Path d="M30 19c-6 3-6 11 0 14" {...stroke} opacity={0.5} strokeWidth={1.8} />
          <Circle cx={24} cy={24} r={2} fill={color} />
        </>
      )}
      {icon === 'breath' && (
        <>
          <Circle cx={24} cy={24} r={15} {...stroke} opacity={0.4} />
          <Circle cx={24} cy={24} r={9} {...stroke} opacity={0.75} />
          <Circle cx={24} cy={24} r={3} fill={color} />
        </>
      )}
      {icon === 'scan' && (
        <>
          <Path d="M24 7v34" {...stroke} opacity={0.45} />
          <Path d="M14 15h20" {...stroke} strokeWidth={2.2} />
          <Path d="M16 25c2.5 2 5.5 2 8 0s5.5-2 8 0" {...stroke} />
          <Path d="M16 33c2.5 2 5.5 2 8 0s5.5-2 8 0" {...stroke} opacity={0.55} />
        </>
      )}
      {icon === 'heart' && (
        <Path
          d="M24 40S10 30 10 19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 11-14 21-14 21Z"
          {...stroke}
        />
      )}
      {icon === 'focus' && (
        <>
          <Path d="M24 8a16 16 0 1 0 0.1 0" {...stroke} opacity={0.45} />
          <Path d="M24 15a9 9 0 1 0 0.1 0" {...stroke} opacity={0.7} />
          <Path d="M24 21a3 3 0 1 0 0.1 0" {...stroke} />
        </>
      )}
    </Svg>
  );
}
