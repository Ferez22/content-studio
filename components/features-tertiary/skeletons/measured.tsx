"use client";

import { IconClock } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const widths = ["100%", "55%", "25%"];

export const SkeletonMeasured = () => {
  const t = useTranslations("visuals.measured");
  const rows = t.raw("rows") as string[];
  return (
    <div className="flex-1 rounded-t-3xl flex flex-col bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 max-w-[20rem] lg:max-w-sm mx-auto w-full h-full absolute inset-x-0 top-4 p-2">
      <div className="shadow-black/10 border bg-white dark:bg-neutral-900 border-transparent ring-1 rounded-[16px] ring-black/10 flex flex-col gap-4 p-4 flex-1">
        <div className="flex items-center gap-2">
          <IconClock className="size-4" />
          <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            {t("title")}
          </p>
        </div>
        {rows.map((row, index) => (
          <div key={row} className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{row}</p>
            <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: widths[index] }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
                viewport={{ once: true }}
                className={cn(
                  "h-full rounded-full",
                  index === 0 ? "bg-neutral-400" : "bg-green-500"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
