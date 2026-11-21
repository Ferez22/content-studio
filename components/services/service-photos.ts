import type { ServiceSlug } from "@/lib/site";

// One free-license Unsplash photo per service (unsplash.com/license: free for commercial
// use, no attribution required), shown on the home service cards. Served through next/image.
export const servicePhotos: Partial<Record<ServiceSlug, string>> = {
  "ai-automation": "https://images.unsplash.com/photo-1586528116022-aeda1613c63d",
  "generative-ai": "https://images.unsplash.com/photo-1738566061961-4e20e3bf470d",
  "document-extraction": "https://images.unsplash.com/photo-1586528116022-aeda1613c63d",
  mcp: "https://images.unsplash.com/photo-1682559736721-c2e77ff4c650",
  "predictive-systems": "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  "computer-vision": "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5",
  "ai-sprint": "https://images.unsplash.com/photo-1581091877018-dac6a371d50f",
  "custom-software": "https://images.unsplash.com/photo-1758691737124-05c5bffe46f0",
  saas: "https://images.unsplash.com/photo-1551434678-e076c223a692",
  "brand-identity": "https://images.unsplash.com/photo-1561070791-2526d30994b5",
  "graphic-design": "https://images.unsplash.com/photo-1572044162444-ad60f128bdea",
  "ui-ux-design": "https://images.unsplash.com/photo-1587440871875-191322ee64b0",
  "personal-branding": "https://images.unsplash.com/photo-1630939687530-241d630735df",
  "social-media": "https://images.unsplash.com/photo-1695408247109-3bf125ad0538",
  "ai-visuals": "https://images.unsplash.com/photo-1572044162444-ad60f128bdea",
  "video-motion": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d",
};
