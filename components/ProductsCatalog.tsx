"use client"

import { useState } from "react"
import Link from "next/link"

/* ── Data ─────────────────────────────────────────────── */
const FAMILLE = [
  {
    id: "robinetterie",
    name: "Robinetterie Industrielle",
    tags: "Vannes · Soupapes · Clapets",
    href: "/produits/robinetterie",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-10 h-10">
        <path d="M10 18L24 25L10 32V18z" fill="currentColor" stroke="none" opacity="0.9"/>
        <path d="M38 18L24 25L38 32V18z" fill="currentColor" stroke="none" opacity="0.9"/>
        <line x1="24" y1="8" x2="24" y2="18" strokeWidth="2.5"/>
        <line x1="24" y1="32" x2="24" y2="42" strokeWidth="2.5"/>
        <line x1="6" y1="25" x2="10" y2="25" strokeWidth="2.5"/>
        <line x1="38" y1="25" x2="42" y2="25" strokeWidth="2.5"/>
      </svg>
    ),
  },
  {
    id: "vapeur",
    name: "Régulation Vapeur",
    tags: "Purgeurs · Détendeurs · Séparateurs",
    href: "/produits/vapeur",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-10 h-10">
        <path d="M14 42V28H34V42"/>
        <path d="M10 28H38"/>
        <path d="M18 28V22C18 19.8 19.8 18 22 18H26C28.2 18 30 19.8 30 22V28"/>
        <path d="M16 14C16 14 18 12 18 10C18 8 16 6 16 6"/>
        <path d="M24 14C24 14 26 12 26 10C26 8 24 6 24 6"/>
        <path d="M32 14C32 14 34 12 34 10C34 8 32 6 32 6"/>
      </svg>
    ),
  },
  {
    id: "instrumentation",
    name: "Instrumentation",
    tags: "Manomètres · Thermomètres · Pressostats",
    href: "/produits/instrumentation",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-10 h-10">
        <circle cx="24" cy="26" r="16"/>
        <path d="M24 26L18 14"/>
        <path d="M16 26H18M30 26H32M24 12V14"/>
        <path d="M18.8 18.8L20.2 20.2M29.2 18.8L27.8 20.2"/>
        <circle cx="24" cy="26" r="2" fill="currentColor" stroke="none"/>
        <path d="M12 44H36"/>
      </svg>
    ),
  },
  {
    id: "fluides",
    name: "Traitement des Fluides",
    tags: "Filtres · Sécheurs · Air Comprimé",
    href: "/produits/fluides",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-10 h-10">
        <path d="M6 12H42L28 26V38L20 34V26L6 12z"/>
        <line x1="14" y1="12" x2="12" y2="18" strokeWidth="1"/>
        <line x1="24" y1="12" x2="24" y2="20" strokeWidth="1"/>
        <line x1="34" y1="12" x2="36" y2="18" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: "automatisme",
    name: "Automatisme",
    tags: "Électrovannes · Vannes Motorisées",
    href: "/produits/automatisme",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-10 h-10">
        <circle cx="24" cy="24" r="6"/>
        <path d="M24 8V12M24 36V40M8 24H12M36 24H40"/>
        <path d="M12.7 12.7L15.5 15.5M32.5 32.5L35.3 35.3M12.7 35.3L15.5 32.5M32.5 15.5L35.3 12.7"/>
        <circle cx="24" cy="24" r="14" strokeDasharray="5 3"/>
      </svg>
    ),
  },
]

