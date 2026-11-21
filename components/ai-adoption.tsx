import React from "react";
import { useTranslations } from "next-intl";
import { IconArrowRight, IconBrain, IconCheck, IconHandStop, IconLock, IconPuzzle } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { categoryPath } from "@/lib/site";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Reveal, RevealItem, RevealList } from "./reveal";

type Item = { title: string; text: string };

// Icons follow the order of home.adoption.pains.
const painIcons = [IconPuzzle, IconBrain, IconHandStop, IconLock];

// Home, right after the hero (Fares 2026-11-21): teams already use AI, each on their own.
// The pains, then what changes when the whole team knows how, leading to the AI training offer.
export const AiAdoption = () => {
  const t = useTranslations("home.adoption");
  const pains = t.raw("pains") as Item[];
  const gains = t.raw("gains") as string[];
  return (
    <section id="adoption" className="scroll-mt-24 py-10 md:py-20 lg:py-32">
      <Container>
        <Reveal className="max-w-3xl">
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-6 max-w-2xl">{t("intro")}</Subheading>
        </Reveal>
        <RevealList as="div" className="mt-10 md:mt-16 grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((pain, index) => {
            const Icon = painIcons[index] ?? IconPuzzle;
            return (
              <RevealItem
                as="div"
                key={pain.title}
                className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-6"
              >
                <Icon className="size-6 text-neutral-500 dark:text-neutral-400" />
                <h3 className="mt-5 text-lg md:text-xl font-bold font-display tracking-tight">{pain.title}</h3>
                <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{pain.text}</p>
              </RevealItem>
            );
          })}
        </RevealList>

        <Reveal className="mt-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black p-6 md:p-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h3 className="text-2xl md:text-4xl font-bold font-display tracking-tight">{t("highlightTitle")}</h3>
            <p className="mt-4 text-base md:text-lg text-neutral-300 dark:text-neutral-600">{t("highlightText")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-6">
              {/* Inverted panel: a white pill on black (black on white in dark mode). */}
              <Button asChild className="bg-white text-black hover:bg-neutral-200 dark:bg-black dark:text-white dark:hover:bg-neutral-800">
                <Link href="/book">{t("cta")}</Link>
              </Button>
              <Link
                href={categoryPath("ai-training")}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-300 hover:text-white dark:text-neutral-600 dark:hover:text-black transition-colors"
              >
                {t("secondary")}
                <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <ul className="grid gap-3">
            {gains.map((gain) => (
              <li key={gain} className="flex items-start gap-3 rounded-2xl bg-white/10 dark:bg-black/5 p-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1E40FF] text-white">
                  <IconCheck className="size-4" />
                </span>
                <span className="text-sm md:text-base font-medium">{gain}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
};
