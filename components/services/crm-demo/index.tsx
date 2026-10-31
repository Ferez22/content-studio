"use client";
import React, { useId, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  IconBuilding,
  IconChartLine,
  IconChevronDown,
  IconFlask,
  IconHome,
  IconLayoutSidebar,
  IconMessageChatbot,
  IconPlayerPlay,
  IconSearch,
  IconSettings,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AgentRun, Assistant, Evals } from "./ai";
import { Settings } from "./settings";
import { ease, type Screen, type ScreenProps } from "./ui";
import { Analytics, Onboarding, Records } from "./work";

// Hero of the CRM page: one demo CRM ("Acme") with seven screens in the order a team meets
// them, from onboarding to daily work, the AI agent and admin. The tabs above and the
// sidebar inside switch screens; each screen is interactive, and the caption below says
// what it does and why it is easy to use. Copy under servicePages.crm-development.demo.

const groups: { key: "start" | "work" | "ai" | "admin"; screens: { id: Screen; icon: Icon }[] }[] = [
  { key: "start", screens: [{ id: "onboarding", icon: IconHome }] },
  {
    key: "work",
    screens: [
      { id: "records", icon: IconBuilding },
      { id: "analytics", icon: IconChartLine },
    ],
  },
  {
    key: "ai",
    screens: [
      { id: "agent", icon: IconPlayerPlay },
      { id: "assistant", icon: IconMessageChatbot },
      { id: "evals", icon: IconFlask },
    ],
  },
  { key: "admin", screens: [{ id: "settings", icon: IconSettings }] },
];
const order = groups.flatMap((group) => group.screens);

const screens: Record<Screen, React.ComponentType<ScreenProps>> = {
  onboarding: Onboarding,
  records: Records,
  analytics: Analytics,
  agent: AgentRun,
  assistant: Assistant,
  evals: Evals,
  settings: Settings,
};

export const CrmDemo = () => {
  const t = useTranslations("servicePages.crm-development.demo");
  const id = useId();
  const [screen, setScreen] = useState<Screen>("records");
  const Current = screens[screen];

  // Arrow keys move between tabs, as in any tab list.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const index = order.findIndex((item) => item.id === screen);
    const next = order[(index + (event.key === "ArrowRight" ? 1 : order.length - 1)) % order.length].id;
    setScreen(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label={t("tabsLabel")} onKeyDown={onKeyDown} className="flex flex-wrap gap-1.5">
          {order.map(({ id: key, icon: TabIcon }) => (
            <button
              key={key}
              id={`${id}-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={screen === key}
              aria-controls={`${id}-panel`}
              tabIndex={screen === key ? 0 : -1}
              onClick={() => setScreen(key)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                screen === key
                  ? "border-transparent text-white dark:text-neutral-900"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white"
              )}
            >
              {screen === key && (
                <motion.span
                  layoutId={`${id}-tab`}
                  transition={{ duration: 0.35, ease }}
                  className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                />
              )}
              <TabIcon className="relative size-4" />
              <span className="relative">{t(`screens.${key}.tab`)}</span>
            </button>
          ))}
        </div>
        <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
          {t("label")}
        </span>
      </div>

      <div className="mt-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-800 md:p-3">
        <div className="flex h-[38rem] gap-2 md:h-[40rem] md:gap-3">
          <Sidebar screen={screen} setScreen={setScreen} />
          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${screen}`}
            className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="absolute inset-0 overflow-y-auto overscroll-contain"
              >
                <Current go={setScreen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.dl
          key={screen}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.45, ease }}
          className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10"
          aria-live="polite"
        >
          <div>
            <dt className="font-display text-sm font-bold text-[#1E40FF] dark:text-blue-400">{t("what")}</dt>
            <dd className="mt-2 text-neutral-700 dark:text-neutral-300">{t(`screens.${screen}.what`)}</dd>
          </div>
          <div>
            <dt className="font-display text-sm font-bold text-[#1E40FF] dark:text-blue-400">{t("why")}</dt>
            <dd className="mt-2 text-neutral-700 dark:text-neutral-300">{t(`screens.${screen}.why`)}</dd>
          </div>
        </motion.dl>
      </AnimatePresence>
    </MotionConfig>
  );
};

// The app's own navigation, a second way to switch screens (mouse only: the tabs above
// are the accessible control).
const Sidebar = ({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) => {
  const t = useTranslations("servicePages.crm-development.demo");
  return (
    <nav aria-hidden="true" className="hidden w-52 shrink-0 flex-col px-2 py-2 lg:flex">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <span className="flex size-5 items-center justify-center rounded-md border border-neutral-300 bg-white text-[10px] dark:border-neutral-600 dark:bg-neutral-900">
            A
          </span>
          {t("workspace")}
          <IconChevronDown className="size-3.5 text-neutral-400" />
        </span>
        <span className="flex gap-2 text-neutral-400">
          <IconSearch className="size-4" />
          <IconLayoutSidebar className="size-4" />
        </span>
      </div>
      {groups.map((group) => (
        <div key={group.key} className="mt-4">
          <p className="px-2 text-xs text-neutral-400">{t(`groups.${group.key}`)}</p>
          <ul className="mt-1 space-y-0.5">
            {group.screens.map(({ id, icon: NavIcon }) => (
              <li key={id}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setScreen(id)}
                  className={cn(
                    "relative flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    screen === id ? "text-neutral-900 dark:text-white" : "text-neutral-600 hover:bg-white/60 dark:text-neutral-400 dark:hover:bg-neutral-700/40"
                  )}
                >
                  {screen === id && (
                    <motion.span
                      layoutId="crm-demo-nav"
                      transition={{ duration: 0.35, ease }}
                      className="absolute inset-0 rounded-lg bg-neutral-200/70 dark:bg-neutral-700"
                    />
                  )}
                  <NavIcon className="relative size-4" />
                  <span className="relative">{t(`screens.${id}.tab`)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="mt-auto flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-700 dark:text-neutral-300">
        <span className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-[#1E40FF] dark:bg-blue-400/10 dark:text-blue-300">
          AM
        </span>
        {t("user")}
      </p>
    </nav>
  );
};
