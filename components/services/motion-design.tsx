"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { LetterReveal } from "@/components/ui/letter-reveal";
import { Link } from "@/i18n/navigation";
import type { ShowcaseVideo } from "@/lib/service-media";
import { cn } from "@/lib/utils";
import { useRequestMinimalNavbar } from "@/lib/navbar-mode";
import { Credit, HeroVideo, firstFrame, usePlayWhileVisible } from "./showcase-video";

// The video and motion design page tells its story with motion: a letter-reveal title over
// a large video, then four scroll-driven scenes, one per point of `explainer.points`.
// Everything falls back to a still layout for people who prefer reduced motion.

const ns = "servicePages.video-motion";

// The still layout is chosen after mount: the server always renders the animated one, so
// switching during hydration would make the HTML mismatch.
const useStill = () => {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduceMotion);
};

type Point = { title: string; text: string };

// Phones get their own proportions in a few scenes (portrait screens, no hover).
const useIsPhone = () => {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return phone;
};

// The hero is one pinned sequence driven by the scroll:
//   1. the title alone, landing letter by letter on load;
//   2. the title lifts away while the video rises and grows to fill the screen;
//   3. the video darkens and the description crosses the bottom of the screen, right to left;
//   4. the camera pushes into the video as it fades to black, straight into scene 01.
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
  const still = useStill();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (still) {
    return (
      <section className="pt-10 md:pt-20 lg:pt-24">
        <Container>
          {breadcrumbs}
          <h1 className="mt-10 md:mt-14 text-center text-4xl md:text-6xl lg:text-8xl tracking-tight font-display font-bold">
            {t("title")}
          </h1>
          <div className="mt-8 md:mt-14 mx-auto max-w-6xl">
            <HeroVideo video={video} label={t("title")} creditClassName="text-right" />
          </div>
          <div className="mt-8 mx-auto max-w-2xl text-center">
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300">{t("intro")}</p>
            <Button asChild className="mt-6 shadow-brand">
              <Link href="/contact">{cta}</Link>
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return <HeroSequence video={video} breadcrumbs={breadcrumbs} cta={cta} titleIn={mounted} />;
};

const HeroSequence = ({
  video,
  breadcrumbs,
  cta,
  titleIn,
}: {
  video: ShowcaseVideo;
  breadcrumbs: React.ReactNode;
  cta: string;
  titleIn: boolean;
}) => {
  const t = useTranslations(ns);
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  usePlayWhileVisible(videoRef);
  const p = useSceneProgress(ref);
  // Once the video fills the screen, the page is dark: the navbar steps aside until scene 02.
  useMinimalNavbarBetween(ref, "motion-hero", 0.18, 1);

  // The video window grows from a card to the full screen, so its size is computed in pixels.
  // Sized from the pinned stage (svh), so the iOS address bar cannot make it jitter.
  const stageRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState({ width: 1440, height: 900 });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setScreen({ width: stage.clientWidth, height: stage.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  // On a portrait phone a 16:9 clip cropped to the full screen turns into unreadable
  // slices, so there the window only grows to the full width and the stage turns dark.
  const portrait = screen.height > screen.width;
  const startWidth = Math.min(screen.width * (portrait ? 0.86 : 0.56), 960);
  const width = useTransform(p, [0.03, 0.27], [startWidth, screen.width]);
  const height = useTransform(
    p,
    [0.03, 0.27],
    [(startWidth * 9) / 16, portrait ? (screen.width * 9) / 16 : screen.height]
  );
  const backdrop = useTransform(p, [0.12, 0.27], [0, 1]);
  const radius = useTransform(p, [0.18, 0.27], [24, 0]);
  const windowY = useTransform(p, [0, 0.15], [screen.height * 0.62, 0]);

  const titleY = useTransform(p, [0, 0.17], [0, -screen.height * 0.32]);
  const titleScale = useTransform(p, [0, 0.17], [1, 0.82]);
  const titleOpacity = useTransform(p, [0.02, 0.1], [1, 0]);
  const cueOpacity = useTransform(p, [0, 0.03], [1, 0]);

  const dim = useTransform(p, [0.27, 0.34, 0.9, 0.98], [0, 0.55, 0.55, 1]);
  // At the end the camera pushes into the video while it fades to black.
  const push = useTransform(p, [0.9, 1], [1, 1.5]);

  // The description crosses the bottom of the screen from right to left, in big type.
  const tickerRef = useRef<HTMLParagraphElement>(null);
  const tickerWidth = useMotionValue(0);
  useEffect(() => {
    const measure = () => tickerWidth.set(tickerRef.current?.scrollWidth ?? 0);
    measure();
    const observer = new ResizeObserver(measure);
    if (tickerRef.current) observer.observe(tickerRef.current);
    return () => observer.disconnect();
  }, [tickerWidth]);
  const tickerX = useTransform([p, tickerWidth], ([value, text]: number[]) => {
    const local = Math.max(0, Math.min(1, (value - 0.32) / 0.56));
    return screen.width - local * (text + screen.width);
  });
  const ctaOpacity = useTransform(p, [0.34, 0.4, 0.84, 0.9], [0, 1, 1, 0]);
  const creditOpacity = useTransform(p, [0.22, 0.27, 0.84, 0.9], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[520svh]">
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ opacity: backdrop }} className="absolute inset-0 bg-neutral-950" />
        <motion.div style={{ y: titleY, scale: titleScale, opacity: titleOpacity }} className="absolute inset-0 flex flex-col">
          <Container className="w-full pt-24 md:pt-28">{breadcrumbs}</Container>
          <div className="flex-1 flex items-center justify-center px-4">
            <h1 className="text-center text-5xl md:text-7xl lg:text-9xl tracking-tighter font-display font-bold leading-[0.95]">
              <LetterReveal text={t("title")} active={titleIn} />
            </h1>
          </div>
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
        >
          {t("scrollHint")}
          <span className="relative h-10 w-px overflow-hidden bg-neutral-200 dark:bg-neutral-800">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-[#1E40FF] dark:bg-blue-400" />
          </span>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            style={{ width, height, y: windowY, borderRadius: radius }}
            className="relative overflow-hidden bg-neutral-950"
          >
            <motion.video
              style={{ scale: push }}
              ref={videoRef}
              src={firstFrame(video.src)}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={t("title")}
              className="absolute inset-0 size-full object-cover"
            />
            <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-neutral-950" />
          </motion.div>
        </div>

        {/* On portrait phones the video is a band across the middle: the line and the button
            sit right under it instead of at the bottom of the screen. */}
        <div className="absolute inset-x-0 bottom-0 pb-6 md:pb-10 pointer-events-none flex flex-col max-md:bottom-auto max-md:top-[calc(50%+28.2vw+1.75rem)] max-md:pb-0">
          <motion.div
            style={{ opacity: ctaOpacity }}
            className="px-4 md:px-8 pb-5 md:pb-8 max-md:order-2 max-md:pt-6 max-md:pb-0"
          >
            <Button asChild className="pointer-events-auto bg-white text-black hover:bg-neutral-200 dark:bg-white dark:text-black">
              <Link href="/contact">{cta}</Link>
            </Button>
          </motion.div>
          <motion.p
            ref={tickerRef}
            style={{ x: tickerX }}
            className="w-max whitespace-nowrap font-display font-bold tracking-tight leading-none text-5xl md:text-6xl lg:text-7xl text-white"
          >
            {t("intro")}
          </motion.p>
        </div>

        <motion.div style={{ opacity: creditOpacity }} className="absolute top-5 right-4 md:right-6">
          <Credit video={video} className="text-neutral-300 dark:text-neutral-300 [&_a]:text-white" />
        </motion.div>
      </div>
    </div>
  );
};

export const MotionDesignStory = ({ explainVideo }: { explainVideo?: ShowcaseVideo }) => {
  const t = useTranslations(`${ns}.explainer`);
  const points = t.raw("points") as Point[];
  // The hero fades straight into scene 01, so the section title is for screen readers only.
  return (
    <section>
      <h2 className="sr-only">{t("title")}</h2>
      <AliveScene point={points[0]} />
      <ExplainScene point={points[1]} video={explainVideo} />
      <StopScene point={points[2]} />
      <BrandScene point={points[3]} />
    </section>
  );
};

const Index = ({ value, className }: { value: number; className?: string }) => (
  <span className={cn("font-display font-bold text-sm text-[#1E40FF] dark:text-blue-400", className)}>
    {String(value).padStart(2, "0")}
  </span>
);

const PointText = ({
  index,
  point,
  className,
}: {
  index: number;
  point: Point;
  className?: string;
}) => (
  <div className={className}>
    <Index value={index} />
    <h3 className="mt-3 text-2xl md:text-4xl font-display font-bold tracking-tight">{point.title}</h3>
    <p className="mt-3 text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-md">
      {point.text}
    </p>
  </div>
);

// Cards that are not pinned enter in 3D, tilting up from below, one after the other.
const Enter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const still = useStill();
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18 }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll progress through a pinned scene: 0 when it reaches the top, 1 when it lets go.
const useSceneProgress = (ref: React.RefObject<HTMLElement | null>) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
};

