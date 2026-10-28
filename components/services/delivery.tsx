import { useTranslations } from "next-intl";
import { IconChecklist, IconUserCheck, IconUserShield } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

const icons = [IconUserShield, IconUserCheck, IconChecklist];

// How every project is delivered: vetted specialists, one project lead, quality control.
export const Delivery = () => {
  const t = useTranslations("services.delivery");
  const points = t.raw("points") as { title: string; text: string }[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Heading>{t("title")}</Heading>
        <Subheading className="pt-6">{t("intro")}</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-neutral-200 dark:border-neutral-800 mt-10 md:mt-16">
          {points.map((point, index) => {
            const Icon = icons[index];
            return (
              <div
                key={point.title}
                className="p-4 md:p-8 border-neutral-200 dark:border-neutral-800 border-b last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <Icon className="size-6 text-[#1E40FF] dark:text-blue-400" />
                <h3 className="mt-4 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {point.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
