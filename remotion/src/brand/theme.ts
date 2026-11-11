
// Shape of brands/<brand>/theme.json. Brand values live there, never in code.
export type Palette = {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  surface: string;
  border: string;
  button: string;
  button_fg: string;
};

export type BrandTheme = {
  brand_name: string;
  lang: string;
  direction: 'ltr' | 'rtl';
  colors: Palette & {secondary: Record<string, string>};
  colors_dark?: Palette; // missing = brand has no dark mode yet
  pillars?: Record<string, {light: string; dark: string}>; // offer areas color-coding
  status?: {done: string; pending: string}; // UI mockup states only
  fonts: {heading: string; body: string; serif?: string; arabic: string};
  type?: {weights: {text: number; ui: number; display?: number}; tracking_em: Record<string, number>; features: string};
  radius?: {card: number; button: number; tag: number; small?: number; thumb?: number};
  logos: {light_bg: string; dark_bg: string; icon_light_bg: string; icon_dark_bg: string; includes_name: boolean};
};

export type Mode = 'light' | 'dark';

// Every brands/**/theme.json is a brand; id = the folder holding it (brands/acme/theme.json -> "acme").
// Brand folders are local data (gitignored), except brands/example. Discovered at bundle time by webpack.
type JsonContext = {keys(): string[]; (key: string): BrandTheme | {default: BrandTheme}};
const themes = (import.meta as unknown as {
  webpackContext(dir: string, opts: {recursive: boolean; regExp: RegExp}): JsonContext;
}).webpackContext('../../../brands', {recursive: true, regExp: /^\.\/(?!.*_inbox\/).*theme\.json$/});

export const BRANDS: Record<string, BrandTheme> = Object.fromEntries(
  themes.keys().map((key) => {
    const mod = themes(key);
    return [key.split('/').slice(-2, -1)[0], 'default' in mod ? mod.default : mod];
  }),
);

export type BrandId = string;

export const brandTheme = (id: BrandId): BrandTheme => {
  const theme = BRANDS[id];
  if (!theme) throw new Error(`Brand "${id}": no brands/${id}/theme.json`);
  return theme;
};

// Palette for a mode. Dark requested on a brand without dark palette = hard error, never a guess.
export const palette = (theme: BrandTheme, mode: Mode): Palette => {
  if (mode === 'light') return theme.colors;
  if (!theme.colors_dark) throw new Error(`${theme.brand_name}: no colors_dark in theme.json`);
  return theme.colors_dark;
};

// Opposite tone of a mode (end cards, inverted panels). Brand without dark palette: invert fg/bg.
export const contrastTone = (theme: BrandTheme, mode: Mode) => {
  const toDark = mode === 'light';
  if (toDark) {
    const d = theme.colors_dark;
    return {
      bg: d?.bg ?? theme.colors.fg,
      fg: d?.fg ?? theme.colors.bg,
      accent: d?.accent ?? theme.colors.accent,
      muted: d?.muted ?? theme.colors.border,
      logo: theme.logos.dark_bg,
      icon: theme.logos.icon_dark_bg,
    };
  }
  return {
    bg: theme.colors.bg,
    fg: theme.colors.fg,
    accent: theme.colors.accent,
    muted: theme.colors.muted,
    logo: theme.logos.light_bg,
    icon: theme.logos.icon_light_bg,
  };
};