// Asks the navbar to shrink to its thin pill while the section is between `from` and `to`
// (0 when its top reaches the top of the screen, 1 when its bottom does).
const useMinimalNavbarBetween = (
  ref: React.RefObject<HTMLElement | null>,
  id: string,
  from: number,
  to: number
) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [active, setActive] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (value) => setActive(value >= from && value < to));
  useRequestMinimalNavbar(id, active);
};

// 01: a full-screen stage. The title is set huge and comes alive as you scroll: the words
// slide past each other, the last one grows and its letters ripple. A soft spotlight follows
// the cursor and lights up the type it passes over. On touch screens it drifts with the scroll.
const AliveScene = ({ point }: { point: Point }) => {
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const p = useSceneProgress(ref);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointer = useRef(false);
  // Without a mouse, the light sweeps across the stage as the scroll moves on.
  useMotionValueEvent(p, "change", (value) => {
    const stage = stageRef.current;
    if (pointer.current || !stage) return;
    x.set(stage.clientWidth * (0.15 + value * 0.7));
    y.set(stage.clientHeight * (0.35 + Math.sin(value * Math.PI) * 0.2));
  });
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = true;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };
  const reveal = useMotionTemplate`radial-gradient(circle 22vmax at ${x}px ${y}px, black 25%, transparent 70%)`;

  useMinimalNavbarBetween(ref, "motion-alive", 0, 0.88);

  const textOpacity = useTransform(p, [0.72, 0.88], [0, 1]);
  const textY = useTransform(p, [0.72, 0.88], [40, 0]);
  const titleY = useTransform(p, [0.7, 1], ["0%", "-12%"]);
  // The type arrives slightly out of focus and sharpens quickly.
  const blur = useTransform(p, [0, 0.1], [14, 0]);
  const titleFilter = useMotionTemplate`blur(${blur}px)`;
  const words = point.title.split(" ");

  if (still) {
    return (
      <div className="bg-neutral-950 text-white">
        <Container className="py-16 md:py-24">
          <Index value={1} />
          <p className="mt-4 font-display font-bold tracking-tighter leading-[0.85] text-[15vw] lg:text-[11vw]">
            {point.title}
          </p>
          <p className="mt-6 max-w-md text-base md:text-lg text-neutral-300">{point.text}</p>
        </Container>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[220svh] md:h-[300svh]">
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        className="sticky top-0 h-svh overflow-hidden bg-neutral-950 text-white"
      >
        <h3 className="sr-only">{point.title}</h3>
        <motion.span
          aria-hidden="true"
          style={{ left: x, top: y }}
          className="pointer-events-none absolute size-[44vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(30_64_255/0.35)_0%,rgb(30_64_255/0.12)_35%,transparent_68%)]"
        />
        <motion.div style={{ y: titleY, filter: titleFilter }} className="absolute inset-0">
          {/* The dim layer is always visible; the bright copy only shows inside the light. */}
          <KineticTitle words={words} progress={p} className="text-neutral-800" />
          <motion.div style={{ maskImage: reveal, WebkitMaskImage: reveal }} className="absolute inset-0">
            <KineticTitle words={words} progress={p} className="text-white" />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-x-0 bottom-0 pb-8 md:pb-14"
        >
          <Container className="flex flex-col md:flex-row md:items-end gap-3 md:gap-10">
            <Index value={1} className="md:pb-1" />
            <p className="max-w-md text-base md:text-lg text-neutral-300">{point.text}</p>
          </Container>
        </motion.div>
      </div>
    </div>
  );
};

