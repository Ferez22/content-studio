import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/features/card";
import { CtaSection } from "@/components/cta-section";
import { FAQs } from "@/components/faqs";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Delivery } from "@/components/services/delivery";
import { ServiceCards } from "@/components/services/service-cards";
import { Examples, Explainer, Included } from "@/components/services/service-sections";
import { HeroVideo } from "@/components/services/showcase-video";
import { MotionDesignHero, MotionDesignStory } from "@/components/services/motion-design";
import { ServiceVisual } from "@/components/services/visuals";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { breadcrumbJsonLd, translatedPageMetadata } from "@/lib/service-metadata";
import { serviceMedia } from "@/lib/service-media";
import {
  categoryOf,
  categoryPath,
  isServiceSlug,
  serviceCategories,
  servicePath,
  serviceSlugs,
  site,
} from "@/lib/site";

type Props = { params: Promise<{ locale: string; category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({ locale, category: categoryOf(slug), slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params;
  if (!isServiceSlug(slug) || categoryOf(slug) !== category) return {};
  const t = await getTranslations({ locale, namespace: `servicePages.${slug}` });
  return translatedPageMetadata({
    locale,
    namespace: `servicePages.${slug}`,
    path: servicePath(slug),
    title: t("metaTitle"),
    description: t("summary"),
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, category, slug } = await params;
  if (!isServiceSlug(slug) || categoryOf(slug) !== category) notFound();
  setRequestLocale(locale);
  const t = await getTranslations(`servicePages.${slug}`);
  const tServices = await getTranslations("services");
  const tCategory = await getTranslations(`serviceCategories.${category}`);
  const tCommon = await getTranslations("common");
  const features = t.raw("features") as { title: string; text: string }[];
  const useCases = t.raw("useCases") as string[];
  const faqs = t.raw("faq.items") as { question: string; answer: string }[];
  const media = serviceMedia[slug];
  // Video and motion design shows the craft itself: its own hero and scroll-driven story.
  const motionPage = slug === "video-motion" && media?.hero;
  const siblings = serviceCategories
    .find((c) => c.slug === category)!
    .services.filter((service) => service !== slug);

  const breadcrumbs = [
    { name: tServices("overview.title"), path: "/services" },
    { name: tCategory("title"), path: categoryPath(category) },
    { name: t("title"), path: servicePath(slug) },
  ];

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: t("title"),
          description: t("summary"),
          category: tCategory("title"),
          url: `${site.url}/${locale}${servicePath(slug)}`,
          provider: { "@type": "Organization", name: site.name, url: site.url },
          areaServed: ["Middle East", "North Africa", "Africa"],
        }}
      />
      <JsonLd data={breadcrumbJsonLd(locale, breadcrumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      {motionPage ? (
        <MotionDesignHero
          video={motionPage}
          cta={tCommon("startProject")}
          breadcrumbs={<Breadcrumbs label={tServices("breadcrumb")} items={breadcrumbs} />}
        />
      ) : (
        <section className="pt-10 md:pt-20 lg:pt-32">
          <Container>
            <Breadcrumbs label={tServices("breadcrumb")} items={breadcrumbs} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
              <div>
                <Heading as="h1">{t("title")}</Heading>
                <Subheading className="py-8">{t("intro")}</Subheading>
                <Button asChild className="shadow-brand">
                  <Link href="/contact">{tCommon("startProject")}</Link>
                </Button>
              </div>
              {media?.hero ? (
                <HeroVideo video={media.hero} label={t("title")} />
              ) : (
                <Card className="w-full rounded-3xl">
                  <ServiceVisual slug={slug} />
                </Card>
              )}
            </div>
          </Container>
        </section>
      )}

      {motionPage ? <MotionDesignStory explainVideo={media?.explain} /> : t.has("explainer") && <Explainer slug={slug} />}
      {media?.examples && t.has("examples") && <Examples slug={slug} videos={media.examples} />}
      {t.has("included") && <Included slug={slug} />}

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

      <Delivery />

      <FAQs namespace={`servicePages.${slug}.faq`} />

      <section>
        <Container>
          <Heading>{tServices("relatedTitle", { category: tCategory("title") })}</Heading>
          <ServiceCards services={siblings} className="mt-10 md:mt-16" />
        </Container>
      </section>

      <CtaSection />
    </div>
  );
}
