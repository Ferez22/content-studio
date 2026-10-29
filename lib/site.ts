export const site = {
  name: "Qartmina",
  url: "https://www.qartmina.com",
  email: "fares@qartmina.com",
  linkedin: "https://www.linkedin.com/company/qartmina/",
  founderCard: "https://bcards.io/fares-aouanicherif",
  founderLinkedin: "https://www.linkedin.com/in/fares-aouani-cherif/",
  esgitech: "https://www.esgitech.tn/",
  // Cal.com booking page, embedded on /book and in the contact section.
  bookingUrl: "https://cal.com/fares-cherif-i1v6wa/discovery?embed=true&layout=month_view",
  // Dedicated partner call, embedded on the partner pages. Falls back to the discovery call.
  partnerBookingUrl: "",
  // Brevo form endpoint; it accepts cross-origin posts and answers with JSON.
  newsletterActionUrl:
    "https://0388cea7.sibforms.com/serve/MUIFANIIqhw3eaJh3xhabLoSVOzemQpOfaIC6104xvsX1Ab0KfWr52CDHwYAl_YmbNSSVsGjeLfnE97irPCWgfcqo_wFcxN8SFKzxT2YmtTRvzb8fE-ro1eGm0hZyXBKNAVFzndDzCDM_2kUxrJUz_asq3LJn1MVN4b33oY9z-ohfa4G4Y7PfB-eTvyN-RRYNoaRXWEiVtUVWGDjWQ==",
};

// Services grouped by category: /services/<category>/<service>. Copy lives in
// messages under serviceCategories.<category> and servicePages.<service>.
export const serviceCategories = [
  {
    slug: "ai",
    services: ["ai-consulting", "ai-agents", "chatbots", "voice-agents", "ai-training"],
  },
  {
    slug: "data-automation",
    services: ["process-automation", "api-integration", "data-platforms"],
  },
  {
    slug: "websites-ecommerce",
    services: ["business-websites", "web-platforms", "ecommerce", "shopify", "website-care"],
  },
  {
    slug: "software-development",
    services: [
      "crm-development",
      "erp-crm-setup",
      "business-apps",
      "mobile-apps",
      "cloud-migration",
    ],
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
  {
    slug: "cybersecurity-it",
    services: ["security-audits", "penetration-testing", "compliance", "ai-security", "it-support"],
  },
] as const;

export type CategorySlug = (typeof serviceCategories)[number]["slug"];
export type ServiceSlug = (typeof serviceCategories)[number]["services"][number];

export const categorySlugs: CategorySlug[] = serviceCategories.map((c) => c.slug);
export const serviceSlugs: ServiceSlug[] = serviceCategories.flatMap((c) => c.services);

export const isServiceSlug = (slug: string): slug is ServiceSlug =>
  (serviceSlugs as string[]).includes(slug);

export const categoryOf = (service: ServiceSlug): CategorySlug =>
  serviceCategories.find((c) => (c.services as readonly string[]).includes(service))!.slug;

export const categoryPath = (category: CategorySlug) => `/services/${category}`;
export const servicePath = (service: ServiceSlug) =>
  `${categoryPath(categoryOf(service))}/${service}`;

// Service URLs before the categories (/services/<old>), redirected permanently in next.config.ts.
export const legacyServiceSlugs: Record<string, ServiceSlug> = {
  "ai-agents": "ai-agents",
  automation: "process-automation",
  integration: "api-integration",
  consulting: "ai-consulting",
  training: "ai-training",
  chatbots: "chatbots",
  // Replaced by ERP and CRM setup (2026-10-29).
  "software-development/erp-development": "erp-crm-setup",
};

// Partner program pages, one per partner type: /partners/<slug>.
export const partnerSlugs = ["consulting-firms"] as const;

export type PartnerSlug = (typeof partnerSlugs)[number];

// Feature flag for the whole partner program: the /partners routes, their sitemap
// entries and every link to them. NEXT_PUBLIC_PARTNER_PROGRAM=true turns it on; unset or
// anything else hides it. Inlined at build time, so a change needs a redeploy.
export const partnerProgramEnabled = process.env.NEXT_PUBLIC_PARTNER_PROGRAM === "true";