// Three lines of type that move against each other. The last word is the hero: it grows
// and each of its letters ripples, settling as the scene ends.
const KineticTitle = ({
  words,
  progress,
  className,
}: {
  words: string[];
  progress: MotionValue<number>;
  className?: string;
}) => {
  // On a narrow phone the words start closer in, so the first screens are not empty.
  const phone = useIsPhone();
  const first = words[0];
  const middle = words.slice(1, -1).join(" ");
  const last = words[words.length - 1];
  const firstX = useTransform(progress, [0, 0.65], [phone ? "14vw" : "38vw", phone ? "0vw" : "-4vw"]);
  const middleX = useTransform(progress, [0, 0.65], [phone ? "-12vw" : "-30vw", phone ? "30vw" : "22vw"]);
  const lastScale = useTransform(progress, [0.1, 0.6], [phone ? 0.7 : 0.45, 1]);
  const lastX = useTransform(progress, [0.1, 0.6], [phone ? "12vw" : "30vw", "0vw"]);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex flex-col justify-center gap-[4vw] md:gap-[1vw] font-display font-bold tracking-tighter leading-[0.82] select-none whitespace-nowrap",
        className
      )}
    >
      <motion.span style={{ x: firstX }} className="block pl-[4vw] text-[21vw] lg:text-[15vw]">
        {first}
      </motion.span>
      {middle && (
        <motion.span style={{ x: middleX }} className="block pl-[4vw] text-[11vw] lg:text-[6.5vw] font-semibold">
          {middle}
        </motion.span>
      )}
      <motion.span
        style={{ scale: lastScale, x: lastX }}
        className="flex justify-end pr-[4vw] text-[33vw] lg:text-[22vw] origin-right"
      >
        {[...last].map((letter, index) => (
          <RippleLetter key={index} letter={letter} index={index} progress={progress} />
        ))}
      </motion.span>
    </div>
  );
};

