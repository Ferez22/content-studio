"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const Figures = ({
  items,
  className,
}: {
  items: { value: string; label: string }[];
  className?: string;
}) => {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-y border-neutral-200 dark:border-neutral-800 py-6 md:py-8",
        // Three figures always share one row, even on phones.
        items.length === 3 && "grid-cols-3 md:grid-cols-3 gap-3",
        className
      )}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ y: -10, opacity: 0, filter: "blur(10px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse justify-end gap-1"
        >
          <dt className={cn("text-neutral-500 dark:text-neutral-400", items.length === 3 ? "text-xs sm:text-sm" : "text-sm")}>
            {item.label}
          </dt>
          <dd className={cn("font-display font-bold tracking-tight md:text-4xl", items.length === 3 ? "text-xl sm:text-2xl" : "text-2xl")}>
            {item.value}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
};
