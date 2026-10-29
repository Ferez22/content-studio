"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Small pieces shared by the CRM demo screens.

export type Screen = "onboarding" | "records" | "analytics" | "agent" | "assistant" | "evals" | "settings";
export type ScreenProps = { go: (screen: Screen) => void };

export const ease = [0.22, 1, 0.36, 1] as const;

// A screen's blocks arrive one after another each time the screen opens.
export const Stagger = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    animate="shown"
    variants={{ shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Item = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
      shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Title row at the top of a screen.
export const ScreenHeader = ({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 md:px-6">
    <div className="flex min-w-0 items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">{title}</div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
);

export const Panel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900", className)}>
    {children}
  </div>
);

export const SmallButton = ({
  children,
  primary,
  className,
  ...rest
}: React.ComponentProps<"button"> & { primary?: boolean }) => (
  <button
    type="button"
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
      primary
        ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-500",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const Toggle = ({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={cn(
      "relative h-6 w-10 shrink-0 rounded-full transition-colors",
      on ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-700"
    )}
  >
    <span
      className={cn(
        "absolute top-1 left-1 size-4 rounded-full bg-white shadow-sm transition-transform dark:bg-neutral-900",
        on && "translate-x-4",
        !on && "dark:bg-neutral-300"
      )}
    />
  </button>
);

// Soft coloured labels: deal stages, results, statuses.
export type Tone = "neutral" | "blue" | "violet" | "amber" | "green" | "red";
const tones: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
  blue: "bg-blue-50 text-[#1E40FF] border-blue-100 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/20",
  violet: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/20",
  amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20",
  red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/20",
};

export const Badge = ({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) => (
  <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[tone], className)}>
    {children}
  </span>
);

export const Initials = ({ name, className }: { name: string; className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
      className
    )}
  >
    {name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")}
  </span>
);