const RippleLetter = ({
  letter,
  index,
  progress,
}: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
}) => {
  // A wave that runs through the word while you scroll and dies out near the end.
  const envelope = (value: number) => Math.max(0, Math.min(1, (0.9 - value) / 0.3));
  const y = useTransform(progress, (value) => `${Math.sin(value * 18 - index * 0.9) * 0.12 * envelope(value)}em`);
  const rotate = useTransform(progress, (value) => Math.sin(value * 14 - index * 1.1) * 8 * envelope(value));
  return (
    <motion.span style={{ y, rotate }} className="inline-block">
      {letter}
    </motion.span>
  );
};

// 02: the title compresses as it scrolls in (wide tracking snapping tight, the first word
// sliding in from the left and the rest together from the right), then the explainer video.
const ExplainScene = ({ point, video }: { point: Point; video?: ShowcaseVideo }) => {
  const still = useStill();
  const phone = useIsPhone();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const tracking = useTransform(p, [0, 1], [phone ? "0.12em" : "0.35em", "-0.04em"]);
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "center center"],
  });
  const videoScale = useTransform(videoProgress, [0, 1], [0.15, 1]);
  const words = point.title.split(" ");

  return (
    <div ref={ref} className="pt-10 md:pt-20 overflow-x-clip">
      <Container>
        <Index value={2} />
        <h3 className="mt-3 text-[13vw] md:text-[9vw] lg:text-[8rem] font-display font-bold leading-[0.9] tracking-tight md:whitespace-nowrap">
          <span className="sr-only">{point.title}</span>
          <KineticGroup from="left" progress={p} tracking={tracking} still={still}>
            {words[0]}
          </KineticGroup>
          {words.length > 1 && (
            <KineticGroup from="right" progress={p} tracking={tracking} still={still}>
              {words.slice(1, -1).join(" ")}
              {words.length > 2 && " "}
              <span className="text-[#1E40FF] dark:text-blue-400">{words[words.length - 1]}</span>
            </KineticGroup>
          )}
        </h3>
        <p className="mt-5 max-w-md text-base md:text-lg text-neutral-600 dark:text-neutral-400">
          {point.text}
        </p>
      </Container>
      {video && (
        <motion.div
          ref={videoRef}
          style={still ? undefined : { scale: videoScale }}
          className="mt-8 md:mt-12 mx-auto w-[calc(100%-2rem)] max-w-4xl origin-center"
        >
          <HeroVideo video={video} label={point.title} creditClassName="text-right" />
        </motion.div>
      )}
    </div>
  );
};

