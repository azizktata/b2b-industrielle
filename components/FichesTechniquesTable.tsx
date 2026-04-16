"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { FAMILLE_LABELS, truncateName } from "@/lib/catalogue"
import type { FamilleKey, MarqueKey, PdfType } from "@/scripts/scraper/types"

const PAGE_SIZE = 25

const PDF_TYPE_LABEL: Record<PdfType, string> = {
  "fiche-technique": "Fiche Technique",
  "catalogue":       "Catalogue",
  "installation":    "Notice d'Installation",
  "dessin":          "Dessin d'Assemblage",
  "other":           "Document",
}

export type FicheRow = {
  ref: string
  productId: string
  name: string
  pdfLabel: string
  pdfType: PdfType
  url: string
  famille: FamilleKey | null
  marque: MarqueKey
}

export default function FichesTechniquesTable({ fiches }: { fiches: FicheRow[] }) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!q.trim()) return fiches
    const lower = q.trim().toLowerCase()
    return fiches.filter(f =>
      f.name.toLowerCase().includes(lower) ||
      f.ref.toLowerCase().includes(lower) ||
      f.marque.toLowerCase().includes(lower) ||
      f.pdfLabel.toLowerCase().includes(lower) ||
      (f.famille ? FAMILLE_LABELS[f.famille]?.label.toLowerCase().includes(lower) : false)
    )
  }, [fiches, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearch(value: string) {
    setQ(value)
    setPage(1)
  }


  return (
    <>
      {/* Live search input */}
      <div className="relative max-w-xl mb-6">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </span>
        <input
          type="search"
          value={q}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Référence, désignation, marque, famille…"
          className="w-full bg-white border border-border text-ink placeholder:text-ink-soft/60 text-sm font-sans pl-10 pr-9 py-3 focus:outline-none focus:border-steel/60 transition-colors"
        />
        {q && (
          <button
            onClick={() => handleSearch("")}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border bg-dim">
              {/* <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Référence</th> */}
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Désignation</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 hidden sm:table-cell">Famille</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 hidden lg:table-cell">Marque</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageItems.length > 0 ? (
              pageItems.map((f, i) => (
                <tr key={`${f.productId}-${i}`} className="group hover:bg-dim/50 transition-colors">
                  {/* <td className="px-5 py-4 align-top">
                    <Link
                      href={`/produits/${f.productId}`}
                      className="font-mono text-[11px] text-steel hover:text-navy-800 transition-colors whitespace-nowrap"
                    >
                      {f.ref}
                    </Link>
                  </td> */}
                  <td className="px-5 py-4 align-top">
                    <p className="text-ink font-sans text-sm leading-snug">{truncateName(f.name, 60)}</p>
                    <p className="text-ink-soft text-[10px] font-sans mt-0.5">
                      {PDF_TYPE_LABEL[f.pdfType]} — {f.pdfLabel}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top text-ink-soft text-xs hidden sm:table-cell whitespace-nowrap">
                    {f.famille ? FAMILLE_LABELS[f.famille]?.label : "—"}
                  </td>
                  <td className="px-5 py-4 align-top text-ink-mid text-xs hidden lg:table-cell whitespace-nowrap">
                    {f.marque}
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-navy-800 group-hover:text-steel transition-colors whitespace-nowrap"
                    >
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      PDF
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-ink-soft text-sm font-sans">
                  Aucun document ne correspond à « {q} ».
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-4">
          <p className="text-xs font-sans text-ink-soft tabular-nums">
            {filtered.length === 0
              ? "Aucun résultat"
              : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} sur ${filtered.length} document${filtered.length > 1 ? "s" : ""}`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Page précédente"
                className="px-3 py-1.5 border border-border text-[10px] font-bold font-sans text-ink-mid disabled:opacity-30 hover:border-steel hover:text-steel transition-colors disabled:pointer-events-none"
              >
                ←
              </button>
              <span className="text-[10px] font-sans text-ink-soft tabular-nums px-2">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Page suivante"
                className="px-3 py-1.5 border border-border text-[10px] font-bold font-sans text-ink-mid disabled:opacity-30 hover:border-steel hover:text-steel transition-colors disabled:pointer-events-none"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
