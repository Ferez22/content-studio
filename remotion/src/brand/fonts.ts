import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';
import {loadFont as loadTajawal} from '@remotion/google-fonts/Tajawal';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadEBGaramond} from '@remotion/google-fonts/EBGaramond';

// Register every font a theme.json may name. Unknown name = hard error, never a silent fallback.
const LOADERS: Record<string, () => {fontFamily: string}> = {
  Inter: () => loadInter('normal', {weights: ['400', '600', '700'], subsets: ['latin']}),
  Manrope: () => loadManrope('normal', {weights: ['400', '600', '800'], subsets: ['latin']}),
  'Inter Tight': () => loadInterTight('normal', {weights: ['300', '400'], subsets: ['latin']}),
  'EB Garamond': () => loadEBGaramond('normal', {weights: ['400', '600'], subsets: ['latin']}),
  Tajawal: () => loadTajawal('normal', {weights: ['400', '700', '800'], subsets: ['arabic', 'latin']}),
};

const loaded = new Map<string, string>();

export const fontFamily = (name: string): string => {
  const cached = loaded.get(name);
  if (cached) return cached;
  const load = LOADERS[name];
  if (!load) throw new Error(`Font "${name}" not registered in remotion/src/brand/fonts.ts`);
  const family = load().fontFamily;
  loaded.set(name, family);
  return family;
};
