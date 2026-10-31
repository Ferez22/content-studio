import { useTranslations } from "next-intl";
import { IconArrowRight, IconArrowUpRight, IconQuote } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Reveal, RevealItem, RevealList } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { ToolLogo, type ToolSlug } from "@/icons/tool-logos";

// Third-party proof for a service: published figures (`stats`) and customer stories from
// vendor case studies (`stories`). Every item links to its source, and each section says
// whose numbers or customers these are. Copy under servicePages.<slug>.stats / .stories.

type Stat = { value: string; label: string; source: string; url: string };
type Story = {
  quote: string;
  name: string;
  company: string;
  country: string;
  // The platform's logo when Simple Icons has it, otherwise its name.
  platform?: ToolSlug;
  platformName: string;
  result?: string;
  url: string;
};

export const Stats = ({ slug }: { slug: string }) => {
  const t = useTranslations(`servicePages.${slug}.stats`);
  const items = t.raw("items") as Stat[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Reveal>
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-6 max-w-2xl">{t("intro")}</Subheading>
        </Reveal>
        <RevealList className="mt-10 grid gap-3 md:mt-16 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <RevealItem
              key={item.label}
              className="flex flex-col rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-800 md:p-6"
            >
              <p className="font-display text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
                {item.value}
              </p>
              <p className="mt-3 text-neutral-700 dark:text-neutral-300">{item.label}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 pt-4 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {item.source}
                <IconArrowUpRight className="size-3.5" />
              </a>
            </RevealItem>
          ))}
        </RevealList>
        <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">{t("note")}</p>
          {t.has("guide") && (
            <Link
              href={t("guide.href")}
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#1E40FF] hover:underline dark:text-blue-400"
            >
              {t("guide.label")}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </Reveal>
      </Container>
    </section>
  );
};

export const Stories = ({ slug }: { slug: string }) => {
  const t = useTranslations(`servicePages.${slug}.stories`);
  const items = t.raw("items") as Story[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Reveal>
          <Heading>{t("title")}</Heading>
          <Subheading className="pt-6 max-w-2xl">{t("intro")}</Subheading>
        </Reveal>
        <RevealList className="mt-10 grid gap-3 md:mt-16 md:grid-cols-2 md:gap-4">
          {items.map((item) => (
            <RevealItem
              key={item.company}
              className="flex flex-col rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-800 md:p-8"
            >
              <IconQuote className="size-6 text-[#1E40FF] dark:text-blue-400" />
              <blockquote className="mt-3 text-lg text-neutral-800 dark:text-neutral-200">{item.quote}</blockquote>
              {item.result && (
                <p className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400">{item.result}</p>
              )}
              <div className="mt-auto flex items-center gap-3 pt-6">
                {/* The platform's logo on a white chip, visible in both themes. */}
                {item.platform ? (
                  <span
                    title={item.platformName}
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-neutral-700"
                  >
                    <ToolLogo tool={item.platform} className="size-5" />
                  </span>
                ) : (
                  <span className="shrink-0 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {item.platformName}
                  </span>
                )}
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-medium text-neutral-900 dark:text-neutral-100">{item.name}</span>
                  <span className="block text-neutral-500 dark:text-neutral-400">
                    {item.company}, {item.country}
                  </span>
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  {t("readStory")}
                  <IconArrowUpRight className="size-3.5" />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealList>
        <Reveal>
          <p className="mt-6 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">{t("note")}</p>
        </Reveal>
      </Container>
    </section>
  );
};

// Hero visual for setup services: the platforms we work with, as tiles. Logos only where
// Simple Icons has them and the brand allows it (Microsoft, Pipedrive and others by name).
const platforms: { name: string; logo?: ToolSlug }[] = [
  { name: "HubSpot", logo: "hubspot" },
  { name: "Salesforce", logo: "salesforce" },
  { name: "Odoo", logo: "odoo" },
  { name: "Zoho", logo: "zoho" },
  { name: "Pipedrive" },
  { name: "Dynamics 365" },
];

export const PlatformsVisual = () => {
  const t = useTranslations("services");
  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800 md:p-4">
      <p className="px-2 pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">{t("platformsTitle")}</p>
      <RevealList as="div" className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {platforms.map((platform) => (
          <RevealItem
            as="div"
            key={platform.name}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900"
          >
            {platform.logo && (
              <span className="flex size-12 items-center justify-center rounded-xl bg-white">
                <ToolLogo tool={platform.logo} className="size-8" />
              </span>
            )}
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{platform.name}</span>
          </RevealItem>
        ))}
      </RevealList>
    </div>
  );
};
