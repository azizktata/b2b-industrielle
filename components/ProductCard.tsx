"use client"

import Link from "next/link"
import AddToDevisButton from "@/components/AddToDevisButton"
import { APPLICATION_LABELS } from "@/lib/catalogue"
import type { Product } from "@/scripts/scraper/types"

export default function ProductCard({ product: p }: { product: Product }) {
  const techPdf = p.pdfs.find(pdf => pdf.type === "fiche-technique")
  const displayRef = p.id.replace(`${p.marque.toLowerCase()}-`, "")

  return (
    <div className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow relative">
      <Link href={`/produits/${p.id}`} className="absolute inset-0 z-0" aria-label={`Voir ${p.name}`} />
      <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/12 group-hover:bg-steel transition-colors" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Ref + marque */}
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-[10px] text-ink-soft tracking-wider truncate max-w-[45%]">{displayRef}</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 bg-ink/6 text-ink-mid shrink-0">
            {p.marque}
          </span>
        </div>

        {/* Name + applications */}
        <div className="flex-1">
          <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight mb-2">
            {p.name}
          </h3>
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

        {/* PDF count */}
        {p.pdfs.length > 0 && (
          <div className="flex items-center gap-1 text-[9px] font-sans text-ink-soft">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {p.pdfs.length} document{p.pdfs.length > 1 ? "s" : ""}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto relative z-10">
          {techPdf ? (
            <a
              href={techPdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft hover:text-ink transition-colors"
            >
              Fiche tech. ↗
            </a>
          ) : <span />}
          <div className="flex items-center gap-2">
            <AddToDevisButton product={{ id: p.id, name: p.name, marque: p.marque }} />
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
}
