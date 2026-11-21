import React from "react";
import { useTranslations } from "next-intl";
import { IconArrowUpRight, IconCertificate, IconLanguage, IconShieldCheck, IconUserCheck } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { serviceCategories, servicePath } from "@/lib/site";
import { serviceIcons } from "./service-icons";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Reveal, RevealItem, RevealList } from "./reveal";

type Item = { title: string; text: string };

// Icons follow the order of home.model.points.
const pointIcons = [IconUserCheck, IconCertificate, IconLanguage, IconShieldCheck];

// Home: who does the work (senior project leads, seasoned North African engineers) and the
// three ways to bring our engineers into a client's team (the "engineers" offer).
export const DeliveryModel = () => {
  const t = useTranslations("home.model");
  const tServices = useTranslations("servicePages");
  const points = t.raw("points") as Item[];
  const formulas = serviceCategories.find((c) => c.slug === "engineers")?.services ?? [];
  return (
    <section id="model" className="scroll-mt-24 py-10 md:py-20 lg:py-32">
      <Container>
        <Reveal className="max-w-3xl">
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-6 max-w-2xl">{t("intro")}</Subheading>
        </Reveal>
        <RevealList as="div" className="mt-10 md:mt-16 grid gap-x-8 gap-y-8 md:gap-y-10 sm:grid-cols-2">
          {points.map((point, index) => {
            const Icon = pointIcons[index] ?? IconUserCheck;
            return (
              <RevealItem as="div" key={point.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1E40FF]/10 text-[#1E40FF] dark:bg-blue-400/10 dark:text-blue-400">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold font-display tracking-tight">{point.title}</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">{point.text}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealList>

        {formulas.length > 0 && (
          <>
            <Reveal className="mt-16 md:mt-24 max-w-3xl">
              <h3 className="text-2xl md:text-4xl font-bold font-display tracking-tight">{t("formulasTitle")}</h3>
              <Subheading className="pt-4 max-w-2xl">{t("formulasIntro")}</Subheading>
            </Reveal>
            <RevealList as="div" className="mt-8 md:mt-10 grid gap-3 md:gap-4 md:grid-cols-3">
              {formulas.map((slug) => {
                const Icon = serviceIcons[slug];
                return (
                  <RevealItem as="div" key={slug}>
                    <Link
                      href={servicePath(slug)}
                      className="group flex h-full flex-col rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-6 hover:-translate-y-1 hover:border-neutral-400 dark:hover:border-neutral-600 transition duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Icon className="size-6 text-[#1E40FF] dark:text-blue-400" />
                        <IconArrowUpRight className="size-5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                      </div>
                      <p className="mt-6 text-lg md:text-xl font-bold font-display tracking-tight">{tServices(`${slug}.title`)}</p>
                      <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{tServices(`${slug}.summary`)}</p>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealList>
          </>
        )}
      </Container>
    </section>
  );
};
