// Master sizes + safe zones. Source: ../platforms.md. Change there first, then here.
export const FORMATS = {
  '9:16': {width: 1080, height: 1920},
  '4:5': {width: 1080, height: 1350},
  '1:1': {width: 1080, height: 1080},
  '16:9': {width: 1920, height: 1080},
} as const;

export type Ratio = keyof typeof FORMATS;

export const SAFE_ZONES: Record<Ratio, {top: number; bottom: number; side: number}> = {
  '9:16': {top: 250, bottom: 670, side: 65},
  '4:5': {top: 60, bottom: 60, side: 60},
  '1:1': {top: 60, bottom: 60, side: 60},
  '16:9': {top: 60, bottom: 60, side: 90},
};
