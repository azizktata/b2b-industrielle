# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack, default)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
npm run scrape                 # Run all scrapers → writes data/products.json, data/guides.json, data/catalogues.json
npm run scrape -- samson       # Run a single brand (merges into existing data, does not wipe other brands)
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

### Data layer

Two distinct data sources with different patterns:

**Scraped data** — `data/products.json`, `data/guides.json`, `data/catalogues.json`
- Populated by `npm run scrape` which runs `scripts/scraper/run.ts` using `tsx`
- Per-brand scrapers in `scripts/scraper/scrapers/` — **only SAMSON is active** (others are stubbed/commented out in `run.ts`)
- `SOGECOR.md` at repo root has the per-brand scraper status, source URLs, and current product counts — read it before implementing a new scraper
- Normalizer in `scripts/scraper/normalizer.ts` assigns `famille` and `application` taxonomy via keyword regexes in `scripts/scraper/families.ts`
- Product IDs are deterministic slugs: `slugify("{MARQUE}-{product name}")` e.g. `samson-vanne-type-3250`
- `filterProducts()` uses `fuse.js` for fuzzy full-text search across `name`, `shortDescription`, and `pdfs[].label`
- Accessed at runtime via `lib/catalogue.ts` helpers: `getProducts()`, `filterProducts()`, `getProductById()`, `groupProductsByFamille()`, `groupProductsByMarque()`, etc.
- Also exports `FAMILLE_LABELS` and `APPLICATION_LABELS` display maps used by UI components
- Next.js caches `require("@/data/*.json")` at build time in production

**Hardcoded brand data** — `lib/brands.ts`
- `BRANDS` array with full `Brand` type: agreement level, SAV status, product families, catalogues, applications
- `getBrandBySlug(slug)` and `getAllBrandSlugs()` for route generation
- Brand IDs (slugs) match `MarqueKey` values in `scripts/scraper/types.ts`

**Type taxonomy** — `scripts/scraper/types.ts`
- `MarqueKey`: SAMSON | SECTORIEL | MIVAL | iFm | sferaco | ADCA
- `FamilleKey`: robinetterie | regulation-vapeur | instrumentation | traitement-fluides | automatisme
- `ApplicationKey`: reseau-vapeur | air-comprime | eau-surchauffee

### Routes built

| Route | Type | Data source |
|---|---|---|
| `/` | Server Component | Static |
| `/produits` | Server Component | `lib/catalogue.ts` — supports `?q=` fuzzy search and `?application=` filter |
| `/produits/famille/[famille]` | Server Component (static) | `filterProducts({ famille })` + `?q=` + `?application=` |
| `/produits/[slug]` | Server Component (static) | `getProductById(slug)` — `slug` is the product `id` field |
| `/marques` | Server Component | `lib/brands.ts` |
| `/marques/[slug]` | Server Component | `lib/brands.ts` via `getBrandBySlug()` |
| `/ressources` | Server Component | Hardcoded consts |

All new routes go under `app/` using App Router file conventions. New shared UI goes under `components/`.

`ProductsCatalog` (`components/ProductsCatalog.tsx`) is the client component handling the famille/application toggle on `/produits`. It receives a `counts` prop from the server page and renders the two view modes client-side.

### Next.js 16 breaking change: async params

In Next.js 16, dynamic route `params` and `searchParams` are `Promise`s and must be awaited:

```ts
// ✅ Correct — Next.js 16
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// ✅ generateMetadata also needs await
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

Do NOT use the old synchronous `{ params }: { params: { slug: string } }` pattern.

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

Per the spec: `/applications/[app]`, `/services`, `/contact`, `/devis`, `/recherche`, Espace Client Pro.

Scrapers not yet implemented: SECTORIEL, MIVAL, iFm, sferaco, ADCA — see `SOGECOR.md` for source URLs and expected data shapes.

## Design Skills

Three design skills live in `.agents/skills/` and are registered in `skills-lock.json`. **Always read and follow their instructions when doing any UI/frontend work:**

- **`/impeccable`** — Core design skill. Follow its guidelines (typography, colour, layout, motion) whenever building any component, page, or UI artifact. Run `/impeccable teach` first if no `.impeccable.md` design context file exists yet.
- **`/bolder`** — Use when a design looks too safe, generic, or lacks personality. Requires `/impeccable` context.
- **`/adapt`** — Use for responsive/cross-device adaptation work. Requires `/impeccable` context.
