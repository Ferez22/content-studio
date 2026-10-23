import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HeroWorkflow } from "./hero-workflow";
import { Typewriter } from "./typewriter";

export const Hero = () => {
  const t = useTranslations("home");
  const [before, after] = (t.raw("hero.titleTemplate") as string).split("{target}");
  const targets = t.raw("hero.targets") as string[];
  const longest = targets.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
      <Container>
        <Heading as="h1">
          <span className="sr-only">{t("hero.title")}</span>
          {/* The invisible longest phrase reserves the height, so typing never shifts the layout. */}
          <span aria-hidden="true" className="grid">
            <span className="invisible col-start-1 row-start-1">
              {before}
              <span className="whitespace-nowrap">{longest}</span>
              {after}
            </span>
            <span className="col-start-1 row-start-1">
              {before}
              <Typewriter phrases={targets} />
              {after}
            </span>
          </span>
        </Heading>

        <Subheading className="py-8">{t("hero.subtitle")}</Subheading>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <Button asChild className="shadow-brand">
            <Link href="/book">{t("hero.primary")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/portfolio">{t("hero.secondary")}</Link>
          </Button>
        </div>
        <HeroWorkflow />
      </Container>
    </section>
  );
};