const KineticGroup = ({
  from,
  progress,
  tracking,
  still,
  children,
}: {
  from: "left" | "right";
  progress: MotionValue<number>;
  tracking: MotionValue<string>;
  still: boolean;
  children: React.ReactNode;
}) => {
  const x = useTransform(progress, [0, 1], [from === "left" ? "-40vw" : "40vw", "0vw"]);
  return (
    <motion.span
      aria-hidden="true"
      style={still ? undefined : { x, letterSpacing: tracking }}
      className="block md:inline-block md:mr-[0.25em] whitespace-nowrap"
    >
      {children}
    </motion.span>
  );
};

// 03: the page turns like a cube. The front face holds the title, then the description as
// you scroll; the whole screen then rotates onto a dark face where our motion graphic
// (rendered from assets/motion/stop-the-scroll) plays from its countdown.
const StopScene = ({ point }: { point: Point }) => {
  const still = useStill();
  return still ? <StopStill point={point} /> : <StopCube point={point} />;
};

const StopVideo = React.forwardRef<HTMLVideoElement, { className?: string }>(({ className }, ref) => {
  const t = useTranslations(`${ns}.explainer`);
  return (
    <div className={cn("overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-950 ring-1 ring-white/10 aspect-video", className)}>
      <video
        ref={ref}
        src="/motion/stop-the-scroll.mp4"
        poster="/motion/stop-the-scroll.jpg"
        muted
        loop
        playsInline
        preload="auto"
        aria-label={t("stopVideoLabel")}
        className="size-full object-cover"
      />
    </div>
  );
});
StopVideo.displayName = "StopVideo";

const StopStill = ({ point }: { point: Point }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  usePlayWhileVisible(videoRef);
  return (
    <Container className="pt-10 md:pt-20">
      <PointText index={3} point={point} />
      <StopVideo ref={videoRef} className="mt-6 md:mt-12" />
    </Container>
  );
};

