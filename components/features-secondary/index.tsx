import React from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { LoopIcon, WorkflowIcon, IntegrationIcon } from "@/icons";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type Proof = { figure: string; text: string; source: string; url: string };
type Benefit = { title: string; text: string };

const benefitIcons = [<LoopIcon key="time" />, <WorkflowIcon key="project" />, <IntegrationIcon key="insight" />];

// "The cost of working without AI": the pain, two public proof points, three benefits.
export const CostOfManualWork = () => {
  const t = useTranslations("home.cost");
  const proofs = t.raw("proofs") as Proof[];
  const benefits = t.raw("benefits") as Benefit[];
  return (
    <section className="pt-10 md:pt-20 lg:py-32 relative overflow-hidden">
      <Container>
        <Heading>{t("title")}</Heading>
        <Subheading className="py-8">{t("text")}</Subheading>

        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400 mt-4 mb-4">
          {t("proofTitle")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
          {proofs.map((proof) => (
            <CardContent key={proof.url}>
              <p className="text-4xl md:text-6xl font-display font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
                {proof.figure}
              </p>
              <CardDescription>{proof.text}</CardDescription>
              <a
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-4 text-sm text-neutral-500 hover:text-black dark:hover:text-white underline underline-offset-4"
              >
                {proof.source}
                <IconArrowUpRight className="size-3" />
              </a>
            </CardContent>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 md:mt-20">
          {benefits.map((benefit, index) => (
            <div key={benefit.title}>
              <div className="flex items-center gap-2">
                {benefitIcons[index]}
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-neutral-500 text-base mt-2">{benefit.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 md:p-8">{children}</div>;
};

export const CardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
      {children}
    </p>
  );
};
