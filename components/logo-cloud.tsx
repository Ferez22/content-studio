"use client";
import Image from "next/image";
import React from "react";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Only real partner or client logos, used with permission. The OpenAI badge
// sits in the middle and keeps its original look, as OpenAI's guidance requires.
const leftLogos = [
  { title: "Additionality", src: "/logos/additionality.png", width: 746, height: 112 },
  { title: "AMLD Africa", src: "/logos/amld.png", width: 241, height: 112 },
];
const rightLogos = [
  { title: "Almajd TCS", src: "/logos/almajd.png", width: 154, height: 112 },
  { title: "bcards", src: "/logos/bcards.png", width: 171, height: 112 },
  { title: "Docutrad", src: "/logos/docutrad.png", width: 238, height: 39 },
];

const reveal = (index: number) => ({
  initial: { y: -10, opacity: 0, filter: "blur(10px)" },
  whileInView: { y: 0, opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay: index * 0.1 },
  viewport: { once: true },
});

export const LogoCloud = () => {
  const t = useTranslations("home");
  const logo = (item: (typeof leftLogos)[number], index: number) => (
    <motion.div key={item.title} {...reveal(index)}>
      <Image
        src={item.src}
        width={item.width}
        height={item.height}
        alt={item.title}
        // One-tone silhouettes keep mixed-colour logos consistent in both themes.
        className="h-8 md:h-10 w-auto max-w-40 object-contain brightness-0 opacity-70 dark:invert"
      />
    </motion.div>
  );

  return (
    <section className="py-10 md:py-16 px-4">
      <h2 className="text-neutral-600 font-medium dark:text-neutral-400 text-lg text-center max-w-xl mx-auto">
        {t("trusted.title")}
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-14 max-w-6xl mx-auto mt-10">
        {leftLogos.map((item, index) => logo(item, index + 1))}
        <motion.div {...reveal(0)} className="order-first w-full flex justify-center md:order-none md:w-auto">
          <Link href="/#openai" className="block transition-transform duration-200 hover:scale-105">
            <Image
              src="/openai-select-partner-badge.svg"
              alt={t("partner.badgeAlt")}
              width={375}
              height={177}
              className="h-14 md:h-16 w-auto"
            />
          </Link>
        </motion.div>
        {rightLogos.map((item, index) => logo(item, index + 3))}
      </div>
    </section>
  );
};
