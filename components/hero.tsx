import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HeroWorkflow } from "./hero-workflow";
import { Figures } from "./figures";
import { LogoCloud } from "./logo-cloud";
import { AmbientTexture } from "./ambient-texture";

export const Hero = () => {
  const t = useTranslations("home");
  return (
    // overflow-x-clip, not overflow-hidden: the texture extends above the section, behind the navbar.
    <section className="pt-10 md:pt-20 lg:pt-32 relative isolate overflow-x-clip">
      <AmbientTexture className="absolute inset-x-0 -top-24 lg:-top-32 -z-10 h-[716px] md:h-[856px] lg:h-[988px]" />
      <Container>
        <Heading as="h1" className="text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-6xl">
          {t("hero.title")}
        </Heading>

        <Subheading className="py-8">{t("hero.subtitle")}</Subheading>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <Button asChild>
            <Link href="/book">{t("hero.primary")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/portfolio">{t("hero.secondary")}</Link>
          </Button>
        </div>
        <Figures
          className="mt-10 md:mt-14 max-w-3xl mx-auto text-center"
          items={t.raw("hero.kpis") as { value: string; label: string }[]}
        />
        <LogoCloud className="mt-8 md:mt-10" />
        <HeroWorkflow />
      </Container>
    </section>
  );
};
