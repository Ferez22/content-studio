import { useTranslations } from "next-intl";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { servicePath, type ServiceSlug } from "@/lib/site";
import { serviceIcons } from "@/components/service-icons";
import { cn } from "@/lib/utils";

// Grid of service links: icon, title and summary. Used on the overview, hub and service pages.
export const ServiceCards = ({
  services,
  className,
}: {
  services: readonly ServiceSlug[];
  className?: string;
}) => {
  const tServices = useTranslations("servicePages");
  return (
    <ul className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4", className)}>
      {services.map((slug) => {
        const Icon = serviceIcons[slug];
        return (
          <li key={slug}>
            <Link
              href={servicePath(slug)}
              className="group flex h-full flex-col rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-6 hover:shadow-brand transition duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="size-11 shrink-0 rounded-xl bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
                  <Icon className="size-5 text-neutral-700 dark:text-neutral-200 group-hover:text-[#1E40FF] dark:group-hover:text-blue-400 transition duration-200" />
                </div>
                <IconArrowUpRight className="size-5 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition duration-200" />
              </div>
              <h3 className="mt-5 text-lg font-bold font-display text-black dark:text-white">
                {tServices(`${slug}.title`)}
              </h3>
              <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                {tServices(`${slug}.summary`)}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
