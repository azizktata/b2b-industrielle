import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import {
  getProductById,
  getProducts,
  filterProducts,
  FAMILLE_LABELS,
  APPLICATION_LABELS,
} from "@/lib/catalogue"
import type { PdfType } from "@/scripts/scraper/types"

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductById(slug)
  if (!product) return {}
  const familleLabel = product.famille ? FAMILLE_LABELS[product.famille]?.label : undefined
  return {
    title: product.name,
    description: product.shortDescription
      ?? `${product.name}${familleLabel ? ` — ${familleLabel}` : ""} · ${product.marque}. Techniflux distributeur agréé.`,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PDF_TYPE_LABEL: Record<PdfType, string> = {
  "fiche-technique": "Fiche Technique",
  "catalogue":       "Catalogue",
  "installation":    "Notice d'Installation",
  "dessin":          "Dessin d'Assemblage",
  "other":           "Document",
}

const PDF_TYPE_ORDER: PdfType[] = [
  "fiche-technique",
  "dessin",
  "installation",
  "catalogue",
  "other",
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductById(slug)
  if (!product) notFound()

  const familleKey = product.famille
  const familleMeta = familleKey ? FAMILLE_LABELS[familleKey] : null

  // Related products — same famille, different product, max 3
  const related = filterProducts({ famille: familleKey ?? undefined })
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  // Sort PDFs by type priority
  const sortedPdfs = [...product.pdfs].sort((a, b) => {
    const ai = PDF_TYPE_ORDER.indexOf(a.type)
    const bi = PDF_TYPE_ORDER.indexOf(b.type)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  const displayRef = product.id.replace(`${product.marque.toLowerCase()}-`, "")

  return (
    <>
      <Header />
      <main className="bg-surface min-h-screen">

        {/* ── HERO ── */}
        <section className="relative bg-navy-950 pt-12 pb-32 overflow-hidden">
          {/* Blueprint grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(var(--navy-700) 1px, transparent 1px), linear-gradient(90deg, var(--navy-700) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 mb-8">
              <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/produits" className="hover:text-white/60 transition-colors">Produits</Link>
              {familleKey && familleMeta && (
                <>
                  <span>/</span>
                  <Link href={`/produits/famille/${familleKey}`} className="hover:text-white/60 transition-colors">
                    {familleMeta.label}
                  </Link>
                </>
              )}
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 mb-4">
                  <span className="bg-steel/20 border border-steel/30 text-steel-lt text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                    {product.marque}
                  </span>
                  {familleMeta && (
                    <span className="bg-white/8 border border-white/12 text-white/50 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                      {familleMeta.label}
                    </span>
                  )}
                </span>
                <h1 className="font-display font-black text-white uppercase text-4xl lg:text-5xl tracking-tighter leading-none">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link
                  href={`/devis?ref=${product.id}`}
                  className="px-7 py-4 bg-steel text-white text-xs font-bold uppercase tracking-widest hover:bg-steel-lt transition-colors"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCT CONTENT ── */}
        <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Documents */}
            <div className="lg:col-span-7 space-y-6">

              {/* Documents card */}
              <div className="bg-white border border-border relative">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-steel/20" />
                <div className="p-8">
                  <h2 className="text-ink font-display font-bold text-xl uppercase tracking-tight mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-steel" />
                    Documents Techniques
                  </h2>

                  {sortedPdfs.length > 0 ? (
                    <div className="flex flex-col divide-y divide-border">
                      {sortedPdfs.map((pdf, i) => (
                        <a
                          key={i}
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between py-4 first:pt-0 hover:bg-dim/40 -mx-8 px-8 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* PDF icon */}
                            <div className="w-9 h-9 bg-dim border border-border flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="square">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-steel mb-0.5">
                                {PDF_TYPE_LABEL[pdf.type] ?? "Document"}
                              </p>
                              <p className="text-ink text-sm font-sans truncate">{pdf.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-navy-800 group-hover:text-steel transition-colors shrink-0 ml-4">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            Télécharger
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-ink-soft text-sm font-sans">
                      Aucun document disponible pour ce produit. Contactez-nous pour obtenir la documentation.
                    </p>
                  )}
                </div>
              </div>

              {/* Source link */}
              <div className="bg-dim border border-border p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink/40 mb-1">
                    Source fabricant
                  </p>
                  <p className="text-ink-mid text-xs font-sans">
                    Informations officielles sur le site {product.marque}
                  </p>
                </div>
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-steel hover:text-navy-800 transition-colors shrink-0"
                >
                  Voir sur {product.marque} ↗
                </a>
              </div>
            </div>

            {/* Right: Info panel */}
            <div className="lg:col-span-5">
              <div className="bg-navy-900 text-white sticky top-8">

                <div className="p-6 border-b border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-steel-lt mb-1">
                    Référence
                  </p>
                  <p className="font-mono text-white/70 text-sm">{displayRef}</p>
                </div>

                <div className="divide-y divide-white/5">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-white/40 text-[11px] uppercase tracking-wider font-sans font-semibold">Marque</span>
                    <span className="text-sm font-mono font-medium text-white/90">{product.marque}</span>
                  </div>

                  {familleMeta && (
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="text-white/40 text-[11px] uppercase tracking-wider font-sans font-semibold">Famille</span>
                      <span className="text-sm font-sans font-medium text-white/90 text-right max-w-[55%]">{familleMeta.label}</span>
                    </div>
                  )}

                  {product.application.length > 0 && (
                    <div className="px-6 py-4">
                      <span className="text-white/40 text-[11px] uppercase tracking-wider font-sans font-semibold block mb-2">Applications</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.application.map((app) => (
                          <span key={app} className="text-[9px] font-sans text-white/60 bg-white/8 border border-white/12 px-2 py-1">
                            {APPLICATION_LABELS[app] ?? app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-white/40 text-[11px] uppercase tracking-wider font-sans font-semibold">Documents</span>
                    <span className="text-sm font-mono font-medium text-white/90">{product.pdfs.length}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <Link
                    href={`/devis?ref=${product.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
                  >
                    Demander un devis
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link
                    href="/#contact"
                    className="flex items-center justify-center w-full py-3.5 border border-white/15 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:text-white hover:border-white/30 transition-colors"
                  >
                    Contacter un technicien
                  </Link>
                </div>

                <div className="px-6 pb-5">
                  <p className="text-white/25 text-[9px] uppercase tracking-[0.15em] font-sans leading-tight italic">
                    Pour des configurations spécifiques (ATEX, dégraissage oxygène), consultez notre bureau d&apos;études.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section className="bg-dim border-t border-border py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
                  Produits Similaires
                </h2>
                {familleMeta && familleKey && (
                  <>
                    <div className="flex-1 h-px bg-border" />
                    <Link
                      href={`/produits/famille/${familleKey}`}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel hover:text-navy-800 transition-colors whitespace-nowrap"
                    >
                      Voir toute la gamme →
                    </Link>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produits/${p.id}`}
                    className="group bg-white border border-border flex flex-col p-5 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/8 group-hover:bg-steel transition-colors" />
                    <span className="font-mono text-[10px] text-ink-soft mb-2 block">
                      {p.id.replace(`${p.marque.toLowerCase()}-`, "")}
                    </span>
                    <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight flex-1 mb-3">
                      {p.name}
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-steel group-hover:text-navy-800 transition-colors">
                      Voir le produit →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  )
}
