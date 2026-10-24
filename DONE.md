# DONE

History of finished work, newest first. Only read this when asked or when tracking down a bug.

## 2026-10-24

- Legal pages completed with company details: Qartmina SUARL, Immeuble Mazars, Les Berges du Lac, RNE 1973016B, represented by Fares Mohamed Aouani Cherif (managing partner); Tunisian law, courts of Tunis
- Vercel function region confirmed (Frankfurt); sitemap resubmitted and priority URLs requested in Google Search Console (by Fares)
- Article author card: photo, bio, links to business card, LinkedIn and newsletter, and QR codes (newsletter form, bcards) on tablet and desktop; QR files in `public/qr/`
- Blog MDX environment completed: `content/blog/{en,fr,de}` folders, `_template.mdx`, styles for images, code, dividers, italics and h4; sitemap and hreflang now list posts and case studies only in the languages that exist; tested end to end on desktop and mobile
- Canonical site URL switched to `https://www.qartmina.com` (sitemap, canonicals, hreflang, JSON-LD); Vercel functions pinned to Frankfurt (`vercel.json`)
- Legal pages rewritten in en/fr/de: privacy policy (Vercel, Brevo, Google Workspace, Cal.com, Cloudflare, EU processing, transfers), terms of service (acceptance by use, no warranty, maximum liability exclusion with mandatory carve-out, indemnity), legal notice with placeholders for company details
- Guidelines file is now `CLAUDE.md` (single file) with task-list workflow and the mobile testing rule; `TODO.md` and `DONE.md` created
- Newsletter welcome page `/newsletter/thank-you` (noindex), opened after sign-up
- Mobile polish: one-row KPIs, larger hero title, logo marquee, founder links at the bottom, ESGITECH link, expandable testimonial, contact card height follows the visible face, navbar `top-0` on phones
- ESGITECH logo restored on a dark rounded tile
- Cal.com embed: auto height, transparent background, theme-matched, hydration fix
- Fixed ~10,000px horizontal scroll (mirrored honeypot in the flipped contact card)
- Contact section: centred tabs flipping a 3D card between Cal.com and the contact form
- Hero: static title "Put AI agents at the service of your company" and three KPIs
- Removed unused assets from `public/`

## 2026-10-23

- Site rebuilt from the Aceternity template into the Qartmina site: en/fr/de routing, home sections, six service pages, portfolio (demo case study), blog, about, contact, book, legal pages, sitemap, robots, JSON-LD, OG image
- Contact form: Turnstile + honeypot + Brevo transactional email; newsletter form posting to Brevo with `isAjax=1`; first-visit newsletter popover
- Branding: wavy "Qartmina." wordmark (EB Garamond), "Q." mark, royal blue accent, client logos, OpenAI Select Partner badge and section, testimonial, founder photo
- Hero workflow: rotating Integration / AI agent / Automation scenes around the Higgsfield robot video, cursor tilt and glow
- Navbar: sticky, shrinking pill on desktop, services mega-menu, mobile drop menu; magnetic buttons; footer with newsletter and centred CTA
- Mobile layout pass (navbar, two-column services, OpenAI carousel); removed the "cost of working without AI" section
- Deployment on Vercel, DNS conflict on Hostinger resolved, Brevo domain authenticated
