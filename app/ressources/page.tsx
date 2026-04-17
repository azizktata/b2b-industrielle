import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import FichesTechniquesTable, { type FicheRow } from "@/components/FichesTechniquesTable"
import { getProducts, getCatalogues, getGuides, FAMILLE_LABELS } from "@/lib/catalogue"

export const metadata: Metadata = {
  title: "Ressources Techniques",
  description: "Catalogues PDF, fiches techniques, guides de sélection et lexique industriel — le hub documentaire de Techniflux pour les bureaux d'études et équipes maintenance.",
}



const LEXIQUE = [
  { term: "ATEX", def: "ATmosphères EXplosibles — directive européenne 2014/34/UE réglementant les équipements utilisables en atmosphères explosives (gaz, vapeurs, poussières inflammables)." },
  { term: "Clapet anti-retour", def: "Organe de robinetterie n'autorisant le passage du fluide que dans un seul sens. S'oppose aux retours de fluide susceptibles d'endommager les équipements en amont." },
  { term: "Cv / Kv", def: "Coefficients de débit d'une vanne. Kv (m³/h) : débit d'eau à 15 °C pour une chute de pression de 1 bar. Cv (gallons US/min) : équivalent anglo-saxon. Kv = 0,865 × Cv." },
  { term: "DN (Diamètre Nominal)", def: "Désignation numérique de la taille d'une tuyauterie ou d'un raccord (DN 15, DN 25, DN 50…). Ne correspond pas exactement au diamètre réel mais à une valeur normalisée." },
  { term: "PDP (Point de Rosée sous Pression)", def: "Température à laquelle la vapeur d'eau contenue dans l'air comprimé se condense. Exprimé en °C PDP ; un PDP de −40 °C signifie une teneur en eau extrêmement faible." },
  { term: "PED (Directive Équipements sous Pression)", def: "Directive européenne 2014/68/UE fixant les exigences essentielles de sécurité pour les équipements soumis à une pression supérieure à 0,5 bar (robinetterie, tuyauteries, récipients)." },
  { term: "PN (Pression Nominale)", def: "Indicateur de la pression maximale de service admissible à 20 °C pour un raccord ou une vanne. PN 16 = 16 bar max à 20 °C. Se dérate avec la température." },
  { term: "Purgeur vapeur", def: "Dispositif purgeur automatique qui évacue les condensats et les incondensables formés dans un réseau vapeur sans laisser s'échapper de vapeur vive. Trois technologies principales : thermostatique, flottant, thermodynamique." },
  { term: "Soupape de sécurité", def: "Organe de protection taré à une pression d'ouverture déterminée, s'ouvrant automatiquement pour limiter la surpression dans une installation et se refermant dès que la pression redescend." },
  { term: "Vanne de régulation", def: "Vanne à ouverture variable commandée par un actionneur (pneumatique ou électrique) et un régulateur PID, permettant de contrôler précisément le débit ou la pression dans un process." },
]

