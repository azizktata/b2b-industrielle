import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import ProductsCatalog from "@/components/ProductsCatalog"
import {
  groupProductsByFamille,
  filterProducts,
  FAMILLE_LABELS,
  APPLICATION_LABELS,
} from "@/lib/catalogue"
import type { FamilleKey, ApplicationKey } from "@/scripts/scraper/types"

export const metadata: Metadata = {
  title: "Catalogue Produits",
  description:
    "Robinetterie industrielle, régulation vapeur, instrumentation, traitement des fluides et automatisme — catalogue complet Techniflux.",
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const FAMILLE_ORDER: FamilleKey[] = [
  "robinetterie",
  "regulation-vapeur",
  "instrumentation",
  "traitement-fluides",
  "automatisme",
]

function productSlug(id: string, marque: string): string {
  return id.replace(`${marque.toLowerCase()}-`, "")
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; application?: string }>
}) {
  const { q, application } = await searchParams

  const hasFilter = !!(q?.trim() || application)

  // Build filtered or grouped data
  const grouped: Partial<Record<FamilleKey, ReturnType<typeof filterProducts>>> = hasFilter
    ? filterProducts({
        q: q?.trim() || undefined,
        application: application as ApplicationKey | undefined,
      }).reduce(
        (acc, p) => {
          if (!p.famille) return acc
          acc[p.famille] = [...(acc[p.famille] ?? []), p]
          return acc
        },
        {} as Record<FamilleKey, ReturnType<typeof filterProducts>>
      )
    : groupProductsByFamille()

  // Counts for ProductsCatalog toggle (always from full data)
  const allGrouped = hasFilter ? groupProductsByFamille() : grouped
  const counts = Object.fromEntries(
    FAMILLE_ORDER.map((k) => [k, (allGrouped as Record<FamilleKey, unknown[]>)[k]?.length ?? 0])
  )

  const totalResults = hasFilter
    ? FAMILLE_ORDER.reduce((s, k) => s + (grouped[k]?.length ?? 0), 0)
    : null

  return (
    <>
      <Header />
      <main>

        {/* ── PAGE HEADER ── */}
        <section className="bg-navy-950 border-b border-white/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 mb-6">
              <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-white/60">Produits</span>
            </nav>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  Catalogue Complet
                </p>
                <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none">
                  Nos Produits
                </h1>
                <p className="text-white/45 text-sm font-sans mt-3 max-w-xl">
                  Robinetterie, régulation vapeur, instrumentation, traitement des fluides et
                  automatisme — sélection par famille technique ou par application process.
                </p>
              </div>
              {/* Search */}
              <form action="/produits" method="get" className="flex w-full lg:w-80">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="q"
                    defaultValue={q ?? ""}
                    placeholder="Référence, DN, PN, marque…"
                    className="w-full bg-white/6 border border-white/14 text-white placeholder:text-white/30 text-sm font-sans pl-10 pr-4 py-3 focus:outline-none focus:border-steel/60 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="px-4 bg-steel text-white hover:bg-steel-lt transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── FAMILY / APPLICATION TOGGLE ── */}
        {!hasFilter && <ProductsCatalog counts={counts} />}

        {/* ── SEARCH RESULTS BANNER ── */}
        {hasFilter && (
          <div className="bg-dim border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3">
              <span className="text-ink text-sm font-sans">
                <strong className="font-bold">{totalResults}</strong> résultat{totalResults !== 1 ? "s" : ""}
                {q?.trim() && (
                  <> pour <span className="text-steel font-bold">« {q.trim()} »</span></>
                )}
                {application && (
                  <> · {APPLICATION_LABELS[application as ApplicationKey] ?? application}</>
                )}
              </span>
              <Link
                href="/produits"
                scroll={false}
                className="ml-auto text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-soft hover:text-steel transition-colors"
              >
                Effacer ×
              </Link>
            </div>
          </div>
        )}

        {/* ── APPLICATION FILTER PILLS — hidden when text search is active ── */}
        {!q?.trim() && <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink/40 mr-1">
              Application :
            </span>
            {(Object.entries(APPLICATION_LABELS) as [ApplicationKey, string][]).map(([key, label]) => (
              <Link
                key={key}
                href={`/produits?application=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                scroll={false}
                className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-[0.15em] font-sans transition-colors ${
                  application === key
                    ? "bg-steel border-steel text-white"
                    : "border-border text-ink-mid hover:border-steel hover:text-steel"
                }`}
              >
                {label}
              </Link>
            ))}
            {hasFilter && (
              <Link href="/produits" scroll={false} className="ml-auto text-[10px] font-sans text-ink-soft hover:text-steel transition-colors">
                Effacer ×
              </Link>
            )}
          </div>
        </div>}

        {/* ── PRODUCT LISTINGS BY FAMILY ── */}
        {FAMILLE_ORDER.map((familleKey) => {
          const products = grouped[familleKey] ?? []
          if (products.length === 0) return null
          const meta = FAMILLE_LABELS[familleKey]

          return (
            <section key={familleKey} id={familleKey} className="border-t border-border py-14 lg:py-20 bg-surface">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">{meta.sub}</p>
                    <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight">{meta.label}</h2>
                    <p className="text-ink-soft text-xs font-sans mt-1">{products.length} produit{products.length > 1 ? "s" : ""}</p>
                  </div>
                  <Link
                    href={`/produits/famille/${familleKey}`}
                    className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-steel hover:text-navy-800 transition-colors whitespace-nowrap"
                  >
                    Voir toute la gamme →
                  </Link>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.slice(0, 6).map((p) => {
                    const techPdf = p.pdfs.find((pdf) => pdf.type === "fiche-technique")
                    const displayRef = productSlug(p.id, p.marque)

                    return (
                      <div key={p.id} className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow relative">
                        <Link href={`/produits/${p.id}`} className="absolute inset-0 z-0" aria-label={`Voir ${p.name}`} />
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/12 group-hover:bg-steel transition-colors" />
                        <div className="p-6 flex flex-col gap-4 flex-1">
                          {/* Ref + marque */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] text-ink-soft tracking-wider truncate max-w-[70%]">{displayRef}</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 bg-ink/6 text-ink-mid shrink-0">
                              {p.marque}
                            </span>
                          </div>
                          {/* Name */}
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight leading-tight mb-2">
                              {p.name}
                            </h3>
                            {/* Application tags */}
                            {p.application.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {p.application.map((app) => (
                                  <span key={app} className="text-[9px] font-sans text-ink-soft bg-dim border border-border px-1.5 py-0.5">
                                    {APPLICATION_LABELS[app] ?? app}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-border relative z-10">
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

                {/* Show more if > 6 */}
                {products.length > 6 && (
                  <div className="mt-6 text-center">
                    <Link
                      href={`/produits/famille/${familleKey}`}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-border text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-mid hover:border-steel hover:text-steel transition-colors"
                    >
                      Voir les {products.length - 6} autres produits
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )
        })}

        {/* ── EMPTY STATE ── */}
        {hasFilter && totalResults === 0 && (
          <section className="bg-surface py-24 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-3">
                Aucun résultat
              </p>
              <p className="text-ink-mid text-sm font-sans mb-8 max-w-md mx-auto">
                Aucun produit ne correspond à votre recherche. Essayez avec d&apos;autres termes ou contactez notre équipe.
              </p>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 px-6 py-3 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
              >
                Voir tout le catalogue
              </Link>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="bg-navy-900 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display font-black text-white uppercase text-3xl tracking-tight mb-2">
                Référence introuvable ?
              </h2>
              <p className="text-white/50 text-sm font-sans">
                Notre équipe technique peut sourcer hors catalogue — contactez-nous avec votre besoin.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
              >
                Contacter un technicien
              </Link>
              <Link
                href="/devis"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-white/5 transition-colors"
              >
                Demande de devis
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
