import {
  IconAppWindow,
  IconBolt,
  IconCalendarEvent,
  IconCloudUpload,
  IconPhoto,
  IconRocket,
  IconUsersPlus,
  IconUsersGroup,
  IconMessageChatbot,
  IconBrush,
  IconBulb,
  IconChartLine,
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
  "ai-operations": IconSparkles,
  "ai-marketing": IconSpeakerphone,
  engineers: IconUsersGroup,
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
  "content-plan": IconCalendarEvent,
  "ai-visuals": IconPhoto,
  "product-launch": IconRocket,
  "team-reinforcement": IconUsersPlus,
  "expert-mission": IconCloudUpload,
  "ai-advisor": IconMessageChatbot,
  "personal-branding": IconUserStar,
  "social-media": IconSpeakerphone,
  "video-motion": IconVideo,
};
