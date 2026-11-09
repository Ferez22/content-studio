import React from 'react';
import {Img, staticFile} from 'remotion';
import {BrandTheme, Mode, contrastTone} from '../brand/theme';

// Logo + optional tagline + accent bar + CTA, in the opposite tone of the video mode.
// Background/transition is the caller's job (e.g. circle wipe from a shared shape). p = appear progress 0..1.
export const EndCard: React.FC<{
  theme: BrandTheme;
  mode: Mode;
  p: number;
  unit: number;
  headingFont: string;
  cta: string;
  tagline?: string;
}> = ({theme, mode, p, unit, headingFont, cta, tagline}) => {
  const t = contrastTone(theme, mode);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 * unit, color: t.fg, textAlign: 'center'}}>
      <Img
        src={staticFile(t.logo)}
        style={{
          width: (theme.logos.includes_name ? 560 : 200) * unit,
          objectFit: 'contain',
          opacity: p,
          transform: `translateY(${(1 - p) * 24 * unit}px)`,
        }}
      />
      {theme.logos.includes_name ? null : (
        <div style={{fontFamily: headingFont, fontWeight: 800, fontSize: 72 * unit, opacity: p}}>{theme.brand_name}</div>
      )}
      {tagline ? <div style={{fontFamily: headingFont, fontWeight: 600, fontSize: 44 * unit, opacity: p, maxWidth: 900 * unit}}>{tagline}</div> : null}
      <div style={{width: 80 * unit, height: 6 * unit, background: t.accent, transform: `scaleX(${p})`}} />
      <div style={{fontSize: 40 * unit, opacity: p}}>{cta}</div>
    </div>
  );
};
