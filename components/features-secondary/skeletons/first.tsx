"use client";

import { CogIcon, FileIcon, HumanIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useToolTags } from "@/components/features/tool-tags";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const SkeletonOne = () => {
  type Item = {
    title: string;
    topIcon: React.ReactNode;
    description: string;
    tags: { text: string; icon: React.ReactNode }[];
  };

  const t = useTranslations("visuals");
  const tags = useToolTags();
  const topIcons = [
    <FileIcon key="question" className="size-4" />,
    <CogIcon key="answer" className="size-4" />,
    <HumanIcon key="handover" className="size-4 text-white" />,
  ];
  const items: Item[] = (
    t.raw("chatbot") as { title: string; description: string }[]
  ).map((item, index) => ({ ...item, topIcon: topIcons[index], tags }));

  const [activeCards, setActiveCards] = useState<Item[] | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  let interval: NodeJS.Timeout;

  useEffect(() => {
    animate();
    return () => clearInterval(interval);
  }, [items]);

  const animate = () => {
    if (isInView) {
      interval = setInterval(() => {
        setActiveCards((prev) => {
          if (!prev) {
            return [items[0]];
          }
          if (prev.length >= items.length) {
            clearInterval(interval);
            return prev;
          }
          return [items[prev.length], ...prev];
        });
      }, 1000);
    }
  };
  return (
    <motion.div
      ref={ref}
      layout
      className="flex-1 rounded-t-3xl gap-2 flex flex-col bg-neutral-100  dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-[20rem] lg:max-w-sm mx-auto w-full h-full absolute inset-x-0 p-2"
    >
      {activeCards?.map((item, idx) => (
        <Card key={item?.title} {...item} />
      ))}
    </motion.div>
  );
};

const Card = ({
  topIcon,
  title,
  description,
  tags,
}: {
  topIcon: React.ReactNode;
  title: string;
  description: string;
  tags: { text: string; icon: React.ReactNode }[];
}) => {
  const randomColors = [
    "var(--color-blue-500)",
    "var(--color-green-500)",
    "var(--color-red-500)",
  ];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="p-4 shadow-black/10 gap-4 border bg-white dark:bg-neutral-800 border-transparent ring-1 rounded-[16px] ring-black/10 flex items-start"
    >
      <div
        className={cn(
          "size-6 shrink-0 rounded-full bg-blue-500 flex mt-1 items-center justify-center"
        )}
        style={{
          backgroundColor:
            randomColors[Math.floor(Math.random() * randomColors.length)],
        }}
      >
        {topIcon}
      </div>
      <div>
        <p className="md:text-lg font-bold text-neutral-800 dark:text-neutral-200">
          {title}
        </p>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 text-balance">
          {description}
        </p>
        <div className="mt-2 flex flex-row flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <Tag key={tag.text + idx} text={tag.text} icon={tag.icon} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Tag = ({ text, icon }: { text: string; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-1 w-fit rounded-sm px-1 py-0.5 border border-neutral-200 dark:border-neutral-700 text-sm">
      {icon}
      <p className="text-xs text-neutral-500">{text}</p>
    </div>
  );
};
