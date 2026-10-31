import Image from "next/image";
import { useTranslations } from "next-intl";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { clientLogos, type ClientLogo } from "@/components/logo-cloud";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

// "Teams we built ... for": client logos (only real clients, with permission) and a link to
// the matching case study. Copy under servicePages.<slug>.clients.
export const Clients = ({ slug }: { slug: string }) => {
  const t = useTranslations(`servicePages.${slug}.clients`);
  const logos = t.raw("logos") as ClientLogo[];
  return (
    <section className="pt-10 md:pt-20">
      <Container>
        <Reveal className="flex flex-col items-center gap-6 rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center dark:border-neutral-800 dark:bg-neutral-800 md:py-10">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t("title")}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((key) => {
              const logo = clientLogos[key];
              return (
                <li key={key}>
                  <Image
                    src={logo.src}
                    width={logo.width}
                    height={logo.height}
                    alt={logo.title}
                    // One-tone silhouette, as in the home logo row.
                    className="h-7 md:h-8 w-auto object-contain brightness-0 opacity-80 dark:invert"
                  />
                </li>
              );
            })}
          </ul>
          <Link
            href={t("caseStudy.href")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#1E40FF] hover:underline dark:text-blue-400"
          >
            {t("caseStudy.label")}
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
};
