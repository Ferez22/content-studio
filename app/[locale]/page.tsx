import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FAQs } from "@/components/faqs";
import { Features } from "@/components/features";
import { WhyUs } from "@/components/features-tertiary";
import { Hero } from "@/components/hero";
import { Team } from "@/components/team";
import { Contact } from "@/components/contact";
import { OpenAIPartner } from "@/components/openai-partner";
import { Testimonials } from "@/components/testimonials";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

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

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: `${site.url}/logo.png`,
          email: site.email,
          sameAs: [site.linkedin],
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
      <Hero />
      <Features />
      <OpenAIPartner />
      {/* <WhyUs /> */}
      <Team />
      <Testimonials />
      <FAQs />
      <Contact />
    </div>
  );
}
