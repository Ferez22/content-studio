import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HeroWorkflow } from "./hero-workflow";
import { Figures } from "./figures";

export const Hero = () => {
  const t = useTranslations("home");
  return (
    <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
      <Container>
        <Heading as="h1" className="text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-6xl">
          {t("hero.title")}
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
        <Figures
          className="mt-10 md:mt-14 max-w-3xl"
          items={t.raw("hero.kpis") as { value: string; label: string }[]}
        />
        <HeroWorkflow />
      </Container>
    </section>
  );
};
