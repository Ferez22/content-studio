import React from "react";
import { useTranslations } from "next-intl";
import { IconBrandLinkedin, IconMail, IconMapPin } from "@tabler/icons-react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { site } from "@/lib/site";
import { ContactTabs } from "./contact-tabs";

export const Contact = ({ as = "h2" }: { as?: "h1" | "h2" }) => {
  const t = useTranslations("home.contact");
  return (
    <section id="contact" className="py-10 md:py-20 lg:py-32 scroll-mt-24 overflow-x-clip">
      <Container>
        <div className="text-center flex flex-col items-center">
          <Heading as={as}>{t("title")}</Heading>
          <Subheading className="py-6 md:py-8 mx-auto text-center">{t("text")}</Subheading>
        </div>
        <ContactTabs
          labels={{ call: t("tabs.call"), message: t("tabs.message") }}
          calendarTitle={t("calendarTitle")}
        />
        <dl className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Detail icon={<IconMail className="size-4" />} label={t("emailLabel")}>
            <a href={`mailto:${site.email}`} className="hover:underline underline-offset-4">
              {site.email}
            </a>
          </Detail>
          <Detail icon={<IconBrandLinkedin className="size-4" />} label={t("linkedinLabel")}>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4"
            >
              linkedin.com/company/qartmina
            </a>
          </Detail>
          <Detail icon={<IconMapPin className="size-4" />} label={t("locationLabel")}>
            {t("location")}
          </Detail>
        </dl>
      </Container>
    </section>
  );
};

const Detail = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 shrink-0 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <dt className="text-sm text-neutral-400">{label}</dt>
        <dd className="text-neutral-700 dark:text-neutral-200">{children}</dd>
      </div>
    </div>
  );
};
