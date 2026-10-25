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

export const serviceSlugs = [
  "ai-agents",
  "automation",
  "integration",
  "consulting",
  "training",
  "chatbots",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

// Partner program pages, one per partner type: /partners/<slug>.
export const partnerSlugs = ["consulting-firms"] as const;

export type PartnerSlug = (typeof partnerSlugs)[number];

// Feature flag for the whole partner program: the /partners routes, their sitemap
// entries and every link to them. NEXT_PUBLIC_PARTNER_PROGRAM=true turns it on; unset or
// anything else hides it. Inlined at build time, so a change needs a redeploy.
export const partnerProgramEnabled = process.env.NEXT_PUBLIC_PARTNER_PROGRAM === "true";
