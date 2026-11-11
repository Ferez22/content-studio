import type React from "react";
import { useTranslations } from "next-intl";
import { IconCircleCheckFilled, type Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import type { ShowcaseVideo } from "@/lib/service-media";
import type { ServiceSlug } from "@/lib/site";
import { Reveal, RevealItem, RevealList } from "@/components/reveal";
import { DoorVideo } from "./showcase-video";

// Optional sections of a service page. Each renders only when its copy exists under
// servicePages.<slug> (explainer, levels, examples, included); UseCases is on every page.

type Item = { title: string; text: string };

const SectionIntro = ({ title, intro }: { title: string; intro?: string }) => (
  <Reveal>
    <Heading>{title}</Heading>
    {intro && <Subheading className="pt-6 max-w-2xl">{intro}</Subheading>}
  </Reveal>
);

type Art = React.ComponentType<{ className?: string }>;

// What the service is and what it is good for, as a short intro and a grid of points.
// `art`: an optional small illustration per point, in the same order as the points.
export const Explainer = ({ slug, art }: { slug: ServiceSlug; art?: Art[] }) => {
  const t = useTranslations(`servicePages.${slug}.explainer`);
  const points = t.raw("points") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <RevealList as="div" className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-10 md:mt-16">
          {points.map((point, index) => {
            const PointArt = art?.[index];
            return (
              <RevealItem
                as="div"
                key={point.title}
                className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-8"
              >
                {PointArt && (
                  <div className="mb-6 flex h-40 md:h-48 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 bg-[radial-gradient(var(--color-neutral-200)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-[size:14px_14px]">
                    <PointArt className="h-full w-auto max-w-full py-3" />
                  </div>
                )}
                <span className="font-display font-bold text-sm text-[#1E40FF] dark:text-blue-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  {point.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-balance">{point.text}</p>
              </RevealItem>
            );
          })}
        </RevealList>
      </Container>
    </section>
  );
};

type Level = { label: string; title: string; text: string; examples: Item[] };

