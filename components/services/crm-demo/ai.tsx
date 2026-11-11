"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import {
  IconArrowUp,
  IconCheck,
  IconChevronDown,
  IconCircleCheck,
  IconFlask,
  IconLoader2,
  IconMicrophone,
  IconPlayerPlay,
  IconPlus,
  IconPlug,
  IconRefresh,
  IconSparkles,
  IconTopologyStar3,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Badge, ease, Item, Panel, ScreenHeader, SmallButton, Stagger, type Tone } from "./ui";

const T = "servicePages.custom-software.demo";

/* ---------- Agent run: the weekly pipeline review ---------- */

type Step = { title: string; text: string; tool: string };
const STEP_MS = 1500;
const APPROVAL = 3;

export const AgentRun = () => {
  const t = useTranslations(`${T}.agent`);
  const steps = t.raw("steps") as Step[];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  // `step` is the one running; steps.length means the run is done.
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const waiting = step === APPROVAL && !decision;
  const done = step >= steps.length;

  useEffect(() => {
    if (!inView || waiting || done) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [inView, waiting, done, step]);

  const restart = () => {
    setStep(0);
    setDecision(null);
  };
  const status: { label: string; tone: Tone } = done
    ? { label: t("done"), tone: "green" }
    : waiting
      ? { label: t("waiting"), tone: "amber" }
      : { label: t("running"), tone: "blue" };

  return (
    <div ref={ref}>
      <Stagger>
        <Item>
          <ScreenHeader
            title={
              <>
                <span className="hidden text-sm font-normal text-neutral-400 sm:inline">{t("runs")} /</span>
                <span className="truncate">{t("title")}</span>
                <Badge tone={status.tone}>{status.label}</Badge>
              </>
            }
          >
            {done && (
              <SmallButton onClick={restart}>
                <IconRefresh className="size-3.5" />
                {t("again")}
              </SmallButton>
            )}
          </ScreenHeader>
        </Item>
        <div className="grid grid-cols-1 gap-4 p-3 md:p-5 lg:grid-cols-[1fr_17rem]">
          <Item>
            <Panel className="overflow-hidden">
              <p className="px-4 pt-4 text-xs text-neutral-500 dark:text-neutral-400">{t("plan")}</p>
              <ol className="space-y-1 p-2">
                {steps.map((item, index) => {
                  const state =
                    index === APPROVAL && decision === "rejected"
                      ? "skipped"
                      : index < step
                        ? "done"
                        : index === step && !done
                          ? waiting
                            ? "waiting"
                            : "running"
                          : "pending";
                  return (
                    <li key={item.title} className={cn("flex gap-3 rounded-xl p-2", state === "running" && "bg-neutral-50 dark:bg-neutral-800/60")}>
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                          state === "done" && "border-transparent bg-[#1E40FF] text-white dark:bg-blue-400 dark:text-neutral-900",
                          state === "running" && "border-transparent text-[#1E40FF] dark:text-blue-400",
                          state === "waiting" && "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-400/10",
                          (state === "pending" || state === "skipped") && "border-neutral-300 text-neutral-400 dark:border-neutral-600"
                        )}
                      >
                        {state === "done" ? (
                          <IconCheck className="size-3" />
                        ) : state === "running" ? (
                          <IconLoader2 className="size-4 animate-spin" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-sm font-medium", state === "pending" || state === "skipped" ? "text-neutral-400" : "text-neutral-900 dark:text-neutral-100")}>
                          {item.title}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          {state === "skipped" ? t("skipped") : item.text}
                          <code className="rounded border border-neutral-200 bg-neutral-50 px-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            {item.tool}
                          </code>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="flex justify-between border-t border-neutral-100 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
                <span>{t("progress", { step: Math.min(step + 1, steps.length) })}</span>
                <span className="h-1 w-24 self-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <motion.span
                    className="block h-1 rounded-full bg-[#1E40FF] dark:bg-blue-400"
                    animate={{ width: `${(Math.min(step, steps.length) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease }}
                  />
                </span>
              </div>
            </Panel>
          </Item>
          <Item className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t("needs")}</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={waiting ? "ask" : decision ?? "none"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease }}
                  className="mt-2"
                >
                  {waiting ? (
                    <Panel className="border-amber-200 p-4 dark:border-amber-400/30">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t("approveTitle")}</p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{t("approveText")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <SmallButton primary onClick={() => setDecision("approved")}>
                          {t("approve")}
                        </SmallButton>
                        <SmallButton onClick={() => setDecision("rejected")}>{t("reject")}</SmallButton>
                      </div>
                    </Panel>
                  ) : decision ? (
                    <p className="flex gap-2 rounded-2xl bg-neutral-50 p-3 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      <IconCircleCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {t(decision)}
                    </p>
                  ) : (
                    <div className="rounded-2xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{t("nothing")}</p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{t("nothingText")}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs text-neutral-400">{t("details")}</p>
              <dl className="mt-2 space-y-2 text-xs">
                {[
                  [t("agentLabel"), t("agentName")],
                  [t("trigger"), t("triggerValue")],
                  [t("calls"), String(Math.min(step, steps.length) * 2)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
                    <dd className="text-right text-neutral-800 dark:text-neutral-200">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Item>
        </div>
      </Stagger>
    </div>
  );
};

/* ---------- Assistant: ask the CRM in plain words ---------- */

type Chat = { chip: string; reply: string; panel: string; items: { title: string; text: string }[] };

// The message box, as a still picture: the demo is driven by the suggestions.
const Composer = ({ className }: { className?: string }) => {
  const t = useTranslations(`${T}.assistant`);
  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/60", className)}>
      <div className="rounded-2xl border-b border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-sm text-neutral-400">{t("placeholder")}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-3">
            <IconPlus className="size-4" />
            <span className="flex items-center gap-1">
              <IconPlug className="size-3.5" />
              {t("plugins")}
            </span>
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <IconSparkles className="size-3.5" />
              {t("auto")}
              <IconChevronDown className="size-3" />
            </span>
            <IconMicrophone className="size-4" />
            <span className="flex size-6 items-center justify-center rounded-full bg-neutral-200 text-white dark:bg-neutral-700">
              <IconArrowUp className="size-3.5" />
            </span>
          </span>
        </div>
      </div>
      <p className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">{t("connect")}</p>
    </div>
  );
};

export const Assistant = () => {
  const t = useTranslations(`${T}.assistant`);
  const chats = t.raw("chats") as Chat[];
  const agents = t.raw("agents") as string[];
  const [chat, setChat] = useState<number | null>(null);
  const [thinking, setThinking] = useState(false);
  const [picked, setPicked] = useState<Set<number>>(new Set([0, 1]));

  useEffect(() => {
    if (!thinking) return;
    const timer = window.setTimeout(() => setThinking(false), 1100);
    return () => window.clearTimeout(timer);
  }, [thinking]);

  const open = (index: number) => {
    setChat(index);
    setThinking(true);
  };

  if (chat === null) {
    return (
      <Stagger className="flex min-h-full flex-col items-center justify-center px-4 py-10">
        <Item>
          <h3 className="text-center text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t("greeting")}</h3>
        </Item>
        <Item className="mt-6 w-full max-w-xl">
          <Composer />
        </Item>
        <Item className="mt-5 flex max-w-xl flex-wrap justify-center gap-2">
          {chats.map((item, index) => (
            <button
              key={item.chip}
              type="button"
              onClick={() => open(index)}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {item.chip}
            </button>
          ))}
        </Item>
      </Stagger>
    );
  }

  const current = chats[chat];
  return (
    <div className="grid grid-cols-1 min-h-full lg:grid-cols-[1fr_16rem]">
      <div className="flex min-w-0 flex-col">
        <ScreenHeader
          title={
            <>
              <IconSparkles className="size-4 text-neutral-500" />
              <span className="truncate">{current.chip}</span>
            </>
          }
        >
          <SmallButton onClick={() => setChat(null)}>{t("newChat")}</SmallButton>
        </ScreenHeader>
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
          >
            {current.chip}
          </motion.p>
          <div className="flex gap-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[#1E40FF] dark:border-neutral-700 dark:text-blue-400">
              <IconTopologyStar3 className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("working")}</p>
              <Stagger className="mt-1.5 flex flex-wrap gap-1.5">
                {agents.map((agent) => (
                  <Item key={agent}>
                    <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                      {thinking ? <IconLoader2 className="size-3 animate-spin" /> : <IconCheck className="size-3 text-emerald-600 dark:text-emerald-400" />}
                      {agent}
                    </span>
                  </Item>
                ))}
              </Stagger>
              <AnimatePresence>
                {!thinking && (
                  <motion.p
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.45, ease }}
                    className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200"
                  >
                    {current.reply}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4">
          <Composer />
        </div>
      </div>
      <AnimatePresence>
        {!thinking && (
          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease }}
            className="border-t border-neutral-100 p-4 dark:border-neutral-800 lg:border-t-0 lg:border-l"
          >
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{current.panel}</p>
            <ul className="mt-3 space-y-2">
              {current.items.map((item, index) => (
                <li key={item.title}>
                  <label className="flex cursor-pointer gap-2.5 rounded-xl border border-neutral-200 p-2.5 transition-colors hover:border-neutral-300 dark:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={picked.has(index)}
                      onChange={() =>
                        setPicked((current) => {
                          const next = new Set(current);
                          if (next.has(index)) next.delete(index);
                          else next.add(index);
                          return next;
                        })
                      }
                      className="mt-0.5 size-3.5 accent-[#1E40FF]"
                    />
                    <span>
                      <span className="block text-sm text-neutral-900 dark:text-neutral-100">{item.title}</span>
                      <span className="block text-xs text-neutral-500 dark:text-neutral-400">{item.text}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Evals: test the AI before a change goes live ---------- */

type Result = "pass" | "partial" | "fail";
type Case = { id: string; input: string; expected: string; result: Result; score: string };
type Piece = { t?: string; del?: string; ins?: string };

const evalKpis = [
  { key: "pass", value: "92%", delta: "+4", good: true },
  { key: "score", value: "4.6/5", delta: "+0.3", good: true },
  { key: "time", value: "1.2 s", delta: "-0.2 s", good: true },
  { key: "cost", value: "€1.70", delta: "+€0.05", good: false },
] as const;
const passByVersion = [61, 64, 70, 68, 74, 79, 77, 82, 85, 83, 88, 92];
const resultTone: Record<Result, Tone> = { pass: "green", partial: "amber", fail: "red" };

export const Evals = () => {
  const t = useTranslations(`${T}.evals`);
  const cases = t.raw("items") as Case[];
  const diff = t.raw("diff") as Piece[];
  const [filter, setFilter] = useState<"all" | Result>("all");
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [running]);

  const shown = filter === "all" ? cases : cases.filter((item) => item.result === filter);
  const line = passByVersion
    .map((value, index) => `${index ? "L" : "M"} ${(index / (passByVersion.length - 1)) * 300} ${60 - (value - 50) * 1.2}`)
    .join(" ");

  return (
    <Stagger>
      <Item>
        <ScreenHeader
          title={
            <>
              <IconFlask className="size-4 text-neutral-500" />
              {t("title")}
              <Badge tone="neutral" className="hidden sm:inline-flex">
                {t("version")}
              </Badge>
            </>
          }
        >
          <span className="hidden text-xs text-neutral-400 sm:inline">{ran ? t("justNow") : t("lastRun")}</span>
          <SmallButton primary onClick={() => setRunning(true)} disabled={running}>
            {running ? <IconLoader2 className="size-3.5 animate-spin" /> : <IconPlayerPlay className="size-3.5" />}
            {running ? t("running") : t("run")}
          </SmallButton>
        </ScreenHeader>
      </Item>
      <div className="space-y-3 p-3 md:space-y-4 md:p-5">
        <Item className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {evalKpis.map((kpi) => (
            <Panel key={kpi.key} className="p-3">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t(`kpis.${kpi.key}`)}</p>
              <p className="mt-1 text-lg md:text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{kpi.value}</p>
              <p className={cn("text-xs tabular-nums", kpi.good ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                {kpi.delta} <span className="text-neutral-400">{t("vs")}</span>
              </p>
            </Panel>
          ))}
        </Item>
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
          <Item>
            <Panel className="h-full p-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t("chartTitle")}</p>
              <svg viewBox="0 0 300 60" className="mt-4 h-24 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d={line}
                  fill="none"
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-[#1E40FF] dark:stroke-blue-400"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease }}
                />
              </svg>
              <p className="mt-3 text-xs text-neutral-400">{t("chartNote")}</p>
            </Panel>
          </Item>
          <Item>
            <Panel className="h-full p-4">
              <p className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <IconSparkles className="size-3.5" />
                {t("changes")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                {diff.map((piece, index) =>
                  piece.del ? (
                    <del key={index} className="rounded bg-red-50 px-0.5 text-red-600 dark:bg-red-400/10 dark:text-red-300">
                      {piece.del}
                    </del>
                  ) : piece.ins ? (
                    <ins key={index} className="rounded bg-emerald-50 px-0.5 text-emerald-700 no-underline dark:bg-emerald-400/10 dark:text-emerald-300">
                      {piece.ins}
                    </ins>
                  ) : (
                    <span key={index}>{piece.t}</span>
                  )
                )}
              </p>
            </Panel>
          </Item>
        </div>
        <Item>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {t("cases")} <span className="font-normal text-neutral-400">{cases.length}</span>
            </p>
            <span className="flex rounded-full border border-neutral-200 p-0.5 dark:border-neutral-700">
              {(["all", "pass", "partial", "fail"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs transition-colors",
                    filter === key ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                  )}
                >
                  {t(`filters.${key}`)}
                  {key !== "all" && " "}
                  {key !== "all" && <span className="opacity-60">{cases.filter((item) => item.result === key).length}</span>}
                </button>
              ))}
            </span>
          </div>
          <Panel className="mt-3 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 text-left text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <tr>
                  <th className="px-3 py-2 font-medium">{t("columns.input")}</th>
                  <th className="hidden px-3 py-2 font-medium md:table-cell">{t("columns.expected")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("columns.score")}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {shown.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: running ? 0.4 : 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-3 py-2">
                        <span className="mr-2 font-mono text-[11px] text-neutral-400">{item.id}</span>
                        <span dir="auto" className="text-neutral-800 dark:text-neutral-200">
                          {item.input}
                        </span>
                      </td>
                      <td className="hidden px-3 py-2 text-neutral-500 dark:text-neutral-400 md:table-cell">{item.expected}</td>
                      <td className="px-3 py-2 text-right">
                        <Badge tone={resultTone[item.result]}>
                          {t(`filters.${item.result}`)} {item.score}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </Panel>
        </Item>
      </div>
    </Stagger>
  );
};
