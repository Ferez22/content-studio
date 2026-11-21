import { IconArrowUpRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { servicePath, type ServiceSlug } from "@/lib/site";
import { serviceIcons } from "@/components/service-icons";
import { cn } from "@/lib/utils";
import { ServiceCardMedia } from "./service-card-media";
import { Reveal } from "@/components/reveal";
import { CardCTA, CardTitle } from "@/components/features/card";
import { HoverPlay } from "@/components/hover-play";

// The service card on the services overview,
// the category hubs and "More in" on service pages. A photo or animated visual on top, then the
// icon, title and (from sm up) the summary.
export const ServiceCard = ({ slug }: { slug: ServiceSlug }) => {
  const tServices = useTranslations("servicePages");
  const Icon = serviceIcons[slug];
  return (
    // The visual plays only while the card is hovered or focused.
    <HoverPlay className="h-full">
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
    </HoverPlay>
  );
};

// The home panel's tile: the same design as the category card that opened it (visual
// full-bleed, title on a fade at the bottom, summary and arrow on hover), in white and grey.
export const ServiceTile = ({ slug, className }: { slug: ServiceSlug; className?: string }) => {
  const tServices = useTranslations("servicePages");
  return (
    <HoverPlay className="h-full">
    <Link
      href={servicePath(slug)}
      className={cn(
        "group relative isolate block h-full overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40FF] dark:focus-visible:ring-blue-400",
        className
      )}
    >
      <ServiceCardMedia slug={slug} toolsOnTop className="absolute inset-0 aspect-auto bg-transparent dark:bg-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 md:px-5 pb-3 md:pb-5 pt-8 md:pt-10 bg-gradient-to-t from-neutral-50 via-neutral-50/90 dark:from-neutral-800 dark:via-neutral-800/90 to-transparent">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm sm:text-base md:text-lg leading-snug">{tServices(`${slug}.title`)}</CardTitle>
            <div className="hidden lg:grid grid-rows-[1fr] [@media(hover:hover)]:grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
              <p className="overflow-hidden text-sm text-neutral-600 dark:text-neutral-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300 ease-out">
                <span className="pt-1.5 line-clamp-2">{tServices(`${slug}.summary`)}</span>
              </p>
            </div>
          </div>
          <CardCTA className="hidden sm:flex group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            <IconArrowUpRight className="size-4 md:size-5" />
          </CardCTA>
        </div>
      </div>
    </Link>
    </HoverPlay>
  );
};

// Columns and tile height so a whole category fits on one screen: up to 4 per row from lg,
// two rows at most for the largest category (7 services), 2 per row on phones.
const tileColumns = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;

export const ServiceTiles = ({ services, className }: { services: readonly ServiceSlug[]; className?: string }) => {
  const columns = Math.min(4, Math.max(1, services.length)) as keyof typeof tileColumns;
  const oneRow = services.length <= 4;
  return (
    // Round outer corners, tight inner ones, as on the category grid.
    <ul className={cn("grid grid-cols-2 gap-2.5 md:gap-3 lg:gap-4 rounded-3xl overflow-hidden", tileColumns[columns], className)}>
      {services.map((slug) => (
        <li
          key={slug}
          className={cn(
            "h-32 sm:h-44",
            oneRow ? "lg:h-[max(14rem,calc((100svh-24rem)/2))]" : "lg:h-[max(10rem,calc((100svh-24rem)/2))]"
          )}
        >
          <ServiceTile slug={slug} />
        </li>
      ))}
    </ul>
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
