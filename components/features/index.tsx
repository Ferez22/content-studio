"use client";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "../container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { Card, CardCTA, CardTitle } from "./card";
import { IconArrowRight, IconPlus, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryPath, serviceCategories, servicePath, type CategorySlug } from "@/lib/site";
import { CategoryVisual } from "../services/visuals";
import { categoryIcons, serviceIcons } from "../service-icons";
import { FlipCard } from "../ui/flip-card";
import { Reveal } from "../reveal";
import { Figures } from "../figures";
import { cn } from "@/lib/utils";

// Outer corners of the grid are rounded: 2 x 3 on phones, 3 x 2 from lg.
const cornerClassNames = [
  "rounded-tl-3xl",
  "rounded-tr-3xl lg:rounded-tr-lg",
  "lg:rounded-tr-3xl",
  "lg:rounded-bl-3xl",
  "rounded-bl-3xl lg:rounded-bl-lg",
  "rounded-br-3xl",
];

// Category cards on the front; clicking one flips the grid to that category's services.
export const Features = () => {
  const t = useTranslations("home");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CategorySlug>(serviceCategories[0].slug);
  const gridRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Partial<Record<CategorySlug, HTMLButtonElement | null>>>({});

  const show = (slug: CategorySlug) => {
    setCategory(slug);
    setOpen(true);
    // On phones the clicked card can sit low on the screen: bring the top of the back face into view.
    const top = gridRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const close = () => setOpen(false);

  // Focus follows the flip: the close button on open, the category card on close, once
  // that face has turned visible (FlipCard hides the turned-away face until mid-flip).
  const opened = useRef(false);
  useEffect(() => {
    if (!open && !opened.current) return;
    opened.current = true;
    const target = open ? closeRef.current : cardRefs.current[category];
    let frame = 0;
    let tries = 0;
    const focusWhenVisible = () => {
      if (target && getComputedStyle(target).visibility === "visible") {
        target.focus({ preventScroll: true });
      } else if (tries++ < 90) {
        frame = requestAnimationFrame(focusWhenVisible);
      }
    };
    frame = requestAnimationFrame(focusWhenVisible);
    if (!open) return () => cancelAnimationFrame(frame);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, category]);

  return (
    <section id="services" className="scroll-mt-24">
      <Container className="py-10 md:py-20 lg:py-10">
        <Reveal className="flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-6 xl:gap-10">
          <Heading className="text-center lg:text-left">{t("services.title")}</Heading>
          <Subheading className="text-center lg:text-left mx-auto lg:mx-0">
            {t("services.intro")}
          </Subheading>
        </Reveal>
        <div ref={gridRef} className="mt-10 lg:mt-8 scroll-mt-28">
          <FlipCard
            flipped={open}
            front={
              <CategoryGrid
                onSelect={show}
                registerCard={(slug, node) => (cardRefs.current[slug] = node)}
              />
            }
            back={<CategoryServices category={category} onClose={close} closeRef={closeRef} />}
          />
        </div>
        <Figures
          className="mt-10 md:mt-16"
          items={t.raw("figures") as { value: string; label: string }[]}
        />
      </Container>
    </section>
  );
};

const CategoryGrid = ({
  onSelect,
  registerCard,
}: {
  onSelect: (slug: CategorySlug) => void;
  registerCard: (slug: CategorySlug, node: HTMLButtonElement | null) => void;
}) => {
  const tCategories = useTranslations("serviceCategories");
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {serviceCategories.map(({ slug }, index) => (
        <Reveal key={slug} delay={0.1 + index * 0.08}>
          <button
            ref={(node) => registerCard(slug, node)}
            type="button"
            onClick={() => onSelect(slug)}
            aria-controls="service-category-panel"
            className="group block w-full h-full text-left rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] dark:focus-visible:ring-blue-400"
          >
            <Card
              className={cn(
                "relative isolate overflow-hidden h-44 sm:h-60 lg:h-[max(14rem,calc((100svh-17rem)/2))]",
                cornerClassNames[index]
              )}
            >
              <CategoryVisual
                category={slug}
                className="h-full sm:h-full md:h-full max-lg:w-[161%] max-lg:h-[161%] max-lg:origin-top-left max-lg:scale-[0.62]"
              />
              <div className="absolute inset-x-0 bottom-0 z-30 px-3 md:px-6 pb-3 md:pb-6 pt-8 md:pt-12 bg-gradient-to-t from-neutral-50 via-neutral-50/95 to-transparent dark:from-neutral-800 dark:via-neutral-800/95">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-sm sm:text-lg md:text-2xl leading-snug">
                      {tCategories(`${slug}.title`)}
                    </CardTitle>
                    <div className="hidden lg:grid grid-rows-[1fr] [@media(hover:hover)]:grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                      <p className="overflow-hidden text-sm md:text-base text-neutral-600 dark:text-neutral-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300 ease-out">
                        <span className="block pt-2">{tCategories(`${slug}.summary`)}</span>
                      </p>
                    </div>
                  </div>
                  <CardCTA className="hidden sm:flex group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                    <IconPlus />
                  </CardCTA>
                </div>
              </div>
            </Card>
          </button>
        </Reveal>
      ))}
    </div>
  );
};

const CategoryServices = ({
  category,
  onClose,
  closeRef,
}: {
  category: CategorySlug;
  onClose: () => void;
  closeRef: React.Ref<HTMLButtonElement>;
}) => {
  const t = useTranslations("services");
  const tCategories = useTranslations("serviceCategories");
  const tServices = useTranslations("servicePages");
  const services = serviceCategories.find((c) => c.slug === category)!.services;
  const CategoryIcon = categoryIcons[category];
  return (
    <div
      id="service-category-panel"
      role="region"
      aria-labelledby="service-category-title"
      className="relative rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-4 md:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t("closeCategory")}
        className="absolute top-3 right-3 md:top-5 md:right-5 size-10 rounded-full flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] dark:focus-visible:ring-blue-400"
      >
        <IconX className="size-5" />
      </button>
      <div className="flex items-start gap-3 md:gap-4 pr-12">
        <div className="size-10 md:size-12 shrink-0 rounded-xl bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
          <CategoryIcon className="size-5 md:size-6 text-[#1E40FF] dark:text-blue-400" />
        </div>
        <div>
          <h3 id="service-category-title" className="text-xl md:text-3xl font-bold font-display">
            {tCategories(`${category}.title`)}
          </h3>
          <p className="mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {tCategories(`${category}.summary`)}
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 md:mt-8">
        {services.map((slug) => {
          const Icon = serviceIcons[slug];
          return (
            <li key={slug}>
              <Link
                href={servicePath(slug)}
                className="group flex h-full items-start gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/60 p-4 hover:shadow-brand transition duration-200"
              >
                <Icon className="size-5 mt-0.5 shrink-0 text-neutral-500 group-hover:text-[#1E40FF] dark:group-hover:text-blue-400 transition duration-200" />
                <div className="min-w-0">
                  <p className="font-bold text-black dark:text-white">{tServices(`${slug}.title`)}</p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {tServices(`${slug}.summary`)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={categoryPath(category)}
        className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-white"
      >
        {t("exploreCategory", { category: tCategories(`${category}.title`) })}
        <IconArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};
