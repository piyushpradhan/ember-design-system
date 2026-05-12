# Design System Brief — Piyush Pradhan

**Author:** Piyush Pradhan
**Status:** Draft v0.1
**Last updated:** May 2026
**Scope:** Personal brand + product UI, dual-mode (light/dark equal priority), tightly opinionated

---

## 1. Purpose

This document defines the intent, principles, and constraints for a personal design system. The system covers two surfaces with equal weight:

- **Brand/editorial** — personal site, Recurse blog, project landing pages, social/profile presence
- **Product UI** — apps I build (Daily Output Tracker, smart clipboard manager, financial planner, future projects)

The system is **tight**, not flexible. Designers and developers using it should feel constrained in a productive way — most decisions are already made. The escape hatches are deliberate and few.

---

## 2. Design Principles

These are the rules every decision is measured against. When in doubt, the earlier principle wins.

**1. Function before flourish.**
Every visual element earns its place by serving comprehension, hierarchy, or action. Decoration without purpose gets removed. This is not minimalism for its own sake — it's respect for the reader's attention.

**2. Craft is visible in restraint.**
The system signals quality through typographic precision, spacing rhythm, and consistent micro-detail — not through gradients, glassmorphism, or generative ornament. A well-set paragraph beats a clever animation.

**3. Warm, not sterile.**
Off-whites over pure white. Near-blacks over pure black. One disciplined accent color. The aesthetic is Swiss-precise but inhabited — like a workshop, not a showroom.

**4. One weird thing.**
Every surface gets exactly one element that breaks the grid — a handwritten note, an unexpected accent, a personal mark. The system is opinionated enough to allow this without becoming chaotic. This is the anti-template clause.

**5. Both modes are first-class.**
Light and dark are designed in parallel, not as inversions of each other. Neither is "the real one." Tokens are mode-aware from the ground up.

**6. Respect the medium.**
Editorial surfaces read like editorial. Product surfaces respond like products. The system shares tokens and a voice — not layouts.

---

## 3. Brand Voice & Tone

| Attribute | Yes | No |
|---|---|---|
| Voice | Direct, dry, opinionated | Corporate, hedged, performatively friendly |
| Humor | Wry, occasional | Memes, exclamation points, emoji-heavy |
| Confidence | High, with receipts | Salesy, hype-driven |
| Density | Dense when it earns it | Padding for the sake of "approachability" |

**Reference for written voice:** Robin Rendle, Paul Stamatiou, Linear's changelog, the old Stripe blog.

**Anti-references:** SaaS landing page hero copy ("Supercharge your workflow"), corporate Medium posts, anything that says "we're so excited to announce."

---

## 4. Typography

Typography carries 70% of the system's character. Get this right and most other things follow.

### Type Stack

| Role | Primary | Fallback Stack |
|---|---|---|
| UI / Sans | **Inter** (variable) | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| Editorial / Serif | **GT Sectra** *(licensed)* or **Source Serif 4** *(free alt)* | `ui-serif, Georgia, "Times New Roman", serif` |
| Monospace | **Berkeley Mono** *(licensed)* or **JetBrains Mono** *(free alt)* | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |
| Display / Personality | **Söhne Breit** *(licensed)* or **Inter Display** *(free alt)* | falls back to sans |

**Why:** Inter is the workhorse — pristine UI at every size. A serif is non-negotiable for long-form Recurse posts; reading 2,000 words in sans is hostile. The mono is for code (obviously) but also for metadata, timestamps, version numbers, and the occasional design accent.

**Not allowed:** Poppins, Montserrat, Open Sans, Lato, Roboto as a primary, Comic Sans (obviously), anything rounded-geometric trying to be friendly.

### Type Scale

Modular scale, base 16px, ratio 1.250 (Major Third). Rounded to whole pixels.

