import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

// Visible trail above the service pages; the last item is the current page.
export const Breadcrumbs = ({
  label,
  items,
}: {
  label: string;
  items: { name: string; path: string }[];
}) => (
  <nav aria-label={label}>
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
      {items.map((item, index) => (
        <li key={item.path} className="flex items-center gap-1.5">
          {index > 0 && <IconChevronRight className="size-3.5 shrink-0" aria-hidden="true" />}
          {index < items.length - 1 ? (
            <Link href={item.path} className="hover:text-black dark:hover:text-white transition duration-200">
              {item.name}
            </Link>
          ) : (
            <span aria-current="page" className="text-neutral-700 dark:text-neutral-300">
              {item.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
