"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IconBellRinging, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "./newsletter-form";

const STORAGE_KEY = "qartmina-newsletter-popover";
// Appears at a random moment in this window, so it never lands on the first glance at the page.
const MIN_DELAY_MS = 8000;
const MAX_DELAY_MS = 20000;
const IDLE_HIDE_MS = 12000;
const CLOSE_AFTER_SUCCESS_MS = 2500;

// Newsletter popover with the sign-up form, shown once per browser.
export const NewsletterToast = () => {
  const t = useTranslations("newsletterToast");
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
  };
  const hideAfter = (ms: number) => {
    cancelHide();
    hideTimer.current = setTimeout(() => setVisible(false), ms);
  };

  useEffect(() => {
    let alreadyShown = true;
    try {
      alreadyShown = Boolean(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      // Storage blocked (private mode, strict settings): skip the popover.
    }
    if (alreadyShown) return;
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    const showTimer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setVisible(true);
      hideAfter(IDLE_HIDE_MS);
    }, delay);
    return () => {
      clearTimeout(showTimer);
      cancelHide();
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      aria-hidden={!visible}
      inert={!visible}
      // Any interaction keeps it open until the visitor closes it.
      onPointerEnter={cancelHide}
      onFocus={cancelHide}
      className={cn(
        "fixed left-1/2 top-4 z-[60] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2",
        !visible && "pointer-events-none"
      )}
    >
      <div
        className="relative rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 shadow-2xl shadow-black/10"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-160%)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.55s cubic-bezier(0.18, 1.25, 0.4, 1), opacity 0.55s ease-out",
        }}
      >
        <button
          onClick={() => setVisible(false)}
          aria-label={t("close")}
          className="absolute right-4 top-4 text-neutral-400 hover:text-black dark:hover:text-white"
        >
          <IconX className="size-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="size-9 shrink-0 rounded-full bg-[#1E40FF]/10 text-[#1E40FF] dark:text-blue-400 flex items-center justify-center">
            <IconBellRinging className="size-5" />
          </div>
          <div>
            <p className="font-bold text-sm">{t("title")}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{t("text")}</p>
          </div>
        </div>
        <NewsletterForm className="mt-4 max-w-none" onSuccess={() => hideAfter(CLOSE_AFTER_SUCCESS_MS)} />
      </div>
    </div>
  );
};
