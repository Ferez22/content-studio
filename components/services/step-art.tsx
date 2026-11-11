import React from "react";
import { cn } from "@/lib/utils";

// Small symbolic illustrations for the numbered "How we work" cards. Line art in the
// text colour with one royal blue accent each, white fills that follow the theme, and one
// quiet loop per drawing (classes in globals.css, off under reduced motion). Decorative only.

type ArtProps = { className?: string };

const Svg = ({ className, children }: ArtProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 240 120"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn("text-neutral-700 dark:text-neutral-300", className)}
  >
    {children}
  </svg>
);

const paper = "fill-white dark:fill-neutral-900";
const accent = "text-[#1E40FF] dark:text-blue-400";

/** Diagnostic: a magnifying glass sweeping over a process of three steps. */
export const DiagnoseArt = ({ className }: ArtProps) => (
  <Svg className={className}>
    <path d="M58 60h42M140 60h42" strokeDasharray="3 4" />
    {[18, 100, 182].map((x) => (
      <g key={x}>
        <rect x={x} y={48} width={40} height={24} rx={6} className={paper} />
        <path d={`M${x + 9} 57h22M${x + 9} 63h14`} />
      </g>
    ))}
    <g className={cn("step-loupe", accent)}>
      <circle cx={120} cy={56} r={24} strokeWidth={2.5} fill="currentColor" fillOpacity={0.08} />
      <path d="M137 73l15 15" strokeWidth={5} />
    </g>
  </Svg>
);

/** Transformation: documents go into a machine and come out as a packed box. */
export const TransformArt = ({ className }: ArtProps) => (
  <Svg className={className}>
    <path d="M10 104h220" strokeDasharray="6 8" className="step-belt" />
    <rect x={14} y={30} width={26} height={34} rx={3} className={paper} />
    <rect x={22} y={40} width={26} height={34} rx={3} className={paper} />
    <path d="M28 50h14M28 56h14M28 62h9" />
    <path d="M56 62h20m-5-5l5 5-5 5" />
    <rect x={82} y={30} width={76} height={64} rx={10} className={paper} />
    <path d="M94 40h6M104 40h6" />
    <g className={accent}>
      <circle cx={120} cy={66} r={14} strokeWidth={3} strokeDasharray="4 3.3" className="step-gear" />
      <circle cx={120} cy={66} r={4} fill="currentColor" />
    </g>
    <path d="M164 62h20m-5-5l5 5-5 5" />
    <rect x={190} y={46} width={36} height={34} rx={4} className={paper} />
    <path d="M190 56h36" />
    <path d="M208 46v20" strokeWidth={3} className={accent} />
  </Svg>
);

/** From pilot to scale: one block, a multiplier, then a grid of the same block. */
export const ScaleArt = ({ className }: ArtProps) => {
  const cells = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({ row, col })));
  return (
    <Svg className={className}>
      <g className={accent}>
        <rect x={26} y={46} width={28} height={28} rx={6} strokeWidth={2.5} fill="currentColor" fillOpacity={0.12} />
      </g>
      <path d="M86 51l18 18M104 51l-18 18" strokeWidth={3} />
      {cells.map(({ row, col }, index) => (
        <rect
          key={index}
          x={142 + col * 26}
          y={22 + row * 26}
          width={18}
          height={18}
          rx={4}
          className={cn("step-pop", index === 4 ? cn(accent, "fill-current/15") : paper)}
          style={{ "--i": index } as React.CSSProperties}
        />
      ))}
    </Svg>
  );
};

/** Training and governance: a classroom with a teacher, a board and two students. */
export const TrainArt = ({ className }: ArtProps) => (
  <Svg className={className}>
    <rect x={84} y={12} width={124} height={56} rx={5} className={paper} />
    <path d="M96 28h50M96 38h36M96 48h44" />
    <path d="M158 58l11-10 9 4 16-16" strokeWidth={2.5} pathLength={1} className={cn("step-draw", accent)} />
    <circle cx={50} cy={50} r={8} className={paper} />
    <path d="M36 98V76a14 14 0 0 1 28 0v22" className={paper} />
    <path d="M62 70l26-26" strokeWidth={2.5} className={accent} />
    {[132, 176].map((x) => (
      <g key={x}>
        <circle cx={x} cy={88} r={6} className={paper} />
        <path d={`M${x - 11} 108a11 11 0 0 1 22 0`} className={paper} />
      </g>
    ))}
    <path d="M110 108h90" />
  </Svg>
);
