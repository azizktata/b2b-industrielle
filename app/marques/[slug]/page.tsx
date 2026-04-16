import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { BRANDS, getBrandBySlug, getAllBrandSlugs } from "@/lib/brands"
import { getProducts } from "@/lib/catalogue"
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
        <section className="bg-navy-950 border-b border-white/8">
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
                  {brand.sav ? (
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
                <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none mb-2">
                  {brand.name}
                </h1>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-6">
                  {brand.specialty} · {brand.origin}
                </p>
                <p className="text-white/55 text-base font-sans leading-relaxed max-w-2xl">
                  {brand.longDesc}
                </p>
              </div>

              {/* Right — quick facts */}
              <div className="flex flex-col gap-px bg-white/8">
                <div className="bg-navy-950/80 px-6 py-5">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">Partenariat</p>
                  <p className="text-white font-display font-bold text-lg uppercase tracking-tight">{brand.agree}</p>
                </div>
                <div className="bg-navy-950/80 px-6 py-5">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">Origine</p>
                  <p className="text-white font-display font-bold text-lg uppercase tracking-tight">{brand.origin}</p>
                </div>
                <div className="bg-navy-950/80 px-6 py-5">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">Spécialité</p>
                  <p className="text-white font-display font-bold text-lg uppercase tracking-tight">{brand.specialty}</p>
                </div>
                <div className={`px-6 py-5 ${brand.sav ? "bg-steel/20" : "bg-navy-950/80"}`}>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-sans mb-1">SAV</p>
                  <p className={`font-display font-bold text-lg uppercase tracking-tight ${brand.sav ? "text-steel-lt" : "text-white"}`}>
                    {brand.sav ? "Certifié Fabricant" : "Disponible sur demande"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCT RANGE ── */}
        <section className="bg-surface py-14 lg:py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">

              {/* Left */}
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">Gamme</p>
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

              {/* Right — product families */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brand.productDetail.map(fam => (
                  <div key={fam.name} className="bg-white border border-border p-5">
                    <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight mb-3">
                      {fam.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {fam.refs.map(ref => (
                        <span key={ref} className="font-mono text-[10px] text-ink-soft bg-dim border border-border px-2 py-0.5">
                          {ref}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/devis?marque=${brand.id}&famille=${encodeURIComponent(fam.name)}`}
                      className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-steel hover:text-navy-800 transition-colors"
                    >
                      Demande de prix →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Full product list */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink/40 mb-4">
                Familles de produits distribuées
              </p>
              <div className="flex flex-wrap gap-2">
                {brand.products.map(p => (
                  <span key={p} className="px-4 py-2 bg-dim border border-border text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                    {p}
                  </span>
                ))}
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
        <section className="bg-dim py-12 lg:py-16 border-b border-border">
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
        </section>

        {/* ── CATALOGUES ── */}
        <section className="bg-surface py-14 lg:py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">Documentation</p>
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
                  Catalogues {brand.name}
                </h2>
              </div>
              <Link
                href="/ressources#catalogues"
                className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink hover:text-steel transition-colors whitespace-nowrap"
              >
                Tous les catalogues →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brand.catalogues.map(cat => (
                <div key={cat.title} className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow">

                  {/* Visual header */}
                  <div className="bg-navy-900 h-24 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <div className="relative flex items-center gap-3">
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white/40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div>
                        <p className="text-white/25 text-[9px] font-bold uppercase tracking-[0.2em] font-sans">{brand.name}</p>
                        <p className="text-white/50 text-[10px] font-sans tabular-nums">{cat.pages} · {cat.size}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight mb-2">
                        {cat.title}
                      </h3>
                      <p className="text-ink-soft text-xs font-sans leading-relaxed">{cat.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <a
                        href="#"
                        className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-navy-800 group-hover:text-steel transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Télécharger PDF
                      </a>
                      <a href="#" className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft hover:text-ink transition-colors">
                        Feuilleter en ligne
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

              <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
                >
                  Contacter le service SAV
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <p className="text-white/30 text-xs font-sans">Réponse sous 24 h ouvrées — diagnostic gratuit</p>
              </div>
            </div>
          </section>
        )}

        {/* ── OTHER BRANDS ── */}
        {otherRelated.length > 0 && (
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
        )}

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
                href="/#dimensionnement"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-ink text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-dim transition-colors"
              >
                Étude technique
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
