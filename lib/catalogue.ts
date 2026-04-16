import Fuse from "fuse.js"
import type { Product, Guide, Catalogue, FamilleKey, MarqueKey, ApplicationKey } from "@/scripts/scraper/types"

// ─── Taxonomy display maps ────────────────────────────────────────────────────

export const FAMILLE_LABELS: Record<FamilleKey, { label: string; sub: string }> = {
  "robinetterie":        { label: "Robinetterie Industrielle", sub: "Vannes · Soupapes · Clapets" },
  "regulation-vapeur":   { label: "Régulation Vapeur",         sub: "Purgeurs · Détendeurs · Séparateurs" },
  "instrumentation":     { label: "Instrumentation",           sub: "Manomètres · Thermomètres · Pressostats" },
  "traitement-fluides":  { label: "Traitement des Fluides",    sub: "Filtres · Sécheurs · Air Comprimé" },
  "automatisme":         { label: "Automatisme",               sub: "Électrovannes · Vannes Motorisées" },
}

export const APPLICATION_LABELS: Record<ApplicationKey, string> = {
  "reseau-vapeur":    "Réseau Vapeur",
  "air-comprime":     "Air Comprimé",
  "eau-surchauffee":  "Eau Surchauffée",
}

// ─── Data loaders ─────────────────────────────────────────────────────────────
// Next.js caches these at build time in production (Server Components).

export function getProducts(): Product[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/data/products.json") as Product[]
}

export function getGuides(): Guide[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/data/guides.json") as Guide[]
}

export function getCatalogues(): Catalogue[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/data/catalogues.json") as Catalogue[]
}

// ─── Filter interfaces ────────────────────────────────────────────────────────

export interface ProductFilters {
  famille?: FamilleKey
  marque?: MarqueKey
  application?: ApplicationKey
  /** Full-text / fuzzy search across name, shortDescription, and PDF labels */
  q?: string
}

export interface GuideFilters {
  famille?: FamilleKey
  marque?: MarqueKey
  q?: string
}

// ─── Product queries ──────────────────────────────────────────────────────────

export function filterProducts(filters: ProductFilters = {}): Product[] {
  let results = getProducts()

  if (filters.famille) {
    results = results.filter((p) => p.famille === filters.famille)
  }
  if (filters.marque) {
    results = results.filter((p) => p.marque === filters.marque)
  }
  if (filters.application) {
    results = results.filter((p) => p.application.includes(filters.application!))
  }
  if (filters.q?.trim()) {
    const fuse = new Fuse(results, {
      keys: ["name", "shortDescription", "pdfs.label"],
      threshold: 0.4,
      minMatchCharLength: 2,
    })
    results = fuse.search(filters.q.trim()).map((r) => r.item)
  }

  return results
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

/** Group products by famille for catalog overview pages */
export function groupProductsByFamille(): Record<FamilleKey, Product[]> {
  const groups = {} as Record<FamilleKey, Product[]>
  for (const product of getProducts()) {
    if (!product.famille) continue
    if (!groups[product.famille]) groups[product.famille] = []
    groups[product.famille].push(product)
  }
  return groups
}

/** Group products by marque for brand pages */
export function groupProductsByMarque(): Record<MarqueKey, Product[]> {
  const groups = {} as Record<MarqueKey, Product[]>
  for (const product of getProducts()) {
    if (!groups[product.marque]) groups[product.marque] = []
    groups[product.marque].push(product)
  }
  return groups
}

// ─── Guide queries ────────────────────────────────────────────────────────────

export function filterGuides(filters: GuideFilters = {}): Guide[] {
  let results = getGuides()

  if (filters.famille) {
    results = results.filter((g) => g.famille === filters.famille)
  }
  if (filters.marque) {
    results = results.filter((g) => g.marque === filters.marque)
  }
  if (filters.q) {
    const q = filters.q.toLowerCase()
    results = results.filter((g) => g.name.toLowerCase().includes(q))
  }

  return results
}

// ─── Catalogue queries ────────────────────────────────────────────────────────

export function filterCatalogues(marque?: MarqueKey): Catalogue[] {
  const all = getCatalogues()
  return marque ? all.filter((c) => c.marque === marque) : all
}

// ─── Aggregates (for filter UI dropdowns) ─────────────────────────────────────

export function getAvailableMarques(): MarqueKey[] {
  return [...new Set(getProducts().map((p) => p.marque))].sort() as MarqueKey[]
}

export function getAvailableFamilles(): FamilleKey[] {
  return [...new Set(getProducts().map((p) => p.famille).filter(Boolean))].sort() as FamilleKey[]
}

// utils
 export const truncateName = (name: string | undefined, maxLength: number = 20): string => {
  if (!name) return "";
  if (name.length <= maxLength) return name;
  
  return `${name.substring(0, maxLength).trim()}...`;
};