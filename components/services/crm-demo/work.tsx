"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import {
  IconArrowLeft,
  IconBuilding,
  IconChartLine,
  IconCheck,
  IconChevronRight,
  IconDownload,
  IconHeadset,
  IconPlus,
  IconSortDescending,
} from "@tabler/icons-react";
import { ToolLogo, type ToolSlug } from "@/icons/tool-logos";
import { cn } from "@/lib/utils";
import { Badge, ease, Initials, Item, Panel, ScreenHeader, SmallButton, Stagger, Toggle, type ScreenProps, type Tone } from "./ui";

const T = "servicePages.crm-development.demo";

/* ---------- Onboarding: connect your tools ---------- */

type Tool = { logo: ToolSlug; name: string; text: string };

export const Onboarding = ({ go }: ScreenProps) => {
  const t = useTranslations(`${T}.onboarding`);
  const tools = t.raw("tools") as Tool[];
  const steps = t.raw("steps") as string[];
  const checklist = t.raw("checklistItems") as { title: string; text: string }[];
  const [on, setOn] = useState<boolean[]>(tools.map((_, index) => index === 0));
  return (
    <Stagger className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-10">
      <Item>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("step")}</p>
        <h3 className="mt-1 text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t("title")}</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
      </Item>
      <Item>
        <ol className="mt-5 flex items-center gap-2 text-xs md:text-sm">
          {steps.map((step, index) => (
            <li key={step} className="flex flex-1 items-center gap-2 last:flex-none">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  index === 0 && "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900",
                  index === 1 && "border-neutral-900 text-neutral-900 dark:border-white dark:text-white",
                  index > 1 && "border-neutral-300 text-neutral-400 dark:border-neutral-600"
                )}
              >
                {index === 0 ? <IconCheck className="size-3" /> : index + 1}
              </span>
              <span className={cn(index === 1 ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400", index > 1 && "hidden sm:inline")}>
                {step}
              </span>
              <span className="hidden h-px flex-1 bg-neutral-200 dark:bg-neutral-700 sm:block" />
            </li>
          ))}
        </ol>
      </Item>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_15rem]">
        <Item>
          <Panel className="overflow-hidden">
            <div className="p-4 md:p-5">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{t("cardTitle")}</p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t("cardText")}</p>
              <ul className="mt-4 space-y-3">
                {tools.map((tool, index) => (
                  <li key={tool.name} className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-neutral-700">
                      <ToolLogo tool={tool.logo} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {tool.name}
                        {on[index] && <Badge tone="neutral">{t("connected")}</Badge>}
                      </span>
                      <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{tool.text}</span>
                    </span>
                    <Toggle
                      on={on[index]}
                      label={tool.name}
                      onChange={() => setOn((values) => values.map((value, i) => (i === index ? !value : value)))}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50 md:px-5">
              <button type="button" onClick={() => go("records")} className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
                {t("skip")}
              </button>
              <span className="flex gap-2">
                <SmallButton disabled>
                  <IconArrowLeft className="size-3.5" />
                  {t("back")}
                </SmallButton>
                <SmallButton primary onClick={() => go("records")}>
                  {t("continue")}
                  <IconChevronRight className="size-3.5" />
                </SmallButton>
              </span>
            </div>
          </Panel>
        </Item>
        <Item className="hidden lg:block">
          <Panel className="p-4">
            <p className="flex justify-between text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t("checklist")}
              <span className="font-normal text-neutral-500">1/4</span>
            </p>
            <div className="mt-3 h-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div className="h-1 w-1/4 rounded-full bg-neutral-900 dark:bg-white" />
            </div>
            <ul className="mt-3 space-y-1">
              {checklist.map((item, index) => (
                <li key={item.title} className={cn("flex gap-2.5 rounded-xl p-2", index === 1 && "border border-neutral-200 dark:border-neutral-700")}>
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                      index === 0 ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900" : "border-neutral-300 dark:border-neutral-600"
                    )}
                  >
                    {index === 0 && <IconCheck className="size-2.5" />}
                  </span>
                  <span>
                    <span className={cn("block text-sm", index > 1 ? "text-neutral-500" : "text-neutral-900 dark:text-neutral-100")}>{item.title}</span>
                    <span className="block text-xs text-neutral-400">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <p className="mt-4 flex gap-2.5 px-2 text-sm">
            <IconHeadset className="mt-0.5 size-4 shrink-0 text-neutral-500" />
            <span>
              <span className="block font-medium text-neutral-900 dark:text-neutral-100">{t("help")}</span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">{t("helpText")}</span>
            </span>
          </p>
        </Item>
      </div>
    </Stagger>
  );
};

/* ---------- Records: the companies table ---------- */

type Stage = "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
type Row = { company: string; industry: string; owner: string; value: number; stage: Stage; last: string };

const stageOrder: Stage[] = ["new", "qualified", "proposal", "negotiation", "won", "lost"];
export const stageTone: Record<Stage, Tone> = {
  new: "neutral",
  qualified: "blue",
  proposal: "violet",
  negotiation: "amber",
  won: "green",
  lost: "red",
};

export const Records = () => {
  const t = useTranslations(`${T}.records`);
  const format = useFormatter();
  const [rows, setRows] = useState(() => t.raw("rows") as Row[]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sorted, setSorted] = useState(false);
  const shown = sorted ? [...rows].sort((a, b) => b.value - a.value) : rows;

  const toggle = (company: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(company)) next.delete(company);
      else next.add(company);
      return next;
    });
  const advance = (company: string) =>
    setRows((current) =>
      current.map((row) =>
        row.company === company ? { ...row, stage: stageOrder[(stageOrder.indexOf(row.stage) + 1) % stageOrder.length] } : row
      )
    );

  const head = "px-3 py-2.5 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400";
  return (
    <Stagger>
      <Item>
        <ScreenHeader
          title={
            <>
              <IconBuilding className="size-4 text-neutral-500" />
              {t("title")}
              <span className="text-sm font-normal text-neutral-400">{rows.length}</span>
            </>
          }
        >
          {selected.size > 0 ? (
            <span className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
              {t("selected", { count: selected.size })}
              <SmallButton onClick={() => setSelected(new Set())}>{t("clear")}</SmallButton>
            </span>
          ) : (
            <span className="hidden text-xs text-neutral-400 sm:inline">{t("hint")}</span>
          )}
        </ScreenHeader>
      </Item>
      <Item className="px-1 md:px-3">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-100 dark:border-neutral-800">
            <tr>
              <th className="w-8 px-3 py-2.5">
                <span className="sr-only">{t("selected", { count: selected.size })}</span>
              </th>
              <th className={head}>{t("columns.company")}</th>
              <th className={cn(head, "hidden md:table-cell")}>{t("columns.industry")}</th>
              <th className={cn(head, "hidden lg:table-cell")}>{t("columns.owner")}</th>
              <th className={cn(head, "hidden text-right sm:table-cell")}>
                <button
                  type="button"
                  onClick={() => setSorted((value) => !value)}
                  aria-pressed={sorted}
                  title={t("sortBy")}
                  className={cn("inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100", sorted && "text-neutral-900 dark:text-neutral-100")}
                >
                  {t("columns.value")}
                  <IconSortDescending className="size-3.5" />
                </button>
              </th>
              <th className={head}>{t("columns.stage")}</th>
              <th className={cn(head, "hidden xl:table-cell")}>{t("columns.last")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <motion.tr
                layout="position"
                transition={{ duration: 0.35, ease }}
                key={row.company}
                className={cn(
                  "border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50",
                  selected.has(row.company) && "bg-blue-50/60 dark:bg-blue-400/5"
                )}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={row.company}
                    checked={selected.has(row.company)}
                    onChange={() => toggle(row.company)}
                    className="size-3.5 accent-[#1E40FF]"
                  />
                </td>
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                    <Initials name={row.company} />
                    <span className="truncate">{row.company}</span>
                  </span>
                </td>
                <td className="hidden px-3 py-2 md:table-cell">
                  <Badge tone="neutral">{row.industry}</Badge>
                </td>
                <td className="hidden px-3 py-2 text-neutral-600 dark:text-neutral-300 lg:table-cell">{row.owner}</td>
                <td className="hidden px-3 py-2 text-right tabular-nums text-neutral-700 dark:text-neutral-200 sm:table-cell">{format.number(row.value)}</td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => advance(row.company)} className="rounded-md transition-transform active:scale-95">
                    <Badge tone={stageTone[row.stage]}>{t(`stages.${row.stage}`)}</Badge>
                  </button>
                </td>
                <td className="hidden px-3 py-2 text-neutral-500 dark:text-neutral-400 xl:table-cell">{row.last}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <p className="flex items-center gap-1.5 px-3 py-3 text-xs text-neutral-400">
          <IconPlus className="size-3.5" />
          {t("addRow")}
        </p>
      </Item>
    </Stagger>
  );
};

