---
name: Snoochie Soft
description: An independent record label whose catalogue is its apps: chartreuse ground, cobalt ink, numbered sleeves.
colors:
  chartreuse-ground: "#d4f03c"
  cobalt-ink: "#161a12"
  cobalt-ink-soft: "#2f3a1c"
  cobalt-field: "#23271d"
  cobalt-deep: "#181b13"
  on-field: "#eef3dc"
  on-field-soft: "#b9c2a0"
  liner-card: "#f6fbe0"
  liner-ink-soft: "#4a5530"
  focus-magenta: "#c2410c"
  phone-frame: "#0d0f0a"
  night-ground: "#1b1e16"
  night-ink: "#d4f03c"
  night-field: "#272b21"
  night-deep: "#111309"
  night-card: "#2a2f22"
  night-focus: "#ff7a3d"
typography:
  display:
    fontFamily: "Unbounded, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(32px, min(3.3vw, 5.6vh), 50px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Unbounded, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(30px, 3.6vw, 52px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Unbounded, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(20px, 1.8vw, 26px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.03em"
rounded:
  sleeve: "4px"
  face: "6px"
  chip: "6px"
  card: "8px"
  icon: "13px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 3.4vw, 48px)"
  section: "clamp(64px, 8vw, 112px)"
  gap-sm: "8px"
  gap-md: "12px"
  gap-lg: "22px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt-ink}"
    textColor: "{colors.chartreuse-ground}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  catno:
    backgroundColor: "{colors.cobalt-ink}"
    textColor: "{colors.chartreuse-ground}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "6px 9px"
  sleeve-card:
    rounded: "{rounded.sleeve}"
    size: "clamp(116px, min(10.2vw, 17vh), 172px)"
  liner-card:
    backgroundColor: "{colors.liner-card}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.card}"
    padding: "24px 26px"
  field-band:
    backgroundColor: "{colors.cobalt-field}"
    textColor: "{colors.on-field}"
    padding: "clamp(56px, 7vw, 96px) clamp(16px, 3.4vw, 48px)"
  lang-chip:
    backgroundColor: "{colors.chartreuse-ground}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.chip}"
    padding: "10px 11px"
---

# Design System: Snoochie Soft

## Overview

**Creative North Star: "The Record Label Catalogue"**

The studio is an independent label and every app is a numbered release (SNS-001 onward). The page is the catalogue: a chartreuse ground with cobalt ink, a crate of square sleeves, a pulled sleeve that flips to its back, and mono catalogue numbers, spine text and credits. App pages are the "back of the sleeve": side A / side B copy, track lists, liner credits. Colour comes from the sleeves; the chrome stays two-colour.

Density is catalogue-tight in the first viewport (headline, selected release and the whole row of sleeves together) and then spacious in long sections. Depth is physical and blurred: sleeves and phones sit above the page like objects on a desk, never like UI cards.

**Key Characteristics:**
- Two-colour chrome (chartreuse ground, cobalt ink), swapped in dark mode to a deep-blue ground with pale ink.
- Each release carries its own three-colour sleeve (c1 ground, c2 title ink, c3 spine/accent) from content/catalogue.json.
- Unbounded at heavy weight for display, Schibsted Grotesk for reading, Martian Mono for numbers and credits.
- Real phone screens in a dark frame are the only proof imagery.
- Sleeve covers are authored SVG/CSS, sized by container query units (cqi).

## Colors

Acid chartreuse over saturated cobalt: a punk-label two-tone, with a dark cobalt band system for crate, rules, screens and footer.

