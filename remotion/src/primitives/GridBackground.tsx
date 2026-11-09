import React from 'react';
import {AbsoluteFill} from 'remotion';

// Faint square grid (grid texture behind panels). Static: texture, not motion.
export const GridBackground: React.FC<{color: string; size: number; opacity?: number; fadeEdges?: boolean}> = ({
  color,
  size,
  opacity = 0.1,
  fadeEdges = true,
}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      maskImage: fadeEdges ? 'radial-gradient(ellipse at center, black 40%, transparent 85%)' : undefined,
    }}
  />
);
