import React from "react";
import { useTranslations } from "next-intl";
import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconLock,
  IconShieldCheck,
  IconShoppingBag,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Animated mockups for the categories that have no service-specific one. Same
// tilted-window style as the skeletons in components/features*/skeletons.

const tilt = { transform: "rotateY(20deg) rotateX(20deg) rotateZ(-20deg)" };

const Window = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div
    aria-hidden="true"
    style={tilt}
    className={cn(
      "relative max-w-[85%] w-full mx-auto my-auto translate-x-6 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl p-3 mask-radial-from-50% mask-b-from-50%",
      className
    )}
  >
    {children}
  </div>
);

const Bar = ({ className }: { className?: string }) => (
  <div className={cn("h-2 rounded-full bg-neutral-200 dark:bg-neutral-700", className)} />
);

const pop = (index: number) => ({ animationDelay: `${index * 0.25}s` });

export const WebsiteVisual = () => {
  const t = useTranslations("visuals.website");
  return (
    <Window>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        ))}
        <div className="ml-2 flex-1 flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1">
          <IconLock className="size-3 text-neutral-400" />
          <span className="text-[10px] text-neutral-500">{t("url")}</span>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 visual-pop" style={pop(0)}>
        <Bar className="w-2/3 h-3 bg-neutral-300 dark:bg-neutral-600" />
        <Bar className="w-1/2 mt-2" />
        <div className="mt-3 h-5 w-20 rounded-md bg-[#1E40FF] dark:bg-blue-400" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-2 visual-pop"
            style={pop(index)}
          >
            <div className="aspect-square rounded-md bg-neutral-100 dark:bg-neutral-800" />
            <Bar className="mt-2 w-3/4 h-1.5" />
            <Bar className="mt-1 w-1/3 h-1.5 bg-neutral-300 dark:bg-neutral-600" />
          </div>
        ))}
      </div>
      <div
        className="absolute top-12 right-5 flex items-center gap-1 rounded-full bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 text-[10px] font-semibold shadow-lg visual-pop"
        style={pop(4)}
      >
        <IconShoppingBag className="size-3" />
        {t("order")}
      </div>
    </Window>
  );
};

export const SoftwareVisual = () => {
  const t = useTranslations("visuals.software");
  const columns = t.raw("columns") as string[];
  return (
    <Window className="[--gap:0.5rem]">
      <p className="text-sm text-black dark:text-white">{t("title")}</p>
      <div className="relative mt-3 grid grid-cols-3 gap-(--gap)">
        {columns.map((column, index) => (
          <div key={column} className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1.5 min-h-36">
            <p className="text-[10px] font-semibold text-neutral-500 px-1">{column}</p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {Array.from({ length: 3 - index }).map((_, card) => (
                <div
                  key={card}
                  className="rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-1.5"
                >
                  <Bar className="w-3/4 h-1.5" />
                  <Bar className="mt-1 w-1/2 h-1.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* The deal moving from the first column to the last. */}
        <div className="visual-travel absolute left-0 bottom-1.5 w-[calc((100%-2*var(--gap))/3)] px-1.5">
          <div className="rounded-md bg-white dark:bg-neutral-900 border border-[#1E40FF] dark:border-blue-400 shadow-brand p-1.5">
            <Bar className="w-3/4 h-1.5 bg-[#1E40FF]/40 dark:bg-blue-400/40" />
            <Bar className="mt-1 w-1/2 h-1.5" />
          </div>
        </div>
      </div>
    </Window>
  );
};

export const BrandVisual = () => {
  const t = useTranslations("visuals.brand");
  const swatches = [
    "bg-black",
    "bg-neutral-500",
    "bg-neutral-200 dark:bg-neutral-100",
    "bg-[#1E40FF] dark:bg-blue-400",
  ];
  return (
    <Window>
      <p className="text-sm text-black dark:text-white">{t("title")}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center visual-pop"
          style={pop(0)}
        >
          <div className="size-14 rounded-full border-[6px] border-black dark:border-white flex items-end justify-end">
            <span className="size-3 rounded-full bg-[#1E40FF] dark:bg-blue-400 translate-x-2 translate-y-1" />
          </div>
        </div>
        <div
          className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 flex flex-col justify-between visual-pop"
          style={pop(1)}
        >
          <span className="font-display font-bold text-4xl leading-none text-black dark:text-white">
            Aa
          </span>
          <div>
            <Bar className="w-full h-1.5" />
            <Bar className="mt-1 w-2/3 h-1.5" />
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {swatches.map((swatch, index) => (
          <div
            key={swatch}
            className={cn("h-8 rounded-lg ring-1 ring-black/5 dark:ring-white/10 visual-pop", swatch)}
            style={pop(index + 2)}
          />
        ))}
      </div>
    </Window>
  );
};

export const SecurityVisual = () => {
  const t = useTranslations("visuals.security");
  const checks = t.raw("checks") as { label: string; status: "ok" | "warning" }[];
  return (
    <Window>
      <div className="flex items-center gap-2">
        <IconShieldCheck className="size-4 text-[#1E40FF] dark:text-blue-400" />
        <p className="text-sm text-black dark:text-white">{t("title")}</p>
      </div>
      <div className="relative mt-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <div className="visual-scan absolute inset-x-0 h-8 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#1E40FF]/15 to-transparent dark:via-blue-400/20 pointer-events-none" />
        {checks.map((check, index) => (
          <div
            key={check.label}
            className="flex items-center justify-between px-3 py-2.5 border-b last:border-b-0 border-neutral-200 dark:border-neutral-700"
          >
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {check.label}
            </span>
            <span className="visual-pop" style={pop(index + 1)}>
              {check.status === "ok" ? (
                <IconCircleCheckFilled className="size-4 text-green-500" />
              ) : (
                <IconAlertTriangleFilled className="size-4 text-yellow-500" />
              )}
            </span>
          </div>
        ))}
      </div>
    </Window>
  );
};
