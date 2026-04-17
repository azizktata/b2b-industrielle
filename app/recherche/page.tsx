import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import {
  filterProducts,
  filterGuides,
  getCatalogues,
  FAMILLE_LABELS,
  APPLICATION_LABELS,
} from "@/lib/catalogue"
import type { FamilleKey } from "@/scripts/scraper/types"

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez dans l'ensemble du catalogue Techniflux — produits, guides techniques et catalogues.",
}

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ""

  const products = query ? filterProducts({ q: query }) : []
  const guides   = query ? filterGuides({ q: query }) : []
  const catalogues = query
    ? getCatalogues().filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const totalResults = products.length + guides.length + catalogues.length
  const hasQuery = query.length > 0

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
              <span className="text-white/60">Recherche</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  Catalogue Complet
                </p>
                <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none">
                  Recherche
                </h1>
                {hasQuery && (
                  <p className="text-white/40 text-sm font-sans mt-3">
                    <strong className="text-white/70 font-bold">{totalResults}</strong> résultat{totalResults !== 1 ? "s" : ""} pour{" "}
                    <span className="text-steel font-bold">« {query} »</span>
                  </p>
                )}
              </div>

              {/* Search form */}
              <form action="/recherche" method="get" className="flex w-full lg:w-96">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Produit, référence, marque…"
                    autoFocus={!hasQuery}
                    className="w-full bg-white/6 border border-white/14 text-white placeholder:text-white/30 text-sm font-sans pl-10 pr-4 py-3 focus:outline-none focus:border-steel/60 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="px-5 bg-steel text-white hover:bg-steel-lt transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── EMPTY STATE ── */}
        {!hasQuery && (
          <section className="bg-surface py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-14 h-14 bg-dim border border-border flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="square">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-3">
                Tapez un terme pour rechercher
              </p>
              <p className="text-ink-mid text-sm font-sans max-w-md mx-auto mb-8">
                Cherchez par référence, type de produit, marque ou application — produits, guides et catalogues inclus.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["vanne", "purgeur", "manomètre", "filtre", "régulateur"].map(term => (
                  <Link
                    key={term}
                    href={`/recherche?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 border border-border text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid hover:border-steel hover:text-steel transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── NO RESULTS ── */}
        {hasQuery && totalResults === 0 && (
          <section className="bg-surface py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-3">
                Aucun résultat pour « {query} »
              </p>
              <p className="text-ink-mid text-sm font-sans max-w-md mx-auto mb-8">
                Essayez un terme différent ou consultez le catalogue complet.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
                >
                  Voir tout le catalogue
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link
                  href="/ressources"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-border text-ink text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-dim transition-colors"
                >
                  Ressources & documentation
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── PRODUITS RESULTS ── */}
        {products.length > 0 && (
          <section className="bg-surface py-12 lg:py-16 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-1">Produits</p>
                  <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
                    {products.length} Référence{products.length !== 1 ? "s" : ""}
                  </h2>
                </div>
                {products.length > 8 && (
                  <Link
                    href={`/produits?q=${encodeURIComponent(query)}`}
                    className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-steel hover:text-navy-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    Voir les {products.length} résultats →
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.slice(0, 8).map(p => {
                  const techPdf = p.pdfs.find(pdf => pdf.type === "fiche-technique")
                  const displayRef = p.id.replace(`${p.marque.toLowerCase()}-`, "")
                  const familleMeta = p.famille ? FAMILLE_LABELS[p.famille as FamilleKey] : null
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
                          ) : <span />}
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

              {products.length > 8 && (
                <div className="mt-6 text-center">
                  <Link
                    href={`/produits?q=${encodeURIComponent(query)}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
                  >
                    Voir les {products.length} produits correspondants
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── GUIDES RESULTS ── */}
        {guides.length > 0 && (
          <section className="bg-dim py-12 lg:py-16 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-1">Documentation</p>
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
                  {guides.length} Guide{guides.length !== 1 ? "s" : ""} Technique{guides.length !== 1 ? "s" : ""}
                </h2>
              </div>

              <div className="flex flex-col gap-px">
                {guides.map((g, i) => (
                  <div key={g.id} className="bg-white border border-border p-5 flex items-start gap-5 hover:shadow-md transition-shadow group">
                    <span className="font-mono text-[10px] text-ink-soft shrink-0 pt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight leading-tight mb-1">
                            {g.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 bg-ink/6 text-ink-mid">
                              {g.marque}
                            </span>
                            {g.famille && (
                              <span className="text-[9px] font-bold uppercase tracking-[0.12em] font-sans text-ink-soft">
                                {FAMILLE_LABELS[g.famille as FamilleKey]?.label}
                              </span>
                            )}
                          </div>
                        </div>
                        <a
                          href={g.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white text-[9px] font-bold uppercase tracking-[0.15em] font-sans hover:bg-steel transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                          PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CATALOGUES RESULTS ── */}
        {catalogues.length > 0 && (
          <section className="bg-surface py-12 lg:py-16 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-1">Documentation</p>
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
                  {catalogues.length} Catalogue{catalogues.length !== 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogues.map(cat => (
                  <div key={cat.id} className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow">
                    <div className="bg-navy-900 h-20 flex items-center justify-center relative overflow-hidden shrink-0">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="relative flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white/40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] font-sans">{cat.marque}</p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-display font-bold text-ink text-sm uppercase tracking-tight leading-tight flex-1">
                        {cat.name}
                      </h3>
                      <div className="pt-2 border-t border-border">
                        <a
                          href={cat.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-navy-800 group-hover:text-steel transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                          Télécharger PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        {hasQuery && totalResults > 0 && (
          <section className="bg-navy-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-display font-black text-white uppercase text-2xl tracking-tight mb-1">
                  Produit non trouvé ?
                </h2>
                <p className="text-white/50 text-sm font-sans">
                  Notre équipe peut sourcer hors catalogue — contactez-nous avec votre référence.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
                >
                  Contacter un technicien
                </Link>
                <Link
                  href="/devis"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-white/5 transition-colors"
                >
                  Demande de devis
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  )
}
