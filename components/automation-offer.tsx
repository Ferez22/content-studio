import React from "react";
import { useTranslations } from "next-intl";
import {
  IconArrowRight,
  IconFileDescription,
  IconFileInvoice,
  IconMessageChatbot,
  IconMessageSearch,
  IconPlugConnected,
  IconReportAnalytics,
  IconScan,
  IconShieldCheck,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { AmbientTexture } from "./ambient-texture";
import { categoryPath } from "@/lib/site";
import { Reveal, RevealItem, RevealList } from "./reveal";

type Item = { title: string; text: string };

// Icons follow the order of home.automation.processes and home.automation.cases in messages.
const processIcons = [IconFileInvoice, IconReportAnalytics, IconShieldCheck];
const caseIcons = [IconMessageSearch, IconScan, IconUsersGroup, IconFileDescription, IconMessageChatbot, IconPlugConnected];

// Home: the processes we automate and the business cases we handle, in one rounded panel
// over the ambient texture.
export const AutomationOffer = () => {
  const t = useTranslations("home.automation");
  const processes = t.raw("processes") as Item[];
  const cases = t.raw("cases") as Item[];

  return (
    <section id="automation" className="scroll-mt-24 py-10 md:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-5 py-12 md:px-12 md:py-20 lg:px-16">
          <AmbientTexture layout="section" className="absolute inset-0 -z-10" />

          <Reveal className="max-w-3xl">
            <Heading>{t("title")}</Heading>
            <Subheading className="pt-6 max-w-2xl text-neutral-600 dark:text-neutral-300">{t("intro")}</Subheading>
          </Reveal>

          <RevealList className="mt-10 md:mt-14 grid gap-3 md:gap-4 md:grid-cols-3">
            {processes.map((item, index) => {
              const Icon = processIcons[index] ?? IconFileDescription;
              return (
                <RevealItem
                  key={item.title}
                  className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-6 md:p-8"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#1E40FF]/10 text-[#1E40FF] dark:bg-blue-400/10 dark:text-blue-400">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-xl md:text-2xl font-bold font-display tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{item.text}</p>
                </RevealItem>
              );
            })}
          </RevealList>

          <Reveal className="mt-16 md:mt-24 max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold font-display tracking-tight">{t("casesTitle")}</h2>
            <Subheading className="pt-4 max-w-2xl text-neutral-600 dark:text-neutral-300">{t("casesIntro")}</Subheading>
          </Reveal>

          <RevealList className="mt-8 md:mt-10 grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((item, index) => {
              const Icon = caseIcons[index] ?? IconFileDescription;
              return (
                <RevealItem
                  key={item.title}
                  className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-6"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
                    <h3 className="text-base md:text-lg font-bold font-display tracking-tight">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{item.text}</p>
                </RevealItem>
              );
            })}
          </RevealList>

          <Reveal className="mt-12 md:mt-16 flex flex-wrap items-center gap-4 md:gap-6">
            <Button asChild>
              <Link href="/book">{t("cta")}</Link>
            </Button>
            <Link
              href={categoryPath("data-ai")}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            >
              {t("secondary")}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
