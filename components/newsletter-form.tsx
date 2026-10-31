"use client";
import React, { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { IconCircleCheckFilled, IconExclamationCircle, IconSend } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error" | "invalid";

// Brevo accepts any string as EMAIL, so the address is checked here first.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Our own sign-up form posting to the Brevo form endpoint (same list and opt-in settings).
export const NewsletterForm = ({
  className,
  onSuccess,
}: {
  className?: string;
  onSuccess?: () => void;
}) => {
  const t = useTranslations("newsletterForm");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const inputId = useId();
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!EMAIL_PATTERN.test(String(data.get("EMAIL") ?? "").trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      // isAjax=1 makes Brevo answer with JSON, the same way its own embed script submits.
      const response = await fetch(`${site.newsletterActionUrl}?isAjax=1`, {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as { success?: boolean; errors?: unknown };
      if (!result.success) {
        console.error("Newsletter sign-up rejected by Brevo", response.status, result.errors);
        throw new Error("Brevo rejected the sign-up");
      }
      form.reset();
      setStatus("success");
      onSuccess?.();
      // Let the inline confirmation show briefly, then open the welcome page.
      setTimeout(() => router.push("/newsletter/thank-you"), 1200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className={cn("relative w-full max-w-md", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="flex items-center gap-2 rounded-full border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 px-4 py-3 text-sm font-medium text-green-700 dark:text-green-400"
            role="status"
          >
            <IconCircleCheckFilled className="size-5 shrink-0" />
            {t("success")}
          </motion.p>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}>
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border bg-white dark:bg-neutral-900 p-1.5 pl-5 shadow-sm transition-colors duration-200 focus-within:border-[#1E40FF] dark:focus-within:border-blue-400",
                status === "invalid" || status === "error"
                  ? "border-red-300 dark:border-red-800"
                  : "border-neutral-200 dark:border-neutral-700"
              )}
            >
              <label htmlFor={inputId} className="sr-only">
                {t("label")}
              </label>
              <input
                id={inputId}
                type="email"
                name="EMAIL"
                required
                autoComplete="email"
                placeholder={t("placeholder")}
                aria-invalid={status === "invalid"}
                onChange={() => status !== "idle" && status !== "sending" && setStatus("idle")}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none"
              />
              {/* Brevo's own honeypot: must stay empty. */}
              <input
                type="text"
                name="email_address_check"
                defaultValue=""
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-0 top-0 size-px overflow-hidden opacity-0 pointer-events-none [clip-path:inset(50%)]"
              />
              <input type="hidden" name="locale" value={locale} />
              <Button type="submit" disabled={status === "sending"}>
                <IconSend />
                {status === "sending" ? t("sending") : t("submit")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-live="polite" className="min-h-5 mt-2">
        {(status === "invalid" || status === "error") && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-500"
          >
            <IconExclamationCircle className="size-3.5 shrink-0" />
            {status === "invalid" ? t("invalid") : t("error")}
          </motion.p>
        )}
      </div>
      {status !== "success" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t.rich("consent", {
            link: (chunks) => (
              <Link href="/privacy" className="underline underline-offset-4">
                {chunks}
              </Link>
            ),
          })}
        </p>
      )}
    </form>
  );
};
