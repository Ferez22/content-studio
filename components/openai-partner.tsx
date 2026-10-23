import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Reveal } from "./reveal";
import { SnapCarousel } from "./snap-carousel";

type Point = { title: string; text: string };

export const OpenAIPartner = () => {
  const t = useTranslations("home.partner");
  const points = t.raw("points") as Point[];
  return (
    <section id="openai" className="py-10 md:py-20 lg:py-32 scroll-mt-24">
      <Container>
        <div className="grid grid-cols-[auto_1fr] gap-5 md:gap-10 items-center">
          <Reveal>
            <Image
              src="/openai-select-partner-badge-vertical.svg"
              alt={t("badgeAlt")}
              width={265}
              height={305}
              className="w-16 sm:w-20 md:w-28 h-auto float-bob"
            />
          </Reveal>
          <div>
            <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-neutral-400">
              {t("eyebrow")}
            </p>
            <Heading className="mt-1 md:mt-2">{t("title")}</Heading>
          </div>
        </div>
        <Subheading className="py-6 md:py-8 max-w-2xl">{t("intro")}</Subheading>
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          {t("whatTitle")}
        </h3>
        <SnapCarousel className="mt-4 md:mt-6" label={t("whatTitle")}>
          {points.map((point) => (
            <div key={point.title}>
              <h4 className="font-bold text-neutral-700 dark:text-neutral-300">{point.title}</h4>
              <p className="text-neutral-500 mt-2">{point.text}</p>
            </div>
          ))}
        </SnapCarousel>
        <a
          href="https://openai.com/business/partners/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-8 text-sm text-neutral-500 hover:text-black dark:hover:text-white underline underline-offset-4"
        >
          {t("link")}
          <IconArrowUpRight className="size-3" />
        </a>
      </Container>
    </section>
  );
};
