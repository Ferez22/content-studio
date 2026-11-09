import {Easing, interpolate} from 'remotion';

// House easing (prompts/mine/studio-base.md): weighted, no linear, no bounce.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// 0 -> 1 progress between two frames, clamped and eased.
export const progress = (frame: number, from: number, duration: number) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
