"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { IconFileText, IconFileSearch, IconTicket, IconUserCheck } from "@tabler/icons-react";
import { ToolCallCard, ToolCallGroup } from "@/components/ui/tool-call-card-clean";

// Hero of the chatbots page: an IT support question, the assistant calling its tools one
// after another, then the answer with its source. Loops while on screen, holds the answer
// while the pointer is over it (so opened tool cards stay put), and shows the finished
// conversation to people who prefer reduced motion.

type Tool = { name: string; summary: string; args: unknown; result: unknown };

const icons = [IconFileSearch, IconUserCheck, IconTicket];
// How long each tool runs, how long the question waits, how long the answer stays.
const RUN = [1600, 1200, 900];
const ASK = 1000;
const HOLD = 6500;

const enter = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export const ChatbotDemo = () => {
  const t = useTranslations("servicePages.chatbots.demo");
  const tools = t.raw("tools") as Tool[];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  // 0: question only, 1..n: tool n running, n + 1: answer.
  const [step, setStep] = useState(0);
  const [startedAt, setStartedAt] = useState<number[]>([]);
  useEffect(() => setMounted(true), []);

  const still = mounted && Boolean(reduced);
  const done = tools.length + 1;
  const shown = still ? done : step;

  useEffect(() => {
    if (still || !inView || (step === done && hovered)) return;
    const delay = step === 0 ? ASK : step === done ? HOLD : RUN[step - 1];
    const timer = window.setTimeout(() => {
      const next = step === done ? 0 : step + 1;
      if (next >= 1 && next <= tools.length) {
        setStartedAt((times) => [...times.slice(0, next - 1), Date.now()]);
      }
      setStep(next);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [step, done, still, inView, hovered, tools.length]);

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="relative flex flex-col justify-end gap-4 min-h-[28rem] md:min-h-[34rem] rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-4 pt-16 md:p-8 md:pt-20 overflow-hidden"
    >
      <span className="absolute top-4 left-4 md:top-6 md:left-8 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {t("label")}
      </span>

      <p className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2.5 text-sm md:text-base">
        {t("question")}
      </p>

      {shown >= 1 && (
        <motion.div {...(still ? {} : enter)}>
          <ToolCallGroup defaultOpen label={t("toolsDone")} runningLabel={t("toolsRunning")}>
            {tools.slice(0, Math.min(shown, tools.length)).map((tool, index) => {
              const Icon = icons[index];
              const finished = shown > index + 1;
              return (
                <ToolCallCard
                  key={tool.name}
                  name={tool.name}
                  summary={tool.summary}
                  icon={<Icon />}
                  status={finished ? "success" : "running"}
                  startedAt={startedAt[index]}
                  duration={finished ? RUN[index] : undefined}
                  args={tool.args}
                  result={finished ? tool.result : undefined}
                />
              );
            })}
          </ToolCallGroup>
        </motion.div>
      )}

      {shown === done && (
        <motion.div
          {...(still ? {} : enter)}
          className="self-start max-w-[92%] rounded-2xl rounded-bl-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm md:text-base text-neutral-700 dark:text-neutral-200"
        >
          <p>{t("answer")}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#1E40FF] dark:text-blue-400">
            <IconFileText className="size-3.5 shrink-0" />
            {t("source")}
          </p>
        </motion.div>
      )}
    </div>
  );
};
