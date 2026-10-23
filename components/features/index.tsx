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

// Outer corners of the 3 x 2 grid are rounded, like the original 3-card row.
const cornerClassNames = [
  "rounded-t-3xl lg:rounded-t-lg lg:rounded-tl-3xl",
  "",
  "lg:rounded-tr-3xl",
  "lg:rounded-bl-3xl",
  "",
  "rounded-b-3xl lg:rounded-b-lg lg:rounded-br-3xl",
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10 lg:mt-8">
          {serviceSlugs.map((slug, index) => (
            <Reveal key={slug} delay={0.1 + index * 0.08}>
              <Link href={`/services/${slug}`} className="group block h-full">
                <Card
                  className={cn(
                    "relative isolate overflow-hidden h-80 lg:h-[max(14rem,calc((100svh-17rem)/2))]",
                    cornerClassNames[index]
                  )}
                >
                  <ServiceVisual slug={slug} className="h-full sm:h-full md:h-full" />
                  <div className="absolute inset-x-0 bottom-0 z-30 px-4 md:px-6 pb-4 md:pb-6 pt-12 bg-gradient-to-t from-neutral-50 via-neutral-50/95 to-transparent dark:from-neutral-800 dark:via-neutral-800/95">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="transition-transform duration-300 ease-out">
                          {tServices(`${slug}.title`)}
                        </CardTitle>
                        <div className="grid grid-rows-[1fr] [@media(hover:hover)]:grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                          <p className="overflow-hidden text-sm md:text-base text-neutral-600 dark:text-neutral-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300 ease-out">
                            <span className="block pt-2">{tServices(`${slug}.summary`)}</span>
                          </p>
                        </div>
                      </div>
                      <CardCTA className="group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
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
