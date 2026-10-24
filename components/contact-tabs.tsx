"use client";
import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconCalendarEvent, IconMail } from "@tabler/icons-react";
import { ContactForm } from "./contact-form";
import { CalEmbed } from "./cal-embed";
import { cn } from "@/lib/utils";

type Tab = "call" | "message";

// Two centred tabs; switching flips one card in 3D between the calendar (front) and the form (back).
export const ContactTabs = ({
  labels,
  calendarTitle,
}: {
  labels: Record<Tab, string>;
  calendarTitle: string;
}) => {
  const [tab, setTab] = useState<Tab>("call");
  const reduceMotion = useReducedMotion();
  const flipped = tab === "message";
  const icons: Record<Tab, React.ReactNode> = {
    call: <IconCalendarEvent className="size-4 shrink-0" />,
    message: <IconMail className="size-4 shrink-0" />,
  };

  return (
    <div>
      <div role="tablist" className="flex justify-center">
        <div className="inline-flex flex-col sm:flex-row gap-1 rounded-2xl sm:rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-1">
          {(["call", "message"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-xl sm:rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200",
                tab === key
                  ? "text-white dark:text-black"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              )}
            >
              {tab === key && (
                <motion.span
                  layoutId="contact-tab"
                  className="absolute inset-0 rounded-xl sm:rounded-full bg-black dark:bg-white shadow-brand"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {icons[key]}
                {labels[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-10 mx-auto max-w-4xl" style={{ perspective: 1800 }}>
        <motion.div
          className="grid"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 }}
        >
          <Face visible={!flipped}>
            <div>
              <CalEmbed title={calendarTitle} />
            </div>
          </Face>
          <Face visible={flipped} back>
            <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-4 md:p-10">
              <div className="max-w-2xl mx-auto">
                <ContactForm />
              </div>
            </div>
          </Face>
        </motion.div>
      </div>
    </div>
  );
};

const Face = ({
  visible,
  back = false,
  children,
}: {
  visible: boolean;
  back?: boolean;
  children: React.ReactNode;
}) => (
  <div
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
