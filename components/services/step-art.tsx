"use client";
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

// Small motion graphics for the numbered "How we work" cards. Each one plays a short story
// in a loop (UI cards in the site's style, one royal blue accent), only while it is on screen.
// Reduced motion, or off screen: the final frame, still. Decorative only (aria-hidden).

type ArtProps = { className?: string };

const ease = [0.65, 0, 0.35, 1] as const;

// One looping keyframe track. When the drawing should not play, it rests on `rest`.
const useLoop = (duration: number) => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const still = useReducedMotion();
  const play = inView && !still;
  const track = <T,>(values: T[], times: number[], rest: T, options: Transition = {}) => ({
    animate: play ? values : rest,
    transition: play
      ? ({ duration, times, repeat: Infinity, ease, ...options } as Transition)
      : ({ duration: 0 } as Transition),
  });
  return { ref, play, track };
};

// Theme-aware fills and strokes.
const card = "fill-white stroke-neutral-200 dark:fill-neutral-900 dark:stroke-neutral-700";
const skeleton = "fill-neutral-200 dark:fill-neutral-700";
const line = "stroke-neutral-300 dark:stroke-neutral-600";
const accentFill = "fill-[#1E40FF] dark:fill-blue-400";
const accentStroke = "stroke-[#1E40FF] dark:stroke-blue-400";
const accentTint = "fill-[#1E40FF]/10 dark:fill-blue-400/15";

const Frame = React.forwardRef<SVGSVGElement, ArtProps & { id: string; children: React.ReactNode }>(
  ({ className, id, children }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 320 160"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>
      {children}
    </svg>
  )
);
Frame.displayName = "Frame";

const Check = ({ x, y, size = 1 }: { x: number; y: number; size?: number }) => (
  <path
    d={`M${x - 3.5 * size} ${y}l${2.5 * size} ${2.5 * size}l${4.5 * size} ${-5 * size}`}
    className="stroke-white dark:stroke-neutral-900"
    strokeWidth={2}
  />
);

// A small UI card: icon square and two text lines.
const Chip = ({ x, y, filter }: { x: number; y: number; filter: string }) => (
  <g>
    <rect x={x} y={y} width={72} height={44} rx={10} className={card} filter={filter} />
    <rect x={x + 10} y={y + 11} width={14} height={14} rx={4} className={skeleton} />
    <rect x={x + 31} y={y + 12} width={31} height={5} rx={2.5} className={skeleton} />
    <rect x={x + 31} y={y + 21} width={20} height={5} rx={2.5} className={skeleton} />
    <rect x={x + 10} y={y + 32} width={52} height={4} rx={2} className={skeleton} opacity={0.6} />
  </g>
);

/** 01 Diagnostic: a magnifier reviews three steps and picks the priority one. */
export const DiagnoseArt = ({ className }: ArtProps) => {
  const { ref, track } = useLoop(7);
  const chips = [20, 124, 228];
  const times = [0, 0.12, 0.26, 0.56, 0.7, 0.84, 1];
  const highlights = [
    track([1, 0, 0, 0, 0, 0, 1], times, 0),
    track([0, 0, 1, 1, 1, 1, 0], times, 1),
    track([0, 0, 0, 0, 1, 1, 0], times, 0),
  ];
  const badge = track([0, 0, 0, 1, 1, 0, 0], [0, 0.26, 0.3, 0.36, 0.9, 0.96, 1], 1);
  const loupe = track([56, 56, 160, 160, 264, 264, 56], times, 160);
  return (
    <Frame ref={ref} id="diagnose" className={className}>
      <path d="M92 80h32M196 80h32" className={line} strokeWidth={1.5} strokeDasharray="3 4" />
      {chips.map((x) => (
        <Chip key={x} x={x} y={58} filter="url(#diagnose-shadow)" />
      ))}
      {/* Highlight on the step under the magnifier; the middle one, the priority, stays selected. */}
      {chips.map((x, index) => (
        <motion.rect
          key={x}
          x={x}
          y={58}
          width={72}
          height={44}
          rx={10}
          strokeWidth={1.75}
          className={cn(accentTint, accentStroke)}
          initial={{ opacity: index === 1 ? 1 : 0 }}
          animate={{ opacity: highlights[index].animate }}
          transition={highlights[index].transition}
        />
      ))}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: badge.animate, opacity: badge.animate }}
        transition={badge.transition}
      >
        <circle cx={196} cy={58} r={9} className={accentFill} />
        <Check x={196} y={58} />
      </motion.g>
      <motion.g initial={{ x: 160, y: 76 }} animate={{ x: loupe.animate, y: 76 }} transition={loupe.transition}>
        <circle r={30} strokeWidth={3} className={cn(accentStroke, "fill-[#1E40FF]/5 dark:fill-blue-400/10")} />
        <path d="M21 21l14 14" strokeWidth={7} className={accentStroke} />
      </motion.g>
    </Frame>
  );
};

