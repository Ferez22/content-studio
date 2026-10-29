import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { servicePath, type ServiceSlug } from "@/lib/site";
import { serviceIcons } from "@/components/service-icons";
import { cn } from "@/lib/utils";
import { ServiceCardMedia } from "./service-card-media";
import { Reveal } from "@/components/reveal";

// The service card used everywhere: the home category panel, the services overview, the
// category hubs and "More in" on service pages. A photo or animated visual on top, then the
// icon, title and (from sm up) the summary.
export const ServiceCard = ({ slug }: { slug: ServiceSlug }) => {
  const tServices = useTranslations("servicePages");
  const Icon = serviceIcons[slug];
  return (
    <Link
      href={servicePath(slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1 hover:ring-black/20 dark:hover:ring-white/30 transition duration-300 ease-out"
    >
      <ServiceCardMedia slug={slug} />
      {/* Two per row on phones: title only there, the summary from sm up. */}
      <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-4">
        <Icon className="size-4 sm:size-5 mt-0.5 shrink-0 text-neutral-500 group-hover:text-[#1E40FF] dark:group-hover:text-blue-400 transition duration-200" />
        <div className="min-w-0">
          <p className="text-[13px] sm:text-base leading-snug font-bold text-black dark:text-white">
            {tServices(`${slug}.title`)}
          </p>
          <p className="hidden sm:block mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {tServices(`${slug}.summary`)}
          </p>
        </div>
      </div>
    </Link>
  );
};

// `reveal`: the cards rise into place one after another as they scroll into view (services
// pages). Off in the home panel, whose cards sit on the hidden face of a flip card.
export const ServiceCards = ({
  services,
  className,
  reveal = false,
}: {
  services: readonly ServiceSlug[];
  className?: string;
  reveal?: boolean;
}) => (
  <ul className={cn("grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3", className)}>
    {services.map((slug, index) => (
      <li key={slug}>
        {reveal ? (
          <Reveal delay={(index % 3) * 0.08} className="h-full">
            <ServiceCard slug={slug} />
          </Reveal>
        ) : (
          <ServiceCard slug={slug} />
        )}
      </li>
    ))}
  </ul>
);
