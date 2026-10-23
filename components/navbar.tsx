"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./logo";
import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { IconChevronDown, IconLayoutSidebar, IconX } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { serviceSlugs } from "@/lib/site";
import { serviceIcons } from "./service-icons";

const navlinks = [
  { key: "services", href: "/#services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "about", href: "/#about" },
  { key: "blog", href: "/blog" },
] as const;

const menuSpring = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
} as const;

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <div className="sticky top-2 z-50">
      <DesktopNavbar scrolled={scrolled} />
      <MobileNavbar scrolled={scrolled} />
    </div>
  );
};

export const MobileNavbar = ({ scrolled }: { scrolled: boolean }) => {
  const t = useTranslations("header");
  const tServices = useTranslations("servicePages");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // The menu grows like a drop from the toggle button until it covers the screen.
  const [drop, setDrop] = useState({ x: 0, y: 0, r: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;
    setDrop({ x, y, r: Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) });
    setOpen(true);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const collapsed = `circle(0px at ${drop.x}px ${drop.y}px)`;
  const expanded = `circle(${drop.r}px at ${drop.x}px ${drop.y}px)`;

  return (
    <div
      className={cn(
        "flex lg:hidden mx-3 px-4 rounded-full justify-between items-center relative transition-[padding,background-color,border-color] duration-300 border",
        scrolled
          ? "py-1.5 border-neutral-200 dark:border-neutral-800 bg-background/80 backdrop-blur-md"
          : "py-2 border-transparent",
      )}
    >
      <Logo compact={scrolled} />
      <button
        ref={buttonRef}
        onClick={openMenu}
        aria-label={t("openMenu")}
        aria-expanded={open}
      >
        <IconLayoutSidebar className="size-4" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ clipPath: collapsed }}
                animate={{ clipPath: expanded }}
                exit={{ clipPath: collapsed }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-0 z-[70] px-4 py-4 flex flex-col justify-between bg-background overflow-y-auto will-change-[clip-path] lg:hidden"
              >
                <div>
                  <div className="flex justify-between items-center px-4 py-2">
                    <Logo />
                    <button onClick={close} aria-label={t("closeMenu")}>
                      <IconX />
                    </button>
                  </div>

                  <div className="flex flex-col gap-6 my-10 px-4">
                    {navlinks.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 + index * 0.06 }}
                        key={item.key}
                      >
                        <Link
                          href={item.href}
                          onClick={close}
                          className="text-3xl text-neutral-700 dark:text-neutral-300 font-display font-bold"
                        >
                          {t(item.key)}
                        </Link>
                        {item.key === "services" && (
                          <ul className="mt-3 ml-1 flex flex-col gap-2 border-l border-neutral-200 dark:border-neutral-800 pl-4">
                            {serviceSlugs.map((slug) => (
                              <li key={slug}>
                                <Link
                                  href={`/services/${slug}`}
                                  onClick={close}
                                  className="text-base text-neutral-500 dark:text-neutral-400"
                                >
                                  {tServices(`${slug}.title`)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.45 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="flex items-center justify-between gap-4 px-4 pb-4"
                >
                  <LocaleSwitcher full onNavigate={close} />
                  <Button asChild>
                    <Link href="/book" onClick={close}>
                      {t("bookCall")}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

export const DesktopNavbar = ({ scrolled }: { scrolled: boolean }) => {
  const t = useTranslations("header");
  const [active, setActive] = useState<string | null>(null);
  return (
    <motion.div
      initial={false}
      animate={{
        maxWidth: scrolled ? 1024 : 1280,
        marginTop: scrolled ? 20 : 24,
        paddingTop: scrolled ? 8 : 14,
        paddingBottom: scrolled ? 8 : 14,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseLeave={() => setActive(null)}
      onKeyDown={(event) => event.key === "Escape" && setActive(null)}
      className={cn(
        "mx-auto px-4 md:px-8 items-center justify-between hidden lg:flex border rounded-full transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800 shadow-lg shadow-black/5"
          : "border-transparent",
      )}
    >
      <Logo compact={scrolled} />
      <nav className="flex items-center gap-10">
        {navlinks.map((item) =>
          item.key === "services" ? (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => setActive(item.key)}
              onFocus={() => setActive(item.key)}
            >
              <Link
                href={item.href}
                aria-haspopup="true"
                aria-expanded={active === item.key}
                className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 font-medium hover:text-black dark:hover:text-white transition duration-200"
              >
                {t(item.key)}
                <IconChevronDown
                  className={cn(
                    "size-3 transition-transform duration-200",
                    active === item.key && "rotate-180",
                  )}
                />
              </Link>
              {active === item.key && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={menuSpring}
                >
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6">
                    <motion.div
                      transition={menuSpring}
                      layoutId="nav-menu"
                      className="bg-white dark:bg-neutral-950 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl"
                    >
                      <motion.div layout className="w-max h-full p-4">
                        <ServicesMenu onNavigate={() => setActive(null)} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              onMouseEnter={() => setActive(null)}
              className="text-sm text-neutral-600 dark:text-neutral-400 font-medium hover:text-black dark:hover:text-white transition duration-200"
            >
              {t(item.key)}
            </Link>
          ),
        )}
      </nav>
      <div className="flex items-center gap-6">
        <LocaleSwitcher />
        <Button asChild>
          <Link href="/book">{t("bookCall")}</Link>
        </Button>
      </div>
    </motion.div>
  );
};

const ServicesMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  const tServices = useTranslations("servicePages");
  return (
    <div className="grid grid-cols-2 gap-2 w-[44rem]">
      {serviceSlugs.map((slug, index) => {
        const Icon = serviceIcons[slug];
        return (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 + index * 0.04 }}
          >
            <Link
              href={`/services/${slug}`}
              onClick={onNavigate}
              className="group flex items-start gap-4 rounded-xl p-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition duration-200"
            >
              <div className="size-14 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-neutral-800 group-hover:shadow-brand transition duration-200">
                <Icon className="size-6 text-neutral-700 dark:text-neutral-200 group-hover:text-[#1E40FF] dark:group-hover:text-blue-400 transition duration-200" />
              </div>
              <div>
                <p className="font-bold text-black dark:text-white">
                  {tServices(`${slug}.title`)}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-[16rem]">
                  {tServices(`${slug}.summary`)}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
