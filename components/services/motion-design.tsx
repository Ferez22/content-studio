"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { LetterReveal } from "@/components/ui/letter-reveal";
import { Link } from "@/i18n/navigation";
import type { ShowcaseVideo } from "@/lib/service-media";
import { cn } from "@/lib/utils";
import { BeforeAfter } from "@/components/ui/before-after";
import { Credit, HeroVideo, usePlayWhileVisible } from "./showcase-video";
import { BuildingCard, StillCard } from "./business-card";

// The video and motion design page explains the craft by showing it: a still versus a moving
// version of the same business card, four short demos and the AI video engine. Nothing is pinned and the scroll is
// never taken over: motion plays when a section comes into view, and stays still for people
// who prefer reduced motion.

const ns = "servicePages.video-motion";

type Point = { title: string; text: string };

export const MotionDesignHero = ({
  video,
  breadcrumbs,
  cta,
}: {
  video: ShowcaseVideo;
  breadcrumbs: React.ReactNode;
  cta: string;
}) => {
  const t = useTranslations(ns);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // A light parallax: the video settles slightly as the page scrolls.
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: videoRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.97]);

  return (
    <section className="pt-10 md:pt-20 lg:pt-24">
      <Container>
        {breadcrumbs}
        <div className="mt-10 md:mt-14 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl tracking-tight font-display font-bold">
            <LetterReveal text={t("title")} active={mounted} />
          </h1>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Subheading className="mx-auto mt-6 text-center">{t("intro")}</Subheading>
            <Button asChild className="mt-6">
              <Link href="/contact">{cta}</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          ref={videoRef}
          style={reduceMotion ? undefined : { scale }}
          className="mt-10 md:mt-14 mx-auto max-w-6xl"
        >
          <HeroVideo video={video} label={t("title")} creditClassName="text-right" />
        </motion.div>
      </Container>
    </section>
  );
};

export const MotionDesignStory = ({
  explainVideo,
  aliveVideo,
}: {
  explainVideo?: ShowcaseVideo;
  aliveVideo?: ShowcaseVideo;
}) => (
  <>
    <StillVersusMotion />
    <Benefits explainVideo={explainVideo} aliveVideo={aliveVideo} />
    <VideoEngine />
  </>
);

// Cards and blocks rise into place the first time they scroll into view.
const Rise = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Still or in motion ----------------------------------------------------------------

// The same business card twice, compared with a slider: still, or building itself.
const StillVersusMotion = () => {
  const t = useTranslations(`${ns}.compare`);
  return (
    <section className="pt-16 md:pt-28">
      <Container>
        <Rise>
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-5 max-w-2xl">{t("intro")}</Subheading>
        </Rise>
        <Rise className="mt-8 md:mt-12" delay={0.1}>
          <BeforeAfter
            className="mx-auto max-w-3xl rounded-3xl ring-1 ring-black/10 dark:ring-white/10"
            before={<StillCard />}
            after={<BuildingCard />}
            beforeLabel={t("still")}
            afterLabel={t("motion")}
            handleLabel={t("handle")}
          />
        </Rise>
      </Container>
    </section>
  );
};

// --- What it is good for ----------------------------------------------------------------

