"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// A card that flips in 3D between two faces. The wrapper sets the perspective and
// takes the height of the visible face, so a short face never sits on top of the
// other one's empty space.
export const FlipCard = ({
  flipped,
  front,
  back,
  className,
}: {
  flipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState<{ front?: number; back?: number }>({});
  useEffect(() => {
    const observer = new ResizeObserver(() =>
      setHeights({ front: frontRef.current?.offsetHeight, back: backRef.current?.offsetHeight })
    );
    if (frontRef.current) observer.observe(frontRef.current);
    if (backRef.current) observer.observe(backRef.current);
    return () => observer.disconnect();
  }, []);
  const activeHeight = flipped ? heights.back : heights.front;

  // While the height animates, turn off the page's scroll anchoring: it would otherwise
  // scroll the page by the height change and push the visible face out of view.
  // Layout effect: it must apply before the browser lays out the flipped faces.
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const root = document.documentElement;
    root.style.overflowAnchor = "none";
    const timer = window.setTimeout(() => root.style.removeProperty("overflow-anchor"), 1500);
    return () => {
      window.clearTimeout(timer);
      root.style.removeProperty("overflow-anchor");
    };
  }, [flipped]);

  return (
    <motion.div
      className={cn("[overflow-y:clip] [overflow-clip-margin:2rem]", className)}
      style={{ perspective: 1800 }}
      initial={false}
      animate={activeHeight ? { height: activeHeight } : undefined}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 18 }}
    >
      <motion.div
        className="grid"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 }}
      >
        <Face visible={!flipped} innerRef={frontRef}>
          {front}
        </Face>
        <Face visible={flipped} back innerRef={backRef}>
          {back}
        </Face>
      </motion.div>
    </motion.div>
  );
};

const Face = ({
  visible,
  back = false,
  innerRef,
  children,
}: {
  visible: boolean;
  back?: boolean;
  innerRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) => (
  <div
    ref={innerRef}
    aria-hidden={!visible}
    inert={!visible}
    className="[grid-area:1/1] self-start"
    style={{
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: back ? "rotateY(180deg)" : undefined,
      // Hide the turned-away face at mid-flip: iframes can bleed through backface-visibility in Safari.
      visibility: visible ? "visible" : "hidden",
      transition: "visibility 0s linear 0.22s",
    }}
  >
    {children}
  </div>
);
