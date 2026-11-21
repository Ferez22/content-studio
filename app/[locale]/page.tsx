import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FAQs } from "@/components/faqs";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { AutomationOffer } from "@/components/automation-offer";
import { Team } from "@/components/team";
import { Contact } from "@/components/contact";
import { OpenAIPartner } from "@/components/openai-partner";
import { Testimonials } from "@/components/testimonials";
import { Method } from "@/components/method";
import { DeliveryModel } from "@/components/delivery-model";
import { CaseStudies } from "@/components/case-studies";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { categoryPath, serviceCategories, site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    locale,
    path: "",
    title: t("siteTitle"),
    description: t("siteDescription"),
    absoluteTitle: true,
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.faq");
  const faq = t.raw("items") as { question: string; answer: string }[];
  const tMeta = await getTranslations("metadata");
  const tCategories = await getTranslations("serviceCategories");

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          // What Google and AI assistants read about us: an AI studio in Nice serving PACA and
          // France, with its three offers. Add `address` once the Nice address is public.
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: site.name,
          url: `${site.url}/${locale}`,
          logo: `${site.url}/logo.png`,
          image: `${site.url}/og.png`,
          description: tMeta("siteDescription"),
          email: site.email,
          sameAs: [site.linkedin],
          areaServed: [
            { "@type": "City", name: "Nice" },
            { "@type": "AdministrativeArea", name: "Provence-Alpes-Côte d'Azur" },
            { "@type": "Country", name: "France" },
          ],
          knowsAbout: tMeta.raw("knowsAbout") as string[],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: tMeta("offerCatalog"),
            itemListElement: serviceCategories.map(({ slug }) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: tCategories(`${slug}.title`),
                description: tCategories(`${slug}.summary`),
                url: `${site.url}/${locale}${categoryPath(slug)}`,
              },
            })),
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      {/* Order (Fares 2026-11-21): promise, the three offers, what AI changes for you, the one-month
          method, who does the work, proof, then questions and contact. */}
      <Hero />
      <Features />
      <AutomationOffer />
      <Method />
      <DeliveryModel />
      <CaseStudies />
      <Testimonials />
      <OpenAIPartner />
      <Team />
      <FAQs />
      <Contact />
    </div>
  );
}