const Benefits = ({ explainVideo, aliveVideo }: { explainVideo?: ShowcaseVideo; aliveVideo?: ShowcaseVideo }) => {
  const t = useTranslations(`${ns}.explainer`);
  const reduceMotion = useReducedMotion();
  const points = t.raw("points") as Point[];
  const demos = [
    aliveVideo ? <DemoVideo key="alive" src={aliveVideo.src} label={points[0].title} credit={aliveVideo} /> : null,
    explainVideo ? <DemoVideo key="explain" src={explainVideo.src} label={points[1].title} credit={explainVideo} /> : null,
    <DemoVideo key="stop" src="/motion/stop-the-scroll.mp4" poster="/motion/stop-the-scroll.jpg" label={t("stopVideoLabel")} restart />,
    <DemoVideo key="brand" src="/motion/qartmina-brand.mp4" poster="/motion/qartmina-brand.jpg" label={t("brandVideoLabel")} restart />,
  ];
  return (
    <section className="pt-16 md:pt-28">
      <Container>
        <Rise>
          <Heading>{t("title")}</Heading>
        </Rise>
        {/* The cards load one after the other once the grid comes into view. */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ shown: { transition: { staggerChildren: 0.18 } } }}
          className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(6px)" },
                shown: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <article className="h-full rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-3 md:p-4">
                <div className="relative overflow-hidden rounded-2xl">{demos[index]}</div>
                <div className="px-2 md:px-3 pt-4 pb-2">
                  <span className="font-display font-bold text-sm text-[#1E40FF] dark:text-blue-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1.5 text-xl md:text-2xl font-display font-bold tracking-tight">{point.title}</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">{point.text}</p>
                </div>
              </article>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

// A muted, looping video without controls that plays while on screen. `restart` starts it
// from the beginning each time it comes back into view (our countdown piece).
const DemoVideo = ({
  src,
  poster,
  label,
  credit,
  restart = false,
}: {
  src: string;
  poster?: string;
  label: string;
  credit?: ShowcaseVideo;
  restart?: boolean;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  usePlayWhileVisible(ref);
  useEffect(() => {
    if (restart && inView && !reduceMotion && ref.current) ref.current.currentTime = 0;
  }, [restart, inView, reduceMotion]);
  return (
    <figure>
      <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-950">
        <video
          ref={ref}
          src={poster ? src : `${src}#t=2`}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
          className="size-full object-cover"
        />
      </div>
      {credit && <Credit video={credit} className="mt-2 text-right" />}
    </figure>
  );
};

// --- Your video engine ------------------------------------------------------------------

// The AI system in five steps, with a pulse travelling along the line between them.
const VideoEngine = () => {
  const t = useTranslations(`${ns}.engine`);
  const steps = t.raw("steps") as Point[];
  return (
    <section className="pt-16 md:pt-28">
      <Container>
        <Rise>
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-5 max-w-2xl">{t("intro")}</Subheading>
        </Rise>
        <div className="relative mt-10 md:mt-14">
          <span className="absolute left-[19px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800 md:left-0 md:right-0 md:top-[19px] md:bottom-auto md:h-px md:w-auto">
            <span className="engine-pulse absolute rounded-full bg-[#1E40FF] dark:bg-blue-400" />
          </span>
          <ol className="relative grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <Rise delay={index * 0.12} className="flex md:block gap-4">
                  <span className="relative size-10 shrink-0 rounded-full bg-background ring-1 ring-neutral-300 dark:ring-neutral-700 flex items-center justify-center font-display font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="block md:mt-4">
                    <span className="block text-lg font-bold">{step.title}</span>
                    <span className="mt-1 block text-neutral-600 dark:text-neutral-400">{step.text}</span>
                  </span>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
};

// --- The offer (replaces "How we deliver" on this page) ---------------------------------

export const MotionOffer = () => {
  const t = useTranslations(`${ns}.offer`);
  return (
    <section className="pt-16 md:pt-28">
      <Container className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <Rise className="rounded-3xl bg-neutral-950 text-white p-6 md:p-12 flex flex-col justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">{t("title")}</h2>
            <p className="mt-4 max-w-lg text-neutral-300 md:text-lg">{t("text")}</p>
          </div>
          <Button asChild className="self-start bg-white text-black hover:bg-transparent hover:text-white hover:border-white/60">
            <Link href="/contact">{t("cta")}</Link>
          </Button>
        </Rise>
        <Rise delay={0.1} className="rounded-3xl bg-[#ede9fe] dark:bg-[#27223d] p-6 md:p-12 flex flex-col justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight">{t("launchTitle")}</h2>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300">{t("launchText")}</p>
          </div>
          <Button asChild className="self-start">
            <Link href="/book">{t("launchCta")}</Link>
          </Button>
        </Rise>
      </Container>
    </section>
  );
};
