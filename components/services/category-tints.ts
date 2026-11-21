import type { CSSProperties } from "react";
import type { CategorySlug } from "@/lib/site";

// One soft colour per service category, used on its home card and the panel it flips to.
// Light mode gets a pastel, dark mode an opaque deep tone of the same hue (so overlays and
// gradients built from it stay solid). Apply with `tintStyle` and the `bg-tint` classes below.
const tints: Record<CategorySlug, { light: string; dark: string }> = {
  "ai-operations": { light: "#ede9fe", dark: "#27223d" },
  "ai-marketing": { light: "#fce7f3", dark: "#34212d" },
  engineers: { light: "#fef3c7", dark: "#33291a" },
};

export const tintStyle = (category: CategorySlug) =>
  ({ "--tint": tints[category].light, "--tint-dark": tints[category].dark }) as CSSProperties;

export const tintBg = "bg-[var(--tint)] dark:bg-[var(--tint-dark)]";
export const tintFrom = "from-[var(--tint)] via-[var(--tint)]/95 dark:from-[var(--tint-dark)] dark:via-[var(--tint-dark)]/95";
