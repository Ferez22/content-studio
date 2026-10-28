"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./logo";
import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { IconArrowUpRight, IconChevronDown, IconX } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import {
  categoryPath,
  partnerProgramEnabled,
  serviceCategories,
  servicePath,
  type CategorySlug,
} from "@/lib/site";
import { useMinimalNavbar } from "@/lib/navbar-mode";

const navlinks = [
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "about", href: "/#team" },
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
  const t = useTranslations("header");
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  // Where the visitor was when they brought the navbar back; scrolling on hides it again.
  const peekedAt = useRef<number | null>(null);
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    if (peekedAt.current !== null && Math.abs(y - peekedAt.current) > 160) {
      peekedAt.current = null;
      setPeek(false);
    }
  });

  // Full-screen sections can ask the navbar to step aside: it slides up out of view and a
  // thin pill stays at the top. Hovering (or tapping, on phones) the pill brings the navbar
  // back until the pointer leaves it or the visitor scrolls on. The bars stay in the layout,
  // so the page never jumps.
  const minimal = useMinimalNavbar();
  const [peek, setPeekState] = useState(false);
  const setPeek = (value: boolean) => {
    peekedAt.current = value ? window.scrollY : null;
    setPeekState(value);
  };
  useEffect(() => {
    if (!minimal) setPeekState(false);
  }, [minimal]);
  const hidden = minimal && !peek;

  return (
    <div className="sticky top-0 lg:top-2 z-50" onMouseLeave={() => minimal && setPeek(false)}>
      <motion.div
        initial={false}
        animate={hidden ? { y: "-160%", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={
          hidden
            ? { duration: 0.4, ease: [0.65, 0, 0.35, 1] }
            : { type: "spring", stiffness: 260, damping: 26 }
        }
        inert={hidden}
      >
        <DesktopNavbar scrolled={scrolled} />
        <MobileNavbar scrolled={scrolled} />
      </motion.div>
      <AnimatePresence>
        {hidden && (
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
            <motion.button
              type="button"
              aria-label={t("showMenu")}
              onClick={() => setPeek(true)}
              onMouseEnter={() => setPeek(true)}
              onFocus={() => setPeek(true)}
              initial={{ opacity: 0, scaleX: 0.3 }}
              animate={{ opacity: 1, scaleX: 1, transition: { delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scaleX: 0.3, transition: { duration: 0.2 } }}
              className="pointer-events-auto px-6 py-3 lg:py-2 focus-visible:outline-none group"
            >
              <span className="block h-[5px] w-[134px] rounded-full bg-white/90 shadow-[0_0_0_1px_rgb(0_0_0/0.15)] group-hover:bg-white group-focus-visible:ring-2 group-focus-visible:ring-blue-400 transition-colors" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileNavbar = ({ scrolled }: { scrolled: boolean }) => {
  const t = useTranslations("header");
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
        "flex lg:hidden px-5 justify-between items-center relative transition-[padding,background-color,border-color] duration-300 border-b",
        scrolled
          ? "py-3 border-neutral-200 dark:border-neutral-800 bg-background/85 backdrop-blur-md"
          : "py-4 border-transparent bg-background",
      )}
    >
      <div className="flex items-center gap-3">
        <Logo compact={scrolled} />
        <PartnerCta />
      </div>
      <button
        ref={buttonRef}
        onClick={openMenu}
        aria-label={t("openMenu")}
        aria-expanded={open}
        className="group flex size-10 -mr-2 flex-col items-end justify-center gap-1.5 px-2"
      >
        {/* Burger with a shorter top bar that stretches to full width on press/hover. */}
        <span className="h-0.5 w-3.5 rounded-full bg-current transition-all duration-300 group-hover:w-6 group-active:w-6" />
        <span className="h-0.5 w-6 rounded-full bg-current" />
        <span className="h-0.5 w-6 rounded-full bg-current" />
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
                  <div className="flex justify-between items-center px-1 pt-0">
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
                        {item.key === "services" && <MobileServices onNavigate={close} />}
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
      <div className="flex items-center gap-4">
        <Logo compact={scrolled} />
        <PartnerCta />
      </div>
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

// Desktop: the six categories in three columns, each with its services. Plain text links:
// an underline draws in and an arrow appears on hover.
const ServicesMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  const t = useTranslations("header");
  const tCategories = useTranslations("serviceCategories");
  const tServices = useTranslations("servicePages");
  return (
    <div className="w-[48rem] p-2">
      <div className="grid grid-cols-3 gap-x-8 gap-y-7">
        {serviceCategories.map(({ slug, services }, index) => (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 + index * 0.04 }}
          >
            <MenuLink
              href={categoryPath(slug)}
              onClick={onNavigate}
              className="text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            >
              {tCategories(`${slug}.title`)}
            </MenuLink>
            <ul className="mt-2 flex flex-col">
              {services.map((service) => (
                <li key={service}>
                  <MenuLink
                    href={servicePath(service)}
                    onClick={onNavigate}
                    className="text-sm text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white"
                  >
                    {tServices(`${service}.title`)}
                  </MenuLink>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <MenuLink
          href="/services"
          onClick={onNavigate}
          className="text-sm font-semibold text-black dark:text-white"
        >
          {t("allServices")}
        </MenuLink>
      </div>
    </div>
  );
};

const MenuLink = ({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn("group/link inline-flex w-fit items-center gap-1 py-1 transition-colors duration-200 focus-visible:outline-none", className)}
  >
    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat [background-position:0_100%] [background-size:0%_1px] group-hover/link:[background-size:100%_1px] group-focus-visible/link:[background-size:100%_1px] transition-[background-size] duration-300 ease-out">
      {children}
    </span>
    <IconArrowUpRight
      aria-hidden="true"
      className="size-3.5 shrink-0 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-focus-visible/link:opacity-100 group-focus-visible/link:translate-x-0 transition duration-200"
    />
  </Link>
);

// Phones: one row per category that opens to show its services.
const MobileServices = ({ onNavigate }: { onNavigate: () => void }) => {
  const t = useTranslations("header");
  const tCategories = useTranslations("serviceCategories");
  const tServices = useTranslations("servicePages");
  const [expanded, setExpanded] = useState<CategorySlug | null>(null);
  return (
    <ul className="mt-3 ml-1 flex flex-col border-l border-neutral-200 dark:border-neutral-800 pl-4">
      {serviceCategories.map(({ slug, services }) => {
        const isOpen = expanded === slug;
        return (
          <li key={slug}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : slug)}
              aria-expanded={isOpen}
              aria-controls={`mobile-services-${slug}`}
              className="flex w-full items-center justify-between gap-3 py-2 text-left text-base font-medium text-neutral-600 dark:text-neutral-300"
            >
              {tCategories(`${slug}.title`)}
              <IconChevronDown
                className={cn("size-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul
                  id={`mobile-services-${slug}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden flex flex-col gap-2 pl-3"
                >
                  <li className="pt-1">
                    <Link
                      href={categoryPath(slug)}
                      onClick={onNavigate}
                      className="text-sm font-semibold text-black dark:text-white"
                    >
                      {t("categoryOverview")}
                    </Link>
                  </li>
                  {services.map((service) => (
                    <li key={service} className="last:pb-2">
                      <Link
                        href={servicePath(service)}
                        onClick={onNavigate}
                        className="text-sm text-neutral-500 dark:text-neutral-400"
                      >
                        {tServices(`${service}.title`)}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

// Partner program entry point: a light, italic text link so it stays secondary to the main CTA.
const PartnerCta = () => {
  const t = useTranslations("header");
  if (!partnerProgramEnabled) return null;
  return (
    <Link
      href="/partners"
      className="inline-flex items-center gap-1 text-sm font-light italic text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] rounded-sm"
    >
      {t("becomePartner")}
      <IconArrowUpRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
};
