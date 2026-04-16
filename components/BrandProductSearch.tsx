"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Fuse from "fuse.js"
import { FAMILLE_LABELS, APPLICATION_LABELS } from "@/lib/catalogue"
import type { Product } from "@/scripts/scraper/types"

type Props = {
  products: Product[]
  brandName: string
}

export default function BrandProductSearch({ products, brandName }: Props) {
  const [q, setQ] = useState("")

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "shortDescription", "pdfs.label"],
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [products]
  )

  const filtered = q.trim().length >= 2
    ? fuse.search(q.trim()).map(r => r.item)
    : products

  return (
    <section className="bg-dim py-12 lg:py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header + live search input */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-1">Catalogue</p>
            <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
              {products.length} Référence{products.length !== 1 ? "s" : ""} {brandName}
            </h2>
            {q.trim().length >= 2 && (
              <p className="text-ink-mid text-sm font-sans mt-1">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour{" "}
                <span className="text-steel font-bold">« {q.trim()} »</span>
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
              onChange={e => setQ(e.target.value)}
              placeholder="Référence, type de produit…"
              className="w-full bg-white border border-border text-ink placeholder:text-ink-soft text-sm font-sans pl-10 pr-9 py-2.5 focus:outline-none focus:border-steel/60 transition-colors"
            />
            {q && (
              <button
                onClick={() => setQ("")}
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

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(p => {
              const techPdf = p.pdfs.find(pdf => pdf.type === "fiche-technique")
              const displayRef = p.id.replace(`${p.marque.toLowerCase()}-`, "")
              const familleMeta = p.famille ? FAMILLE_LABELS[p.famille] : null
              return (
                <div key={p.id} className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow relative">
                  <Link href={`/produits/${p.id}`} className="absolute inset-0 z-0" aria-label={`Voir ${p.name}`} />
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/12 group-hover:bg-steel transition-colors" />
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] text-ink-soft tracking-wider truncate max-w-[65%]">{displayRef}</span>
                      {familleMeta && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] font-sans px-2 py-0.5 bg-ink/6 text-ink-mid shrink-0">
                          {familleMeta.label.split(" ")[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight mb-2">{p.name}</h3>
                      {p.application.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.application.map(app => (
                            <span key={app} className="text-[9px] font-sans text-ink-soft bg-dim border border-border px-1.5 py-0.5">
                              {APPLICATION_LABELS[app] ?? app}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border relative z-10">
                      {techPdf ? (
                        <a
                          href={techPdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft hover:text-ink transition-colors"
                        >
                          Fiche tech. ↗
                        </a>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/devis?ref=${p.id}`}
                          className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans border border-steel/60 text-steel px-3 py-1.5 hover:bg-steel hover:text-white transition-colors"
                        >
                          Devis
                        </Link>
                        <Link
                          href={`/produits/${p.id}`}
                          className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans bg-navy-900 text-white px-3 py-1.5 hover:bg-steel transition-colors"
                        >
                          Voir →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : q.trim().length >= 2 ? (
          <div className="py-16 text-center bg-white border border-border">
            <p className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-2">Aucun résultat</p>
            <p className="text-ink-mid text-sm font-sans mb-6">
              Aucun produit {brandName} ne correspond à « {q.trim()} ».
            </p>
            <button
              onClick={() => setQ("")}
              className="inline-flex items-center gap-2 px-5 py-3 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
            >
              Voir toute la gamme {brandName}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
