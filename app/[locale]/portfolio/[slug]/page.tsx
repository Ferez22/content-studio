import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { CtaSection } from "@/components/cta-section";
import { DemoBadge } from "@/components/demo-badge";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getEntry, getSlugs, type CaseStudyFrontmatter, getEntryLocales } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isServiceSlug, servicePath } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) =>
      (await getSlugs("portfolio", locale)).map((slug) => ({ locale, slug }))
    )
  );
  return params.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = await getEntry<CaseStudyFrontmatter>("portfolio", locale, slug);
  if (!entry) return {};
  return pageMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    locales: await getEntryLocales("portfolio", slug, routing.locales),
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = await getEntry<CaseStudyFrontmatter>("portfolio", locale, slug);
  if (!entry) notFound();
  const t = await getTranslations("portfolio");
  const tCommon = await getTranslations("common");
  const tServices = await getTranslations("servicePages");
  const { frontmatter } = entry;
  const service = isServiceSlug(frontmatter.service) ? frontmatter.service : null;

  return (
    <div className="min-h-screen">
      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container className="max-w-4xl">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition duration-200"
          >
            <IconArrowLeft className="size-4" />
            {t("back")}
          </Link>
          <div className="mt-8 flex items-center gap-2">
            {frontmatter.demo && <DemoBadge label={tCommon("demo")} />}
          </div>
          <Heading as="h1" className="mt-4">
            {frontmatter.title}
          </Heading>
          <Subheading className="py-8">{frontmatter.summary}</Subheading>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-neutral-200 dark:border-neutral-800 py-6">
            <div>
              <dt className="text-sm text-neutral-400">{t("sector")}</dt>
              <dd className="font-medium mt-1">{frontmatter.sector}</dd>
            </div>
            {service && (
              <div>
                <dt className="text-sm text-neutral-400">{t("service")}</dt>
                <dd className="font-medium mt-1">
                  <Link href={servicePath(service)} className="underline underline-offset-4">
                    {tServices(`${service}.title`)}
                  </Link>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-neutral-400">{t("result")}</dt>
              <dd className="font-medium mt-1">{frontmatter.result}</dd>
            </div>
          </dl>
          <article className="py-6">{entry.content}</article>
        </Container>
      </section>
      <CtaSection />
    </div>
  );
}
