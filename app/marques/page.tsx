import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import { BRANDS } from "@/lib/brands"

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
                {brands.map(b => (
                  <Link
                    key={b.id}
                    href={`/marques/${b.id}`}
                    className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    {/* Logo area */}
                    <div className="relative bg-navy-950 h-28 flex flex-col items-center justify-center overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                      {/* Logo placeholder — replace with <Image src={`/logos/${b.id}.svg`} …> when assets are ready */}
                      <div className="relative flex flex-col items-center gap-2">
                        <p className="font-display font-black text-white text-2xl uppercase tracking-[0.08em] leading-none">
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

                    <div className="flex flex-col gap-4 p-5 flex-1">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel mb-1">
                          {b.specialty}
                        </p>
                        <p className="text-ink-mid text-xs font-sans leading-relaxed line-clamp-3">
                          {b.desc}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {b.products.slice(0, 3).map(p => (
                          <span key={p} className="px-2 py-0.5 bg-dim border border-border text-[9px] font-sans text-ink-soft">
                            {p}
                          </span>
                        ))}
                        {b.products.length > 3 && (
                          <span className="px-2 py-0.5 text-[9px] font-sans text-ink-soft">
                            +{b.products.length - 3} autres
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft">{b.agree}</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel group-hover:text-navy-800 transition-colors">
                          Voir la gamme →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
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
