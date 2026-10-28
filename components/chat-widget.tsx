"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { LogoIcon } from "./logo";
import { cn } from "@/lib/utils";

type QuickReply = { label: string; answer: string };
type Message = { from: "bot" | "user"; text: string };

// Phase 1: scripted answers. Phase 2 replaces `quickReplies` with a live agent.
export const ChatWidget = () => {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const quickReplies = t.raw("quickReplies") as QuickReply[];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const ask = (reply: QuickReply) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: reply.label },
      { from: "bot", text: reply.answer },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label={t("title")}
            className="w-[calc(100vw-2rem)] max-w-sm rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <LogoIcon />
                <p className="text-sm font-bold">{t("title")}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t("close")}>
                <IconX className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" aria-live="polite">
              <Bubble from="bot">{t("greeting")}</Bubble>
              {messages.map((message, index) => (
                <Bubble key={index} from={message.from}>
                  {message.text}
                </Bubble>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.label}
                    onClick={() => ask(reply)}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition duration-200"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
              <Button asChild size="sm" className="self-start">
                <Link href="/book" onClick={() => setOpen(false)}>
                  {tCommon("bookCall")}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
        className="size-12 rounded-full bg-primary text-primary-foreground ring-1 ring-neutral-300 dark:ring-neutral-700 flex items-center justify-center active:scale-[0.98] transition duration-200"
      >
        {open ? <IconX className="size-5" /> : <IconMessageCircle className="size-5" />}
      </button>
    </div>
  );
};

const Bubble = ({
  from,
  children,
}: {
  from: "bot" | "user";
  children: React.ReactNode;
}) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "text-sm px-3 py-2 rounded-2xl max-w-[85%]",
        from === "bot"
          ? "bg-neutral-100 dark:bg-neutral-800 self-start"
          : "bg-primary text-primary-foreground self-end"
      )}
    >
      {children}
    </motion.p>
  );
};
