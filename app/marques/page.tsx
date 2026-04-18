import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import { BRANDS } from "@/lib/brands"

const SAMSON = BRANDS.find(b => b.id === "samson")!

export const metadata: Metadata = {
  title: "Marques Représentées",
  description: "Distributeur agréé Spirax Sarco, Gestra, Wika, Bürkert, Samson, Parker, Beko, Vega et plus — capacité SAV certifiée fabricant sur l'ensemble du catalogue.",
}

const AGREEMENT_ORDER = [ "Partenaire Commercial","Distributeur Agréé", "Distributeur Officiel",] as const

export default function MarquesPage() {
  const grouped = AGREEMENT_ORDER.map(level => ({
    level,
    brands: BRANDS.filter(b => b.agree === level),
  }))

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
              <span className="text-white/60">Marques</span>
            </nav>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  Partenaires Fabricants
                </p>
                <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none mb-4">
                  Marques<br />Représentées
                </h1>
                <p className="text-white/45 text-sm font-sans max-w-xl leading-relaxed">
                  Distributeur agréé des plus grands fabricants mondiaux en robinetterie industrielle, régulation vapeur et instrumentation — avec capacité SAV certifiée sur l&apos;ensemble du catalogue.
                </p>
              </div>
              <div className="flex flex-col gap-3 items-start lg:items-end">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-steel shrink-0" />
                  <span className="text-white/55 text-xs font-sans">{BRANDS.filter(b => b.sav).length} marques avec SAV certifié</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white/20 shrink-0" />
                  <span className="text-white/55 text-xs font-sans">{BRANDS.length} fabricants référencés</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SAMSON FEATURED ── */}
        {/* <section className="bg-navy-950 border-b-2 border-gold py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.35em] font-sans">Partenaire Privilégié</span>
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>

            <Link
              href={`/marques/${SAMSON.id}`}
              className="group grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 border border-gold/40 hover:border-gold transition-colors overflow-hidden"
            >
              <div className="relative bg-navy-900 p-10 lg:p-14 flex flex-col justify-between gap-8 overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(oklch(1 0 0 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.02) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute top-0 left-0 w-1 h-full bg-gold" />

                <div className="relative">
                  <div className="flex items-center gap-1.5 mb-6">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <h2 className="font-display font-black text-white text-5xl lg:text-6xl uppercase tracking-tight leading-none mb-3">
                    {SAMSON.name}
                  </h2>
                  <p className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-4">{SAMSON.origin} · {SAMSON.specialty}</p>
                  <p className="text-white/55 text-sm font-sans leading-relaxed max-w-md">{SAMSON.longDesc}</p>
                </div>

                <div className="relative flex items-center gap-3">
                  <span className="bg-gold/15 border border-gold/30 px-3 py-1.5 text-gold text-[9px] font-bold uppercase tracking-[0.2em] font-sans">
                    {SAMSON.agree}
                  </span>
                  {SAMSON.sav && (
                    <span className="bg-steel px-3 py-1.5 text-white text-[9px] font-bold uppercase tracking-[0.2em] font-sans">
                      SAV Certifié Fabricant
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-navy-950 border-l border-gold/20 p-8 lg:p-10 flex flex-col gap-6">
                <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-sans">Gammes disponibles</p>
                <div className="flex flex-col gap-px flex-1">
                  {SAMSON.products.map(p => (
                    <div key={p} className="flex items-center gap-3 py-3 border-b border-white/6 last:border-0">
                      <div className="w-1.5 h-1.5 bg-gold shrink-0" />
                      <span className="text-white/70 text-sm font-sans">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gold/20 mt-auto">
                  <span className="text-white/30 text-[10px] font-sans uppercase tracking-[0.2em]">
                    {SAMSON.applications.length} applications
                  </span>
                  <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] font-sans group-hover:text-gold-lt transition-colors">
                    Voir la gamme →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section> */}

        {/* ── BRAND GROUPS ── */}
        {grouped.map(({ level, brands }) => brands.length > 0 && (
          <section key={level} className="bg-surface py-14 lg:py-20 border-b border-border last:border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans text-ink/40">{level}</span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-sans text-ink-soft">{brands.length} marque{brands.length > 1 ? "s" : ""}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map(b => {
                  const isSamson = b.id === "samson"
                  return (
                  <Link
                    key={b.id}
                    href={`/marques/${b.id}`}
                    className={`group flex flex-col hover:shadow-xl transition-shadow overflow-hidden ${isSamson ? "bg-navy-950 border-2 border-gold" : "bg-white border border-border"}`}
                  >
                    {/* Logo area */}
                    <div className={`relative h-28 flex flex-col items-center justify-center overflow-hidden ${isSamson ? "bg-navy-900" : "bg-navy-950"}`}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                      {isSamson && <div className="absolute top-0 inset-x-0 h-0.5 bg-gold" />}
                      <div className="relative flex flex-col items-center gap-2">
                        {isSamson && (
                          <div className="flex items-center gap-1 mb-1">
                            {[1,2,3].map(i => (
                              <svg key={i} className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                        )}
                        <p className={`font-display font-black text-2xl uppercase tracking-[0.08em] leading-none ${isSamson ? "text-gold" : "text-white"}`}>
                          {b.name}
                        </p>
                        <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-sans">{b.origin}</p>
                      </div>
                      {b.sav && (
                        <div className="absolute top-3 right-3 bg-steel px-2 py-1">
                          <span className="text-white text-[8px] font-bold uppercase tracking-[0.15em] font-sans">SAV Certifié</span>
                        </div>
                      )}
                    </div>

                    <div className={`flex flex-col gap-4 p-5 flex-1 ${isSamson ? "bg-navy-950" : ""}`}>
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] font-sans mb-1 ${isSamson ? "text-gold" : "text-steel"}`}>
                          {b.specialty}
                        </p>
                        <p className={`text-xs font-sans leading-relaxed line-clamp-3 ${isSamson ? "text-white/50" : "text-ink-mid"}`}>
                          {b.desc}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {b.products.slice(0, 3).map(p => (
                          <span key={p} className={`px-2 py-0.5 text-[9px] font-sans border ${isSamson ? "bg-white/5 border-gold/20 text-white/50" : "bg-dim border-border text-ink-soft"}`}>
                            {p}
                          </span>
                        ))}
                        {b.products.length > 3 && (
                          <span className="px-2 py-0.5 text-[9px] font-sans text-ink-soft">
                            +{b.products.length - 3} autres
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center justify-between pt-3 border-t mt-auto ${isSamson ? "border-gold/20" : "border-border"}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] font-sans ${isSamson ? "text-gold/60" : "text-ink-soft"}`}>{b.agree}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] font-sans transition-colors ${isSamson ? "text-gold group-hover:text-gold-lt" : "text-steel group-hover:text-navy-800"}`}>
                          Voir la gamme →
                        </span>
                      </div>
                    </div>
                  </Link>
                  )
                })}
              </div>
            </div>
          </section>
        ))}

        {/* ── SAV ── */}
        <section className="bg-dim py-14 lg:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">Service Après-Vente</p>
                <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight leading-none mb-6">
                  SAV Certifié<br />Fabricant
                </h2>
                <p className="text-ink-mid text-sm font-sans leading-relaxed">
                  Pour les {BRANDS.filter(b => b.sav).length} marques agréées, nous assurons le SAV avec des pièces d&apos;origine et une traçabilité complète. Intervention en atelier ou sur site.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Pièces d'origine", body: "Approvisionnement direct fabricant. Aucune pièce générique, traçabilité lot garantie." },
                  { title: "Diagnostic technique", body: "Analyse de défaillance, rapport écrit, préconisations d'amélioration process." },
                  { title: "Intervention rapide", body: "Prise en charge sous 48 h. Atelier équipé ou déplacement sur site selon urgence." },
                  { title: "Garantie SAV", body: "Garantie 12 mois sur les interventions. Conformité aux spécifications fabricant." },
                ].map(({ title, body }) => (
                  <div key={title} className="bg-white border border-border p-5">
                    <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight mb-2">{title}</h3>
                    <p className="text-ink-mid text-sm font-sans leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-navy-900 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display font-black text-white uppercase text-3xl tracking-tight mb-2">
                Marque non listée ?
              </h2>
              <p className="text-white/50 text-sm font-sans max-w-md">
                Nous sourçons régulièrement hors catalogue. Contactez-nous avec la référence fabricant.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/#contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors">
                Nous contacter
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/devis" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-white/5 transition-colors">
                Demande de devis
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
