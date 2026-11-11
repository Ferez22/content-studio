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
  expertisesPath,
  categoryPath,
  partnerProgramEnabled,
  serviceCategories,
  servicePath,
  type CategorySlug,
  type ServiceSlug,
} from "@/lib/site";
import { ServiceCardMedia } from "./services/service-card-media";

const navlinks = [
  { key: "services", href: expertisesPath },
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
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <div className="sticky top-0 lg:top-2 z-50">
      <DesktopNavbar scrolled={scrolled} />
      <MobileNavbar scrolled={scrolled} />
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
            // Not positioned: the menu below anchors to the full-width navbar wrapper, so the
            // wide services menu is centred on the page rather than on this link.
            <div
              key={item.key}
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
                // Full-width strip under the navbar (anchored to the sticky wrapper), so the wide
                // menu is centred on the page. Only the menu takes the pointer, including the gap
                // above it (its padding), so the hover is not lost on the way down.
                <div className="pointer-events-none absolute inset-x-0 top-full flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-auto origin-top pt-6"
                  >
                    <motion.div
                      transition={menuSpring}
                      layoutId="nav-menu"
                      className="bg-white dark:bg-neutral-950 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl"
                    >
                      <motion.div layout className="w-max h-full p-4">
                        <ServicesMenu onNavigate={() => setActive(null)} />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
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

// Elements inside the services menu come in one after another: a short rise and unblur.
const menuItem = (delay: number) => ({
  initial: { opacity: 0, y: 6, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Desktop: the six categories in three columns, each with its services. Plain text links:
// an underline draws in and an arrow appears on hover. From xl, a square preview on the left
// shows the hovered service's card media (a category shows its first service).
const ServicesMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  const t = useTranslations("header");
  const tCategories = useTranslations("serviceCategories");
  const tServices = useTranslations("servicePages");
  const [preview, setPreview] = useState<ServiceSlug>(serviceCategories[0].services[0]);
  return (
    <div className="flex gap-7 p-2">
      <motion.div {...menuItem(0.04)} className="hidden xl:block w-60 shrink-0">
        <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 bg-neutral-100 dark:bg-neutral-900">
          <AnimatePresence initial={false}>
            <motion.div
              key={preview}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <ServiceCardMedia slug={preview} className="aspect-auto size-full" />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-3 text-sm font-semibold text-black dark:text-white">{tServices(`${preview}.title`)}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-3">
          {tServices(`${preview}.summary`)}
        </p>
      </motion.div>
    <div className="w-[48rem]">
      <div className="grid grid-cols-3 gap-x-8 gap-y-7">
        {serviceCategories.map(({ slug, services }, index) => (
          <motion.div
            key={slug}
            {...menuItem(0.06 + index * 0.04)}
          >
            <MenuLink
              href={categoryPath(slug)}
              onClick={onNavigate}
              onHover={() => setPreview(services[0])}
              className="text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            >
              {tCategories(`${slug}.title`)}
            </MenuLink>
            <ul className="mt-2 flex flex-col">
              {services.map((service, position) => (
                <motion.li key={service} {...menuItem(0.1 + index * 0.04 + position * 0.03)}>
                  <MenuLink
                    href={servicePath(service)}
                    onClick={onNavigate}
                    onHover={() => setPreview(service)}
                    className="text-sm text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white"
                  >
                    {tServices(`${service}.title`)}
                  </MenuLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <motion.div {...menuItem(0.35)} className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <MenuLink
          href={expertisesPath}
          onClick={onNavigate}
          className="text-sm font-semibold text-black dark:text-white"
        >
          {t("allServices")}
        </MenuLink>
      </motion.div>
    </div>
    </div>
  );
};

const MenuLink = ({
  href,
  onClick,
  onHover,
  className,
  children,
}: {
  href: string;
  onClick: () => void;
  onHover?: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    onClick={onClick}
    onMouseEnter={onHover}
    onFocus={onHover}
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
