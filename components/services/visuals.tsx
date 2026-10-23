import React from "react";
import type { ServiceSlug } from "@/lib/site";
import { CardSkeleton } from "@/components/features/card";
import { SkeletonOne as AutomationVisual } from "@/components/features/skeletons/first";
import { SkeletonTwo as AgentRunVisual } from "@/components/features/skeletons/second";
import { SkeletonOne as ChatbotVisual } from "@/components/features-secondary/skeletons/first";
import { SkeletonTwo as IntegrationVisual } from "@/components/features-secondary/skeletons/second";
import { SkeletonTwo as TrainingVisual } from "@/components/features-tertiary/skeletons/second";
import { SkeletonFour as ConsultingVisual } from "@/components/features-tertiary/skeletons/four";

// Each service keeps its own animated mockup, used on the home card and its page.
const visuals: Record<ServiceSlug, { Visual: React.ComponentType; className?: string }> = {
  "ai-agents": { Visual: AgentRunVisual },
  automation: { Visual: AutomationVisual },
  integration: {
    Visual: IntegrationVisual,
    className: "flex flex-col mask-radial-from-50% mask-t-from-50%",
  },
  consulting: { Visual: ConsultingVisual, className: "flex flex-col" },
  training: {
    Visual: TrainingVisual,
    className: "flex flex-col justify-center mask-radial-from-20%",
  },
  chatbots: { Visual: ChatbotVisual, className: "flex flex-col" },
};

export const ServiceVisual = ({
  slug,
  className,
}: {
  slug: ServiceSlug;
  className?: string;
}) => {
  const { Visual, className: visualClassName } = visuals[slug];
  return (
    <CardSkeleton className={[visualClassName, className].filter(Boolean).join(" ")}>
      <Visual />
    </CardSkeleton>
  );
};
