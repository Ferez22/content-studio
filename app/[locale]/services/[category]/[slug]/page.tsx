import type React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  IconArrowDown,
  IconChecklist,
  IconMessageChatbot,
  IconPlugConnected,
  IconSparkles,
  IconUserCheck,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/features/card";
import { CtaSection } from "@/components/cta-section";
import { FAQs } from "@/components/faqs";
import { JsonLd } from "@/components/json-ld";
import { Reveal, RevealItem, RevealList } from "@/components/reveal";
import { AgentGraph } from "@/components/services/agent-graph";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ChatbotDemo } from "@/components/services/chatbot-demo";
import { PlatformsVisual, Stats, Stories } from "@/components/services/proof";
import { Clients } from "@/components/services/clients";
import { AssistantCard } from "@/components/services/chatbots";
import { CrmDemo } from "@/components/services/crm-demo";
import { Delivery } from "@/components/services/delivery";
import { DemoStage } from "@/components/services/demo-stage";
import { ServiceCards } from "@/components/services/service-cards";
import { Examples, Explainer, Features, Included, Levels, UseCases } from "@/components/services/service-sections";
import { ArchitectureDiagram } from "@/components/services/system-graph";
import { HeroVideo } from "@/components/services/showcase-video";
import { MotionDesignHero, MotionDesignStory, MotionOffer } from "@/components/services/motion-design";
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
  type ServiceSlug,
} from "@/lib/site";

type Props = { params: Promise<{ locale: string; category: string; slug: string }> };

// Pages that go further than the standard layout. Each piece is optional:
// heroVisual     beside the hero text (instead of the category visual)
// wideHero       full width under the hero text
// sections       own sections right after the hero
// levelIcons     one icon per item of the `levels` copy
// useCasesAside  a visual next to the use cases
// afterUseCases  own sections after the use cases
// marquee        key features as a marquee
// demo           an interactive demo, last before the FAQ, opened by a "See the demo" button
// A page with any of these skips the general "How we deliver" section.
type Extras = {
  heroVisual?: React.ComponentType;
  wideHero?: React.ComponentType;
  sections?: React.ComponentType<{ slug: ServiceSlug }>[];
  levelIcons?: Icon[];
  useCasesAside?: React.ComponentType;
  marquee?: boolean;
  demo?: React.ComponentType;
  afterUseCases?: React.ComponentType<{ slug: ServiceSlug }>[];
};

const extras: Partial<Record<ServiceSlug, Extras>> = {
  chatbots: {
    heroVisual: ChatbotDemo,
    levelIcons: [IconMessageChatbot, IconPlugConnected, IconSparkles],
    useCasesAside: AssistantCard,
  },
  "ai-agents": {
    wideHero: AgentGraph,
    levelIcons: [IconChecklist, IconPlugConnected, IconUserCheck, IconUsersGroup],
  },
  "erp-crm-setup": {
    heroVisual: PlatformsVisual,
    sections: [Stats],
    afterUseCases: [Stories],
  },
  "crm-development": {
    heroVisual: ArchitectureDiagram,
    sections: [Clients],
    marquee: true,
    demo: CrmDemo,
  },
};

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
  const faqs = t.raw("faq.items") as { question: string; answer: string }[];
  const media = serviceMedia[slug];
  // Video and motion design shows the craft itself: its own hero and scroll-driven story.
  const motionPage = slug === "video-motion" && media?.hero;
  const page = extras[slug];
  const HeroVisual = page?.heroVisual;
  const WideHero = page?.wideHero;
  const UseCasesAside = page?.useCasesAside;
  const Demo = page?.demo;
  // Without a visual beside it, the hero text spreads over both columns.
  const textOnlyHero = Boolean(page && !HeroVisual && !media?.hero);
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
          areaServed: "France",
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
              <RevealList
                as="div"
                className={textOnlyHero ? "lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-end" : undefined}
              >
                <RevealItem as="div">
                  <Heading as="h1">{t("title")}</Heading>
                </RevealItem>
                <RevealItem as="div">
                  <Subheading className={textOnlyHero ? "py-8 lg:pt-0" : "py-8"}>{t("intro")}</Subheading>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href="/contact">{tCommon("startProject")}</Link>
                    </Button>
                    {Demo && (
                      <Button asChild variant="outline" className="border border-neutral-200 dark:border-neutral-700">
                        <a href="#demo">
                          {tServices("seeDemo")}
                          <IconArrowDown />
                        </a>
                      </Button>
                    )}
                  </div>
                </RevealItem>
              </RevealList>
              {media?.hero ? (
                <HeroVideo video={media.hero} label={t("title")} />
              ) : HeroVisual ? (
                <Reveal delay={0.25}>
                  <HeroVisual />
                </Reveal>
              ) : page ? null : (
                <Card className="w-full rounded-3xl">
                  <ServiceVisual slug={slug} />
                </Card>
              )}
            </div>
            {WideHero && (
              <Reveal delay={0.3} className="mt-10 md:mt-16">
                <WideHero />
              </Reveal>
            )}
          </Container>
        </section>
      )}

      {page?.sections?.map((Section, index) => <Section key={index} slug={slug} />)}
      {t.has("included") && <Included slug={slug} />}
      {motionPage ? <MotionDesignStory explainVideo={media?.explain} aliveVideo={media?.alive} /> : t.has("explainer") && <Explainer slug={slug} />}
      {media?.examples && t.has("examples") && <Examples slug={slug} videos={media.examples} />}
      {t.has("levels") && <Levels slug={slug} icons={page?.levelIcons ?? []} />}

      <Features slug={slug} marquee={page?.marquee} />
      {t.has("useCases") && <UseCases slug={slug} aside={UseCasesAside ? <UseCasesAside /> : undefined} />}
      {page?.afterUseCases?.map((Section, index) => <Section key={index} slug={slug} />)}

      {motionPage ? <MotionOffer /> : !page && <Delivery />}

      {Demo && (
        <DemoStage
          title={t("demo.title")}
          intro={t("demo.intro")}
          close={tServices("closeDemo")}
          expand={tServices("expandDemo")}
        >
          <Demo />
        </DemoStage>
      )}

      <FAQs namespace={`servicePages.${slug}.faq`} />

      <section>
        <Container>
          <Heading>{tServices("relatedTitle", { category: tCategory("title") })}</Heading>
          <ServiceCards services={siblings} className="mt-10 md:mt-16" reveal />
        </Container>
      </section>

      <CtaSection />
    </div>
  );
}
