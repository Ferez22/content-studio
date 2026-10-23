"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { IconCircleCheckFilled, IconExclamationCircle } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { Turnstile } from "./turnstile";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error" | "verification";

const inputClassName =
  "w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export const ContactForm = () => {
  const t = useTranslations("contactForm");
  const locale = useLocale();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setStatus("verification");
      return;
    }
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token, locale }),
      });
      if (!response.ok) throw new Error(`Contact request failed: ${response.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setResetKey((key) => key + 1);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("name")} name="name" autoComplete="name" required maxLength={100} />
        <Field
          label={t("email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
        <Field label={t("company")} name="company" autoComplete="organization" maxLength={100} />
        <Field label={t("website")} name="website" type="url" autoComplete="url" maxLength={200} placeholder="https://" />
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t("message")}
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={inputClassName}
        />
      </label>

      {/* Honeypot: hidden from people and screen readers, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {t("honeypot")}
          <input type="text" name="fax" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          onToken={setToken}
          resetKey={resetKey}
          language={locale}
        />
      )}

      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {t.rich("consent", {
          link: (chunks) => (
            <Link href="/privacy" className="underline underline-offset-4">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <Button type="submit" className="shadow-brand self-start" disabled={status === "sending"}>
        {status === "sending" ? t("sending") : t("send")}
      </Button>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {(status === "success" || status === "error" || status === "verification") && (
            <motion.p
              key={status}
              initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-start gap-2 text-sm",
                status === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"
              )}
            >
              {status === "success" ? (
                <IconCircleCheckFilled className="size-4 shrink-0 mt-0.5" />
              ) : (
                <IconExclamationCircle className="size-4 shrink-0 mt-0.5" />
              )}
              {status === "success" && t("success")}
              {status === "error" && t("error", { email: site.email })}
              {status === "verification" && t("verification")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

const Field = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<"input">) => {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input className={inputClassName} {...props} />
    </label>
  );
};
