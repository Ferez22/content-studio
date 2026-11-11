export const site = {
  name: "Qartmina",
  url: "https://www.qartmina.com",
  email: "fares@qartmina.com",
  linkedin: "https://www.linkedin.com/company/qartmina/",
  founderCard: "https://bcards.io/fares-aouanicherif",
  founderLinkedin: "https://www.linkedin.com/in/fares-aouani-cherif/",
  esgitech: "https://www.esgitech.tn/",
  // Cal.com booking page, embedded on /book and in the contact section.
  bookingUrl:
    "https://cal.com/fares-cherif-i1v6wa/discovery?embed=true&layout=month_view",
  // Dedicated partner call, embedded on the partner pages. Falls back to the discovery call.
  partnerBookingUrl: "",
  // Brevo form endpoint; it accepts cross-origin posts and answers with JSON.
  newsletterActionUrl:
    "https://0388cea7.sibforms.com/serve/MUIFANIIqhw3eaJh3xhabLoSVOzemQpOfaIC6104xvsX1Ab0KfWr52CDHwYAl_YmbNSSVsGjeLfnE97irPCWgfcqo_wFcxN8SFKzxT2YmtTRvzb8fE-ro1eGm0hZyXBKNAVFzndDzCDM_2kUxrJUz_asq3LJn1MVN4b33oY9z-ohfa4G4Y7PfB-eTvyN-RRYNoaRXWEiVtUVWGDjWQ==",
};

// Every expertise we can offer, grouped by category: /expertises/<category>/<service>. Copy
// lives in messages under serviceCategories.<category> and servicePages.<service>. Only
// the services switched on in serviceToggles are published. Restructured 2026-11-11 (Fares):
// Data & AI, Software development, Brand and online presence. Old URLs: next.config.ts.
const allServiceCategories = [
  {
    slug: "data-ai",
    services: [
      "ai-automation",
      "generative-ai",
      "document-extraction",
      "mcp",
      "predictive-systems",
      "computer-vision",
      "ai-sprint",
    ],
  },
  {
    slug: "software-development",
    services: ["custom-software", "saas"],
  },
  {
    slug: "brand",
    services: [
      "brand-identity",
      "graphic-design",
      "ui-ux-design",
      "personal-branding",
      "social-media",
      "video-motion",
    ],
  },
] as const;

export type CategorySlug = (typeof allServiceCategories)[number]["slug"];
export type ServiceSlug =
  (typeof allServiceCategories)[number]["services"][number];

// Feature toggles, one per service. A service set to false has no page, no route (404),
// no sitemap entry and no link anywhere (menu, footer, home, overview, hubs, "More in",
// portfolio, blog links). A category with no service switched on is hidden the same way.
// Set at build time, so a change needs a redeploy.
export const serviceToggles: Record<ServiceSlug, boolean> = {
  "ai-automation": true,
  "generative-ai": true,
  "document-extraction": true,
  mcp: true,
  "predictive-systems": true,
  "computer-vision": true,
  "ai-sprint": true,
  "custom-software": true,
  saas: true,
  "brand-identity": false,
  "graphic-design": false,
  "ui-ux-design": true,
  "personal-branding": true,
  "social-media": true,
  "video-motion": true,
};

// The published services and categories. Everything on the site reads these.
export const serviceCategories: {
  slug: CategorySlug;
  services: ServiceSlug[];
}[] = allServiceCategories
  .map(({ slug, services }) => ({
    slug,
    services: services.filter((s) => serviceToggles[s]),
  }))
  .filter(({ services }) => services.length > 0);

export const categorySlugs: CategorySlug[] = serviceCategories.map(
  (c) => c.slug,
);
export const serviceSlugs: ServiceSlug[] = serviceCategories.flatMap(
  (c) => c.services,
);

// True only for a published service.
export const isServiceSlug = (slug: string): slug is ServiceSlug =>
  (serviceSlugs as string[]).includes(slug);

export const categoryOf = (service: ServiceSlug): CategorySlug =>
  allServiceCategories.find((c) =>
    (c.services as readonly string[]).includes(service),
  )!.slug;

export const expertisesPath = "/expertises";
export const categoryPath = (category: CategorySlug) => `${expertisesPath}/${category}`;
export const servicePath = (service: ServiceSlug) =>
  `${categoryPath(categoryOf(service))}/${service}`;

// False for a link to a hidden service or category page (/en/expertises/<category>/<service>),
// so written content (blog, case studies) can show the words without a dead link.
export const isPublishedServiceHref = (href: string) => {
  const match = href.match(
    /^(?:\/(?:en|fr))?\/expertises\/([^/?#]+)(?:\/([^/?#]+))?/,
  );
  if (!match) return true;
  const [, category, service] = match;
  return service
    ? isServiceSlug(service) && categoryOf(service) === category
    : (categorySlugs as string[]).includes(category);
};

// Partner program pages, one per partner type: /partners/<slug>.
export const partnerSlugs = ["consulting-firms"] as const;

export type PartnerSlug = (typeof partnerSlugs)[number];

// Feature flag for the whole partner program: the /partners routes, their sitemap
// entries and every link to them. NEXT_PUBLIC_PARTNER_PROGRAM=true turns it on; unset or
// anything else hides it. Inlined at build time, so a change needs a redeploy.
export const partnerProgramEnabled =
  process.env.NEXT_PUBLIC_PARTNER_PROGRAM === "true";
