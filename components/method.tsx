import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Reveal, RevealItem, RevealList } from "./reveal";
import { DiagnoseArt, ScaleArt, TrainArt, TransformArt } from "./services/step-art";

type Step = { when: string; title: string; text: string };

// One small motion graphic per step, in the order of home.method.steps.
const arts = [DiagnoseArt, TransformArt, ScaleArt, TrainArt];

// Home: how a first use case reaches production in a month, week by week.
export const Method = () => {
  const t = useTranslations("home.method");
  const steps = t.raw("steps") as Step[];
  return (
    <section id="method" className="scroll-mt-24 py-10 md:py-20 lg:py-32">
      <Container>
        <Reveal className="max-w-3xl">
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-6 max-w-2xl">{t("intro")}</Subheading>
        </Reveal>
        <RevealList as="div" className="mt-10 md:mt-16 grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Art = arts[index];
            return (
              <RevealItem
                as="div"
                key={step.title}
                className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-6"
              >
                {Art && (
                  <div className="mb-5 flex h-20 md:h-24 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 bg-[radial-gradient(var(--color-neutral-200)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-[size:12px_12px]">
                    <Art className="h-full w-auto max-w-full py-1.5" />
                  </div>
                )}
                <p className="font-display font-bold text-sm text-[#1E40FF] dark:text-blue-400">{step.when}</p>
                <h3 className="mt-1 text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-200">{step.title}</h3>
                <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{step.text}</p>
              </RevealItem>
            );
          })}
        </RevealList>
      </Container>
    </section>
  );
};
