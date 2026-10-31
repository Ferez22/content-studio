"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { IconCalendarEvent, IconMail } from "@tabler/icons-react";
import { ContactForm } from "./contact-form";
import { CalEmbed } from "./cal-embed";
import { FlipCard } from "./ui/flip-card";
import { cn } from "@/lib/utils";

type Tab = "call" | "message";

// Two centred tabs; switching flips a FlipCard between the calendar (front) and the form (back).
export const ContactTabs = ({
  labels,
  calendarTitle,
}: {
  labels: Record<Tab, string>;
  calendarTitle: string;
}) => {
  const [tab, setTab] = useState<Tab>("call");
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
                  className="absolute inset-0 rounded-xl sm:rounded-full bg-black dark:bg-white"
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

      <FlipCard
        className="mt-8 md:mt-10 mx-auto max-w-4xl"
        flipped={flipped}
        front={
          <div>
            <CalEmbed title={calendarTitle} />
          </div>
        }
        back={
          <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-4 md:p-10">
            <div className="max-w-2xl mx-auto">
              <ContactForm />
            </div>
          </div>
        }
      />
    </div>
  );
};