/* ---------- Analytics: the sales report ---------- */

type Range = "week" | "month" | "quarter";
type Kpi = { value: string; delta: string; good: boolean };
const report: Record<
  Range,
  { kpis: { pipeline: Kpi; won: Kpi; winRate: Kpi; cycle: Kpi & { days: number } }; current: number[]; previous: number[]; funnel: number[] }
> = {
  week: {
    kpis: {
      pipeline: { value: "€412k", delta: "+6%", good: true },
      won: { value: "€38.4k", delta: "+12%", good: true },
      winRate: { value: "31%", delta: "+2 pts", good: true },
      cycle: { value: "", days: 24, delta: "-3", good: true },
    },
    current: [3.1, 4.2, 3.8, 5.1, 4.6, 5.9, 6.4, 7.2],
    previous: [2.8, 3.1, 3.6, 3.3, 4.0, 4.1, 4.5, 4.4],
    funnel: [42, 28, 17, 9, 6],
  },
  month: {
    kpis: {
      pipeline: { value: "€468k", delta: "+9%", good: true },
      won: { value: "€152k", delta: "+18%", good: true },
      winRate: { value: "29%", delta: "-1 pt", good: false },
      cycle: { value: "", days: 27, delta: "-2", good: true },
    },
    current: [12, 18, 15, 22, 26, 24, 31, 35],
    previous: [10, 13, 16, 15, 19, 21, 20, 24],
    funnel: [131, 86, 52, 27, 19],
  },
  quarter: {
    kpis: {
      pipeline: { value: "€525k", delta: "+14%", good: true },
      won: { value: "€431k", delta: "+21%", good: true },
      winRate: { value: "30%", delta: "+3 pts", good: true },
      cycle: { value: "", days: 29, delta: "+1", good: false },
    },
    current: [38, 45, 52, 49, 61, 70, 74, 86],
    previous: [33, 36, 41, 44, 43, 50, 55, 58],
    funnel: [388, 251, 149, 81, 54],
  },
};

