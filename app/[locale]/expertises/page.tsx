import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { CtaSection } from "@/components/cta-section";
import { Delivery } from "@/components/services/delivery";
import { ServiceCards } from "@/components/services/service-cards";
import { categoryIcons } from "@/components/service-icons";
import { TableOfContents } from "@/components/table-of-contents";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { translatedPageMetadata } from "@/lib/service-metadata";
import { categoryPath, expertisesPath, serviceCategories } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.overview" });
  return translatedPageMetadata({
    locale,
    namespace: "services.overview",
    path: expertisesPath,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tCategories = await getTranslations("serviceCategories");
  const toc = serviceCategories.map(({ slug }) => ({ id: slug, text: tCategories(`${slug}.title`) }));

  return (
    <div className="min-h-screen">
      <PageIntro title={t("overview.title")} intro={t("overview.intro")} />

      {/* A sticky list of the categories on the left (collapsible above them on phones);
          each link scrolls to its section and the one in view is highlighted. */}
      <Container className="pt-2 md:pt-6 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
        <aside className="hidden lg:block pt-10">
          <TableOfContents headings={toc} title={t("toc")} variant="sidebar" />
        </aside>
        <div>
          <div className="lg:hidden">
            <TableOfContents headings={toc} title={t("toc")} variant="inline" />
          </div>
          {serviceCategories.map(({ slug, services }) => {
            const Icon = categoryIcons[slug];
            return (
              <section key={slug} id={slug} className="pt-10 md:pt-16 scroll-mt-28">
                <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-8 md:pt-10">
                  <div className="flex items-start gap-4">
                    <div className="size-11 md:size-12 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
                      <Icon className="size-5 md:size-6 text-[#1E40FF] dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-4xl font-bold font-display tracking-tight">
                        {tCategories(`${slug}.title`)}
                      </h2>
                      <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-2xl">
                        {tCategories(`${slug}.summary`)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={categoryPath(slug)}
                    className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-black dark:text-white md:pb-1"
                  >
                    {t("exploreCategory", { category: tCategories(`${slug}.title`) })}
                    <IconArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Reveal>
                <ServiceCards services={services} className="mt-6 md:mt-8" reveal />
              </section>
            );
          })}
        </div>
      </Container>

      <Delivery />

      <CtaSection />
    </div>
  );
}
