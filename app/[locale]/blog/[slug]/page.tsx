import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { AuthorCard } from "@/components/author-card";
import { TableOfContents } from "@/components/table-of-contents";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getEntries, getEntry, getSlugs, type PostFrontmatter, getEntryLocales } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) =>
      (await getSlugs("blog", locale)).map((slug) => ({ locale, slug }))
    )
  );
  return params.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = await getEntry<PostFrontmatter>("blog", locale, slug);
  if (!entry) return {};
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: entry.frontmatter.title,
    description: entry.frontmatter.description ?? entry.frontmatter.summary,
    locales: await getEntryLocales("blog", slug, routing.locales),
  });
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = await getEntry<PostFrontmatter>("blog", locale, slug);
  if (!entry) notFound();
  const t = await getTranslations("blog");
  const format = await getFormatter();
  const { frontmatter } = entry;
  const showToc = entry.headings.length > 1;
  const related = (await getEntries<PostFrontmatter>("blog", locale))
    .filter((post) => post.slug !== slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: frontmatter.title,
          description: frontmatter.description ?? frontmatter.summary,
          datePublished: frontmatter.date,
          dateModified: frontmatter.updated ?? frontmatter.date,
          inLanguage: locale,
          url: `${site.url}/${locale}/blog/${slug}`,
          author: { "@type": "Person", name: t("authorName") },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
      {frontmatter.faq && frontmatter.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: frontmatter.faq.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          }}
        />
      )}
      <section className="pt-10 md:pt-20 lg:pt-32">
        <Container className="max-w-6xl lg:grid lg:grid-cols-[minmax(0,48rem)_15rem] lg:justify-between lg:gap-12">
          <div className="min-w-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition duration-200"
            >
              <IconArrowLeft className="size-4" />
              {t("back")}
            </Link>
            <Heading as="h1" className="mt-8">
              {frontmatter.title}
            </Heading>
            <p className="text-sm text-neutral-400 mt-6">
              {format.dateTime(new Date(frontmatter.date), { dateStyle: "long" })}
              {" · "}
              {t("readingTime", { minutes: entry.readingMinutes })}
            </p>
            {frontmatter.updated && (
              <p className="text-sm text-neutral-400 mt-1">
                {t("lastUpdated", {
                  date: format.dateTime(new Date(frontmatter.updated), { month: "long", year: "numeric" }),
                })}
              </p>
            )}
            {showToc && (
              <div className="lg:hidden">
                <TableOfContents headings={entry.headings} title={t("toc")} variant="inline" />
              </div>
            )}
            <article className="py-6">{entry.content}</article>

            <AuthorCard />

            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-display font-bold">{t("related")}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {related.map((post) => (
                    <li key={post.slug}>
                      <Link href={`/blog/${post.slug}`} className="underline underline-offset-4">
                        {post.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {showToc && (
            <aside className="hidden lg:block">
              <TableOfContents headings={entry.headings} title={t("toc")} variant="sidebar" />
            </aside>
          )}
        </Container>
      </section>
      <CtaSection />
    </div>
  );
}
