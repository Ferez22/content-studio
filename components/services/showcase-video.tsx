"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { IconHandClick, IconPointer } from "@tabler/icons-react";
import { promptMotionUrl, type ShowcaseVideo } from "@/lib/service-media";
import { cn } from "@/lib/utils";

// Start a little into the clip: it makes Safari paint a frame without playing, and the
// opening frames of these videos are often blank.
export const firstFrame = (src: string) => `${src}#t=2`;

const linkClassName = "underline underline-offset-2 hover:text-black dark:hover:text-white";

// Credits the creator: these videos are examples by other people, never our work.
export const Credit = ({ video, className }: { video: ShowcaseVideo; className?: string }) => {
  const t = useTranslations("services.media");
  return (
    <figcaption className={cn("text-xs text-neutral-500 dark:text-neutral-400", className)}>
      {t.rich("credit", {
        handle: video.creator,
        creator: (chunks) => (
          <a
            href={`https://x.com/${video.creator}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {chunks}
          </a>
        ),
        source: (chunks) => (
          <a href={promptMotionUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            {chunks}
          </a>
        ),
      })}
    </figcaption>
  );
};

// Plays a muted loop only while it is on screen; stays on its first frame for people who
// prefer reduced motion.
export const usePlayWhileVisible = (ref: React.RefObject<HTMLVideoElement | null>) => {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? element.play().catch(() => {}) : element.pause()),
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, reduceMotion]);
};

// Always-on hero video: muted, looping, no controls.
export const HeroVideo = ({
  video,
  label,
  creditClassName,
}: {
  video: ShowcaseVideo;
  label: string;
  creditClassName?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  usePlayWhileVisible(ref);

  return (
    <figure>
      <div className="overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10 aspect-video">
        <video
          ref={ref}
          src={firstFrame(video.src)}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
          className="size-full object-cover"
        />
      </div>
      <Credit video={video} className={cn("mt-3", creditClassName)} />
    </figure>
  );
};

const doorEase = "duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0";

// Example card: the video sits behind two folding doors that swing open on hover (or tap on
// touch screens, Enter for keyboards) and the video plays while they are open.
export const DoorVideo = ({
  video,
  title,
  text,
  index,
}: {
  video: ShowcaseVideo;
  title: string;
  text: string;
  index: number;
}) => {
  const t = useTranslations("services.media");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  // Mouse opens on hover, so a mouse click must not toggle it shut again.
  const pointerType = useRef("");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open) element.play().catch(() => {});
    else element.pause();
  }, [open]);

  const door = cn(
    "absolute inset-y-0 w-1/2 transition-transform [backface-visibility:hidden] bg-neutral-100 dark:bg-neutral-800",
    "bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)] [background-size:14px_14px]",
    doorEase
  );

  return (
    <figure>
      <button
        type="button"
        aria-pressed={open}
        aria-label={t("playLabel", { title })}
        onPointerDown={(event) => (pointerType.current = event.pointerType)}
        onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
        onClick={() => {
          if (pointerType.current !== "mouse") setOpen((value) => !value);
          pointerType.current = "";
        }}
        onBlur={() => setOpen(false)}
        className="group relative block w-full aspect-video overflow-hidden rounded-3xl bg-black [perspective:1600px] ring-1 ring-black/5 dark:ring-white/10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] dark:focus-visible:ring-blue-400"
      >
        <video
          ref={ref}
          src={firstFrame(video.src)}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover"
        />
        <span
          aria-hidden="true"
          className={cn(door, "left-0 origin-left border-r border-neutral-200 dark:border-neutral-700")}
          style={{ transform: open ? "rotateY(-108deg)" : "rotateY(0deg)" }}
        >
          <span className="absolute top-4 left-5 font-display font-bold text-sm text-neutral-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </span>
        <span
          aria-hidden="true"
          className={cn(door, "right-0 origin-right border-l border-neutral-200 dark:border-neutral-700")}
          style={{ transform: open ? "rotateY(108deg)" : "rotateY(0deg)" }}
        >
          <span className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 whitespace-nowrap rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-semibold text-black dark:text-white shadow-brand transition-all duration-300",
            open ? "opacity-0 scale-90" : "opacity-100 scale-100"
          )}
        >
          <span className="hidden [@media(hover:hover)]:inline-flex items-center gap-2">
            <IconPointer className="size-4 text-[#1E40FF] dark:text-blue-400 motion-safe:animate-bounce" />
            {t("hoverHint")}
          </span>
          <span className="inline-flex [@media(hover:hover)]:hidden items-center gap-2">
            <IconHandClick className="size-4 text-[#1E40FF] dark:text-blue-400 motion-safe:animate-bounce" />
            {t("tapHint")}
          </span>
        </span>
      </button>
      <h3 className="mt-4 text-lg font-bold font-display text-black dark:text-white">{title}</h3>
      <p className="mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{text}</p>
      <Credit video={video} className="mt-2" />
    </figure>
  );
};
