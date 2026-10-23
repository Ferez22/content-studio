import React from "react";
import { Container } from "../container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { Card, CardCTA, CardTitle } from "./card";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { serviceSlugs } from "@/lib/site";
import { ServiceVisual } from "../services/visuals";
import { Reveal } from "../reveal";
import { Figures } from "../figures";
import { cn } from "@/lib/utils";

// Outer corners of the grid are rounded: 2 x 3 on phones, 3 x 2 from lg.
const cornerClassNames = [
  "rounded-tl-3xl",
  "rounded-tr-3xl lg:rounded-tr-lg",
  "lg:rounded-tr-3xl",
  "lg:rounded-bl-3xl",
  "rounded-bl-3xl lg:rounded-bl-lg",
  "rounded-br-3xl",
];

export const Features = () => {
  const t = useTranslations("home");
  const tServices = useTranslations("servicePages");
  return (
    <section id="services" className="scroll-mt-24">
      <Container className="py-10 md:py-20 lg:py-10">
        <Reveal className="flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-6 xl:gap-10">
          <Heading className="text-center lg:text-left">{t("services.title")}</Heading>
          <Subheading className="text-center lg:text-left mx-auto lg:mx-0">
            {t("services.intro")}
          </Subheading>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-10 lg:mt-8">
          {serviceSlugs.map((slug, index) => (
            <Reveal key={slug} delay={0.1 + index * 0.08}>
              <Link href={`/services/${slug}`} className="group block h-full">
                <Card
                  className={cn(
                    "relative isolate overflow-hidden h-44 sm:h-60 lg:h-[max(14rem,calc((100svh-17rem)/2))]",
                    cornerClassNames[index]
                  )}
                >
                  <ServiceVisual
                    slug={slug}
                    className="h-full sm:h-full md:h-full max-lg:w-[161%] max-lg:h-[161%] max-lg:origin-top-left max-lg:scale-[0.62]"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-30 px-3 md:px-6 pb-3 md:pb-6 pt-8 md:pt-12 bg-gradient-to-t from-neutral-50 via-neutral-50/95 to-transparent dark:from-neutral-800 dark:via-neutral-800/95">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-lg md:text-2xl leading-snug transition-transform duration-300 ease-out">
                          {tServices(`${slug}.title`)}
                        </CardTitle>
                        <div className="hidden lg:grid grid-rows-[1fr] [@media(hover:hover)]:grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                          <p className="overflow-hidden text-sm md:text-base text-neutral-600 dark:text-neutral-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300 ease-out">
                            <span className="block pt-2">{tServices(`${slug}.summary`)}</span>
                          </p>
                        </div>
                      </div>
                      <CardCTA className="hidden sm:flex group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                        <IconArrowUpRight />
                      </CardCTA>
                    </div>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
        <Figures
          className="mt-10 md:mt-16"
          items={t.raw("figures") as { value: string; label: string }[]}
        />
      </Container>
    </section>
  );
};