| Token | Size | Line Height | Letter Spacing | Use |
|---|---|---|---|---|
| `text-2xs` | 11px | 1.45 | +0.02em | Captions, labels |
| `text-xs` | 12px | 1.45 | +0.01em | Metadata, footnotes |
| `text-sm` | 14px | 1.5 | 0 | UI body, secondary text |
| `text-base` | 16px | 1.6 | 0 | Default body |
| `text-md` | 18px | 1.65 | 0 | Editorial body (Recurse) |
| `text-lg` | 20px | 1.5 | -0.005em | Lead paragraphs |
| `text-xl` | 24px | 1.35 | -0.01em | H4 |
| `text-2xl` | 30px | 1.3 | -0.015em | H3 |
| `text-3xl` | 38px | 1.2 | -0.02em | H2 |
| `text-4xl` | 48px | 1.15 | -0.025em | H1 |
| `text-5xl` | 60px | 1.1 | -0.03em | Display |
| `text-6xl` | 76px | 1.05 | -0.035em | Hero display |

**Weight axis:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold). No light weights below 400 — they break under common rendering pipelines.

**Rules:**
- Body copy: serif on editorial surfaces, sans on product surfaces. Never mix in a single block.
- Headings: sans by default. Serif heading is an editorial choice, used deliberately (e.g., long-form essay opener).
- Mono: use for code, numeric data (financial tables, metrics), and *one* personality moment per page maximum.
- Letter-spacing tightens as size grows. Never positive tracking on body or headings — only on uppercase labels.

---

## 5. Color System

Color is restrained. The system uses neutrals + one signature accent. Everything else is functional (semantic) color.

### Foundation: Warm Neutrals

Built on a warm gray ramp (slight hue toward `#FFB000`, not pure gray). Tokens are mode-aware — same name, different value per mode.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg-canvas` | `#FAF9F6` | `#0F0F0E` | Page background |
| `bg-surface` | `#FFFFFF` | `#181816` | Cards, elevated panels |
| `bg-subtle` | `#F3F1EC` | `#1F1F1D` | Inset areas, code blocks |
| `bg-muted` | `#E8E5DE` | `#2A2A27` | Hover states, dividers fill |
| `border-subtle` | `#E8E5DE` | `#2A2A27` | Hairlines |
| `border-default` | `#D4CFC4` | `#3A3A36` | Standard borders |
| `border-strong` | `#9C968A` | `#5C5C57` | Emphasis borders |
| `text-primary` | `#161513` | `#F2EFE8` | Body, headings |
| `text-secondary` | `#5C5853` | `#A8A39A` | Supporting copy |
| `text-tertiary` | `#8B867D` | `#7A756D` | Captions, metadata |
| `text-disabled` | `#BAB3A6` | `#4A4742` | Disabled state |

**Why warm:** Pure gray ramps feel clinical and read as "default." A slight warm shift makes the system feel inhabited and ages better on screens with different white points.

### Signature Accent: Ember

A single saturated burnt-orange/amber. Inspired by Triumph's heritage paint and old machine warning lamps. Used with discipline — primary CTAs, key links, brand mark, and nothing else.

| Token | Light | Dark | Use |
|---|---|---|---|
| `accent-ember-50` | `#FFF4EC` | `#2A1810` | Tinted backgrounds |
| `accent-ember-100` | `#FFE3CC` | `#3D2418` | Hover surfaces |
| `accent-ember-500` | `#D9541A` | `#E86B2E` | **Primary accent** — CTAs, links |
| `accent-ember-600` | `#B8410D` | `#F58247` | Hover/active |
| `accent-ember-700` | `#8F3309` | `#FF9663` | Pressed |

**Contrast:** Ember-500 hits WCAG AA against canvas in both modes.

### Semantic Colors

Used only when meaning is functional — never decorative.

| Token | Light | Dark | Use |
|---|---|---|---|
| `status-success` | `#2F7D4F` | `#52C77E` | Confirmations |
| `status-warning` | `#B5811A` | `#E5B547` | Attention |
| `status-danger` | `#B53A2C` | `#E56657` | Destructive, errors |
| `status-info` | `#2D6BAE` | `#5599DD` | Neutral notices |

**Rules:**
- Pure `#000` and `#FFF` are banned. Always use the token.
- No gradients in UI. One mesh gradient allowed on the hero of the personal site landing page, used sparingly.
- Accent color appears on roughly 5% of the visible pixels on any given screen. If you're tempted to use it more, you're using it wrong.