const APPLICATION = [
  {
    id: "vapeur-app",
    name: "Solutions Réseau Vapeur",
    description:
      "Distribution, régulation et contrôle de vapeur basse et haute pression. Purgeurs, détendeurs, séparateurs, clapets et instrumentation associée.",
    products: ["Purgeurs vapeur", "Détendeurs de pression", "Séparateurs vapeur", "Vannes de régulation", "Manomètres PN40"],
    href: "/applications/vapeur",
    svg: (
      <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" className="w-16 h-12 opacity-70">
        <line x1="4" y1="30" x2="76" y2="30" strokeWidth="2.5"/>
        <path d="M20 30V20M20 30V44" /><rect x="14" y="20" width="12" height="10" /><circle cx="20" cy="15" r="6"/>
        <path d="M40 30V20M40 30V44" /><rect x="34" y="20" width="12" height="10" /><circle cx="40" cy="15" r="6"/>
        <path d="M60 30V20M60 30V44" /><rect x="54" y="20" width="12" height="10" /><circle cx="60" cy="15" r="6"/>
        <line x1="20" y1="44" x2="60" y2="44" strokeDasharray="5 3" opacity="0.4"/>
        <path d="M36 27L40 30L36 33" fill="currentColor" stroke="none" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: "air-app",
    name: "Solutions Air Comprimé",
    description:
      "Traitement complet de l'air comprimé industriel : filtration multi-étages, séchage réfrigérant ou dessicant, régulation et distribution vers les postes.",
    products: ["Filtres coalescents", "Sécheurs réfrigérants", "Régulateurs de pression", "Lubrificateurs", "Séparateurs huile-eau"],
    href: "/applications/air-comprime",
    svg: (
      <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" className="w-16 h-12 opacity-70">
        <line x1="4" y1="30" x2="76" y2="30" strokeWidth="2.5"/>
        <rect x="10" y="18" width="16" height="24"/><polygon points="14,22 22,22 18,36" strokeWidth="1.2" fill="none"/>
        <rect x="32" y="15" width="16" height="30"/><path d="M35 22C39 28 43 22 47 28M35 32C39 38 43 32 47 38" fill="none"/>
        <circle cx="64" cy="30" r="10"/><path d="M55 30L60 24L60 36L64 30L68 24L68 36L73 30" fill="none" strokeWidth="1"/>
        <path d="M32 27L36 30L32 33" fill="currentColor" stroke="none" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: "thermique-app",
    name: "Eau Surchauffée & Fluides Caloporteurs",
    description:
      "Régulation et mesure pour circuits d'eau surchauffée, huile thermique et fluides caloporteurs à haute température dans l'industrie chimique et agroalimentaire.",
    products: ["Vannes de régulation", "Transmetteurs de température", "Débitmètres", "Échangeurs à plaques", "Soupapes de sécurité"],
    href: "/applications/thermique",
    svg: (
      <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" className="w-16 h-12 opacity-70">
        <line x1="4" y1="30" x2="76" y2="30" strokeWidth="2.5"/>
        <circle cx="20" cy="30" r="12"/><path d="M14 30L17 24L17 36L20 30L23 24L23 36L26 30" fill="none" strokeWidth="1"/>
        <rect x="37" y="20" width="18" height="20"/><line x1="41" y1="20" x2="41" y2="40"/><line x1="45" y1="20" x2="45" y2="40"/><line x1="49" y1="20" x2="49" y2="40"/>
        <circle cx="68" cy="20" r="8"/><line x1="68" y1="28" x2="68" y2="30"/>
        <line x1="64" y1="20" x2="74" y2="20" opacity="0.5"/>
        <path d="M36 27L40 30L36 33" fill="currentColor" stroke="none" opacity="0.7"/>
      </svg>
    ),
  },
]

type View = "famille" | "application"

/* ── Component ─────────────────────────────────────────── */
export default function ProductsCatalog() {
  const [view, setView] = useState<View>("famille")

  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-2">
              Catalogue Produits
            </p>
            <h2 className="font-display font-bold text-ink text-fluid-h2 uppercase tracking-tight">
              Nos Produits
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex shrink-0 border border-border">
            <button
              onClick={() => setView("famille")}
              className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] font-sans transition-colors ${
                view === "famille"
                  ? "bg-navy-900 text-white"
                  : "bg-white text-ink-soft hover:text-ink"
              }`}
            >
              Par Famille Technique
            </button>
            <button
              onClick={() => setView("application")}
              className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] font-sans transition-colors border-l border-border ${
                view === "application"
                  ? "bg-navy-900 text-white"
                  : "bg-white text-ink-soft hover:text-ink"
              }`}
            >
              Par Application
            </button>
          </div>
        </div>

        {/* View A — Famille Technique */}
        {view === "famille" && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {FAMILLE.map(f => (
              <Link
                key={f.id}
                href={`#${f.id}`}
                className="group relative bg-white border border-border flex flex-col gap-5 p-6 overflow-hidden hover:shadow-xl transition-shadow last:col-span-2 lg:last:col-span-1"
              >
                {/* Top accent line */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/15 group-hover:bg-steel transition-colors" />

                <div className="text-navy-800 group-hover:text-steel transition-colors mt-1">
                  {f.svg}
                </div>

                <div>
                  <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight leading-tight mb-1.5">
                    {f.name}
                  </h3>
                  <p className="text-ink-soft text-xs font-sans leading-relaxed">{f.tags}</p>
                </div>

                <div className="mt-auto pt-3 border-t border-border">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel group-hover:text-navy-800 transition-colors">
                    Voir les produits →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View B — Application */}
        {view === "application" && (
          <div className="flex flex-col gap-3">
            {APPLICATION.map((app, i) => (
              <Link
                key={app.id}
                href={app.href}
                className="group bg-white border border-border grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-0 hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Number + SVG */}
                <div className="bg-navy-900 px-8 py-8 flex flex-col items-center justify-center gap-4 md:w-40">
                  <span className="font-display font-black text-white/20 text-5xl leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="text-white/60 group-hover:text-steel transition-colors">
                    {app.svg}
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 py-8 border-t md:border-t-0 md:border-l border-white/10">
                  <h3 className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-3">
                    {app.name}
                  </h3>
                  <p className="text-ink-mid text-sm font-sans leading-relaxed max-w-2xl mb-5">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.products.map(p => (
                      <span
                        key={p}
                        className="px-3 py-1 border border-border text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA arrow */}
                <div className="hidden md:flex items-center justify-center px-8 border-l border-border">
                  <svg
                    className="w-5 h-5 text-ink-soft group-hover:text-steel transition-colors"
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
