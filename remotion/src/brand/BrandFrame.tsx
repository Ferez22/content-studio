import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BrandTheme, Mode, palette} from './theme';
import {fontFamily} from './fonts';
import {Ratio, SAFE_ZONES} from './formats';

export type Locale = {lang: string; direction: 'ltr' | 'rtl'};

// Text font stack for a locale: Arabic font first for Arabic, brand font otherwise.
export const textFont = (theme: BrandTheme, locale: Locale, role: 'heading' | 'body') =>
  locale.lang === 'ar'
    ? `${fontFamily(theme.fonts.arabic)}, ${fontFamily(theme.fonts[role])}`
    : `${fontFamily(theme.fonts[role])}, ${fontFamily(theme.fonts.arabic)}`;

// Base layer for every brand video: mode palette, direction, fonts, safe-zone padding, TEST mark.
export const BrandFrame: React.FC<{
  theme: BrandTheme;
  locale: Locale;
  mode: Mode;
  ratio: Ratio;
  test: boolean;
  showSafeZones?: boolean;
  background?: React.ReactNode; // full-bleed layer under the safe-zone content
  children: React.ReactNode;
}> = ({theme, locale, mode, ratio, test, showSafeZones, background, children}) => {
  const safe = SAFE_ZONES[ratio];
  const c = palette(theme, mode);
  return (
    <AbsoluteFill
      lang={locale.lang}
      dir={locale.direction}
      style={{background: c.bg, color: c.fg, fontFamily: textFont(theme, locale, 'body')}}
    >
      {background}
      <AbsoluteFill style={{padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`}}>{children}</AbsoluteFill>
      {showSafeZones ? (
        <AbsoluteFill
          style={{
            borderStyle: 'solid',
            borderColor: 'rgba(255,0,0,0.25)',
            borderWidth: `${safe.top}px ${safe.side}px ${safe.bottom}px`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {test ? (
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            padding: '6px 14px',
            border: '3px solid #e11d48',
            background: '#ffffff',
            color: '#e11d48',
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            direction: 'ltr',
          }}
        >
          TEST
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
