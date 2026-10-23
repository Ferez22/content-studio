import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Reveal } from "./reveal";

// Quotes stay in the client's own words, so they are not translated.
const testimonials = [
  {
    name: "James Gifford",
    company: "Additionality",
    logo: "/logos/additionality.png",
    headline:
      "Fares rebuilt our website and everything underneath it, and I'd hire him again tomorrow.",
    body: [
      "The brief started small: a new React site with an RSS feed pulling in our Substack posts, so we'd stop maintaining content in two places. He delivered that quickly. What I noticed more than the design, though, was that I never had to chase him. He asked the right questions at the start, told us what was in scope and what wasn't, and gave us dates that held.",
      "So we kept giving him tasks: consolidating our domains, managing our Google Workspace, wiring up the CRM, sorting out analytics and the SEO basics.",
      "There was some back and forth during the engagement, as there should be, but it was always about solving the actual problem rather than adding hours or widening the scope. For a small advisory firm like ours, where nobody's job is technology, having someone who communicates this clearly and finishes what he starts is worth a lot.",
      "I'd recommend Fares to anyone who wants their technical foundations done properly.",
    ],
  },
];

export const Testimonials = () => {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  return (
    <section className="py-10 md:py-20 lg:py-32">
      <Container>
        <Heading>{t("title")}</Heading>
        {testimonials.map((item) => (
          <Reveal key={item.name} className="mt-10 md:mt-16">
            <figure className="rounded-3xl bg-neutral-50 dark:bg-neutral-800 p-6 md:p-12" lang="en">
              <blockquote>
                <p className="text-xl md:text-4xl font-display font-bold tracking-tight max-w-4xl">
                  &ldquo;{item.headline}&rdquo;
                </p>
                <div className="mt-6 md:mt-8 md:columns-2 gap-10 text-neutral-600 dark:text-neutral-300">
                  {item.body.map((paragraph) => (
                    <p key={paragraph} className="mb-4 break-inside-avoid">{paragraph}</p>
                  ))}
                </div>
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center gap-4 border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <Image
                  src={item.logo}
                  alt=""
                  width={746}
                  height={112}
                  className="h-6 w-auto brightness-0 dark:invert"
                />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-neutral-500">{item.company}</p>
                </div>
              </figcaption>
            </figure>
            {locale !== "en" && (
              <p className="text-xs text-neutral-400 mt-2">{t("original")}</p>
            )}
          </Reveal>
        ))}
      </Container>
    </section>
  );
};