---

## 6. Spacing & Layout

### Spacing Scale

4px base unit. The scale is non-linear after 24px to discourage mid-range spacing decisions.

| Token | Value | Common Use |
|---|---|---|
| `space-0` | 0 | — |
| `space-1` | 4px | Icon-to-text |
| `space-2` | 8px | Tight grouping |
| `space-3` | 12px | Form field internal |
| `space-4` | 16px | Default gap |
| `space-5` | 24px | Component padding |
| `space-6` | 32px | Section internal |
| `space-8` | 48px | Block separation |
| `space-10` | 64px | Major sections |
| `space-12` | 96px | Page sections |
| `space-16` | 144px | Hero/landing |

### Grid

- **Editorial:** Single column, max-width 680px (≈70ch at 16px). Margin notes can break out to 880px.
- **Product:** 12-column flex grid, 24px gutter desktop / 16px gutter tablet / 16px single-column mobile.
- **Breakpoints:** `sm 640px · md 768px · lg 1024px · xl 1280px · 2xl 1536px`.

### Radius

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0 | Tables, code blocks |
| `radius-sm` | 4px | Inputs, small buttons |
| `radius-md` | 6px | Cards, modals |
| `radius-lg` | 10px | Large containers |
| `radius-pill` | 999px | Tags, badges |

No `radius-xl` or higher. Heavily rounded UI ages poorly and reads as "consumer app."

### Elevation

The system uses **two** shadow tokens. That's it.

| Token | Light | Dark |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(20, 18, 14, 0.06)` | `0 1px 2px rgba(0, 0, 0, 0.4)` |
| `shadow-md` | `0 6px 24px -4px rgba(20, 18, 14, 0.10)` | `0 8px 32px -4px rgba(0, 0, 0, 0.5)` |

Borders do most of the depth work. Shadows are for true elevation (modals, dropdowns).

---

## 7. Motion

Sparse, physical, optional.

### Tokens

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 120ms | Hover, focus |
| `duration-base` | 200ms | Standard transitions |
| `duration-slow` | 320ms | Modal enter, drawer |
| `easing-standard` | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | Default |
| `easing-spring` | spring(stiffness: 220, damping: 26) | Interactive feedback |
| `easing-decelerate` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Enter |
| `easing-accelerate` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Exit |

### Rules

- Springs for anything driven by direct user action (drag, toggle, hover). Curves for system-driven transitions.
- Page transitions: avoid them. Crossfade if absolutely necessary.
- Respect `prefers-reduced-motion: reduce` — fall back to opacity-only or instant.
- No scroll-jacked storytelling. No parallax. No "watch this entrance animation" hero.

---

## 8. Iconography

- **Library:** Lucide (primary). Phosphor at "regular" weight as fallback for icons Lucide lacks.
- **Stroke:** 1.5px at 16/20/24px sizes.
- **Color:** Always `text-primary` or `text-secondary` — never the accent unless paired with an accent-colored CTA.
- **No filled icon sets.** Outline only. Consistency over expressiveness.
- **No emoji as iconography in product UI.** Emoji is allowed in editorial content (Recurse), used sparingly.

---

## 9. Components: Minimum Viable Set

These are the components that exist on day one. Anything outside this list requires a justification.

**Primitives:** Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Label, Badge, Tag, Avatar, Divider, Tooltip, Spinner.

**Patterns:** Card, Modal, Drawer, Toast, Tabs, Accordion, Navigation (top + side), Breadcrumb, Pagination, Table, Empty State, Form Field group.

**Editorial:** Article header, Pull quote, Margin note, Code block (with copy button), Inline code, Footnote, Author byline, Tag cloud, Reading progress indicator.

### Button — Worked Example

The button is the canonical component. Get this right, the rest follows.

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `accent-ember-500` | `#FFFFFF` | none |
| Secondary | `bg-surface` | `text-primary` | `border-default` |
| Ghost | transparent | `text-primary` | none |
| Danger | `status-danger` | `#FFFFFF` | none |
| Link | transparent | `accent-ember-500` (underline on hover) | none |

