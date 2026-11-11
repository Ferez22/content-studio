"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { IconGripVertical, IconPlus, IconUserPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { stageTone } from "./work";
import { Badge, ease, Initials, Item, Panel, SmallButton, Stagger } from "./ui";

const T = "servicePages.custom-software.demo";

type Role = "admin" | "sales" | "viewer";
type Member = { name: string; email: string; role: Role };
type Tab = "members" | "pipeline" | "billing";

export const Settings = () => {
  const t = useTranslations(`${T}.settings`);
  const tStages = useTranslations(`${T}.records.stages`);
  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState(() => t.raw("members") as Member[]);
  const [stages, setStages] = useState<string[]>(() =>
    (Object.keys(stageTone) as (keyof typeof stageTone)[]).map((stage) => tStages(stage))
  );

  return (
    <Stagger className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
      <Item>
        <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t("title")}</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
      </Item>
      <Item className="mt-5 flex gap-1">
        {(["members", "pipeline", "billing"] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              tab === key ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            )}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </Item>
      <Item className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease }}
          >
            {tab === "members" && (
              <Panel>
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {members.map((member, index) => (
                    <li key={member.email} className="flex items-center gap-3 px-4 py-3">
                      <Initials name={member.name} className="size-8 rounded-full" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{member.name}</span>
                        <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{member.email}</span>
                      </span>
                      <select
                        aria-label={t("roleLabel", { name: member.name })}
                        value={member.role}
                        onChange={(event) =>
                          setMembers((current) =>
                            current.map((item, i) => (i === index ? { ...item, role: event.target.value as Role } : item))
                          )
                        }
                        className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                      >
                        {(["admin", "sales", "viewer"] as const).map((role) => (
                          <option key={role} value={role}>
                            {t(`roles.${role}`)}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
                  <SmallButton primary>
                    <IconUserPlus className="size-3.5" />
                    {t("invite")}
                  </SmallButton>
                </div>
              </Panel>
            )}
            {tab === "pipeline" && (
              <Panel className="p-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("pipelineText")}</p>
                <ol className="mt-3 space-y-1.5">
                  <AnimatePresence initial={false}>
                    {stages.map((stage, index) => (
                      <motion.li
                        key={`${stage}-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3, ease }}
                        className="flex items-center gap-2 rounded-xl border border-neutral-200 px-2.5 py-2 text-sm dark:border-neutral-700"
                      >
                        <IconGripVertical className="size-4 text-neutral-300 dark:text-neutral-600" />
                        <span className="w-5 text-xs tabular-nums text-neutral-400">{index + 1}</span>
                        <Badge tone={Object.values(stageTone)[index] ?? "neutral"}>{stage}</Badge>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ol>
                <SmallButton
                  className="mt-3"
                  disabled={stages.length >= 8}
                  onClick={() => setStages((current) => [...current, t("newStage")])}
                >
                  <IconPlus className="size-3.5" />
                  {t("addStage")}
                </SmallButton>
              </Panel>
            )}
            {tab === "billing" && (
              <Panel className="p-4">
                <p className="flex items-center justify-between text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {t("billing.plan")}
                  <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">{t("billing.renews")}</span>
                </p>
                <ul className="mt-4 space-y-4">
                  {(
                    [
                      ["seats", 0.8],
                      ["storage", 0.42],
                      ["ai", 0.68],
                    ] as const
                  ).map(([key, share], index) => (
                    <li key={key}>
                      <p className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
                        {t(`billing.${key}`)}
                        <span className="tabular-nums">{t(`billing.${key}Value`)}</span>
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${share * 100}%` }}
                          transition={{ duration: 0.7, ease, delay: 0.1 + index * 0.08 }}
                          className="h-1.5 rounded-full bg-[#1E40FF] dark:bg-blue-400"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </motion.div>
        </AnimatePresence>
      </Item>
    </Stagger>
  );
};