/** 02 Transformation: a document goes into the machine, a packed box comes out. */
export const TransformArt = ({ className }: ArtProps) => {
  const { ref, play, track } = useLoop(5);
  const doc = track([28, 28, 124, 124], [0, 0.08, 0.36, 1], 124);
  const docFade = track([0, 1, 1, 0, 0], [0, 0.06, 0.36, 0.4, 1], 0);
  const progress = track([0, 0, 1, 1, 0], [0, 0.36, 0.64, 0.95, 1], 1);
  const box = track([160, 160, 250, 250], [0, 0.62, 0.84, 1], 250);
  const boxFade = track([0, 0, 1, 1, 0], [0, 0.6, 0.62, 0.92, 1], 1);
  return (
    <Frame ref={ref} id="transform" className={className}>
      <motion.path
        d="M8 132h304"
        className={line}
        strokeWidth={1.5}
        strokeDasharray="6 8"
        animate={play ? { strokeDashoffset: [0, -28] } : { strokeDashoffset: 0 }}
        transition={play ? { duration: 1.6, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      />
      {/* Waiting documents */}
      <rect x={14} y={70} width={32} height={40} rx={6} className={card} />
      <rect x={20} y={64} width={32} height={40} rx={6} className={card} filter="url(#transform-shadow)" />
      <rect x={27} y={74} width={18} height={4} rx={2} className={skeleton} />
      <rect x={27} y={82} width={14} height={4} rx={2} className={skeleton} />
      {/* Document on its way in */}
      <motion.g
        initial={{ x: 124, opacity: 0 }}
        animate={{ x: doc.animate, opacity: docFade.animate }}
        transition={{ x: doc.transition, opacity: docFade.transition }}
      >
        <rect x={0} y={84} width={26} height={32} rx={5} className={card} filter="url(#transform-shadow)" />
        <rect x={6} y={92} width={14} height={3.5} rx={1.75} className={accentFill} />
        <rect x={6} y={99} width={10} height={3.5} rx={1.75} className={skeleton} />
      </motion.g>
      {/* Packed box on its way out */}
      <motion.g
        initial={{ x: 250, opacity: 1 }}
        animate={{ x: box.animate, opacity: boxFade.animate }}
        transition={{ x: box.transition, opacity: boxFade.transition }}
      >
        <rect x={0} y={80} width={44} height={40} rx={8} className={cn(accentTint, accentStroke)} strokeWidth={1.75} filter="url(#transform-shadow)" />
        <path d="M0 94h44" className={accentStroke} strokeWidth={1.5} />
        <rect x={17} y={80} width={10} height={14} className={accentFill} />
      </motion.g>
      {/* Machine */}
      <rect x={110} y={36} width={100} height={88} rx={16} className={card} filter="url(#transform-shadow)" />
      <rect x={124} y={50} width={72} height={6} rx={3} className={skeleton} />
      <motion.rect
        x={124}
        y={50}
        width={72}
        height={6}
        rx={3}
        className={accentFill}
        style={{ transformBox: "fill-box", transformOrigin: "left" }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: progress.animate }}
        transition={progress.transition}
      />
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={play ? { rotate: 360 } : { rotate: 0 }}
        transition={play ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      >
        <circle cx={160} cy={92} r={17} strokeWidth={6} strokeDasharray="5.3 3.6" className={accentStroke} />
        <circle cx={160} cy={92} r={11} className={accentTint} />
      </motion.g>
      <circle cx={160} cy={92} r={4} className={accentFill} />
    </Frame>
  );
};

/** 03 From pilot to scale: the pilot is validated, then the grid fills in a wave. */
export const ScaleArt = ({ className }: ArtProps) => {
  const { ref, track } = useLoop(5.5);
  const pilot = track([0.6, 1, 1, 1, 0.6], [0, 0.08, 0.12, 0.92, 1], 1);
  const pilotFade = track([0, 1, 1, 1, 0], [0, 0.08, 0.12, 0.92, 1], 1);
  const check = track([0, 0, 1, 1, 0], [0, 0.1, 0.2, 0.92, 1], 1);
  const multiply = track([0, 0, 1, 1, 0], [0, 0.18, 0.24, 0.92, 1], 1);
  const cells = [0, 1, 2].flatMap((row) => [0, 1, 2, 3].map((col) => ({ row, col })));
  return (
    <Frame ref={ref} id="scale" className={className}>
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: pilot.animate, opacity: pilotFade.animate }}
        transition={pilot.transition}
      >
        <rect x={28} y={56} width={48} height={48} rx={12} strokeWidth={2} className={cn(accentTint, accentStroke)} filter="url(#scale-shadow)" />
      </motion.g>
      <motion.path
        d="M43 80l7 7 12-13"
        strokeWidth={3}
        className={accentStroke}
        initial={{ pathLength: 1 }}
        animate={{ pathLength: check.animate }}
        transition={check.transition}
      />
      <motion.path
        d="M106 72l16 16M122 72l-16 16"
        strokeWidth={3}
        className="stroke-neutral-400 dark:stroke-neutral-500"
        initial={{ opacity: 1 }}
        animate={{ opacity: multiply.animate }}
        transition={multiply.transition}
      />
      {cells.map(({ row, col }) => {
        const start = 0.26 + (row + col) * 0.07;
        const cellTimes = [0, start, start + 0.08, 0.92, 1];
        const appear = track([0, 0, 1, 1, 0], cellTimes, 1);
        const grow = track([0.7, 0.7, 1, 1, 0.7], cellTimes, 1);
        const flash = track([0, 0, 1, 0, 0], [0, start, start + 0.08, start + 0.22, 1], 0);
        const x = 150 + col * 38;
        const y = 30 + row * 36;
        return (
          <motion.g
            key={`${row}-${col}`}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: appear.animate, scale: grow.animate }}
            transition={appear.transition}
          >
            <rect x={x} y={y} width={28} height={28} rx={7} className={card} filter="url(#scale-shadow)" />
            <rect x={x + 7} y={y + 12} width={14} height={4} rx={2} className={skeleton} />
            <motion.rect
              x={x}
              y={y}
              width={28}
              height={28}
              rx={7}
              strokeWidth={1.75}
              className={cn(accentTint, accentStroke)}
              initial={{ opacity: 0 }}
              animate={{ opacity: flash.animate }}
              transition={flash.transition}
            />
          </motion.g>
        );
      })}
    </Frame>
  );
};

