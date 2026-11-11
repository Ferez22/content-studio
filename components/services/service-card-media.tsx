import React from "react";
import Image from "next/image";
import { ToolLogo, type ToolSlug } from "@/icons/tool-logos";
import type { ServiceSlug } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CardVisual, type CardVisualKind } from "./card-visuals";
import { servicePhotos } from "./service-photos";

// The top of each service card in the home category panel: a stock photo or a small
// animated UI, with the logos of the tools involved where the visual does not show them.
const media: Partial<Record<ServiceSlug, { visual?: CardVisualKind; tools?: ToolSlug[] }>> = {
  "ai-consulting": { visual: "team" },
  "ai-agents": { visual: "agents" },
  chatbots: { visual: "chat" },
  "voice-agents": { visual: "voice", tools: ["elevenlabs", "openai"] },
  "ai-automation": { visual: "sourcing", tools: ["n8n", "make"] },
  "process-automation": { visual: "sourcing", tools: ["n8n", "make"] },
  "api-integration": { visual: "integration" },
  "data-platforms": { visual: "bars", tools: ["postgresql", "googlesheets"] },
  "business-websites": { tools: ["wordpress", "webflow"] },
  "web-platforms": { tools: ["react", "vercel"] },
  ecommerce: { visual: "cluster" },
  shopify: { visual: "shop" },
  "website-care": { visual: "seo" },
  "crm-development": { visual: "crm" },
  "erp-crm-setup": { visual: "erp" },
  "business-apps": { visual: "layers" },
  "mobile-apps": { visual: "mobile", tools: ["apple", "android", "flutter"] },
  "cloud-migration": { visual: "cloud" },
  "graphic-design": { tools: ["canva", "figma"] },
  "ui-ux-design": { tools: ["figma"] },
  "personal-branding": { tools: ["linkedin"] },
  "social-media": { tools: ["instagram", "tiktok", "linkedin"] },
  "security-audits": { visual: "scan" },
  "penetration-testing": { tools: ["kalilinux", "wireshark"] },
  "it-support": { tools: ["gmail", "slack"] },
};

export const ServiceCardMedia = ({ slug, className }: { slug: ServiceSlug; className?: string }) => {
  const { visual, tools = [] } = media[slug] ?? {};
  return (
    // Decorative and not interactive: the whole card is the link.
    <div className={cn("relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800 pointer-events-none", className)}>
      {visual ? (
        <CardVisual kind={visual} />
      ) : (
        <Image
          src={servicePhotos[slug]}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
      {tools.length > 0 && (
        <div className={cn("absolute right-1.5 sm:right-3 z-10 flex gap-1 sm:gap-1.5", visual ? "bottom-1.5 sm:bottom-3" : "top-1.5 sm:top-3")}>
          {tools.map((tool) => (
            <span
              key={tool}
              className="size-6 sm:size-8 rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center"
            >
              <ToolLogo tool={tool} className="size-3 sm:size-4" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
