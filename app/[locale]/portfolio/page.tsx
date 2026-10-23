import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { CtaSection } from "@/components/cta-section";
import { DemoBadge } from "@/components/demo-badge";
import { Card, CardCTA, CardTitle } from "@/components/features/card";
import { Link } from "@/i18n/navigation";
import { getEntries, type CaseStudyFrontmatter } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return pageMetadata({
    locale,
    path: "/portfolio",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const tCommon = await getTranslations("common");
  const cases = await getEntries<CaseStudyFrontmatter>("portfolio", locale);

  return (
    <div className="min-h-screen">
      <PageIntro title={t("title")} intro={t("intro")} />
      <section className="py-10">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cases.map(({ slug, frontmatter }) => (
            <Link key={slug} href={`/portfolio/${slug}`} className="group block">
              <Card className="rounded-3xl p-6 md:p-10 h-full flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      {frontmatter.sector}
                      {frontmatter.demo && <DemoBadge label={tCommon("demo")} />}
                    </div>
                    <CardTitle>{frontmatter.title}</CardTitle>
                  </div>
                  <CardCTA className="group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                    <IconArrowUpRight />
                  </CardCTA>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300">{frontmatter.problem}</p>
                <div className="mt-auto border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <p className="text-sm text-neutral-400">{t("result")}</p>
                  <p className="font-medium mt-1">{frontmatter.result}</p>
                </div>
              </Card>
            </Link>
          ))}
        </Container>
      </section>
      <CtaSection />
    </div>
  );
}
