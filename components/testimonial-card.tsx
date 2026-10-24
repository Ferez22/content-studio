"use client";
import React, { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  name: string;
  company: string;
  logo: string;
  headline: string;
  body: string[];
};

// Shows the headline quote; the full testimonial expands smoothly on request.
export const TestimonialCard = ({
  item,
  expandLabel,
  collapseLabel,
}: {
  item: Testimonial;
  expandLabel: string;
  collapseLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <figure className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 p-6 md:p-12" lang="en">
      <blockquote>
        <p className="text-xl md:text-4xl font-display font-bold tracking-tight max-w-4xl">
          &ldquo;{item.headline}&rdquo;
        </p>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={bodyId}
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6 md:pt-8 md:columns-2 gap-10 text-neutral-600 dark:text-neutral-300">
                {item.body.map((paragraph) => (
                  <p key={paragraph} className="mb-4 break-inside-avoid">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </blockquote>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E40FF] dark:text-blue-400 hover:underline underline-offset-4"
      >
        {open ? collapseLabel : expandLabel}
        <IconChevronDown
          className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <figcaption className="mt-6 flex flex-wrap items-center gap-4 border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <Image
          src={item.logo}
          alt=""
          width={746}
          height={112}
          className="h-6 w-auto brightness-0 dark:invert"
        />
        <div>
          <p className="font-bold">{item.name}</p>
          <p className="text-sm text-neutral-500">{item.company}</p>
        </div>
      </figcaption>
    </figure>
  );
};
