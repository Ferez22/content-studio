import {
  IconAppWindow,
  IconBolt,
  IconBrush,
  IconBulb,
  IconChartLine,
  IconCode,
  IconEye,
  IconFileSearch,
  IconLayout,
  IconLayoutDashboard,
  IconPalette,
  IconPlugConnected,
  IconRobot,
  IconSparkles,
  IconSpeakerphone,
  IconUserStar,
  IconVideo,
} from "@tabler/icons-react";
import type { CategorySlug, ServiceSlug } from "@/lib/site";

type Icon = React.ComponentType<{ className?: string }>;

export const categoryIcons: Record<CategorySlug, Icon> = {
  "data-ai": IconSparkles,
  "software-development": IconCode,
  brand: IconPalette,
};

export const serviceIcons: Record<ServiceSlug, Icon> = {
  "ai-automation": IconBolt,
  "generative-ai": IconRobot,
  "document-extraction": IconFileSearch,
  mcp: IconPlugConnected,
  "predictive-systems": IconChartLine,
  "computer-vision": IconEye,
  "ai-sprint": IconBulb,
  "custom-software": IconLayoutDashboard,
  saas: IconAppWindow,
  "brand-identity": IconPalette,
  "graphic-design": IconBrush,
  "ui-ux-design": IconLayout,
  "personal-branding": IconUserStar,
  "social-media": IconSpeakerphone,
  "video-motion": IconVideo,
};