const chart = { width: 600, height: 180 };
const toLine = (values: number[], max: number) =>
  values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * chart.width;
      const y = chart.height - (value / max) * (chart.height - 10);
      return `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

export const Analytics = () => {
  const t = useTranslations(`${T}.analytics`);
  const tStages = useTranslations(`${T}.records.stages`);
  const [range, setRange] = useState<Range>("week");
  const data = report[range];
  const max = Math.max(...data.current, ...data.previous) * 1.1;
  const kpis = (["pipeline", "won", "winRate", "cycle"] as const).map((key) => ({
    key,
    ...data.kpis[key],
    value: key === "cycle" ? t("days", { count: data.kpis.cycle.days }) : data.kpis[key].value,
  }));
  return (
    <Stagger>
      <Item>
        <ScreenHeader
          title={
            <>
              <IconChartLine className="size-4 text-neutral-500" />
              {t("title")}
            </>
          }
        >
          <span className="flex rounded-full border border-neutral-200 p-0.5 dark:border-neutral-700">
            {(["week", "month", "quarter"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={range === key}
                onClick={() => setRange(key)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs transition-colors",
                  range === key ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                {t(`ranges.${key}`)}
              </button>
            ))}
          </span>
          <SmallButton className="hidden sm:inline-flex">
            <IconDownload className="size-3.5" />
            {t("export")}
          </SmallButton>
        </ScreenHeader>
      </Item>
      <div className="space-y-3 p-3 md:space-y-4 md:p-5">
        <Item className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Panel key={kpi.key} className="p-3 md:p-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t(`kpis.${kpi.key}`)}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <motion.span
                  key={`${range}-${kpi.key}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="text-lg md:text-2xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100"
                >
                  {kpi.value}
                </motion.span>
                <span className={cn("text-xs tabular-nums", kpi.good ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>{kpi.delta}</span>
              </p>
            </Panel>
          ))}
        </Item>
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[2fr_1fr]">
          <Item>
            <Panel className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t("chartTitle")}</p>
                <p className="flex gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 rounded-full bg-[#1E40FF] dark:bg-blue-400" />
                    {t("current")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    {t("previous")}
                  </span>
                </p>
              </div>
              <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="mt-4 h-40 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
                {[0.25, 0.5, 0.75, 1].map((line) => (
                  <line key={line} x1={0} x2={chart.width} y1={chart.height * line} y2={chart.height * line} className="stroke-neutral-100 dark:stroke-neutral-800" />
                ))}
                <motion.path
                  initial={false}
                  animate={{ d: toLine(data.previous, max) }}
                  transition={{ duration: 0.6, ease }}
                  fill="none"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-neutral-300 dark:stroke-neutral-600"
                />
                <motion.path
                  initial={false}
                  animate={{ d: toLine(data.current, max) }}
                  transition={{ duration: 0.6, ease }}
                  fill="none"
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-[#1E40FF] dark:stroke-blue-400"
                />
              </svg>
            </Panel>
          </Item>
          <Item>
            <Panel className="h-full p-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t("funnelTitle")}</p>
              <ul className="mt-4 space-y-3">
                {(["new", "qualified", "proposal", "negotiation", "won"] as const).map((stage, index) => (
                  <li key={stage}>
                    <p className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
                      {tStages(stage)}
                      <span className="tabular-nums">{data.funnel[index]}</span>
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.funnel[index] / data.funnel[0]) * 100}%` }}
                        transition={{ duration: 0.6, ease, delay: index * 0.05 }}
                        className="h-1.5 rounded-full bg-[#1E40FF] dark:bg-blue-400"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </Item>
        </div>
      </div>
    </Stagger>
  );
};
