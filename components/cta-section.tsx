import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";

export const CtaSection = () => {
  const t = useTranslations("common");
  return (
    <section className="py-10 md:py-20 lg:py-32">
      <Container>
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6 md:p-16 flex flex-col items-start">
          <Heading>{t("readyTitle")}</Heading>
          <Subheading className="py-8">{t("readyText")}</Subheading>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Button asChild>
              <Link href="/contact">{t("startProject")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/book">{t("bookCall")}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
