import React from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonThree } from "./skeletons/third";
import { SkeletonMeasured } from "./skeletons/measured";
import { SkeletonThree as ShieldVisual } from "@/components/features/skeletons/third";

type Point = { title: string; text: string };

// Engineering first, people in control, data protected, measured results.
const cells = [
  {
    visual: <SkeletonThree />,
    cellClassName: "md:border-r border-b",
    skeletonClassName: "mask-radial-from-20%  mask-r-from-50%",
  },
  {
    visual: <SkeletonOne />,
    cellClassName: "border-b",
    skeletonClassName: "",
  },
  {
    visual: <ShieldVisual />,
    cellClassName: "md:border-r border-b md:border-b-0",
    skeletonClassName: "",
  },
  {
    visual: <SkeletonMeasured />,
    cellClassName: "",
    skeletonClassName: "",
  },
];

export const WhyUs = () => {
  const t = useTranslations("home.why");
  const points = t.raw("points") as Point[];
  return (
    <section
      id="about"
      className="pt-10 md:pt-20 lg:py-32 relative overflow-hidden scroll-mt-24"
    >
      <Container>
        <Heading>{t("title")}</Heading>
        <Subheading className="py-8">{t("intro")}</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800  divide-neutral-200 dark:divide-neutral-800">
          {points.map((point, index) => (
            <div
              key={point.title}
              className={cn(
                "border-neutral-200 dark:border-neutral-800",
                cells[index].cellClassName
              )}
            >
              <CardContent>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {point.title}
                </h3>
                <CardDescription>{point.text}</CardDescription>
              </CardContent>
              <CardSkeleton className={cells[index].skeletonClassName}>
                {cells[index].visual}
              </CardSkeleton>
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

export const CardSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative h-80 sm:h-60 flex flex-col md:h-80 overflow-hidden perspective-distant",
        className
      )}
    >
      {children}
    </div>
  );
};
