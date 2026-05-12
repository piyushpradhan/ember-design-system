# Ember — Design System

A tight, opinionated design system for personal brand and product UI — warm neutrals,
ember accent, dual-mode (light + dark, equal priority).

> "Function before flourish. Craft is visible in restraint. Warm, not sterile.
> One weird thing. Both modes are first-class. Respect the medium."
> — [design-brief.md](./design-brief.md)

## Links

- **Showcase site** — https://ember-design-system.vercel.app
- **Storybook** — https://ember-storybook.vercel.app
- **Source brief** — [design-brief.md](./design-brief.md)

## Stack

- React 19 + TypeScript + Vite
- CSS Modules + CSS custom properties (mode-aware tokens)
- Storybook 10 (`@storybook/react-vite`)
- Lucide icons (1.5px stroke, outline only)
- `react-router-dom` for showcase routing

## What is in the box

**Tokens** — color, type scale, spacing, radius, motion, elevation. All mode-aware via
`[data-theme="light" | "dark"]` on `<html>`.

**Components — 36 total**:

- _Primitives:_ Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch,
  Label, Badge, Tag, Avatar, Divider, Tooltip, Spinner.
- _Patterns:_ Card, Modal, Drawer, Toast, Tabs, Accordion, Navigation (top + side),
  Breadcrumb, Pagination, Table, Empty State, Form Field.
- _Editorial:_ Article Header, Pull Quote, Margin Note, Code Block, Inline Code, Footnote,
  Author Byline, Tag Cloud, Reading Progress.

## Develop

```bash
npm install
npm run dev          # showcase app  -> http://localhost:5173
npm run storybook    # Storybook     -> http://localhost:6006
```

## Build

```bash
npm run build              # outputs to dist/
npm run build-storybook    # outputs to storybook-static/
```

## Project layout

```
src/
  styles/                 tokens.css, base.css, typography.css
  lib/
    components/
      primitives/         15 atomic components
      patterns/           12 composite components
      editorial/          9 long-form components
    hooks/                useTheme
    utils/                cn
  pages/                  Home, Foundations, Components, Editorial, About
  showcase/               AppShell (nav, theme toggle, signature footer)
.storybook/               main.ts, preview.ts, fonts.css
```

Each component lives in its own folder with `Name.tsx`, `Name.module.css`,
`Name.stories.tsx`, and `index.ts`.

## The "one weird thing" clause

The system permits exactly one element per surface that breaks the grid intentionally.
On this showcase site: a hand-drawn signature in the footer, in the ember accent. It is
the anti-template clause — it prevents the system from collapsing into "tasteful dev
portfolio #4,892."

## License

MIT.
