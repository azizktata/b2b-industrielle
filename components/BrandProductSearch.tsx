"use client"

import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import { FAMILLE_LABELS } from "@/lib/catalogue"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/scripts/scraper/types"
import type { FamilleKey } from "@/scripts/scraper/types"

const PAGE_SIZE = 12

type Props = {
  products: Product[]
  brandName: string
}

export default function BrandProductSearch({ products, brandName }: Props) {
  const [q, setQ] = useState("")
  const [selectedFamille, setSelectedFamille] = useState<FamilleKey | null>(null)
  const [page, setPage] = useState(0)

  // Available familles from this brand's products
  const availableFamilles = useMemo(
    () => [...new Set(products.map(p => p.famille).filter(Boolean))] as FamilleKey[],
    [products]
  )

  // Apply famille filter first
  const familleFiltered = useMemo(
    () => selectedFamille ? products.filter(p => p.famille === selectedFamille) : products,
    [products, selectedFamille]
  )

  // Fuse instance scoped to famille-filtered set
  const fuse = useMemo(
    () => new Fuse(familleFiltered, {
      keys: ["name", "shortDescription", "pdfs.label"],
      threshold: 0.4,
      minMatchCharLength: 2,
    }),
    [familleFiltered]
  )

  const filtered = q.trim().length >= 2
    ? fuse.search(q.trim()).map(r => r.item)
    : familleFiltered

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSetQ(val: string) {
    setQ(val)
    setPage(0)
  }

  function handleSetFamille(val: FamilleKey | null) {
    setSelectedFamille(val)
    setPage(0)
  }

  return (
    <section className="bg-dim py-12 lg:py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header + live search input */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-1">Catalogue</p>
            <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
              {products.length} Référence{products.length !== 1 ? "s" : ""} {brandName}
            </h2>
            {(q.trim().length >= 2 || selectedFamille) && (
              <p className="text-ink-mid text-sm font-sans mt-1">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                {q.trim().length >= 2 && (
                  <> pour <span className="text-steel font-bold">« {q.trim()} »</span></>
                )}
                {selectedFamille && (
                  <> · {FAMILLE_LABELS[selectedFamille].label}</>
                )}
              </p>
            )}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-ink/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              value={q}
              onChange={e => handleSetQ(e.target.value)}
              placeholder="Référence, type de produit…"
              className="w-full bg-white border border-border text-ink placeholder:text-ink-soft text-sm font-sans pl-10 pr-9 py-2.5 focus:outline-none focus:border-steel/60 transition-colors"
            />
            {q && (
              <button
                onClick={() => handleSetQ("")}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="square">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Famille filter badges */}
        {availableFamilles.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleSetFamille(null)}
              className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-[0.15em] font-sans transition-colors ${
                !selectedFamille
                  ? "bg-navy-900 border-navy-900 text-white"
                  : "border-border text-ink-mid hover:border-navy-900 hover:text-ink"
              }`}
            >
              Tous ({products.length})
            </button>
            {availableFamilles.map(f => {
              const count = products.filter(p => p.famille === f).length
              return (
                <button
                  key={f}
                  onClick={() => handleSetFamille(selectedFamille === f ? null : f)}
                  className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-[0.15em] font-sans transition-colors ${
                    selectedFamille === f
                      ? "bg-navy-900 border-navy-900 text-white"
                      : "border-border text-ink-mid hover:border-navy-900 hover:text-ink"
                  }`}
                >
                  {FAMILLE_LABELS[f].label} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Product grid */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginated.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-border">
            <p className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-2">Aucun résultat</p>
            <p className="text-ink-mid text-sm font-sans mb-6">
              Aucun produit {brandName} ne correspond à cette recherche.
            </p>
            <button
              onClick={() => { handleSetQ(""); handleSetFamille(null) }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
            >
              Voir toute la gamme {brandName}
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <span className="text-[10px] font-sans text-ink-soft uppercase tracking-[0.15em]">
              Page {page + 1} / {totalPages} — {filtered.length} référence{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="w-9 h-9 flex items-center justify-center border border-border text-ink-mid hover:border-navy-900 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Page précédente"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="w-9 h-9 flex items-center justify-center border border-border text-ink-mid hover:border-navy-900 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Page suivante"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
