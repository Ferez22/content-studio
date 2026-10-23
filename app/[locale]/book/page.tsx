import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return pageMetadata({
    locale,
    path: "/book",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  return (
    <div className="min-h-screen">
      <PageIntro title={t("title")} intro={t("intro")} />
      <section className="py-10 md:py-20">
        <Container>
          {site.bookingUrl ? (
            <div className="rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white">
              <iframe
                title={t("calendarTitle")}
                src={site.bookingUrl}
                className="block w-full h-[720px]"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <p className="text-lg text-neutral-600 dark:text-neutral-300">{t("fallback")}</p>
              <ContactForm />
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
