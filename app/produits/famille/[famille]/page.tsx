import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import {
  filterProducts,
  FAMILLE_LABELS,
  APPLICATION_LABELS,
} from "@/lib/catalogue"
import type { FamilleKey, ApplicationKey, MarqueKey } from "@/scripts/scraper/types"

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return (Object.keys(FAMILLE_LABELS) as FamilleKey[]).map((famille) => ({ famille }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ famille: string }>
}): Promise<Metadata> {
  const { famille } = await params
  const meta = FAMILLE_LABELS[famille as FamilleKey]
  if (!meta) return {}
  return {
    title: meta.label,
    description: `Catalogue ${meta.label} — ${meta.sub}. Produits industriels Techniflux distributeur agréé.`,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function productSlug(id: string, marque: string): string {
  return id.replace(`${marque.toLowerCase()}-`, "")
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function FamillePage({
  params,
  searchParams,
}: {
  params: Promise<{ famille: string }>
  searchParams: Promise<{ q?: string; application?: string; marque?: string }>
}) {
  const { famille } = await params
  const { q, application, marque } = await searchParams

  const familleKey = famille as FamilleKey
  const meta = FAMILLE_LABELS[familleKey]
  if (!meta) notFound()

  const allFamilleProducts = filterProducts({ famille: familleKey })
  const products = filterProducts({
    famille: familleKey,
    q: q?.trim() || undefined,
    application: application as ApplicationKey | undefined,
    marque: marque as MarqueKey | undefined,
  })

  const hasFilter = !!(q?.trim() || application || marque)
  const totalAll = allFamilleProducts.length
  const availableMarques = [...new Set(allFamilleProducts.map(p => p.marque))].sort()

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
              <Link href="/produits" className="hover:text-white/60 transition-colors">Produits</Link>
              <span>/</span>
              <span className="text-white/60">{meta.label}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  {meta.sub}
                </p>
                <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none mb-3">
                  {meta.label}
                </h1>
                <p className="text-white/40 text-sm font-sans">
                  {totalAll} produit{totalAll !== 1 ? "s" : ""} disponible{totalAll !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Search */}
              <form
                action={`/produits/famille/${famille}`}
                method="get"
                className="flex w-full lg:w-80"
              >
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
                    placeholder="Référence, type de produit…"
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

        {/* ── FILTER BAR ── */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink/40 mr-1">
                Application :
              </span>
              {(Object.entries(APPLICATION_LABELS) as [ApplicationKey, string][]).map(([key, label]) => (
                <Link
                  key={key}
                  href={`/produits/famille/${famille}?application=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}${marque ? `&marque=${encodeURIComponent(marque)}` : ""}`}
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
            </div>
            {availableMarques.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink/40 mr-1">
                  Marque :
                </span>
                {availableMarques.map((key) => (
                  <Link
                    key={key}
                    href={`/produits/famille/${famille}?marque=${encodeURIComponent(key)}${q ? `&q=${encodeURIComponent(q)}` : ""}${application ? `&application=${encodeURIComponent(application)}` : ""}`}
                    scroll={false}
                    className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-[0.15em] font-sans transition-colors ${
                      marque === key
                        ? "bg-navy-900 border-navy-900 text-white"
                        : "border-border text-ink-mid hover:border-navy-900 hover:text-ink"
                    }`}
                  >
                    {key}
                  </Link>
                ))}
              </div>
            )}
            {/* {hasFilter && (
              <div className="flex">
                <Link
                  href={`/produits/famille/${famille}`}
                  scroll={false}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-soft hover:text-steel transition-colors"
                >
                  Effacer les filtres ×
                </Link>
              </div>
            )} */}
          </div>
        </div>

        {/* ── RESULTS COUNT (when filtering) ── */}
        {hasFilter && (
          <div className="bg-dim border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <span className="text-ink text-sm font-sans">
                <strong className="font-bold">{products.length}</strong> résultat{products.length !== 1 ? "s" : ""}
                {q?.trim() && (
                  <> pour <span className="text-steel font-bold">« {q.trim()} »</span></>
                )}
                {application && (
                  <> · {APPLICATION_LABELS[application as ApplicationKey] ?? application}</>
                )}
                {marque && (
                  <> · {marque}</>
                )}
              </span>
            <div className="flex">
                <Link
                  href={`/produits/famille/${famille}`}
                  scroll={false}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-soft hover:text-steel transition-colors"
                >
                  Effacer les filtres ×
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        <section className="bg-surface py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((p) => {
                  const techPdf = p.pdfs.find((pdf) => pdf.type === "fiche-technique")
                  const displayRef = productSlug(p.id, p.marque)

                  return (
                    <div
                      key={p.id}
                      className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow relative"
                    >
                      <Link href={`/produits/${p.id}`} className="absolute inset-0 z-0" aria-label={`Voir ${p.name}`} />
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/12 group-hover:bg-steel transition-colors" />
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        {/* Ref + marque */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] text-ink-soft tracking-wider truncate max-w-[70%]">
                            {displayRef}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 bg-ink/6 text-ink-mid shrink-0">
                            {p.marque}
                          </span>
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                          <h2 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight mb-2">
                            {p.name}
                          </h2>
                          {/* Application tags */}
                          {p.application.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.application.map((app) => (
                                <span
                                  key={app}
                                  className="text-[9px] font-sans text-ink-soft bg-dim border border-border px-1.5 py-0.5"
                                >
                                  {APPLICATION_LABELS[app] ?? app}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* PDF count badge */}
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
            ) : (
              /* Empty state */
              <div className="py-20 text-center">
                <p className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-3">
                  Aucun résultat
                </p>
                <p className="text-ink-mid text-sm font-sans mb-8 max-w-md mx-auto">
                  Aucun produit {meta.label.toLowerCase()} ne correspond à votre recherche.
                </p>
                <Link
                  href={`/produits/famille/${famille}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
                >
                  Voir toute la gamme {meta.label}
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── FAMILLE NAVIGATION ── */}
        <section className="bg-dim border-t border-border py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans text-ink/40 mb-4">
              Autres familles
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(FAMILLE_LABELS) as [FamilleKey, { label: string; sub: string }][])
                .filter(([key]) => key !== familleKey)
                .map(([key, m]) => (
                  <Link
                    key={key}
                    href={`/produits/famille/${key}`}
                    className="px-4 py-2.5 border border-border bg-white text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid hover:border-steel hover:text-steel transition-colors"
                  >
                    {m.label}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
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

      </main>
    </>
  )
}
