import { useTranslations } from "next-intl";
import { IconMicrophone, IconSparkles } from "@tabler/icons-react";

// A still assistant screen next to the use cases: a soft colour blur drifting behind the
// suggestions and a light sweeping over the placeholder (CSS loops in globals.css).
export const AssistantCard = () => {
  const t = useTranslations("servicePages.chatbots.assistant");
  const chips = t.raw("chips") as string[];
  return (
    <div
      aria-hidden="true"
      className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
    >
      <div className="relative z-10 border-b border-neutral-100 dark:border-neutral-800 px-6 py-5">
        <p className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
          <IconSparkles className="size-5 text-violet-500 dark:text-violet-400" />
          {t("name")}
        </p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t("tagline")}</p>
      </div>
      <div className="relative flex flex-1 flex-col justify-end p-6">
        <div className="pointer-events-none absolute inset-0">
          <span className="assistant-drift absolute -bottom-16 -left-10 size-64 rounded-full bg-pink-200/60 dark:bg-pink-500/15 blur-3xl" />
          <span
            className="assistant-drift absolute -bottom-20 right-0 size-72 rounded-full bg-violet-300/50 dark:bg-violet-500/20 blur-3xl"
            style={{ animationDelay: "-7s" }}
          />
          <span
            className="assistant-drift absolute bottom-10 left-1/3 size-56 rounded-full bg-indigo-200/50 dark:bg-indigo-500/15 blur-3xl"
            style={{ animationDelay: "-13s" }}
          />
        </div>
        <p className="relative text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {t("prompt")}
        </p>
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-lg border border-neutral-200/80 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-300"
            >
              {chip}
            </li>
          ))}
        </ul>
        <div className="relative mt-8 flex items-center justify-between gap-4">
          <span className="assistant-shine text-neutral-400 dark:text-neutral-500">
            {t("placeholder")}
          </span>
          <IconMicrophone className="size-5 text-neutral-400 dark:text-neutral-500" />
        </div>
      </div>
    </div>
  );
};
