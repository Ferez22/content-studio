import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  IconArrowUpRight,
  IconBrandLinkedin,
  IconId,
  IconSchool,
} from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletterThanks" });
  return {
    ...pageMetadata({
      locale,
      path: "/newsletter/thank-you",
      title: t("metaTitle"),
      description: t("text"),
    }),
    // A confirmation page has nothing to offer search results.
    robots: { index: false, follow: true },
  };
}

export default async function NewsletterThanksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("newsletterThanks");

  const links = [
    { href: site.linkedin, label: t("links.company"), icon: IconBrandLinkedin },
    { href: site.founderLinkedin, label: t("links.founder"), icon: IconBrandLinkedin },
    { href: site.founderCard, label: t("links.card"), icon: IconId },
    { href: site.esgitech, label: t("links.esgitech"), icon: IconSchool },
  ];

  return (
    <section className="min-h-[80vh] py-16 md:py-28">
      <Container className="max-w-3xl flex flex-col items-center text-center">
        <Reveal>
          <div className="relative size-36 md:size-44 rounded-full bg-white ring-1 ring-neutral-200 dark:ring-neutral-700 shadow-2xl shadow-[#1E40FF]/25 flex items-center justify-center overflow-hidden">
            <Image
              src="/robot/robot-poster.webp"
              alt=""
              width={480}
              height={480}
              priority
              className="size-[92%] object-contain float-bob"
            />
          </div>
        </Reveal>

        <p className="mt-10 text-xs md:text-sm font-medium uppercase tracking-wide text-[#1E40FF] dark:text-blue-400">
          {t("eyebrow")}
        </p>
        <Heading as="h1" className="mt-3">
          {t("title")}
        </Heading>
        <Subheading className="mt-6 mx-auto text-center max-w-2xl">{t("text")}</Subheading>

        <h2 className="mt-14 text-sm font-medium text-neutral-400">{t("linksTitle")}</h2>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
          {links.map(({ href, label, icon: Icon }, index) => (
            <Reveal key={href} delay={0.1 + index * 0.06}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-4 transition-colors duration-200 hover:border-[#1E40FF] dark:hover:border-blue-400"
              >
                <span className="size-9 shrink-0 rounded-full bg-white dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
                  <Icon className="size-4 text-neutral-700 dark:text-neutral-200 group-hover:text-[#1E40FF] dark:group-hover:text-blue-400 transition-colors" />
                </span>
                <span className="flex-1 text-sm font-medium">{label}</span>
                <IconArrowUpRight className="size-4 text-neutral-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          ))}
        </ul>

        <Button asChild className="mt-12">
          <Link href="/">{t("home")}</Link>
        </Button>
      </Container>
    </section>
  );
}
