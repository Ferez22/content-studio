import React from 'react';
import {Ratio} from '../brand/formats';

// Registry of production videos: every src/videos/<id>/Video.tsx that exports `video` (a VideoEntry) is registered.
// id = <brand>-<YYYYMMDD>-<slug>-<NN>, same as the folder name. Size follows props.ratio (Root calculateMetadata).
// Video folders are brand work (gitignored): the public repo ships the registry only.
// subframes: k > 1 renders at fps*k (same timeline) for motion-blur blending (ffmpeg tmix). Videos must read time
// as frame / fps (useVideoConfig), never as a raw frame count, to support it.
export type VideoProps = {ratio: Ratio; test: boolean; showSafeZones: boolean; subframes?: number};

export type VideoEntry = {
  id: string;
  component: React.FC<VideoProps>;
  durationInFrames: number;
  fps: number;
  defaultProps: VideoProps;
};

type VideoContext = {keys(): string[]; (key: string): {video?: VideoEntry}};
const files = (import.meta as unknown as {
  webpackContext(dir: string, opts: {recursive: boolean; regExp: RegExp}): VideoContext;
}).webpackContext('./', {recursive: true, regExp: /\/Video\.tsx$/});

const byId = new Map<string, VideoEntry>();
for (const key of files.keys()) {
  const entry = files(key).video;
  if (entry) byId.set(entry.id, entry);
}
export const VIDEOS: VideoEntry[] = [...byId.values()];