// Stages or building blocks of a service, each with real examples (e.g. chatbot, agent,
// specialist). The page passes one icon per item.
export const Levels = ({ slug, icons }: { slug: ServiceSlug; icons: Icon[] }) => {
  const t = useTranslations(`servicePages.${slug}.levels`);
  const levels = t.raw("items") as Level[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <RevealList
          as="ol"
          className={cn(
            "grid grid-cols-1 gap-3 md:gap-4 mt-10 md:mt-16",
            levels.length % 3 === 0 ? "lg:grid-cols-3" : "md:grid-cols-2"
          )}
        >
          {levels.map((level, index) => {
            const LevelIcon = icons[index];
            return (
              <RevealItem
                key={level.label}
                className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-8"
              >
                <div className="flex items-center gap-3">
                  {LevelIcon && (
                    <span className="flex size-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                      <LevelIcon className="size-5 text-[#1E40FF] dark:text-blue-400" />
                    </span>
                  )}
                  <span className="font-display font-bold text-sm text-[#1E40FF] dark:text-blue-400">
                    {String(index + 1).padStart(2, "0")} {level.label}
                  </span>
                </div>
                <h3 className="mt-5 text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  {level.title}
                </h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{level.text}</p>
                <ul className="mt-6 space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  {level.examples.map((example) => (
                    <li key={example.title}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        {example.title}
                      </span>
                      <p className="mt-1 text-sm md:text-base text-neutral-800 dark:text-neutral-200">
                        {example.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            );
          })}
        </RevealList>
      </Container>
    </section>
  );
};

// Example videos behind folding doors, with the creators credited.
export const Examples = ({ slug, videos }: { slug: ServiceSlug; videos: ShowcaseVideo[] }) => {
  const t = useTranslations(`servicePages.${slug}.examples`);
  const tMedia = useTranslations("services.media");
  const items = t.raw("items") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10 mt-10 md:mt-16">
          {videos.map((video, index) => (
            <DoorVideo
              key={video.src}
              video={video}
              index={index}
              title={items[index].title}
              text={items[index].text}
            />
          ))}
        </div>
        <p className="mt-10 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
          {tMedia("disclaimer")}
        </p>
      </Container>
    </section>
  );
};

// Key features: a two-column grid, or a slow marquee of cards (paused on hover) on pages
// whose demo carries the detail.
export const Features = ({ slug, marquee }: { slug: ServiceSlug; marquee?: boolean }) => {
  const t = useTranslations(`servicePages.${slug}`);
  const tServices = useTranslations("services");
  const features = t.raw("features") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Reveal>
          <Heading>{t.has("featuresTitle") ? t("featuresTitle") : tServices("featuresTitle")}</Heading>
        </Reveal>
        {marquee ? (
          <Reveal className="mt-10 md:mt-16 overflow-hidden mask-x-from-90%">
            <ul
              className="marquee-track flex w-max hover:[animation-play-state:paused]"
              style={{ animationDuration: `${features.length * 7}s` }}
            >
              {[...features, ...features].map((feature, index) => (
                <li
                  key={index}
                  aria-hidden={index >= features.length || undefined}
                  className="mr-3 w-72 shrink-0 rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-800 md:mr-4 md:w-80 md:p-6"
                >
                  <IconCircleCheckFilled className="size-5 text-[#1E40FF] dark:text-blue-400" />
                  <h3 className="mt-3 font-bold text-neutral-800 dark:text-neutral-200">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 md:text-base">{feature.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <RevealList
            as="div"
            className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 mt-10 md:mt-16"
          >
            {features.map((feature, index) => (
              <RevealItem
                as="div"
                key={feature.title}
                className={cn(
                  "p-4 md:p-8 border-neutral-200 dark:border-neutral-800",
                  index % 2 === 0 && "md:border-r",
                  index < features.length - 2 && "border-b",
                  index === features.length - 2 && "border-b md:border-b-0"
                )}
              >
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">{feature.text}</p>
              </RevealItem>
            ))}
          </RevealList>
        )}
      </Container>
    </section>
  );
};

// Where the service is used: short lines, or cards when each use case has a title and text.
// An optional `aside` (a visual) sits next to them on large screens.
export const UseCases = ({ slug, aside }: { slug: ServiceSlug; aside?: React.ReactNode }) => {
  const t = useTranslations(`servicePages.${slug}`);
  const tServices = useTranslations("services");
  const useCases = t.raw("useCases") as (string | Item)[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Reveal>
          <Heading>{tServices("useCasesTitle")}</Heading>
        </Reveal>
        <div
          className={cn(
            "mt-10 md:mt-16",
            aside && "grid grid-cols-1 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_26rem] gap-4 items-start"
          )}
        >
          <RevealList className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((useCase) =>
              typeof useCase === "string" ? (
                <RevealItem
                  key={useCase}
                  className="flex items-center gap-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6 font-medium"
                >
                  <IconCircleCheckFilled className="size-5 shrink-0 text-neutral-500" />
                  {useCase}
                </RevealItem>
              ) : (
                <RevealItem
                  key={useCase.title}
                  className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-8"
                >
                  <IconCircleCheckFilled className="size-5 text-[#1E40FF] dark:text-blue-400" />
                  <h3 className="mt-3 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">{useCase.text}</p>
                </RevealItem>
              )
            )}
          </RevealList>
          {aside && <Reveal delay={0.25}>{aside}</Reveal>}
        </div>
      </Container>
    </section>
  );
};

// Everything the client gets, as a checklist grid.
export const Included = ({ slug }: { slug: ServiceSlug }) => {
  const t = useTranslations(`servicePages.${slug}.included`);
  const items = t.raw("items") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <RevealList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-10 md:mt-16">
          {items.map((item) => (
            <RevealItem
              key={item.title}
              className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
            >
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{item.text}</p>
            </RevealItem>
          ))}
        </RevealList>
      </Container>
    </section>
  );
};
