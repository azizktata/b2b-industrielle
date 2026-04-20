import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { BRANDS, getBrandBySlug, getAllBrandSlugs } from "@/lib/brands"
import { getProducts, getCatalogues } from "@/lib/catalogue"
import type { MarqueKey } from "@/scripts/scraper/types"
import BrandProductSearch from "@/components/BrandProductSearch"

/* ── Static params for all brand slugs ── */
export function generateStaticParams() {
  return getAllBrandSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const brand = getBrandBySlug(slug)
  if (!brand) return {}
  return {
    title: `${brand.name} — ${brand.agree}`,
    description: `${brand.agree} ${brand.name}. ${brand.desc} Capacité SAV${brand.sav ? " certifiée fabricant" : " disponible"}.`,
  }
}

/* ── Page ── */
export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = getBrandBySlug(slug)
  if (!brand) notFound()

  // Resolve scraped products for this brand via case-insensitive marque match
  const marqueKey = getProducts().find(
    p => p.marque.toLowerCase() === brand.id.toLowerCase()
  )?.marque as MarqueKey | undefined
  const allBrandProducts = marqueKey
    ? getProducts().filter(p => p.marque === marqueKey)
    : []

  // Catalogues from scraped data, matched case-insensitively on marque
  const brandCatalogues = getCatalogues().filter(
    c => c.marque.toLowerCase() === brand.id.toLowerCase()
  )

  /* Related brands — same specialty family, different brand */
  const related = BRANDS.filter(b => b.id !== brand.id && b.specialty === brand.specialty).slice(0, 3)
  const otherRelated = related.length < 3
    ? [...related, ...BRANDS.filter(b => b.id !== brand.id && !related.includes(b)).slice(0, 3 - related.length)]
    : related

  return (
    <>
      <Header />
      <main>

        {/* ── BRAND HERO ── */}
        <section className={`border-b ${brand.id === "samson" ? "bg-navy-950 border-gold/40" : "bg-navy-950 border-white/8"}`}>
          {brand.id === "samson" && <div className="h-1 bg-gold w-full" />}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 mb-8">
              <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/marques" className="hover:text-white/60 transition-colors">Marques</Link>
              <span>/</span>
              <span className="text-white/60">{brand.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-20 items-start">

              {/* Left — brand identity */}
              <div>
                {/* Agreement badge */}
                <div className="inline-flex items-center gap-2 mb-6">
                  {brand.id === "samson" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      {/* <span className="bg-gold/15 border border-gold/30 px-3 py-1.5 text-gold text-[9px] font-bold uppercase tracking-[0.2em] font-sans">
                        Partenaire Privilégié · SAV Certifié Fabricant
                      </span> */}
                    </div>
                  ) : brand.sav ? (
                    <span className="bg-steel px-3 py-1.5 text-white text-[9px] font-bold uppercase tracking-[0.2em] font-sans">
                      {brand.agree} · SAV Certifié Fabricant
                    </span>
                  ) : (
                    <span className="bg-white/10 px-3 py-1.5 text-white/70 text-[9px] font-bold uppercase tracking-[0.2em] font-sans">
                      {brand.agree}
                    </span>
                  )}
                </div>

                {/* Logo / name */}
                <h1 className={`font-display font-black uppercase text-fluid-h2 tracking-tight leading-none mb-2 ${brand.id === "samson" ? "text-gold" : "text-white"}`}>
                  {brand.name}
                </h1>
                <p className={`text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-6 ${brand.id === "samson" ? "text-gold/60" : "text-steel"}`}>
                  {brand.specialty} · {brand.origin}
                </p>
                <p className="text-white/55 text-base font-sans leading-relaxed max-w-2xl">
                  {brand.longDesc}
                </p>
              </div>

              {/* Right — quick facts */}
              <div className={`flex flex-col gap-px ${brand.id === "samson" ? "bg-gold/10" : "bg-white/8"}`}>
                <div className="bg-navy-950/80 px-6 py-5">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">Partenariat</p>
                  <p className={`font-display font-bold text-lg uppercase tracking-tight ${brand.id === "samson" ? "text-gold" : "text-white"}`}>{brand.id === "samson" ? "Partenaire Privilégié" : brand.agree}</p>
                </div>
                <div className="bg-navy-950/80 px-6 py-5">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">Origine</p>
                  <p className="text-white font-display font-bold text-lg uppercase tracking-tight">{brand.origin}</p>
                </div>
                <div className="bg-navy-950/80 px-6 py-5">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">Spécialité</p>
                  <p className="text-white font-display font-bold text-lg uppercase tracking-tight">{brand.specialty}</p>
                </div>
                <div className={`px-6 py-5 ${brand.id === "samson" ? "bg-gold/10" : brand.sav ? "bg-steel/20" : "bg-navy-950/80"}`}>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">SAV</p>
                  <p className={`font-display font-bold text-lg uppercase tracking-tight ${brand.id === "samson" ? "text-gold" : brand.sav ? "text-steel-lt" : "text-white"}`}>
                    {brand.sav ? "Certifié Fabricant" : "Disponible sur demande"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GAMME & DOCUMENTATION ── */}
        <section className="bg-surface py-14 lg:py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">

              {/* Left */}
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">Gamme & Documentation</p>
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight leading-none mb-4">
                  Produits {brand.name}
                </h2>
                <p className="text-ink-mid text-sm font-sans leading-relaxed mb-6">
                  Sélection disponible en stock ou sur commande. Devis personnalisé sous 12 h ouvrées.
                </p>
                <Link
                  href={`/devis?marque=${brand.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
                >
                  Demander un devis {brand.name}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              {/* Right — unified grid: product families + catalogues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Product family cards */}
                {brand.productDetail.map(fam => (
                  <div key={fam.name} className="bg-white border border-border flex flex-col p-5 relative">
                    <span className="absolute top-3 right-3 text-[8px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 bg-ink/6 text-ink-soft">
                      Gamme
                    </span>
                    <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight mb-3 pr-12">
                      {fam.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                      {fam.refs.map(ref => (
                        <span key={ref} className="font-mono text-[10px] text-ink-soft bg-dim border border-border px-2 py-0.5">
                          {ref}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/devis?marque=${brand.id}&famille=${encodeURIComponent(fam.name)}`}
                      className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-steel hover:text-navy-800 transition-colors mt-auto"
                    >
                      Demande de prix →
                    </Link>
                  </div>
                ))}

                {/* Catalogue cards */}
                {brandCatalogues.map(cat => (
                  <div key={cat.id} className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow relative">
                    <span className="absolute top-3 right-3 z-10 text-[8px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 bg-white/15 text-white/70">
                      Catalogue
                    </span>
                    {/* Visual header */}
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
                        <p className="text-white/25 text-[9px] font-bold uppercase tracking-[0.2em] font-sans">{cat.marque}</p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-display font-bold text-ink text-sm uppercase tracking-tight leading-tight flex-1">
                        {cat.name}
                      </h3>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
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

                {/* Fallback: product tag badges when no productDetail cards */}
                {/* {brand.productDetail.length === 0 && brand.products.map(p => (
                  <div key={p} className="bg-white border border-border p-5 flex items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">{p}</span>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </section>

        {/* ── SCRAPED PRODUCT CATALOGUE ── */}
        {allBrandProducts.length > 0 && (
          <BrandProductSearch
            products={allBrandProducts}
            brandName={brand.name}
          />
        )}

        {/* ── APPLICATIONS ── */}
        {/* <section className="bg-dim py-12 lg:py-16 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-center">
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">Secteurs</p>
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight leading-none">
                  Applications<br />Principales
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {brand.applications.map(app => (
                  <span key={app} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-xs font-sans text-ink-mid">
                    <span className="w-1 h-1 bg-steel shrink-0" />
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section> */}


        {/* ── SAV BLOCK (if applicable) ── */}
        {brand.sav && (
          <section className="bg-navy-900 py-14 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20">

                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-steel-lt" />
                    <span className="text-steel-lt text-[10px] font-bold uppercase tracking-[0.25em] font-sans">SAV Certifié</span>
                  </div>
                  <h2 className="font-display font-bold text-white text-2xl uppercase tracking-tight leading-none mb-4">
                    Service Après-Vente<br />{brand.name}
                  </h2>
                  <p className="text-white/50 text-sm font-sans leading-relaxed">
                    Techniflux est habilité par {brand.name} pour assurer la maintenance, la réparation et la remise en conformité de l&apos;ensemble de leur gamme avec des pièces d&apos;origine certifiées.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Pièces d'origine", body: `Approvisionnement direct ${brand.name}. Aucune pièce générique — traçabilité lot garantie.` },
                    { label: "Délai garanti", body: "Prise en charge sous 48 h ouvrées. Intervention en atelier ou sur site selon urgence." },
                    { label: "Rapport technique", body: "Analyse de défaillance écrite, photos d'état, préconisations d'amélioration process." },
                    { label: "Garantie 12 mois", body: "Toutes les interventions SAV sont garanties 12 mois — conformité aux specs fabricant." },
                  ].map(({ label, body }) => (
                    <div key={label} className="bg-white/5 border border-white/10 p-5">
                      <h3 className="font-display font-bold text-white text-lg uppercase tracking-tight mb-2">{label}</h3>
                      <p className="text-white/45 text-xs font-sans leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
                >
                  Contacter le service SAV
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <p className="text-white/30 text-xs font-sans">Réponse sous 24 h ouvrées — diagnostic gratuit</p>
              </div> */}
            </div>
          </section>
        )}

        {/* ── OTHER BRANDS ── */}
        {/* {otherRelated.length > 0 && (
          <section className="bg-dim py-12 lg:py-16 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans text-ink/40">Autres marques représentées</p>
                <div className="flex-1 h-px bg-border" />
                <Link href="/marques" className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-steel hover:text-navy-800 transition-colors whitespace-nowrap">
                  Toutes les marques →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherRelated.map(b => (
                  <Link key={b.id} href={`/marques/${b.id}`} className="group bg-white border border-border flex items-center gap-4 p-5 hover:shadow-lg transition-shadow">
                    <div className="bg-navy-950 w-14 h-14 flex items-center justify-center shrink-0">
                      <p className="font-display font-black text-white text-[9px] uppercase tracking-tight text-center leading-tight px-1">
                        {b.name.split(" ")[0]}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-ink text-base uppercase tracking-tight truncate">{b.name}</p>
                      <p className="text-ink-soft text-xs font-sans">{b.specialty}</p>
                    </div>
                    <svg className="w-4 h-4 text-ink/20 group-hover:text-steel transition-colors ml-auto shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )} */}

        {/* ── BOTTOM CTA ── */}
        <section className="bg-surface py-12 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-black text-ink uppercase text-2xl tracking-tight mb-1">
                Besoin d&apos;un produit {brand.name} ?
              </h2>
              <p className="text-ink-soft text-sm font-sans">
                Devis sous 12 h · Stock disponible · {brand.sav ? "SAV certifié fabricant" : "Livraison rapide"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={`/devis?marque=${brand.id}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
              >
                Demander un devis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-ink text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-dim transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
