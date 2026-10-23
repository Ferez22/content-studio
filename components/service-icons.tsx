import {
  IconBolt,
  IconChartDots3,
  IconMessageChatbot,
  IconPlugConnected,
  IconRobot,
  IconSchool,
} from "@tabler/icons-react";
import type { ServiceSlug } from "@/lib/site";

export const serviceIcons: Record<ServiceSlug, React.ComponentType<{ className?: string }>> = {
  "ai-agents": IconRobot,
  automation: IconBolt,
  integration: IconPlugConnected,
  consulting: IconChartDots3,
  training: IconSchool,
  chatbots: IconMessageChatbot,
};
