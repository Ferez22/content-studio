"use client";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useUntranslatedPaths } from "./untranslated-paths";

const names: Record<string, string> = {
  en: "English",
  fr: "Français",
};

export const LocaleSwitcher = ({
  full = false,
  onNavigate,
}: {
  full?: boolean;
  onNavigate?: () => void;
}) => {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const untranslated = useUntranslatedPaths();
  // An entry missing in the target locale links to that locale's collection index, not to a redirect.
  const hrefFor = (l: string) =>
    untranslated[l]?.includes(pathname) ? `/${pathname.split("/")[1]}` : pathname;

  return (
    <nav aria-label={t("language")} className="flex items-center gap-3">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-label={names[l]}
          aria-current={l === locale ? "true" : undefined}
          onClick={onNavigate}
          className={cn(
            "text-sm font-medium text-neutral-400 hover:text-black dark:hover:text-white transition duration-200",
            l === locale && "text-black dark:text-white"
          )}
        >
          {full ? names[l] : l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
};
