import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="py-20 md:py-32 min-h-[60vh]">
      <Container>
        <Heading as="h1">{t("title")}</Heading>
        <Subheading className="py-8">{t("text")}</Subheading>
        <Button asChild>
          <Link href="/">{t("home")}</Link>
        </Button>
      </Container>
    </section>
  );
}