| Size | Height | Padding X | Text |
|---|---|---|---|
| sm | 28px | 12px | text-sm / 500 |
| md | 36px | 16px | text-sm / 500 |
| lg | 44px | 20px | text-base / 500 |

**States:** rest, hover (background shift to `-600`), active (shift to `-700`), focus-visible (2px outline at `accent-ember-500` + 2px offset), disabled (40% opacity, no pointer events), loading (spinner replaces icon, label stays).

---

## 10. Accessibility

Non-negotiable baseline:

- **Contrast:** AA minimum for body text (4.5:1), AAA target for editorial long-form (7:1). Large text and UI components meet AA (3:1).
- **Focus:** Visible focus rings on every interactive element. `focus-visible` only — no rings on mouse click.
- **Motion:** Honor `prefers-reduced-motion`.
- **Color independence:** Never communicate state through color alone. Icon + color + text label.
- **Targets:** 44×44px minimum tap target on touch, 24×24px on pointer.
- **Keyboard:** Every interaction reachable without a mouse. Tab order matches visual order.

---

## 11. The "One Weird Thing" Clause

Every product or page surface gets exactly one element that breaks the system intentionally. Examples of what this can be — not what it must be:

- A handwritten signature in the footer of the personal site
- A pixel-art easter egg on the 404 page
- A loud accent (off-brand color) used on a single label
- An audio cue or haptic moment on a key interaction
- A typewriter-style date stamp on Recurse posts
- Console.log art on the homepage

The rule: one per surface, deliberate, charming, and removable without breaking anything else. This prevents the system from collapsing into "tasteful dev portfolio #4,892."

---

## 12. Tokens: Implementation

Tokens live in a single source of truth (`tokens.json` or Style Dictionary). Output formats:

- **Web:** CSS custom properties + Tailwind config
- **Figma:** Variables (mode-aware)
- **iOS / Android:** if/when needed, generated from the same source

Naming convention: `{category}-{role}-{variant?}-{state?}` — e.g., `bg-surface`, `accent-ember-500`, `text-primary`.

---

## 13. References & Mood

**Yes:**
Linear · Vercel · Rauno Freiberg · Robin Rendle's site · old Stripe docs · Are.na · Paco Coursey's site · Cron (RIP) · Readwise's editorial design · Berkeley Graphics' type specimens · Hoefler & Co.'s pre-Monotype site · Working Not Working's case studies

**No:**
Apple's current glassmorphism era · YC startup landing pages with hero gradients · most Webflow templates · Material Design 3 expressive · anything that uses "supercharge" in a hero · Bento grids · 3D blob illustrations · dashboard screenshots floating at a 12° angle

**Adjacent worlds for cross-pollination:**
Triumph motorcycle catalogues · Berkeley Graphics type specimens · Standard Issue magazine · Monocle's print issues (not the website) · Specialty coffee brand systems (Onyx, Sey, Hydrangea) · DJI's product photography discipline

---

## 14. Open Questions

Decisions intentionally deferred to the build phase:

1. Final type license selection (GT Sectra vs Source Serif, Berkeley Mono vs JetBrains Mono) — depends on budget.
2. Whether the accent color shifts hue slightly between light and dark mode (current spec: yes — warmer in light, slightly brighter in dark).
3. Logotype / wordmark — not part of this brief. Treat as a separate deliverable.
4. Illustration style — TBD. Default to no illustration until a clear voice is found. Photography over illustration where possible.

---

## 15. Definition of Done

The system is "v1 ready" when:

- [ ] All tokens defined in code and Figma, mode-aware
- [ ] Type ramp implemented and tested at every size in both modes
- [ ] All Section 9 components shipped with all states
- [ ] Personal site (homepage + Recurse index + post template) uses only system tokens
- [ ] One product UI (Daily Output Tracker) fully migrated
- [ ] Accessibility audit passed (axe + manual keyboard run)
- [ ] Documentation site published with live examples
- [ ] One "weird thing" present on each ship surface

---

*End of brief.*
