import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";

export type Collection = "portfolio" | "blog";

export type CaseStudyFrontmatter = {
  title: string;
  summary: string;
  sector: string;
  service: string;
  problem: string;
  result: string;
  demo?: boolean;
  date: string;
};

export type PostFrontmatter = {
  title: string;
  summary: string;
  date: string;
  tags?: string[];
};

const dir = (collection: Collection, locale: string) =>
  path.join(process.cwd(), "content", collection, locale);

export const getSlugs = async (collection: Collection, locale: string) => {
  try {
    const files = await fs.readdir(dir(collection, locale));
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    // A collection without any entries for this locale yet.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
};

export const getEntry = async <T extends { date: string }>(
  collection: Collection,
  locale: string,
  slug: string
) => {
  let source: string;
  try {
    source = await fs.readFile(
      path.join(dir(collection, locale), `${slug}.mdx`),
      "utf8"
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  const { content, frontmatter } = await compileMDX<T>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
  const words = source.split(/\s+/).length;
  return {
    slug,
    frontmatter,
    content,
    readingMinutes: Math.max(1, Math.ceil(words / 200)),
  };
};

// Newest first.
export const getEntries = async <T extends { date: string }>(
  collection: Collection,
  locale: string
) => {
  const slugs = await getSlugs(collection, locale);
  const entries = await Promise.all(
    slugs.map((slug) => getEntry<T>(collection, locale, slug))
  );
  return entries
    .filter((entry) => entry !== null)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
};

// Locales in which a given entry exists.
export const getEntryLocales = async (collection: Collection, slug: string, locales: readonly string[]) => {
  const found = await Promise.all(
    locales.map(async (locale) => ((await getSlugs(collection, locale)).includes(slug) ? locale : null))
  );
  return found.filter((locale): locale is string => locale !== null);
};
