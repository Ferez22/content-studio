import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from './ease';

// Masked line reveal: the line slides up out of its own mask. Moves as one block, not per word.
export const TextReveal: React.FC<{
  text: string;
  from: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({text, from, duration = 20, style}) => {
  const p = progress(useCurrentFrame(), from, duration);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em'}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`, ...style}}>{text}</div>
    </div>
  );
};
