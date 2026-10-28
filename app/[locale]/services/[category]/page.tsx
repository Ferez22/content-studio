import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/features/card";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Delivery } from "@/components/services/delivery";
import { ServiceCards } from "@/components/services/service-cards";
import { CategoryVisual } from "@/components/services/visuals";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { breadcrumbJsonLd, translatedPageMetadata } from "@/lib/service-metadata";
import { categoryPath, categorySlugs, serviceCategories, type CategorySlug } from "@/lib/site";

type Props = { params: Promise<{ locale: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categorySlugs.map((category) => ({ locale, category }))
  );
}

const isCategorySlug = (slug: string): slug is CategorySlug =>
  (categorySlugs as string[]).includes(slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isCategorySlug(category)) return {};
  const t = await getTranslations({ locale, namespace: `serviceCategories.${category}` });
  return translatedPageMetadata({
    locale,
    namespace: `serviceCategories.${category}`,
    path: categoryPath(category),
    title: t("metaTitle"),
    description: t("summary"),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  if (!isCategorySlug(category)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations(`serviceCategories.${category}`);
  const tServices = await getTranslations("services");
  const tCommon = await getTranslations("common");
  const services = serviceCategories.find((c) => c.slug === category)!.services;

  const breadcrumbs = [
    { name: tServices("overview.title"), path: "/services" },
    { name: t("title"), path: categoryPath(category) },
  ];

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbJsonLd(locale, breadcrumbs)} />
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
            <Card className="w-full rounded-3xl">
              <CategoryVisual category={category} />
            </Card>
          </div>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading>{tServices("categoryServicesTitle")}</Heading>
          <ServiceCards services={services} className="mt-10 md:mt-16" />
        </Container>
      </section>

      <Delivery />

      <CtaSection />
    </div>
  );
}
