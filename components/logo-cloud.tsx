import Image from "next/image";
import React from "react";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Only real partner or client logos, used with permission. The OpenAI badge
// stays still beside the moving row and keeps its original look, as OpenAI's guidance requires.
export const clientLogos = {
  additionality: { title: "Additionality", src: "/logos/additionality.png", width: 746, height: 112 },
  amld: { title: "AMLD Africa", src: "/logos/amld.png", width: 241, height: 112 },
  almajd: { title: "Almajd TCS", src: "/logos/almajd.png", width: 154, height: 112 },
  bcards: { title: "bcards", src: "/logos/bcards.png", width: 171, height: 112 },
  docutrad: { title: "Docutrad", src: "/logos/docutrad.png", width: 238, height: 39 },
};
export type ClientLogo = keyof typeof clientLogos;
const logos = Object.values(clientLogos);

// The track shifts by half its width, so it holds an even number of copies, enough to
// stay wider than the visible row.
const COPIES = 4;

export const LogoCloud = ({ className }: { className?: string }) => {
  const t = useTranslations("home");

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 text-center">
        {t("trusted.title")}
      </h2>
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
        <Link
          href="/#openai"
          className="block shrink-0 transition-transform duration-200 hover:scale-105"
        >
          <Image
            src="/openai-select-partner-badge.svg"
            alt={t("partner.badgeAlt")}
            width={375}
            height={177}
            className="h-10 w-auto"
          />
        </Link>
        <div className="w-full min-w-0 overflow-hidden mask-x-from-80%">
          <div className="marquee-track flex w-max items-center hover:[animation-play-state:paused]">
            {Array.from({ length: COPIES }, () => logos)
              .flat()
              .map((item, index) => (
                <Image
                  key={`${item.title}-${index}`}
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  alt={index < logos.length ? item.title : ""}
                  aria-hidden={index >= logos.length || undefined}
                  // One-tone silhouettes keep mixed-colour logos consistent in both themes.
                  className="h-5 md:h-6 w-auto max-w-24 md:max-w-28 mx-5 md:mx-6 object-contain brightness-0 opacity-70 dark:invert"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
