import React from "react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { getEntry, type CaseStudyFrontmatter } from "@/lib/content";
import { Card, CardCTA, CardTitle } from "./features/card";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Reveal } from "./reveal";
import { clientLogos } from "./logo-cloud";

// Home: the client work we show first (Fares 2026-11-21): Docutrad's two case studies.
const featured = ["crm-startup-cloud-migration", "document-agent-mvp-one-week"];

export const CaseStudies = async () => {
  const locale = await getLocale();
  const t = await getTranslations("home.caseStudies");
  const tPortfolio = await getTranslations("portfolio");
  const entries = (
    await Promise.all(featured.map((slug) => getEntry<CaseStudyFrontmatter>("portfolio", locale, slug)))
  ).filter((entry) => entry !== null);
  if (entries.length === 0) return null;
  const docutrad = clientLogos.docutrad;
  return (
    <section id="case-studies" className="scroll-mt-24 py-10 md:py-20 lg:py-32">
      <Container>
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <Heading>{t("title")}</Heading>
            <Subheading className="pt-6 max-w-2xl">{t("intro")}</Subheading>
          </div>
          <Image
            src={docutrad.src}
            alt={docutrad.title}
            width={docutrad.width}
            height={docutrad.height}
            className="h-6 md:h-8 w-auto brightness-0 opacity-70 dark:invert"
          />
        </Reveal>
        <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {entries.map(({ slug, frontmatter }) => (
            <Reveal key={slug} className="h-full">
              <Link href={`/portfolio/${slug}`} className="group block h-full">
                <Card className="rounded-3xl p-6 md:p-10 h-full flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-neutral-500">{frontmatter.sector}</p>
                      <CardTitle>{frontmatter.title}</CardTitle>
                    </div>
                    <CardCTA className="group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                      <IconArrowUpRight />
                    </CardCTA>
                  </div>
                  <div className="mt-auto border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <p className="text-sm text-neutral-400">{tPortfolio("result")}</p>
                    <p className="font-medium mt-1">{frontmatter.result}</p>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <Link href="/portfolio" className="text-sm font-semibold underline underline-offset-4 hover:no-underline">
            {t("all")}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
};
