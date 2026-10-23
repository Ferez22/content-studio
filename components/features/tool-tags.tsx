import { SheetsIcon } from "@/icons";
import { IconDatabase, IconMail } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const icons = [
  <IconMail key="mail" className="size-3 text-blue-500" />,
  <SheetsIcon key="sheets" className="size-3" />,
  <IconDatabase key="erp" className="size-3 text-indigo-500" />,
];

// Tool names shown as tags in the card mockups (Email, Excel, ERP).
export const useToolTags = () => {
  const t = useTranslations("visuals");
  return (t.raw("tools") as string[]).map((text, index) => ({
    text,
    icon: icons[index],
  }));
};
