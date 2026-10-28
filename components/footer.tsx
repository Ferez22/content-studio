import React from "react";
import { Logo } from "./logo";
import { Container } from "./container";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { IconArrowUpRight, IconBrandLinkedin } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { useTranslations } from "next-intl";
import { categoryPath, categorySlugs, partnerProgramEnabled, site } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

const linkClassName =
  "text-neutral-600 text-sm hover:text-black dark:text-neutral-400 dark:hover:text-white transition duration-200";

const Separator = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn(
      "h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700",
      className
    )}
  />
);

export const Footer = () => {
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");
  const tCategories = useTranslations("serviceCategories");

  const company = [
    { title: tHeader("about"), href: "/about" },
    { title: tHeader("blog"), href: "/blog" },
    { title: tHeader("portfolio"), href: "/portfolio" },
    ...(partnerProgramEnabled ? [{ title: tHeader("partners"), href: "/partners" }] : []),
    { title: tHeader("contact"), href: "/contact" },
  ];

  return (
    <footer className="border-t perspective-distant overflow-hidden border-neutral-200 dark:border-neutral-800 pt-10 md:pt-16 pb-8 relative">
      <Container className="grid grid-cols-1 lg:grid-cols-5 gap-10 relative z-20">
        <div
          id="newsletter"
          className="lg:col-span-2 flex flex-col gap-4 items-start scroll-mt-24"
        >
          <Logo />
          <Subheading>{t("positioning")}</Subheading>
          <div className="mt-4 w-full flex flex-col gap-2">
            <h4 className="text-base font-medium text-black dark:text-white">
              {t("newsletterTitle")}
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-2">
              {t("newsletterText")}
            </p>
            <NewsletterForm />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-400">
            {t("services")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            {categorySlugs.map((slug) => (
              <li key={slug}>
                <Link href={categoryPath(slug)} className={linkClassName}>
                  {tCategories(`${slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-400">
            {t("company")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClassName}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-400">
            {t("contact")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            <li>
              <a href={`mailto:${site.email}`} className={linkClassName}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.url} className={linkClassName}>
                qartmina.com
              </a>
            </li>
            <li className="text-neutral-600 text-sm dark:text-neutral-400">
              {t("location")}
            </li>
          </ul>
        </div>
      </Container>

      <Container className="relative z-20 mt-10 md:mt-12">
        <Separator />
        <div className="flex justify-center py-8 md:py-10">
          <Button asChild size="lg" className="shadow-brand">
            <Link href="/book">
              {tHeader("bookCall")}
              <IconArrowUpRight />
            </Link>
          </Button>
        </div>
        <Separator />
      </Container>

      <Container className="flex flex-col sm:flex-row justify-between mt-6 relative z-20 gap-4 md:gap-0">
        <p className="text-sm text-neutral-500">
          {t("rights", { year: new Date().getFullYear() })}
        </p>

        <div className="flex md:items-end items-start flex-col gap-4">
          <div className="flex items-center gap-4 *:text-sm *:text-neutral-500">
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/terms">{t("terms")}</Link>
            <Link href="/legal">{t("legal")}</Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <IconBrandLinkedin className="size-4" />
            </a>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "flex items-center justify-center gap-20 h-[200%]",
          "absolute -inset-x-[150%] -inset-y-40",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,var(--color-neutral-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-100)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,var(--color-neutral-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-900)_1px,transparent_1px)]",
          "mask-radial-from-50%"
        )}
        style={{
          transform: " rotateX(60deg) ",
        }}
      />
    </footer>
  );
};
