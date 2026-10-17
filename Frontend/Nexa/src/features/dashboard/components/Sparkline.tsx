import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme/colors';

type Props = { values: number[]; height?: number; color?: string };

function buildPath(values: number[], width: number, height: number) {
  if (values.length < 2 || width <= 0) return null;

  const pad = 4;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: pad + (1 - (value - min) / span) * (height - pad * 2),
  }));

  // Quadratic curve through the midpoints gives a smooth line with no overshoot.
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    d += ` Q ${prev.x} ${prev.y} ${(prev.x + cur.x) / 2} ${(prev.y + cur.y) / 2}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

export function Sparkline({ values, height = 44, color = colors.accent }: Props) {
  const [width, setWidth] = useState(0);
  const path = useMemo(() => buildPath(values, width, height), [values, width, height]);

  return (
    <View style={{ height }} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {path ? (
        <Svg width={width} height={height}>
          <Path
            d={path}
            stroke={color}
            strokeOpacity={0.55}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}
