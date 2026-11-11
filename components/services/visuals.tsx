import React from "react";
import { categoryOf, type CategorySlug, type ServiceSlug } from "@/lib/site";
import { CardSkeleton } from "@/components/features/card";
import { SkeletonOne as AutomationVisual } from "@/components/features/skeletons/first";
import { SkeletonTwo as AgentRunVisual } from "@/components/features/skeletons/second";
import { SkeletonOne as ChatbotVisual } from "@/components/features-secondary/skeletons/first";
import { SkeletonTwo as IntegrationVisual } from "@/components/features-secondary/skeletons/second";
import { SkeletonFour as ConsultingVisual } from "@/components/features-tertiary/skeletons/four";
import { BrandVisual, SoftwareVisual } from "./category-visuals";

type VisualEntry = { Visual: React.ComponentType; className?: string };

const centred = "flex flex-col justify-center";

// One animated mockup per category, used on its home card and hub page.
const categoryVisuals: Record<CategorySlug, VisualEntry> = {
  "data-ai": { Visual: AgentRunVisual },
  "software-development": { Visual: SoftwareVisual, className: centred },
  brand: { Visual: BrandVisual, className: centred },
};

// Services with a mockup of their own; the others show their category's.
const serviceVisuals: Partial<Record<ServiceSlug, VisualEntry>> = {
  "ai-automation": { Visual: AutomationVisual },
  "generative-ai": { Visual: ChatbotVisual, className: "flex flex-col" },
  "document-extraction": { Visual: AutomationVisual },
  mcp: {
    Visual: IntegrationVisual,
    className: "flex flex-col mask-radial-from-50% mask-t-from-50%",
  },
  "ai-sprint": { Visual: ConsultingVisual, className: "flex flex-col" },
};

const Render = ({ entry, className }: { entry: VisualEntry; className?: string }) => (
  <CardSkeleton className={[entry.className, className].filter(Boolean).join(" ")}>
    <entry.Visual />
  </CardSkeleton>
);

export const CategoryVisual = ({
  category,
  className,
}: {
  category: CategorySlug;
  className?: string;
}) => <Render entry={categoryVisuals[category]} className={className} />;

export const ServiceVisual = ({ slug, className }: { slug: ServiceSlug; className?: string }) => (
  <Render
    entry={serviceVisuals[slug] ?? categoryVisuals[categoryOf(slug)]}
    className={className}
  />
);