const StopCube = ({ point }: { point: Point }) => {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleIn = useInView(titleRef, { once: true, amount: 0.6 });
  const p = useSceneProgress(ref);
  useMinimalNavbarBetween(ref, "motion-stop", 0.31, 1);

  const [width, setWidth] = useState(1440);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setWidth(stage.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const textOpacity = useTransform(p, [0.08, 0.2], [0, 1]);
  const textY = useTransform(p, [0.08, 0.2], [30, 0]);
  const turn = useTransform(p, [0.3, 0.6], [0, -90]);
  // The cube turns around its own centre, and the camera pulls back a little mid-turn.
  const z = useTransform(p, [0.3, 0.45, 0.6], [-width / 2, -width / 2 - width * 0.3, -width / 2]);

  // The motion graphic starts from its countdown once the dark face has landed, and rewinds
  // when the visitor scrolls back.
  const playing = useRef(false);
  useMotionValueEvent(p, "change", (value) => {
    const video = videoRef.current;
    if (!video) return;
    if (value >= 0.6 && !playing.current) {
      playing.current = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    } else if (value < 0.55 && playing.current) {
      playing.current = false;
      video.pause();
      video.currentTime = 0;
    }
  });

  const face = "absolute inset-0 [backface-visibility:hidden]";
  return (
    <div ref={ref} className="relative h-[320svh] mt-10 md:mt-20">
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden" style={{ perspective: width * 1.4 }}>
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", z, rotateY: turn }}
        >
          <div className={cn(face, "bg-background flex items-center")} style={{ transform: `translateZ(${width / 2}px)` }}>
            <Container className="w-full">
              <Index value={3} />
              <h3
                ref={titleRef}
                className="mt-3 text-[13vw] md:text-[9vw] lg:text-[8rem] font-display font-bold leading-[0.9] tracking-tight"
              >
                <LetterReveal text={point.title} active={titleIn} />
              </h3>
              <motion.p
                style={{ opacity: textOpacity, y: textY }}
                className="mt-6 max-w-xl text-lg md:text-2xl text-neutral-600 dark:text-neutral-400"
              >
                {point.text}
              </motion.p>
            </Container>
          </div>
          <div
            className={cn(face, "bg-neutral-950 flex items-center justify-center")}
            style={{ transform: `rotateY(90deg) translateZ(${width / 2}px)` }}
          >
            <StopVideo ref={videoRef} className="w-[calc(100%-1rem)] md:w-[min(88vw,80rem)]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 04: the brand word, letter by letter. Plays when it scrolls into view and again on hover.
const BrandScene = ({ point }: { point: Point }) => {
  const t = useTranslations(`${ns}.explainer.brandDemo`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [active, setActive] = useState(false);
  useEffect(() => setActive(inView), [inView]);
  const replayTimer = useRef<number | undefined>(undefined);
  const replay = () => {
    setActive(false);
    window.clearTimeout(replayTimer.current);
    replayTimer.current = window.setTimeout(() => setActive(true), 380);
  };
  useEffect(() => () => window.clearTimeout(replayTimer.current), []);
  const swatches = [
    "bg-black dark:bg-white",
    "bg-neutral-500",
    "bg-neutral-200 dark:bg-neutral-700",
    "bg-[#1E40FF] dark:bg-blue-400",
  ];

  return (
    <Container className="pt-10 md:pt-20">
      <Enter className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 lg:gap-12 items-center">
        <PointText index={4} point={point} />
        <div
          ref={ref}
          onMouseEnter={replay}
          onClick={replay}
          className="group cursor-default rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-6 md:p-12"
        >
          <p className="font-display font-bold text-5xl sm:text-6xl md:text-8xl tracking-tight leading-none">
            <LetterReveal text={t("word")} active={active} />
          </p>
          <div className="mt-8 md:mt-12 grid grid-cols-4 gap-2 md:gap-3">
            {swatches.map((swatch, index) => (
              <span key={swatch} className="block overflow-hidden rounded-xl">
                <span
                  className={cn(
                    "block h-10 md:h-16 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none motion-reduce:translate-y-0",
                    swatch,
                    active ? "translate-y-0" : "translate-y-[110%]"
                  )}
                  style={{ transitionDelay: active ? `${300 + index * 80}ms` : "0ms" }}
                />
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="hidden [@media(hover:hover)]:inline">{t("hoverHint")}</span>
            <span className="[@media(hover:hover)]:hidden">{t("tapHint")}</span>
          </p>
        </div>
      </Enter>
    </Container>
  );
};
