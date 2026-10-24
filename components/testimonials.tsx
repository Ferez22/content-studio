import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Reveal } from "./reveal";
import { TestimonialCard, type Testimonial } from "./testimonial-card";

// Quotes stay in the client's own words, so they are not translated.
const testimonials: Testimonial[] = [
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
            <TestimonialCard item={item} expandLabel={t("expand")} collapseLabel={t("collapse")} />
            {locale !== "en" && (
              <p className="text-xs text-neutral-400 mt-2">{t("original")}</p>
            )}
          </Reveal>
        ))}
      </Container>
    </section>
  );
};
