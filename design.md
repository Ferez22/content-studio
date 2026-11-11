<!-- Copy of Content Studio brands/qartmina/design.md (source of truth, synced 2026-11-11). Edit there, then copy here. -->
# Qartmina: Style Reference
> Calm monochrome consulting canvas: black and white do the work, one royal blue dot of intent, pill buttons and soft 24px cards on a white page that turns near-black at night.

**Theme:** light + dark (both on-brand)

Source: qartmina.com code (`app/globals.css`, `components/*`, `lib/site.ts`) measured 2026-11-11, plus charte.md v1.0. Class counts are from the
components folder. Roles and recommendations are interpreted. HTML examples are reconstructions, not source components.

Qartmina is a restrained, editorial B2B system for a digital partner that sells trust to non-technical SME decision makers.
The page is pure white (near-black #0a0a0a in dark mode) and more than 90% of any screen is black, white and neutral grays.
Headlines are large Manrope bold with tight tracking; body copy is Inter in a muted gray with generous line height. A single
royal blue (#1E40FF, #54a2ff in dark mode) appears only as a detail: active states, connector dots, focus rings, small icon
tints and inline "read more" links. It is never a background and never a headline color. Three soft pillar tints (violet for
AI, amber for software, pink for brand) color-code offer cards and panels. Every button is a pill; cards and panels use 16 to 24px
radii on a neutral-100 surface. Depth comes from surface steps and hairline borders; shadows are rare and reserved for the
floating navbar, menus and a layered brand shadow on hero mockups. Motion is constant but quiet: logo marquee, cards that pop in,
a floating bob, mockups that animate in loops, all disabled under reduced motion.

## Tokens: Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#0a0a0a` | `--color-ink` | Primary text (light), page background (dark). `--foreground` oklch(0.145 0 0) |
| Paper | `#ffffff` | `--color-paper` | Page background and cards (light), text (dark) |
| Graphite | `#171717` | `--color-graphite` | Primary pill button fill (light), card surface (dark). `--primary` oklch(0.205 0 0) |
| Mist | `#f5f5f5` | `--color-mist` | Section panels, FAQ rows, CTA block, secondary surfaces (light). neutral-100 |
| Snow | `#fafafa` | `--color-snow` | Button text on graphite, subtle tinted rows. neutral-50 |
| Hairline | `#e5e5e5` | `--color-hairline` | Borders and dividers (light), the most used border (121 uses of neutral-200) |
| Stone | `#737373` | `--color-stone` | Subheadings and body secondary text (light). neutral-500, `--muted-foreground` |
| Ash | `#a1a1a1` | `--color-ash` | Secondary text in dark mode, captions and labels (light). neutral-400, the most used text color |
| Slate | `#525252` | `--color-slate` | Nav links and body on light surfaces. neutral-600 |
| Coal | `#262626` | `--color-coal` | Surfaces and borders in dark mode. neutral-800 |
| Royal Blue | `#1E40FF` | `--color-royal` | The only brand accent (light): active states, focus rings, dots, links, small icons. 98 uses as hex |
| Sky Blue | `#54a2ff` | `--color-sky` | Royal blue's dark-mode twin (blue-400) |
| AI Violet | `#ece9fc` / `#26223b` | `--color-pillar-ai` | AI and automation offer tint (light / dark), cards and panels only |
| Software Amber | `#fcf3cc` / `#31291c` | `--color-pillar-software` | Software offer tint (light / dark) |
| Brand Pink | `#f9e8f2` / `#31222c` | `--color-pillar-brand` | Brand and presence offer tint (light / dark) |
| Done Green | `#00c758` | `--color-done` | Status check in UI mockups only |
| Pending Amber | `#fcbb00` | `--color-pending` | Pending status in UI mockups only |
| Blueprint Paper | `#ded5c8` / `#28221b` | `--color-blueprint` | Blueprint banner art backgrounds only (with sepia line `#aea18e`) |

## Tokens: Typography

### Manrope: Display family for every heading, big number and card title. Bold, tight tracking, large on the hero. · `--font-display`
- **Substitute:** Manrope (Google Fonts), loaded by next/font
- **Weights:** 400, 500, 600, 700 (headings use 700)
- **Sizes:** 16px (card titles mobile), 24px, 30px, 36px, 41.6px (hero mobile), 48px, 60px
- **Line height:** 1.05 on the hero, 1.1 to 1.25 on section headings
- **Letter spacing:** tight (-0.025em, Tailwind `tracking-tight`)
- **Role:** Headlines, section titles, FAQ questions, figures ("< 1 month"). The voice of authority.

### Inter: Body and UI family. · `--font-inter`
- **Substitute:** Inter (Google Fonts), loaded by next/font
- **Weights:** 400, 500, 600, 700 (body 400, UI labels 500)
- **Sizes:** 12px, 14px (dominant: 163 uses of text-sm), 16px, 18px
- **Line height:** 1.5 to 1.75
- **Letter spacing:** normal; uppercase labels and tabs letter-spaced (`tracking-wide`)
- **Role:** Subheadings in muted gray, body copy, nav links, buttons, captions, form fields.

### EB Garamond: Logo look only. · `--font-logo`
- **Weights:** 700
- **Role:** The "Qartmina." wordmark feel. At most one editorial word as an accent. Never body text.

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| caption | Inter | 400 | 12px | 1.5 | normal | `--text-caption` |
| body-sm | Inter | 400-500 | 14px | 1.5 | normal | `--text-body-sm` |
| body | Inter | 400 | 16px | 1.6 | normal | `--text-body` |
| subheading | Inter | 400 | 18px | 1.6 | normal | `--text-subheading` |
| card-title | Manrope | 700 | 24px | 1.25 | -0.025em | `--text-card-title` |
| heading-sm | Manrope | 700 | 30px | 1.2 | -0.025em | `--text-heading-sm` |
| heading | Manrope | 700 | 36px | 1.15 | -0.025em | `--text-heading` |
| heading-lg | Manrope | 700 | 60px | 1.1 | -0.025em | `--text-heading-lg` |
| display | Manrope | 700 | 60px (41.6px mobile) | 1.05 | -0.025em | `--text-display` |

Section headings scale 30px (mobile) to 36px (md) to 60px (lg). The hero h1 is 41.6px, then 48px, then 60px.

## Tokens: Spacing & Shapes

**Base unit:** 4px (Tailwind)

**Density:** comfortable, airy sections

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 16px | `--spacing-4` |
| 6 | 24px | `--spacing-6` |
| 8 | 32px | `--spacing-8` |
| 10 | 40px | `--spacing-10` |
| 16 | 64px | `--spacing-16` |
| 20 | 80px | `--spacing-20` |
| 32 | 128px | `--spacing-32` |

### Border Radius

| Element | Value |
|---------|-------|
| buttons, nav bar, badges, avatars | 9999px (pill, 118 uses) |
| cards, FAQ rows, CTA block, panels | 24px (rounded-3xl) |
| menus, mockup windows | 16px (rounded-2xl) |
| thumbnails, inner tiles | 12px (rounded-xl) |
| inputs, small chips | 8-10px (`--radius` 0.625rem) |

### Layout

- **Page max-width:** 1280px (`max-w-7xl`), side padding 16px mobile, 32px from md
- **Section gap:** 40px mobile, 80px md, 128px lg (`py-10 md:py-20 lg:py-32`)
- **Card padding:** 16px mobile, 32px desktop (CTA block up to 64px)
- **Element gap:** 12-16px in grids, 16-24px between buttons

## Components

### Floating Pill Navbar
**Role:** Primary navigation (desktop)

Sticky full-width bar that turns into a floating pill on scroll: max width animates 1280px to 1024px, full radius, then
`bg-background/80` with backdrop blur, a hairline border (#e5e5e5 / #262626) and a faint `shadow-lg shadow-black/5`. Before scroll
it has no border and no background. Logo left, links in 14px Inter 500 #525252 (hover black), locale switcher, a graphite pill CTA.
The Services link opens a 16px-radius white mega menu with service cards and their media.

### Mobile Menu
**Role:** Navigation (mobile)

Two-line hamburger (short line grows on hover). The menu opens as a circular clip-path "drop" from the toggle until it covers
the screen, on the page background.

### Primary Pill Button
**Role:** Main action ("Book a call")

Graphite #171717 fill, #fafafa text, 14px Inter 500, height 36px (40px large), 20px horizontal padding, full radius, no shadow.
On hover it swaps to the page background with a #d4d4d4 hairline and dark text. Slight magnetic pull toward the cursor.
In dark mode: #e5e5e5 fill, #171717 text.

### Outline Pill Button
**Role:** Secondary action ("See our work")

Page background, hairline border, same size and radius. Hover fills with the accent surface (#f5f5f5).

### Hero
**Role:** Above the fold

Left-aligned on the white canvas: Manrope bold h1 (41.6 to 60px, line height 1.05), muted Inter subheading (16 to 18px, #737373,
max width 576px), primary + outline pills, a row of three figures (big Manrope number, muted label under), the client logo
marquee, then the animated hero workflow mockup (with royal blue active states).

### Figures Row
**Role:** Proof in numbers

Three items centered, value in Manrope bold, label above or below in 12-14px #737373. Only numbers Qartmina can back up.

### Logo Marquee
**Role:** Social proof

Client and tool logos in grayscale, rendered twice and shifted by half (22s linear loop). Stops under reduced motion.

### Offer Category Card (Expertise grid)
**Role:** One card per offer category on the home page

24px radius card filled with its pillar tint (violet, amber, pink) holding an animated mockup; the title and summary sit on a
bottom gradient from the tint to transparent. 2 columns mobile, 3 on desktop, 12-16px gaps. Royal blue focus ring.
Cards flip to list the category's services.

### FAQ Row
**Role:** Accordion item

#f5f5f5 (dark #262626) 24px-radius row, 16px padding mobile, 32px desktop. Question in Manrope bold 16 to 24px. FAQPage JSON-LD.

### CTA Block
**Role:** End-of-page call to action

#f5f5f5 (dark #262626) 24px-radius panel, 24px padding mobile, 64px desktop, heading + muted subheading + pill buttons.

### Inline Link
**Role:** "Read the story" style text link

14px Inter 600 in royal blue (#1E40FF, dark #54a2ff), underline on hover with 4px offset. Nav links instead draw a 1px
underline from left to right on hover.

### Mockup Window
**Role:** Product and agent illustrations (hero workflow, CRM, agent team)

White (dark #0a0a0a) panels with hairline borders and 12-16px radii, monochrome UI with royal blue for the active step,
green check and amber pending for status. Optional layered `shadow-brand`.

## Do's and Don'ts

### Do
- Keep black, white and neutrals above 90% of every screen. Royal blue is a detail: one active state, a dot, a link, a focus ring.
- Make every button a pill (full radius). The site sets one radius for all buttons in `components/ui/button.tsx`.
- Use Manrope bold with tight tracking for all headings and big numbers; Inter for everything else.
- Set subheadings in #737373 (dark #a1a1a1) at 16 to 18px, max width about 576px.
- Use a pillar tint only when the content is about that pillar, one tint per card or frame.
- Separate surfaces with #f5f5f5 panels and #e5e5e5 hairlines instead of shadows.
- Ship both modes: every color needs its dark twin (white to #0a0a0a, royal blue to #54a2ff, tints to their dark versions).
- Respect reduced motion: every looping animation has a `prefers-reduced-motion` off switch.

### Don't
- Don't use royal blue as a background, a section fill or a headline color.
- Don't add a third typeface. EB Garamond stays on the logo, at most one accent word.
- Don't use sharp corners on cards or buttons (nothing under 8px except hairline dividers).
- Don't add drop shadows to cards or buttons. Shadows belong to the floating navbar, menus and hero mockups only.
- Don't recolor, stretch, outline or shadow the logo, and never retype "Qartmina" next to it in another font.
- Don't show figures, clients or results that are not Qartmina's own (no invented ROI or "time saved" numbers).
- Don't use em or en dashes in copy.

## Surfaces

| Level | Name | Light | Dark | Purpose |
|-------|------|-------|------|---------|
| 0 | Paper | `#ffffff` | `#0a0a0a` | Page canvas |
| 1 | Mist | `#f5f5f5` | `#262626` | Panels, FAQ rows, CTA block, card fills |
| 1b | Pillar tint | `#ece9fc` `#fcf3cc` `#f9e8f2` | `#26223b` `#31291c` `#31222c` | Offer cards per pillar |
| 2 | Card | `#ffffff` + `#e5e5e5` border | `#171717` + `#262626` border | Menus, mockup windows, cards on Mist |

## Elevation

Flat by default. Hierarchy comes from the white to #f5f5f5 surface step and hairline borders. Three exceptions: the scrolled
navbar (`shadow-lg shadow-black/5` with backdrop blur), dropdown menus (`shadow-xl`), and hero mockups, which may carry
`--shadow-brand`: a five-layer offset shadow falling down-left (-82px 54px 27px at 1% opacity down to -3px 2px 9px at 29%),
inverted to white in dark mode. The floating bob adds a drop shadow that grows softer at the top of the bob.

## Imagery

Product-first and diagrammatic. No stock photography of people at desks. Visuals are coded UI mockups (CRM tables, agent runs,
pipelines, chat), interactive node diagrams with traveling light beams, and monochrome tool logos (Simple Icons). Team photos
appear in the Team section. Blueprint-style banners (paper #ded5c8 with sepia lines) exist for social and print, not for the site
UI. Mockups animate in loops (pop in, travel across columns, scanner line) to show the work happening.

## Layout

Single 1280px column with 16 / 32px side padding. Home reads: floating navbar, left-aligned hero with figures, logo marquee and
workflow mockup, then the Expertise grid of offer category cards, OpenAI partner block, team, testimonials (snap carousel), FAQ,
contact. Section headers place the heading left and the subheading right on wide screens (`xl:flex-row`), stacked and centered
on mobile. Services overview uses a sticky category list on the left. Generous vertical rhythm (40 / 80 / 128px).

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0a0a (dark #ffffff)
- background: #ffffff (dark #0a0a0a)
- surface: #f5f5f5 (dark #262626)
- border: #e5e5e5 (dark #262626)
- muted text: #737373 (dark #a1a1a1)
- accent: #1E40FF (dark #54a2ff), details only
- primary action: #171717 pill with #fafafa text (dark #e5e5e5 with #171717)

**Example Component Prompts**

1. *Create a hero section:* White background. H1 left-aligned in Manrope 700, 60px desktop / 41.6px mobile, line height 1.05,
   tracking -0.025em, #0a0a0a. Subheading Inter 400 18px #737373, max width 576px, 32px vertical margin. Two pills: graphite
   "Book a call" and outline "See our work", 24px apart. Then a row of three figures centered, max width 768px.
2. *Create an offer card:* 24px-radius card filled with AI Violet #ece9fc (dark #26223b), animated monochrome mockup inside,
   title in Manrope 700 24px and a one-line summary at the bottom over a gradient from the tint to transparent. No shadow.
3. *Create a FAQ row:* #f5f5f5 panel, 24px radius, 32px padding, question in Manrope 700 24px, answer in Inter 16px #737373.
4. *Create a CTA block:* #f5f5f5 panel, 24px radius, 64px padding, heading in Manrope 700 48px, muted subheading, graphite pill.
5. *Create an active step in a mockup:* white pill with a #1E40FF 40% opacity border and royal blue text, small shadow; inactive
   steps in #a1a1a1 on hairline borders.

## Similar Brands

- **Linear**: same monochrome canvas, one accent used sparingly, product mockups instead of photos
- **Vercel**: black and white system with pill buttons, hairline borders, light and dark parity
- **Stripe Press / Stripe docs**: editorial calm, large tight headlines, muted gray body text
- **Attio**: CRM-style UI mockups as the main imagery, soft tinted cards per product area

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #0a0a0a;
  --color-paper: #ffffff;
  --color-graphite: #171717;
  --color-mist: #f5f5f5;
  --color-snow: #fafafa;
  --color-hairline: #e5e5e5;
  --color-stone: #737373;
  --color-ash: #a1a1a1;
  --color-slate: #525252;
  --color-coal: #262626;
  --color-royal: #1E40FF;
  --color-sky: #54a2ff;
  --color-pillar-ai: #ece9fc;
  --color-pillar-software: #fcf3cc;
  --color-pillar-brand: #f9e8f2;
  --color-done: #00c758;
  --color-pending: #fcbb00;

  /* Typography: families */
  --font-display: 'Manrope', ui-sans-serif, system-ui, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-logo: 'EB Garamond', ui-serif, Georgia, Cambria, "Times New Roman", serif;

  /* Typography: scale */
  --text-caption: 12px;
  --text-body-sm: 14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 18px;
  --text-card-title: 24px;
  --text-heading-sm: 30px;
  --text-heading: 36px;
  --text-heading-lg: 60px;
  --text-display: 60px;
  --leading-display: 1.05;
  --tracking-display: -0.025em;

  /* Typography: weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --page-max-width: 1280px;
  --page-gutter: 16px;          /* 32px from md */
  --section-gap: 128px;         /* 40px mobile, 80px md */
  --card-padding: 32px;         /* 16px mobile */
  --element-gap: 16px;

  /* Border radius */
  --radius: 0.625rem;
  --radius-pill: 9999px;
  --radius-card: 24px;
  --radius-menu: 16px;
  --radius-tile: 12px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mist: #f5f5f5;
  --surface-card: #ffffff;

  /* Elevation */
  --shadow-brand:
    -82px 54px 27px 0px rgba(0, 0, 0, 0.01),
    -52px 35px 25px 0px rgba(0, 0, 0, 0.04),
    -29px 19px 21px 0px rgba(0, 0, 0, 0.15),
    -13px 9px 16px 0px rgba(0, 0, 0, 0.25),
    -3px 2px 9px 0px rgba(0, 0, 0, 0.29);
}

.dark {
  --color-ink: #ffffff;
  --color-paper: #0a0a0a;
  --color-graphite: #e5e5e5;
  --color-mist: #262626;
  --color-hairline: #262626;
  --color-stone: #a1a1a1;
  --color-royal: #54a2ff;
  --color-pillar-ai: #26223b;
  --color-pillar-software: #31291c;
  --color-pillar-brand: #31222c;
  --surface-paper: #0a0a0a;
  --surface-mist: #262626;
  --surface-card: #171717;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #0a0a0a;
  --color-paper: #ffffff;
  --color-graphite: #171717;
  --color-mist: #f5f5f5;
  --color-hairline: #e5e5e5;
  --color-stone: #737373;
  --color-ash: #a1a1a1;
  --color-royal: #1E40FF;
  --color-sky: #54a2ff;
  --color-pillar-ai: #ece9fc;
  --color-pillar-software: #fcf3cc;
  --color-pillar-brand: #f9e8f2;

  /* Typography */
  --font-display: 'Manrope', ui-sans-serif, system-ui, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-logo: 'EB Garamond', ui-serif, Georgia, serif;
  --text-display: 60px;
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.025em;
  --text-heading: 36px;
  --text-heading--line-height: 1.15;
  --text-card-title: 24px;

  /* Border radius */
  --radius-card: 24px;
  --radius-menu: 16px;
  --radius-tile: 12px;

  /* Elevation */
  --shadow-brand:
    -82px 54px 27px 0px rgba(0, 0, 0, 0.01),
    -52px 35px 25px 0px rgba(0, 0, 0, 0.04),
    -29px 19px 21px 0px rgba(0, 0, 0, 0.15),
    -13px 9px 16px 0px rgba(0, 0, 0, 0.25),
    -3px 2px 9px 0px rgba(0, 0, 0, 0.29);
}
```
