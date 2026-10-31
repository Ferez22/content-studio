"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconArrowsMaximize, IconX } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Reveal } from "@/components/reveal";

// A section holding an interactive demo that can be pinned: opening it (a link to #demo,
// such as the hero's "See the demo" button, or the expand button here) centres the demo on
// screen over a soft backdrop and stops the page from scrolling. Esc, the X in the top
// right corner or a click on the backdrop puts it back in place. The same demo element
// moves between the two states, so whatever the visitor clicked inside it is kept.
// No ancestor may have a transform or filter, or `fixed` would stop being the viewport.

const DEMO_ID = "demo";

export const DemoStage = ({
  title,
  intro,
  close,
  expand,
  children,
}: {
  title: string;
  intro: string;
  close: string;
  expand: string;
  children: React.ReactNode;
}) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState<number>();
  const slot = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  const open = useCallback(() => {
    const element = slot.current;
    if (!element) return;
    opener.current = document.activeElement;
    // Keep the demo's place in the page, and land the page on it for when it closes.
    setHeight(element.offsetHeight);
    element.scrollIntoView({ block: "center", behavior: "instant" });
    setActive(true);
  }, []);

  const shut = useCallback(() => {
    setActive(false);
    if (window.location.hash === `#${DEMO_ID}`) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
  }, []);

  // Open on a link to #demo, including arriving with it in the address.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === `#${DEMO_ID}`) open();
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [open]);

  // While pinned: no page scroll, Esc closes, focus on the close button.
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") shut();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, shut]);

  return (
    <section id={DEMO_ID} className="scroll-mt-28 pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Heading>{title}</Heading>
            <Subheading className="pt-6 max-w-2xl">{intro}</Subheading>
          </div>
          <button
            type="button"
            onClick={open}
            className="hidden items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 md:inline-flex"
          >
            <IconArrowsMaximize className="size-4" />
            {expand}
          </button>
        </Reveal>
        <div className="mt-10 md:mt-16" style={active ? { height } : undefined}>
          <AnimatePresence>
            {active && (
              <motion.div
                key="backdrop"
                aria-hidden="true"
                onClick={shut}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[80] bg-white/85 backdrop-blur-sm dark:bg-neutral-950/85"
              />
            )}
          </AnimatePresence>
          <div
            className={active ? "pointer-events-none fixed inset-0 z-[90] flex overflow-y-auto overscroll-contain px-3 pt-16 pb-3 md:p-8" : undefined}
          >
            <motion.div
              ref={slot}
              role={active ? "dialog" : undefined}
              aria-modal={active || undefined}
              aria-label={active ? title : undefined}
              // Glides between its place in the page and the centre of the screen.
              layout="position"
              transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              className={active ? "pointer-events-auto m-auto w-full max-w-7xl" : undefined}
            >
              {children}
            </motion.div>
          </div>
          {active && (
            <button
              ref={closeButton}
              type="button"
              onClick={shut}
              aria-label={close}
              className="fixed top-3 right-3 z-[95] flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 md:top-5 md:right-5"
            >
              <IconX className="size-5" />
            </button>
          )}
        </div>
      </Container>
    </section>
  );
};
