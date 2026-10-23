import React from "react";
import { useTranslations } from "next-intl";
import { IconBrandLinkedin, IconMail, IconMapPin } from "@tabler/icons-react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const Contact = ({ as = "h2" }: { as?: "h1" | "h2" }) => {
  const t = useTranslations("home.contact");
  const tCommon = useTranslations("common");
  return (
    <section id="contact" className="py-10 md:py-20 lg:py-32 scroll-mt-24">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex flex-col items-start">
          <Heading as={as}>{t("title")}</Heading>
          <Subheading className="py-8">{t("text")}</Subheading>
          <dl className="flex flex-col gap-4 mb-8">
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
          <Button asChild className="shadow-brand">
            <Link href="/book">{tCommon("bookCall")}</Link>
          </Button>
        </div>
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-4 md:p-8">
          <ContactForm />
        </div>
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
