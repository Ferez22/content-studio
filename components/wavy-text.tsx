"use client";
import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";

export default function WavyText({
  text,
  intervalMs = 10000,
  initialDelayMs = 2500,
}: {
  text: string;
  intervalMs?: number;
  initialDelayMs?: number;
}) {
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const wave = () =>
      controls.start((i: number) => ({
        y: [0, -5, 0],
        transition: { delay: i * 0.06, duration: 0.6, ease: "easeInOut" },
      }));
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      wave();
      interval = setInterval(wave, intervalMs);
    }, initialDelayMs);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [controls, reduceMotion, intervalMs, initialDelayMs]);

  return (
    <span aria-label={text} className="inline-flex">
      {Array.from(text).map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          aria-hidden
          custom={index}
          animate={controls}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
