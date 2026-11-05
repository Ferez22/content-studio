import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconArrowUpRight, IconCircleCheckFilled, IconPlus } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Figures } from "@/components/figures";
import { FAQs } from "@/components/faqs";
import { CalEmbed } from "@/components/cal-embed";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { partnerProgramEnabled, partnerSlugs, site, type PartnerSlug } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

type Side = { title: string; items: string[] };
type Step = { time: string; title: string; text: string };
type JointForce = { pair: string; year: string; story: string; result: string; source: string };

export const dynamicParams = false;

export function generateStaticParams() {
  if (!partnerProgramEnabled) return [];
  return routing.locales.flatMap((locale) => partnerSlugs.map((slug) => ({ locale, slug })));
}

const isPartnerSlug = (slug: string): slug is PartnerSlug =>
  partnerProgramEnabled && (partnerSlugs as readonly string[]).includes(slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isPartnerSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: `partnerPages.${slug}` });
  return pageMetadata({
    locale,
    path: `/partners/${slug}`,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PartnerPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isPartnerSlug(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations(`partnerPages.${slug}`);
  const tShared = await getTranslations("partners");
  const tCommon = await getTranslations("common");
  const why = t.raw("why.items") as { title: string; text: string; source?: string }[];
  const you = t.raw("bring.you") as Side;
  const us = t.raw("bring.us") as Side;
  const steps = t.raw("steps.items") as Step[];
  const jointForces = tShared.raw("jointForces.items") as JointForce[];

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: `${site.url}/${locale}/partners/${slug}`,
          provider: { "@type": "Organization", name: site.name, url: site.url },
          areaServed: "France",
        }}
      />

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <p className="text-sm font-medium text-[#1E40FF] dark:text-blue-400">{t("eyebrow")}</p>
          <Heading as="h1" className="mt-4 max-w-4xl">
            {t("title")}
          </Heading>
          <Subheading className="py-8">{t("intro")}</Subheading>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Button asChild>
              <a href="#book">{tShared("bookCta")}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#how">{tShared("howCta")}</a>
            </Button>
          </div>
          <Figures
            className="mt-10 md:mt-14 max-w-4xl"
            items={tShared.raw("kpis") as { value: string; label: string }[]}
          />
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading className="max-w-4xl">{t("why.title")}</Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 md:mt-16">
            {why.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="h-full flex flex-col rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8">
                  <h3 className="text-lg font-bold font-display">{item.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2">{item.text}</p>
                  {item.source && <SourceLink href={item.source} label={tCommon("source")} />}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading className="max-w-4xl">{t("bring.title")}</Heading>
          <Subheading className="pt-6">{t("bring.intro")}</Subheading>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 md:mt-16">
            <BringCard side={you} />
            {/* Between the stacked cards on phones, centred over the seam on wider screens. */}
            <div
              aria-hidden="true"
              className="relative z-10 mx-auto -my-7 size-12 rounded-full bg-[#1E40FF] dark:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-[#1E40FF]/30 ring-8 ring-white dark:ring-neutral-950 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:my-0"
            >
              <IconPlus className="size-6" />
            </div>
            <BringCard side={us} />
          </div>
          <Reveal>
            <div className="mt-4 rounded-3xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-6 md:p-10">
              <h3 className="text-xl md:text-3xl font-bold font-display">{t("bring.together.title")}</h3>
              <p className="mt-3 max-w-3xl text-neutral-300 dark:text-neutral-600 md:text-lg">
                {t("bring.together.text")}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="how" className="pt-10 md:pt-20 lg:pt-32 scroll-mt-24">
        <Container>
          <Heading className="max-w-4xl">{t("steps.title")}</Heading>
          <ol className="mt-10 md:mt-16 border-y border-neutral-200 dark:border-neutral-800">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[4rem_12rem_1fr] gap-x-4 gap-y-1 py-6 md:py-8 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800"
              >
                <span className="font-display font-bold text-2xl md:text-3xl text-[#1E40FF] dark:text-blue-400 row-span-2 md:row-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-neutral-500 md:pt-2">{step.time}</span>
                <div className="col-start-2 md:col-start-3">
                  <h3 className="text-lg md:text-xl font-bold font-display">{step.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading className="max-w-4xl">{tShared("jointForces.title")}</Heading>
          <Subheading className="pt-6">{tShared("jointForces.intro")}</Subheading>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10 md:mt-16">
            {jointForces.map((item, index) => (
              <Reveal key={item.pair} delay={(index % 3) * 0.1}>
                <article className="h-full flex flex-col rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8">
                  <p className="text-sm text-neutral-500">{item.year}</p>
                  <h3 className="text-xl font-bold font-display mt-1">{item.pair}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-3">{item.story}</p>
                  <p className="mt-4 font-medium text-neutral-900 dark:text-neutral-100">{item.result}</p>
                  <SourceLink href={item.source} label={tCommon("source")} />
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <div className="rounded-3xl border border-[#1E40FF]/30 dark:border-blue-400/30 bg-[#1E40FF]/5 dark:bg-blue-400/10 p-6 md:p-12">
            <h2 className="text-2xl md:text-4xl font-bold font-display tracking-tight">{tShared("inMotion.title")}</h2>
            <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300 md:text-lg">{tShared("inMotion.text")}</p>
          </div>
        </Container>
      </section>

      <FAQs namespace={`partnerPages.${slug}.faq`} />

      <section id="book" className="pb-10 md:pb-20 lg:pb-32 scroll-mt-24">
        <Container>
          <Heading>{tShared("book.title")}</Heading>
          <Subheading className="py-8">{tShared("book.text")}</Subheading>
          <CalEmbed title={tShared("book.calendarTitle")} url={site.partnerBookingUrl || site.bookingUrl} />
        </Container>
      </section>
    </div>
  );
}

const SourceLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-auto pt-6 inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-[#1E40FF] dark:hover:text-blue-400 transition duration-200"
  >
    {label}
    <IconArrowUpRight className="size-4" />
  </a>
);

const BringCard = ({ side }: { side: Side }) => (
  <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-6 md:p-10">
    <h3 className="text-xl md:text-2xl font-bold font-display">{side.title}</h3>
    <ul className="mt-6 flex flex-col gap-3">
      {side.items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
          <IconCircleCheckFilled className="size-5 shrink-0 mt-0.5 text-neutral-400" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);
