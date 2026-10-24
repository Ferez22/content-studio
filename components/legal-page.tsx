import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "./container";
import { Heading } from "./heading";

// Date the legal texts were last reviewed.
const UPDATED = new Date("2026-10-24");

export const LegalPage = async ({
  document,
}: {
  document: "privacy" | "terms" | "notice";
}) => {
  const t = await getTranslations("legal");
  const format = await getFormatter();
  const sections = t.raw(`${document}.sections`) as { heading: string; body: string[] }[];

  return (
    <section className="py-10 md:py-20 lg:py-32 min-h-screen">
      <Container className="max-w-3xl">
        <Heading as="h1">{t(`${document}.title`)}</Heading>
        <p className="text-sm text-neutral-400 mt-6">
          {t("updated", { date: format.dateTime(UPDATED, { dateStyle: "long" }) })}
        </p>
        {sections.map((section) => (
          <div key={section.heading} className="mt-10">
            <h2 className="text-xl md:text-2xl font-display font-bold">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </Container>
    </section>
  );
};
