import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {BrandTest, BrandTestProps} from './compositions/BrandTest';
import {FORMATS, Ratio} from './brand/formats';
import {BRANDS, Mode} from './brand/theme';
import {VIDEOS, VideoProps} from './videos';

// Size follows props.ratio, so one composition renders every format: --props='{"ratio":"4:5"}'.
const byRatio = <P extends {ratio: Ratio}>(): CalculateMetadataFunction<P> => ({props}) => FORMATS[props.ratio];

// Template checks, one per brand theme (+ dark if the brand has one). TEST copy only (placeholder, never published).
const TESTS: {id: string; props: BrandTestProps}[] = Object.entries(BRANDS).flatMap(([brand, theme]) =>
  (theme.colors_dark ? (['light', 'dark'] as Mode[]) : (['light'] as Mode[])).map((mode) => ({
    id: mode === 'dark' ? `${brand}-dark-test` : `${brand}-test`,
    props: {brand, mode, ratio: '9:16' as Ratio, test: true, showSafeZones: false,
      headline: 'Your headline goes here', sub: 'Placeholder copy for a template test', cta: theme.brand_name},
  })),
);

export const RemotionRoot: React.FC = () => (
  <>
    {TESTS.map(({id, props}) => (
      <Composition key={id} id={id} component={BrandTest} durationInFrames={150} fps={30}
        width={1080} height={1920} defaultProps={props} calculateMetadata={byRatio<BrandTestProps>()} />
    ))}
    {VIDEOS.map((v) => (
      <Composition key={v.id} id={v.id} component={v.component} durationInFrames={v.durationInFrames} fps={v.fps}
        width={1080} height={1920} defaultProps={v.defaultProps} calculateMetadata={byRatio<VideoProps>()} />
    ))}
  </>
);
