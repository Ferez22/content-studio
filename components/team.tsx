import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IconArrowUpRight, IconMail } from "@tabler/icons-react";
import { site } from "@/lib/site";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";

type Partner = { name: string; text: string };

export const Team = () => {
  const t = useTranslations("home.team");
  return (
    <section className="py-10 md:py-20 lg:py-32">
      <Container>
        <Heading>{t("title")}</Heading>
        <Subheading className="py-8">{t("intro")}</Subheading>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FounderCard className="lg:col-span-2" />
          <PartnersCard />
        </div>
      </Container>
    </section>
  );
};

export const FounderCard = ({ className }: { className?: string }) => {
  const t = useTranslations("home.team.founder");
  const skills = t.raw("skills") as string[];
  return (
    <div
      className={`rounded-3xl bg-neutral-50 dark:bg-neutral-800 p-6 md:p-10 flex flex-col sm:flex-row gap-6 ${className ?? ""}`}
    >
      <Image
        src="/team/fares-aouani-cherif.jpeg"
        alt={t("photoAlt")}
        width={800}
        height={800}
        className="size-28 md:size-36 shrink-0 rounded-2xl object-cover object-top ring-1 ring-black/10 dark:ring-white/10 shadow-brand"
      />
      <div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h3 className="text-lg md:text-2xl font-bold font-display">{t("name")}</h3>
          <a
            href={site.founderCard}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black dark:hover:text-white underline underline-offset-4"
          >
            {t("cardLink")}
            <IconArrowUpRight className="size-3" />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black dark:hover:text-white underline underline-offset-4"
          >
            <IconMail className="size-3" />
            {site.email}
          </a>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("role")}</p>
        <p className="text-neutral-600 dark:text-neutral-300 mt-4 max-w-xl">{t("bio")}</p>
        <ul className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill) => (
            <li
              key={skill}
              className="px-2 text-sm py-1 rounded-sm bg-neutral-200 dark:bg-neutral-700"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const PartnersCard = ({ className }: { className?: string }) => {
  const t = useTranslations("home.team");
  const partners = t.raw("partners") as Partner[];
  return (
    <div
      className={`rounded-3xl bg-neutral-50 dark:bg-neutral-800 p-6 md:p-10 ${className ?? ""}`}
    >
      <h3 className="text-base font-medium text-neutral-400">{t("partnersTitle")}</h3>
      <ul className="flex flex-col gap-4 mt-4">
        {partners.map((partner) => (
          <li key={partner.name}>
            {partner.name === "ESGITECH" ? (
              // The logo is white, so it sits on a dark rounded tile in both themes.
              <span className="inline-flex rounded-xl bg-neutral-950 px-4 py-3 ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src="/logoesgitech.svg"
                  alt={partner.name}
                  width={690}
                  height={130}
                  className="h-8 md:h-10 w-auto"
                />
              </span>
            ) : (
              <p className="text-lg md:text-2xl font-bold font-display">{partner.name}</p>
            )}
            <p className="text-neutral-600 dark:text-neutral-300 mt-3">{partner.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