/* ── Page ── */
export default function RessourcesPage() {
  const catalogues = getCatalogues()
  const guides = getGuides()
  const fiches: FicheRow[] = getProducts().flatMap(p =>
    p.pdfs.map(pdf => ({
      ref: p.id.replace(`${p.marque.toLowerCase()}-`, ""),
      productId: p.id,
      name: p.name,
      pdfLabel: pdf.label,
      pdfType: pdf.type,
      url: pdf.url,
      famille: p.famille,
      marque: p.marque,
    }))
  )
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
              <span className="text-white/60">Ressources Techniques</span>
            </nav>
            <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
              Hub Documentation
            </p>
            <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none mb-4">
              Ressources<br />Techniques
            </h1>
            <p className="text-white/45 text-sm font-sans max-w-2xl leading-relaxed">
              Tout ce dont votre bureau d&apos;études et vos équipes maintenance ont besoin — catalogues fournisseurs, fiches techniques, guides de sélection et lexique industriel, centralisés et toujours à jour.
            </p>

            {/* Quick-jump nav */}
            <div className="flex flex-wrap gap-2 mt-8">
              {[
                { label: "Catalogues PDF", href: "#catalogues" },
                { label: "Fiches Techniques", href: "#fiches" },
                { label: "Guides de Sélection", href: "#guides" },
                { label: "Lexique Technique", href: "#lexique" },
              ].map(({ label, href }) => (
                <a key={href} href={href}
                  className="px-4 py-2 border border-white/15 text-white/55 text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:border-steel hover:text-steel transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATALOGUES PDF ── */}
        <section id="catalogues" className="bg-surface py-16 lg:py-24 border-b border-border scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">
                  Section 01
                </p>
                <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight">
                  Catalogues Fournisseurs
                </h2>
                <p className="text-ink-soft text-sm font-sans mt-2">
                  Feuilletables en ligne et téléchargeables. Mis à jour à chaque nouvelle édition fabricant.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink-soft whitespace-nowrap">
                {catalogues.length} catalogue{catalogues.length !== 1 ? "s" : ""} disponible{catalogues.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {catalogues.map(cat => (
                <a key={cat.id} href={cat.pdfUrl} target="_blank" rel="noopener noreferrer"
                  className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow"
                >
                  {/* Visual placeholder */}
                  <div className="bg-navy-950 h-32 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" className="relative w-8 h-8 text-white/30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="relative text-[9px] font-bold uppercase tracking-[0.2em] font-sans text-white/25">{cat.marque}</span>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-steel mb-1">{cat.marque}</p>
                      <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-end pt-3 border-t border-border">
                      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-navy-800 group-hover:text-steel transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Télécharger
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FICHES TECHNIQUES ── */}
        <section id="fiches" className="bg-dim py-16 lg:py-24 border-b border-border scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">
                  Section 02
                </p>
                <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight">
                  Documents Techniques
                </h2>
                <p className="text-ink-soft text-sm font-sans mt-2">
                  Fiches techniques, dessins d&apos;assemblage, notices d&apos;installation — tous les PDFs fabricant par référence.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink-soft whitespace-nowrap tabular-nums">
                {fiches.length} document{fiches.length !== 1 ? "s" : ""} disponible{fiches.length !== 1 ? "s" : ""}
              </span>
            </div>

            <FichesTechniquesTable fiches={fiches} />
          </div>
        </section>

        {/* ── GUIDES DE SÉLECTION ── */}
        <section id="guides" className="bg-surface py-16 lg:py-24 border-b border-border scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">
                Section 03
              </p>
              <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight mb-2">
                Guides de Sélection
              </h2>
              <p className="text-ink-soft text-sm font-sans max-w-xl">
                Rédigés par nos ingénieurs — méthodes de sélection, calculs pratiques et aide à la décision pour les techniciens et bureaux d&apos;études.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-border border border-border bg-white">
              {guides.map((g, i) => {
                const tags = [
                  g.marque,
                  g.famille ? FAMILLE_LABELS[g.famille]?.label : null,
                ].filter(Boolean) as string[]
                return (
                  <a
                    key={g.id}
                    href={g.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-6 px-6 py-7 hover:bg-dim/50 transition-colors"
                  >
                    <span className="font-display font-black text-ink/15 text-4xl leading-none shrink-0 mt-1 group-hover:text-steel transition-colors tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-3">
                        {g.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-dim border border-border text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-ink/20 group-hover:text-steel transition-colors shrink-0 mt-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── LEXIQUE TECHNIQUE ── */}
        <section id="lexique" className="bg-dim py-16 lg:py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20">

              {/* Left sticky header */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">
                  Section 04
                </p>
                <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight mb-4">
                  Lexique<br />Technique
                </h2>
                <p className="text-ink-mid text-sm font-sans leading-relaxed mb-6">
                  Définitions précises des termes utilisés en robinetterie industrielle, régulation vapeur et instrumentation — pour techniciens et acheteurs.
                </p>
                <p className="text-ink-soft text-xs font-sans">{LEXIQUE.length} définitions · Mis à jour 2024</p>
              </div>

              {/* Definitions */}
              <div className="flex flex-col divide-y divide-border">
                {LEXIQUE.map(({ term, def }) => (
                  <div key={term} className="py-6 first:pt-0">
                    <h3 className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-3">
                      {term}
                    </h3>
                    <p className="text-ink-mid text-sm font-sans leading-relaxed max-w-2xl">{def}</p>
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
                Document introuvable ?
              </h2>
              <p className="text-white/50 text-sm font-sans max-w-md">
                Contactez notre équipe technique — nous disposons de nombreux documents hors catalogue fournisseur.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-7 py-4 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors shrink-0"
            >
              Contacter un technicien
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
