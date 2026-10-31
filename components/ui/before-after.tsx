"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { IconArrowsHorizontal } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Before/after comparison: two full-size layers stacked, the top ("after") one clipped with
// inset(0 R% 0 0). Dragging the handle (or clicking anywhere, or the arrow keys) sets the
// split; a thin divider and a round handle follow it. Vertical page scrolling stays free on
// touch screens: only the handle captures the pointer. The first time it scrolls into view,
// the handle sweeps right, left and back to the middle once, to show that it can be dragged.
export const BeforeAfter = ({
  before,
  after,
  beforeLabel,
  afterLabel,
  handleLabel,
  className,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel: string;
  afterLabel: string;
  handleLabel: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);
  const touched = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reduceMotion) return;
    // 50 -> 78 -> 22 -> 50 over 2.2 s, smoothed between the stops; any touch stops it.
    const stops = [50, 78, 22, 50];
    const duration = 2200;
    let frame = 0;
    const start = performance.now() + 300;
    const tick = (now: number) => {
      if (touched.current) return;
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const segment = Math.min(stops.length - 2, Math.floor(p * (stops.length - 1)));
      const local = p * (stops.length - 1) - segment;
      const eased = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
      setPct(stops[segment] + (stops[segment + 1] - stops[segment]) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion]);

  const setFromPointer = (clientX: number) => {
    touched.current = true;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPct(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const label = "absolute bottom-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm";

  return (
    <div
      ref={ref}
      onPointerDown={(event) => event.pointerType === "mouse" && setFromPointer(event.clientX)}
      className={cn("relative select-none overflow-hidden touch-pan-y", className)}
    >
      <div className="relative">
        {before}
        <span className={cn(label, "right-3")}>{beforeLabel}</span>
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        {after}
        <span className={cn(label, "left-3")}>{afterLabel}</span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.1)]" style={{ left: `${pct}%` }} />
      <button
        type="button"
        role="slider"
        aria-label={handleLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        onPointerDown={(event) => {
          event.stopPropagation();
          touched.current = true;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => dragging.current && setFromPointer(event.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={(event) => {
          touched.current = true;
          if (event.key === "ArrowLeft") setPct((value) => Math.max(0, value - 5));
          if (event.key === "ArrowRight") setPct((value) => Math.min(100, value + 5));
        }}
        className="absolute top-1/2 z-20 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white text-black ring-1 ring-black/10 flex items-center justify-center touch-none cursor-ew-resize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF]"
        style={{ left: `${pct}%` }}
      >
        <IconArrowsHorizontal className="size-5" />
      </button>
    </div>
  );
};