/** 04 Training and governance: a lesson on a board, results rise, a governance badge. */
export const TrainArt = ({ className }: ArtProps) => {
  const { ref, play, track } = useLoop(6);
  const bars = [
    { x: 148, h: 18 },
    { x: 170, h: 28 },
    { x: 192, h: 24 },
    { x: 214, h: 38 },
  ];
  const trend = track([0, 0, 1, 1, 0], [0, 0.42, 0.62, 0.92, 1], 1);
  const badge = track([0, 0, 1, 1, 0], [0, 0.64, 0.72, 0.92, 1], 1);
  return (
    <Frame ref={ref} id="train" className={className}>
      {/* Board */}
      <rect x={124} y={18} width={172} height={98} rx={12} className={card} filter="url(#train-shadow)" />
      <rect x={140} y={32} width={56} height={6} rx={3} className={skeleton} />
      <path d="M140 104h104" className={line} strokeWidth={1.5} />
      {bars.map((bar, index) => {
        const grow = track([0, 0, 1, 1, 0], [0, 0.06 + index * 0.08, 0.2 + index * 0.08, 0.92, 1], 1);
        return (
          <motion.rect
            key={bar.x}
            x={bar.x}
            y={104 - bar.h}
            width={14}
            height={bar.h}
            rx={3}
            className={index === bars.length - 1 ? accentFill : skeleton}
            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: grow.animate }}
            transition={grow.transition}
          />
        );
      })}
      <motion.path
        d="M155 80l22-10 22 4 22-16"
        strokeWidth={2.5}
        className={accentStroke}
        initial={{ pathLength: 1 }}
        animate={{ pathLength: trend.animate }}
        transition={trend.transition}
      />
      {/* Governance badge: a shield with a check */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: badge.animate, opacity: badge.animate }}
        transition={badge.transition}
      >
        <path d="M268 30l14 5v9c0 8-6 13-14 16-8-3-14-8-14-16v-9z" className={accentFill} />
        <Check x={268} y={45} />
      </motion.g>
      {/* Teacher with a pointer that moves along the chart */}
      <circle cx={72} cy={62} r={10} className="fill-neutral-700 dark:fill-neutral-300" />
      <rect x={58} y={76} width={28} height={50} rx={14} className="fill-neutral-700 dark:fill-neutral-300" />
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "84px 86px" }}
        animate={play ? { rotate: [0, -10, -4, -12, 0] } : { rotate: -6 }}
        transition={play ? { duration: 6, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, ease } : { duration: 0 }}
      >
        <path d="M84 86l56-22" strokeWidth={3} className={accentStroke} />
      </motion.g>
      {/* Two students */}
      {[176, 240].map((x) => (
        <g key={x}>
          <circle cx={x} cy={134} r={7} className="fill-neutral-400 dark:fill-neutral-500" />
          <path d={`M${x - 13} 158a13 13 0 0 1 26 0z`} className="fill-neutral-300 dark:fill-neutral-600" />
        </g>
      ))}
    </Frame>
  );
};
