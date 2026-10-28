import { useTranslations } from "next-intl";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import type { ShowcaseVideo } from "@/lib/service-media";
import type { ServiceSlug } from "@/lib/site";
import { DoorVideo } from "./showcase-video";

// Optional sections of a service page. Each renders only when its copy exists under
// servicePages.<slug> (explainer, examples, included).

type Item = { title: string; text: string };

const SectionIntro = ({ title, intro }: { title: string; intro?: string }) => (
  <>
    <Heading>{title}</Heading>
    {intro && <Subheading className="pt-6 max-w-2xl">{intro}</Subheading>}
  </>
);

// What the service is and what it is good for, as a short intro and a grid of points.
export const Explainer = ({ slug }: { slug: ServiceSlug }) => {
  const t = useTranslations(`servicePages.${slug}.explainer`);
  const points = t.raw("points") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-10 md:mt-16">
          {points.map((point, index) => (
            <div
              key={point.title}
              className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-8"
            >
              <span className="font-display font-bold text-sm text-[#1E40FF] dark:text-blue-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-200">
                {point.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-balance">{point.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

// Example videos behind folding doors, with the creators credited.
export const Examples = ({ slug, videos }: { slug: ServiceSlug; videos: ShowcaseVideo[] }) => {
  const t = useTranslations(`servicePages.${slug}.examples`);
  const tMedia = useTranslations("services.media");
  const items = t.raw("items") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10 mt-10 md:mt-16">
          {videos.map((video, index) => (
            <DoorVideo
              key={video.src}
              video={video}
              index={index}
              title={items[index].title}
              text={items[index].text}
            />
          ))}
        </div>
        <p className="mt-10 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
          {tMedia("disclaimer")}
        </p>
      </Container>
    </section>
  );
};

// Everything the client gets, as a checklist grid.
export const Included = ({ slug }: { slug: ServiceSlug }) => {
  const t = useTranslations(`servicePages.${slug}.included`);
  const items = t.raw("items") as Item[];
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <SectionIntro title={t("title")} intro={t("intro")} />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-10 md:mt-16">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 p-5 md:p-6"
            >
              <IconCircleCheckFilled className="size-5 text-[#1E40FF] dark:text-blue-400" />
              <h3 className="mt-3 font-bold text-neutral-800 dark:text-neutral-200">{item.title}</h3>
              <p className="mt-1.5 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
