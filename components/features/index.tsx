"use client";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "../container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { Card, CardCTA, CardTitle } from "./card";
import { IconArrowRight, IconPlus, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryPath, serviceCategories, serviceSlugs, type CategorySlug } from "@/lib/site";
import { CategoryVisual } from "../services/visuals";
import { categoryIcons } from "../service-icons";
import { tintBg, tintFrom, tintStyle } from "../services/category-tints";
import dynamic from "next/dynamic";
import { FlipCard } from "../ui/flip-card";
import { Reveal } from "../reveal";
import { HoverPlay } from "../hover-play";
import { Figures } from "../figures";
import { cn } from "@/lib/utils";

// The service cards (with their animated visuals) only show once a category is opened: load them then.
const loadServiceCards = () => import("../services/service-cards");
const ServiceTiles = dynamic(() => loadServiceCards().then((m) => m.ServiceTiles));

// Outer corners of the grid are rounded: 2 x 3 on phones, 3 x 2 from lg.
// The grid's outer corners are round, the inner ones tight, for any number of categories
// (2 columns on phones, 3 from lg). Per corner: round on phones, round from lg, tight from lg.
const cornerClasses = {
  tl: ["rounded-tl-3xl", "lg:rounded-tl-3xl", "lg:rounded-tl-lg"],
  tr: ["rounded-tr-3xl", "lg:rounded-tr-3xl", "lg:rounded-tr-lg"],
  bl: ["rounded-bl-3xl", "lg:rounded-bl-3xl", "lg:rounded-bl-lg"],
  br: ["rounded-br-3xl", "lg:rounded-br-3xl", "lg:rounded-br-lg"],
} as const;

const outerCorners = (index: number, count: number, columns: number) => {
  const left = index % columns === 0;
  const right = index % columns === columns - 1 || index === count - 1;
  const top = index < columns;
  const bottom = index + columns >= count;
  return { tl: top && left, tr: top && right, bl: bottom && left, br: bottom && right };
};

const cornerClassNames = (index: number, count: number) => {
  const phone = outerCorners(index, count, 2);
  const desktop = outerCorners(index, count, 3);
  return (Object.keys(cornerClasses) as (keyof typeof cornerClasses)[]).map((corner) => {
    const [round, lgRound, lgTight] = cornerClasses[corner];
    if (phone[corner]) return desktop[corner] ? round : `${round} ${lgTight}`;
    return desktop[corner] ? lgRound : "";
  });
};

// Category cards on the front; clicking one flips the grid to that category's services.
export const Features = () => {
  const t = useTranslations("home");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CategorySlug>(serviceCategories[0].slug);
  // The back face is built on the first open, not on page load: it holds every card visual of a category.
  const [everOpened, setEverOpened] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Partial<Record<CategorySlug, HTMLButtonElement | null>>>({});

  const show = (slug: CategorySlug) => {
    setCategory(slug);
    setEverOpened(true);
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
            {t("services.intro", { areas: serviceCategories.length })}
          </Subheading>
        </Reveal>
        {/* Fetch the service cards as soon as a pointer or keyboard comes near, so the flip never waits. */}
        <div ref={gridRef} onPointerEnter={loadServiceCards} onFocus={loadServiceCards} className="mt-10 lg:mt-8 scroll-mt-28">
          <FlipCard
            flipped={open}
            front={
              <CategoryGrid
                onSelect={show}
                registerCard={(slug, node) => (cardRefs.current[slug] = node)}
              />
            }
            back={everOpened ? <CategoryServices category={category} onClose={close} closeRef={closeRef} /> : null}
          />
        </div>
        <Figures
          className="mt-10 md:mt-16"
          // "{services}" is the number of published services (serviceToggles).
          items={(t.raw("figures") as { value: string; label: string }[]).map((figure) => ({
            ...figure,
            value: figure.value.replace("{services}", String(serviceSlugs.length)),
          }))}
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
          {/* The card's visual plays only while it is hovered or focused. */}
          <HoverPlay className="h-full">
          <button
            ref={(node) => registerCard(slug, node)}
            type="button"
            onClick={() => onSelect(slug)}
            aria-controls="service-category-panel"
            className="group block w-full h-full text-left rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] dark:focus-visible:ring-blue-400"
          >
            <Card
              style={tintStyle(slug)}
              className={cn(
                "relative isolate overflow-hidden h-44 sm:h-60 lg:h-[max(14rem,calc((100svh-17rem)/2))]",
                tintBg,
                cornerClassNames(index, serviceCategories.length)
              )}
            >
              <CategoryVisual
                category={slug}
                className="h-full sm:h-full md:h-full max-lg:w-[161%] max-lg:h-[161%] max-lg:origin-top-left max-lg:scale-[0.62]"
              />
              <div className={cn("absolute inset-x-0 bottom-0 z-30 px-3 md:px-6 pb-3 md:pb-6 pt-8 md:pt-12 bg-gradient-to-t to-transparent", tintFrom)}>
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
          </HoverPlay>
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
  const services = serviceCategories.find((c) => c.slug === category)!.services;
  const CategoryIcon = categoryIcons[category];
  return (
    <div
      id="service-category-panel"
      role="region"
      aria-labelledby="service-category-title"
      style={tintStyle(category)}
      className={cn("relative rounded-3xl p-4 md:p-8", tintBg)}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t("closeCategory")}
        className="absolute top-3 right-3 md:top-5 md:right-5 size-11 rounded-full flex items-center justify-center bg-white text-black shadow-sm ring-1 ring-black/5 hover:scale-105 active:scale-95 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] dark:focus-visible:ring-blue-400"
      >
        <IconX className="size-5" />
      </button>
      <div className="flex items-start gap-3 md:gap-4 pr-12">
        <div className="size-10 md:size-12 shrink-0 rounded-xl bg-white/80 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
          <CategoryIcon className="size-5 md:size-6 text-[#1E40FF] dark:text-blue-400" />
        </div>
        <div>
          <h3 id="service-category-title" className="text-xl md:text-3xl font-bold font-display">
            {tCategories(`${category}.title`)}
          </h3>
          <p className="hidden md:block mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {tCategories(`${category}.summary`)}
          </p>
        </div>
      </div>
      <ServiceTiles services={services} className="mt-5 md:mt-6" />
      <Link
        href={categoryPath(category)}
        className="group mt-4 md:mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-white"
      >
        {t("exploreCategory", { category: tCategories(`${category}.title`) })}
        <IconArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};
