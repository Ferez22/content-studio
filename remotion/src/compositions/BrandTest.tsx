import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandFrame, Locale, textFont} from '../brand/BrandFrame';
import {BrandId, Mode, brandTheme, contrastTone, palette} from '../brand/theme';
import {Ratio} from '../brand/formats';
import {TextReveal} from '../primitives/TextReveal';
import {progress} from '../primitives/ease';
import {EndCard} from '../primitives/EndCard';

export type BrandTestProps = {
  brand: BrandId;
  mode: Mode;
  ratio: Ratio;
  test: boolean;
  showSafeZones: boolean;
  locale?: Locale; // overrides theme lang/direction (e.g. an Arabic version)
  headline: string;
  sub: string;
  cta: string;
};

// Base template check: palette per mode, fonts, logos, direction, safe zones, house easing.
// Timeline (30 fps, 5 s): accent bar -> headline -> sub -> circle wipes into end card (opposite tone). Accent = detail only.
export const BrandTest: React.FC<BrandTestProps> = ({brand, mode, ratio, test, showSafeZones, locale, headline, sub, cta}) => {
  const theme = brandTheme(brand);
  const c = palette(theme, mode);
  const loc: Locale = locale ?? {lang: theme.lang, direction: theme.direction};
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  const heading = textFont(theme, loc, 'heading');

  const end = contrastTone(theme, mode);

  const bar = progress(frame, 0, 18);
  const wipe = progress(frame, 84, 26);
  const logoIn = progress(frame, 100, 18);
  const radius = Math.hypot(width, height) * wipe;

  return (
    <BrandFrame theme={theme} locale={loc} mode={mode} ratio={ratio} test={test} showSafeZones={showSafeZones}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 28 * unit}}>
        <div
          style={{
            width: 120 * unit,
            height: 10 * unit,
            background: c.accent,
            transform: `scaleX(${bar})`,
            transformOrigin: loc.direction === 'rtl' ? 'right' : 'left',
          }}
        />
        <TextReveal
          text={headline}
          from={10}
          style={{fontFamily: heading, fontWeight: 800, fontSize: 96 * unit, lineHeight: 1.05, letterSpacing: loc.lang === 'ar' ? 0 : '-0.02em'}}
        />
        <TextReveal text={sub} from={26} style={{fontSize: 44 * unit, color: c.muted, lineHeight: 1.3}} />
      </div>
      <AbsoluteFill
        style={{
          background: end.bg,
          clipPath: `circle(${radius}px at 50% 50%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EndCard theme={theme} mode={mode} p={logoIn} unit={unit} headingFont={heading} cta={cta} />
      </AbsoluteFill>
    </BrandFrame>
  );
};
