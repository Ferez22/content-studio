import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { NewsletterForm } from "@/components/newsletter-form";
import { Card, CardTitle } from "@/components/features/card";
import { Link } from "@/i18n/navigation";
import { getEntries, type PostFrontmatter } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata({
    locale,
    path: "/blog",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const format = await getFormatter();
  const posts = await getEntries<PostFrontmatter>("blog", locale);

  return (
    <div className="min-h-screen">
      <PageIntro title={t("title")} intro={t("intro")} />
      <section className="py-10 md:py-20">
        <Container>
          {posts.length === 0 ? (
            <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <p className="text-lg text-neutral-600 dark:text-neutral-300">{t("empty")}</p>
              <NewsletterForm />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {posts.map(({ slug, frontmatter, readingMinutes }) => (
                <Link key={slug} href={`/blog/${slug}`} className="group block">
                  <Card className="rounded-3xl p-6 md:p-8 h-full flex flex-col gap-4">
                    <p className="text-sm text-neutral-400">
                      {format.dateTime(new Date(frontmatter.date), { dateStyle: "long" })}
                      {" · "}
                      {t("readingTime", { minutes: readingMinutes })}
                    </p>
                    <CardTitle className="group-hover:underline underline-offset-4">
                      {frontmatter.title}
                    </CardTitle>
                    <p className="text-neutral-600 dark:text-neutral-300">{frontmatter.summary}</p>
                    {frontmatter.tags && (
                      <ul className="flex flex-wrap gap-2 mt-auto">
                        {frontmatter.tags.map((tag) => (
                          <li key={tag} className="px-2 text-xs py-1 rounded-sm bg-neutral-200 dark:bg-neutral-700">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