### Primary
- **Chartreuse Ground** (#d4f03c): page background in light mode; text-on-ink; the "pop" accent on cobalt bands (selected outlines, stickers, rule tops, current language).
- **Cobalt Ink** (#161a12): all text, borders, filled buttons and catalogue chips in light mode. Soft variant (#2f3a1c) for secondary copy.

### Secondary
- **Cobalt Field** (#23271d): crate box, "house rules" band, screens band, language menu. Deep variant (#181b13) for crate lip and footer.

### Neutral
- **Liner Card** (#f6fbe0): the back-of-sleeve and credits surface, with ink #161a12 and soft ink #4a5530.
- **On Field** (#eef3dc) and **On Field Soft** (#b9c2a0): text on cobalt bands.
- **Phone Frame** (#0d0f0a): bezel behind every screenshot.
- **Focus Magenta** (#c2410c, dark mode #ff7a3d): the only focus ring colour on ground and cards; chartreuse is used for focus on cobalt bands.
- **Night set** (ground #1b1e16, field #272b21, deep #111309, card #2a2f22, ink #d4f03c): applied via prefers-color-scheme; chartreuse stays as the pop.

### Named Rules
**The Two-Colour Chrome Rule.** Site chrome uses chartreuse and cobalt only; other hues appear solely inside a release's own sleeve colours.
**The Pop-On-Cobalt Rule.** Chartreuse as text or outline appears on cobalt bands; on the chartreuse ground the same role is played by cobalt ink.

## Typography

**Display Font:** Unbounded (self-hosted variable woff2, latin and latin-ext, fallback Arial Rounded MT Bold)
**Body Font:** Schibsted Grotesk (variable woff2, fallback system-ui)
**Label/Mono Font:** Martian Mono (variable woff2, fallback ui-monospace)

**Character:** A wide, heavy, slightly comic display face over a plain, newsy grotesk, with a typewriter-spec mono for the catalogue's paperwork. CJK pages swap to system CJK stacks and drop negative tracking.

### Hierarchy
- **Display** (900, clamp(32px, min(3.3vw, 5.6vh), 50px), 1.02, -0.035em): home h1. App-page h1 runs larger (900, clamp(34px, 4.4vw, 66px), 1, -0.04em).
- **Headline** (900, clamp(30px, 3.6vw, 52px), 1.02): block, rules and contact h2. Contact mail address is 700 at clamp(22px, 4.2vw, 58px).
- **Title** (700, clamp(20px, 1.8vw, 26px), 1.1, -0.02em): crate, screens, liner and related headings; sheet h3 is 700 19px.
- **Body** (400, 17px, 1.55; 16px under 760px): Schibsted Grotesk; ledes cap at 38 to 46ch, prose at 60 to 62ch.
- **Label** (Martian Mono 600, 11 to 12px, +0.03 to 0.06em, tabular numerals): catalogue numbers, spine text, credits, track numbers, captions.

### Named Rules
**The Mono Is Paperwork Rule.** Martian Mono carries numbers, credits, captions and stickers, not sentences.
**The Heavy Display Rule.** Unbounded is used at 700 to 900 with negative tracking; never light, never for body copy.

## Layout

One fluid gutter (clamp(16px, 3.4vw, 48px)) frames everything. The home front is a two-column grid (intro 320 to 410px, stage fluid) with the crate spanning full width beneath; at 1080px it stacks intro, crate, stage. Below the front: a catalogue sheet (five-column row: number, icon, title, tagline, links, collapsing at 1080 and 760), a house-rules band (3 columns, 1 under 760), contact, footer (1fr 2fr .8fr, 2 then 1 columns). App pages: sleeve-hero (text and sleeve, stacked under 1080), screens band, side A / side B two-column, liner notes plus credits card, related minis. Vertical rhythm between blocks is clamp(56 to 64px, 7 to 8vw, 96 to 112px). Breakpoints: 1080px and 760px. The first viewport is height-aware (vh-based clamps) so the whole crate row stays above the fold at 1440x900.

## Elevation & Depth

Hybrid, object-based. Sleeves, faces and phones carry blurred, negatively-spread drop shadows tinted from a single shadow colour (rgb 12,14,48 light, black dark) as if resting on a desk; a thin 1 to 2px contact line sits above the large soft shadow. Bands (field, deep, card) provide tonal layering. Hover lifts objects with translate, not shadow growth, except the Play badge.

### Shadow Vocabulary
- **Sleeve rest** (`0 1px 0 rgba(var(--shadow),.25), 0 18px 30px -16px rgba(var(--shadow),.7)`): crate sleeves.
- **Face / hero sleeve** (`0 2px 0 rgba(var(--shadow),.18), 0 30px 60px -24px rgba(var(--shadow),.65)`): pulled sleeve and app hero.
- **Phone** (`0 22px 34px -18px rgba(0,0,0,.7)`): screenshots.
- **Menu** (`0 18px 40px -12px rgba(var(--shadow),.55)`): language list.

### Named Rules
**The Desk Light Rule.** Shadows fall straight down, are blurred, and use negative spread; objects look placed, not floating UI.

## Shapes

Objects are nearly square: sleeves 4px, flipping faces 6px, liner card 8px, catalogue chips 6px, app icons 9 to 13px. Interactive controls are pills (999px) or circles (36 to 44px). Dashed borders (2 to 3px) mark empty slots (open SNS-007, 404 slot) and the language note. Rules are 2px ink above lists, 1px tint between rows. Stickers are rotated (-12deg) circles with a dashed inner ring. Phones have a 3px dark bezel and 11 to 18px radius.

## Components

### Buttons
- **Shape:** full pill, min-height 48px, 2px border.
- **Primary:** cobalt ink fill, chartreuse text, 12px 20px, bold; hover mixes 14% ground into the fill.
- **Ghost:** transparent, ink text and border; hover 10% ink tint.
- **Circle controls** (flip, arrows, 36 to 44px): 1.5px outline that inverts on hover; icon rotates or nudges.
- **Google Play badge:** 52px high image, lifts 2px with a soft shadow on hover.

### Catalogue chip
Cobalt fill, chartreuse Martian Mono 600 text, 6px radius, used for SNS numbers.

### Sleeve (signature)
Square release cover, aspect-ratio 1, with a 20px vertical-rl mono spine in a darkened c1, authored cover (number top-left, title bottom, icon top-right, optional sticker), and a phone screenshot "peeking" above that rises on hover. Selected state lifts 14px and gets a 3px chartreuse outline with a 3px offset. Empty slot: dashed outline on liner card.

### Pulled sleeve (signature)
3D gatefold: the cover face flips (rotateY 180deg, 0.85s, ease cubic-bezier(.16,1,.3,1)) to the liner-card rear with track list and two real screens on a cobalt panel. Reduced motion shows faces without transforms.

### Crate and lip
Horizontal scroll-snap rack of sleeves on a cobalt box; a deep-cobalt lip below holds a mono scrubber (catalogue numbers, chartreuse window bar) and circle arrows.

### Catalogue sheet
Ruled list: mono number, icon, Unbounded title, tagline, store and page links; open slot row in muted ink.

### Liner card
Liner-card surface with mono definition-list credits (130px label column) and legal links.

### Navigation
Brand mark with Unbounded wordmark and mono subline; pill nav links with 11% ink hover tint; language button is an outlined pill with mono code opening a cobalt menu (current item in chartreuse). Footer repeats languages as bordered mono chips, current one chartreuse-filled.

### Stamps
Outlined mono pills on app pages, the first one filled ink.

## Do's and Don'ts

### Do:
- **Do** give every release a catalogue number (SNS-###) in Martian Mono and a three-colour sleeve (c1, c2, c3) in catalogue.json.
- **Do** show apps through real screenshots in the 3px #0d0f0a bezel.
- **Do** keep all text on ground in cobalt ink and on cobalt bands in On Field / On Field Soft.
- **Do** use the gutter variable and clamp-based section spacing for new blocks.
- **Do** use the ease cubic-bezier(.16,1,.3,1) for all movement and honour prefers-reduced-motion.
- **Do** keep touch targets at or above 36px (buttons 48px, flip 44px).

### Don't:
- **Don't** replace the catalogue with an equal-card grid plus hero.
- **Don't** introduce a third chrome hue; colour belongs to sleeves.
- **Don't** use Unbounded for body text or Martian Mono for sentences.
- **Don't** use hard offset shadows; shadows are blurred with negative spread.
- **Don't** use Cyrillic/Russian content anywhere on the site.
