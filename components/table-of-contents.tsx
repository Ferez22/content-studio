"use client";

import { useEffect, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string };

// Desktop: a sticky ladder beside the article that highlights the section in view.
// Phones: a collapsible list above the article.
export const TableOfContents = ({
  headings,
  title,
  variant,
}: {
  headings: Heading[];
  title: string;
  variant: "sidebar" | "inline";
}) => {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    if (variant !== "sidebar") return;
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    // The active section is the last heading that has passed the upper third of the screen.
    const onScroll = () => {
      const passed = elements.filter((element) => element.getBoundingClientRect().top < window.innerHeight / 3);
      setActive((passed.at(-1) ?? elements[0])?.id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings, variant]);

  const list = (
    <ol className="flex flex-col">
      {headings.map(({ id, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={cn(
              "block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors duration-200",
              variant === "sidebar" && active === id
                ? "border-[#1E40FF] dark:border-blue-400 text-black dark:text-white font-medium"
                : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white"
            )}
          >
            {text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "inline") {
    return (
      <details className="group mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 px-5 py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-display font-bold [&::-webkit-details-marker]:hidden">
          {title}
          <IconChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <nav aria-label={title} className="mt-4">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label={title} className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="mb-4 text-sm font-display font-bold">{title}</p>
      {list}
    </nav>
  );
};
