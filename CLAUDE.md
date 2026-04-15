# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack, default)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

> **Note:** `next build` does NOT run the linter automatically (changed in Next.js 16). Run lint separately.
> Use `npm run dev -- --webpack` to opt out of Turbopack if needed.

## Stack

- **Next.js 16.2.3** with App Router (breaking changes vs. prior versions — read `node_modules/next/dist/docs/` before writing routing or data-fetching code)
- **React 19.2.4**
- **TypeScript** (strict mode, path alias `@/*` → repo root)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — uses `@import "tailwindcss"` in CSS, not `@tailwind` directives
- **Barlow Condensed** (`--font-display`) + **Barlow** (`--font-sans`) via `next/font/google` — variables set on `<html>` in `app/layout.tsx`

## Project Purpose

B2B industrial equipment catalog site (régulation & vapeur) for a company named **Techniflux**. The `CAHIER-DE-CHARGE.md` at the repo root is the full product brief — read it before building any feature. Key decisions already in that document:

- **Design language:** "Industriel Propre" — navy blue, anthracite grey, straight lines, technical vector icons. No rounded shadows or consumer-friendly flourishes.
- **Navigation model:** Organized by trade family (Robinetterie, Régulation Vapeur, Instrumentation, Traitement des Fluides, Automatisme) AND by application (Réseau Vapeur, Air Comprimé, etc.) with a toggle between the two views on the product listing.
- **No e-commerce cart:** The cart is a *Quote Request basket* (Panier de Devis), not a purchase flow.
- **Mobile-first for field workers:** Large tap targets, simplified nav for maintenance technicians on phones in noisy environments.
- **Key personas:** Maintenance manager (mobile, wants reference in < 2 min), Design Bureau/BE (desktop, needs datasheets and dimensional drawings), Buyer (brand/SAV trust signals).

## Architecture

### File structure

```
app/
  layout.tsx        — root layout; loads Barlow fonts, sets lang="fr"
  page.tsx          — homepage (Server Component); wires together all sections
  globals.css       — Tailwind v4 entry; OKLCH colour tokens + @theme inline block
components/
  Header.tsx        — sticky nav, mobile hamburger, "Demande de Devis" CTA ("use client")
  HeroSlider.tsx    — auto-advancing 3-slide hero with SVG schematics ("use client")
  ProductsCatalog.tsx — famille/application toggle grid ("use client")
```

All new routes go under `app/` using App Router file conventions. New shared UI goes under `components/`.

### Design tokens

All colour tokens are defined as CSS custom properties in `app/globals.css` and mapped to Tailwind utility classes via the `@theme inline` block:

| Token | Utility class | Usage |
|---|---|---|
| `--navy-950/900/800/700` | `bg-navy-950` etc. | Dark backgrounds, header |
| `--steel` / `--steel-lt` | `bg-steel`, `text-steel` | Primary accent / CTA |
| `--graphite` | `bg-graphite` | Stats bar |
| `--surface` / `--dim` | `bg-surface`, `bg-dim` | Page backgrounds |
| `--ink` / `--ink-mid` / `--ink-soft` | `text-ink` etc. | Body copy hierarchy |
| `--border` | `border-border` | All dividers |

Fluid type helpers `.text-fluid-hero` and `.text-fluid-h2` are defined in `globals.css` using `clamp()`.

### Conventions

- **Inline SVGs only** — no icon library. Icons use `strokeLinecap="square"` to match the industrial aesthetic.
- **"use client"** required on any component using hooks or event handlers. Server Components are the default in App Router.
- **Font classes:** use `font-display` (Barlow Condensed, headings) and `font-sans` (Barlow, body). Never use Tailwind's default `font-sans`.
- **Slug generation pattern** (used in brand/product links): `name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")`

### Planned sections (not yet built)

Per the spec: `/produits/[famille]`, `/applications/[app]`, `/marques`, `/marques/[slug]`, `/ressources`, `/services`, `/contact`, `/devis`, `/recherche`, Espace Client Pro.

## Design Skills

Three design skills live in `.agents/skills/` and are registered in `skills-lock.json`. **Always read and follow their instructions when doing any UI/frontend work:**

- **`/impeccable`** — Core design skill. Follow its guidelines (typography, colour, layout, motion) whenever building any component, page, or UI artifact. Run `/impeccable teach` first if no `.impeccable.md` design context file exists yet.
- **`/bolder`** — Use when a design looks too safe, generic, or lacks personality. Requires `/impeccable` context.
- **`/adapt`** — Use for responsive/cross-device adaptation work. Requires `/impeccable` context.
