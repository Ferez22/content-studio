import type { ServiceSlug } from "@/lib/site";

// Example videos shown on some service pages. They are made by independent creators
// and hosted by Prompt Motion: always shown with the creator's credit, never as our work.
export type ShowcaseVideo = { src: string; creator: string };

export const promptMotionUrl = "https://prompt-motion.com";

const promptMotion = (path: string, creator: string): ShowcaseVideo => ({
  src: `https://media.prompt-motion.com/${path}`,
  creator,
});

const socialVideo = promptMotion("sab8a-opus-5-5-openedit-prompt/video.f57b6670.mp4", "sab8a");

// `hero` replaces the mockup next to the page title (always playing); `examples` are the
// cards of the examples section, in the order of `servicePages.<slug>.examples.items`;
// `explain` is the large video of the "Explains in seconds" scene (video-motion only).
export const serviceMedia: Partial<
  Record<ServiceSlug, { hero?: ShowcaseVideo; examples?: ShowcaseVideo[]; explain?: ShowcaseVideo }>
> = {
  "video-motion": {
    hero: promptMotion("sudo-kiran-no-storyboard-no-detailed/video.d1ffb723.mp4", "sudo_kiran"),
    examples: [
      promptMotion("ajith-io-wtf-made-with-claude/video.7ea5df52.mp4", "ajith_io"),
      promptMotion("twoclipping-d89be5/video.c1c2a37f.mp4", "twoclipping"),
      promptMotion("viktoroddy-opus-5-5-one-shoted-this/video.3ebc4180.mp4", "viktoroddy"),
      promptMotion("notdwd-another-one-1000-ai/video.c8dc9ba6.mp4", "notdwd"),
    ],
    explain: promptMotion("ratheejaisal-bro-i-just-one/video.5e8b257d.mp4", "RatheeJaisal"),
  },
  "social-media": { hero: socialVideo },
  "personal-branding": { hero: socialVideo },
};
