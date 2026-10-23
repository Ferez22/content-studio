import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { PageIntro } from "@/components/page-intro";
import { CtaSection } from "@/components/cta-section";
import { Figures } from "@/components/figures";
import { FounderCard, PartnersCard } from "@/components/team";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const Tags = ({ label, items }: { label: string; items: string[] }) => (
  <div>
    <p className="text-sm text-neutral-400">{label}</p>
    <ul className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <li key={item} className="px-2 text-sm py-1 rounded-sm bg-neutral-200 dark:bg-neutral-700">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const layers = t.raw("layers") as { title: string; text: string }[];

  return (
    <div className="min-h-screen">
      <PageIntro title={t("title")} intro={t("intro")} />

      <section className="pt-10 md:pt-20">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <Heading>{t("nameTitle")}</Heading>
            <Subheading className="py-8">{t("nameText")}</Subheading>
          </div>
          <div>
            <Heading>{t("founderTitle")}</Heading>
            <FounderCard className="mt-8" />
          </div>
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container>
          <Heading>{t("methodTitle")}</Heading>
          <Subheading className="py-8">{t("methodIntro")}</Subheading>
          <ol className="grid grid-cols-1 md:grid-cols-3 border-y border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
            {layers.map((layer, index) => (
              <li key={layer.title} className="p-4 md:p-8">
                <p className="text-sm text-neutral-400">0{index + 1}</p>
                <h3 className="text-lg md:text-2xl font-bold font-display mt-2">{layer.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">{layer.text}</p>
              </li>
            ))}
          </ol>
          <Figures
            className="mt-10 md:mt-16"
            items={t.raw("rhythm") as { value: string; label: string }[]}
          />
        </Container>
      </section>

      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <Heading>{t("locationsTitle")}</Heading>
            <Subheading className="py-8">{t("locationsText")}</Subheading>
            <div className="flex flex-col gap-6">
              <Tags label={t("coreMarketsLabel")} items={t.raw("coreMarkets") as string[]} />
              <Tags label={t("reachLabel")} items={t.raw("reach") as string[]} />
            </div>
          </div>
          <div>
            <Heading>{t("partnersTitle")}</Heading>
            <PartnersCard className="mt-8" />
          </div>
        </Container>
      </section>

      <CtaSection />
    </div>
  );
}
