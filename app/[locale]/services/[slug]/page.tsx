import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconArrowLeft, IconCircleCheckFilled } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/features/card";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { ServiceVisual } from "@/components/services/visuals";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { serviceSlugs, site, type ServiceSlug } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({ locale, slug }))
  );
}

const isServiceSlug = (slug: string): slug is ServiceSlug =>
  (serviceSlugs as readonly string[]).includes(slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: `servicePages.${slug}` });
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: t("metaTitle"),
    description: t("summary"),
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations(`servicePages.${slug}`);
  const tServices = await getTranslations("services");
  const tCommon = await getTranslations("common");
  const features = t.raw("features") as { title: string; text: string }[];
  const useCases = t.raw("useCases") as string[];

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: t("title"),
          description: t("summary"),
          url: `${site.url}/${locale}/services/${slug}`,
          provider: { "@type": "Organization", name: site.name, url: site.url },
          areaServed: ["Middle East", "North Africa", "Africa"],
        }}
      />
      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition duration-200"
          >
            <IconArrowLeft className="size-4" />
            {tServices("back")}
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
            <div>
              <Heading as="h1">{t("title")}</Heading>
              <Subheading className="py-8">{t("intro")}</Subheading>
              <Button asChild className="shadow-brand">
                <Link href="/contact">{tCommon("startProject")}</Link>
              </Button>
            </div>
            <Card className="w-full rounded-3xl">
              <ServiceVisual slug={slug} />
            </Card>
          </div>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading>{tServices("featuresTitle")}</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 mt-10 md:mt-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={[
                  "p-4 md:p-8 border-neutral-200 dark:border-neutral-800",
                  index % 2 === 0 ? "md:border-r" : "",
                  index < 2 ? "border-b" : index === 2 ? "border-b md:border-b-0" : "",
                ].join(" ")}
              >
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading>{tServices("useCasesTitle")}</Heading>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 md:mt-16">
            {useCases.map((useCase) => (
              <li
                key={useCase}
                className="flex items-center gap-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6 font-medium"
              >
                <IconCircleCheckFilled className="size-5 shrink-0 text-neutral-500" />
                {useCase}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection />
    </div>
  );
}
