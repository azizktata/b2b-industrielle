import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "Ressources Techniques",
  description: "Catalogues PDF, fiches techniques, guides de sélection et lexique industriel — le hub documentaire de Techniflux pour les bureaux d'études et équipes maintenance.",
}

/* ── Data ── */
const CATALOGUES = [
  { brand: "Spirax Sarco", title: "Catalogue Général Vapeur 2024", pages: "348 p.", size: "18 MB", desc: "Purgeurs, séparateurs, détendeurs, vannes vapeur — gamme complète.", href: "#" },
  { brand: "Gestra",       title: "Purgeurs & Conditionnement Vapeur", pages: "210 p.", size: "12 MB", desc: "Purgeurs thermostatiques, flottants, thermodynamiques, UNA series.", href: "#" },
  { brand: "Wika",         title: "Instruments de Mesure Industriels", pages: "560 p.", size: "24 MB", desc: "Manomètres, thermomètres, transmetteurs, calibrateurs.", href: "#" },
  { brand: "Bürkert",      title: "Vannes Automatisées & Électrovannes", pages: "280 p.", size: "15 MB", desc: "Électrovannes, vannes de process, capteurs, systèmes de contrôle.", href: "#" },
  { brand: "Parker Hannifin", title: "Traitement Air Comprimé — Série G", pages: "196 p.", size: "9 MB", desc: "Filtres, régulateurs, lubrificateurs, sécheurs, séparateurs HO.", href: "#" },
  { brand: "Samson AG",    title: "Vannes de Régulation — Séries 3000", pages: "164 p.", size: "11 MB", desc: "Corps de vanne, actionneurs pneumatiques, positionneurs HART.", href: "#" },
  { brand: "Beko Technologies", title: "Solutions Air Comprimé Industriel", pages: "120 p.", size: "7 MB", desc: "Sécheurs réfrigérants, dessicants, filtration, condensats.", href: "#" },
  { brand: "Vega",         title: "Instrumentation de Niveau & Pression", pages: "230 p.", size: "13 MB", desc: "Radars, capacitifs, hydrostatiques, guidés — VEGAPULS series.", href: "#" },
]

const FICHES = [
  { ref: "FT-PTE-015", name: "Purgeur thermostatique à bouchon", family: "Régulation Vapeur", brand: "Spirax Sarco", updated: "Jan. 2024" },
  { ref: "FT-MAN-100", name: "Manomètre glycérine Ø 100 mm", family: "Instrumentation", brand: "Wika", updated: "Fév. 2024" },
  { ref: "FT-VBF-025", name: "Vanne à bille pleine alésage DN25", family: "Robinetterie", brand: "Samson", updated: "Mar. 2024" },
  { ref: "FT-EV2-015", name: "Électrovanne 2/2 voies", family: "Automatisme", brand: "Bürkert", updated: "Nov. 2023" },
  { ref: "FT-FIL-005", name: "Filtre coalescent 5 μm", family: "Traitement Fluides", brand: "Parker", updated: "Déc. 2023" },
  { ref: "FT-DET-025", name: "Détendeur vapeur à soufflet DN25", family: "Régulation Vapeur", brand: "Yoshitake", updated: "Jan. 2024" },
  { ref: "FT-SEP-050", name: "Séparateur vapeur cyclonique DN50", family: "Régulation Vapeur", brand: "Spirax Sarco", updated: "Oct. 2023" },
  { ref: "FT-THB-100", name: "Thermomètre bimétallique L100", family: "Instrumentation", brand: "Wika", updated: "Fév. 2024" },
]

const GUIDES = [
  {
    no: "01",
    title: "Dimensionner un purgeur vapeur",
    desc: "Méthode complète : calcul du débit de condensat, facteur de sécurité, choix du type (thermostatique, flottant, thermodynamique) selon l'application.",
    tags: ["Vapeur", "Purgeurs", "Calcul"],
    href: "/ressources/guides/dimensionner-purgeur-vapeur",
  },
  {
    no: "02",
    title: "Choisir un régulateur de pression",
    desc: "Sélection selon le fluide, la plage de pression, le débit nominal et la précision requise. Tableaux comparatifs et exemples de calcul.",
    tags: ["Pression", "Régulation", "Air / Vapeur"],
    href: "/ressources/guides/choisir-regulateur-pression",
  },
  {
    no: "03",
    title: "Traitement de l'air comprimé — ISO 8573",
    desc: "Comprendre les classes de qualité ISO 8573, choisir la chaîne de traitement adaptée (filtre, sécheur, séparateur HO) selon votre application.",
    tags: ["Air Comprimé", "ISO 8573", "Filtration"],
    href: "/ressources/guides/traitement-air-comprime",
  },
  {
    no: "04",
    title: "Audit d'un réseau vapeur",
    desc: "Protocole d'inspection : identification des purgeurs défaillants, mesure des pertes calorifiques, calcul du ROI d'un remplacement. Grille de diagnostic.",
    tags: ["Audit", "Vapeur", "Énergie"],
    href: "/ressources/guides/audit-reseau-vapeur",
  },
  {
    no: "05",
    title: "Robinetterie en zone ATEX",
    desc: "Exigences réglementaires, marquage CE / ATEX, sélection des matériaux, joints et actionneurs. Tableau de compatibilité groupe/catégorie.",
    tags: ["ATEX", "Sécurité", "Réglementation"],
    href: "/ressources/guides/robinetterie-atex",
  },
  {
    no: "06",
    title: "Lecture d'une courbe de perte de charge",
    desc: "Interpréter Kv/Cv, choisir le DN pour le débit nominal, appliquer les coefficients de correction température/viscosité.",
    tags: ["Hydraulique", "Calcul", "Kv/Cv"],
    href: "/ressources/guides/courbe-perte-de-charge",
  },
]

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
                {CATALOGUES.length} catalogues disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CATALOGUES.map(cat => (
                <a key={cat.brand} href={cat.href}
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
                    <span className="relative text-[9px] font-bold uppercase tracking-[0.2em] font-sans text-white/25">{cat.brand}</span>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-steel mb-1">{cat.brand}</p>
                      <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight mb-2">
                        {cat.title}
                      </h3>
                      <p className="text-ink-soft text-xs font-sans leading-relaxed">{cat.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-[9px] font-sans text-ink-soft tabular-nums">{cat.pages} · {cat.size}</span>
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
                  Fiches Techniques
                </h2>
                <p className="text-ink-soft text-sm font-sans mt-2">
                  Dimensions, courbes de débit, matériaux, certifications — par référence produit.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink-soft whitespace-nowrap">
                500+ fiches disponibles
              </span>
            </div>

            {/* Search bar */}
            <form action="/recherche" method="get" className="flex mb-6 max-w-xl">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="search" name="q" placeholder="Référence, marque ou type de produit…"
                  className="w-full bg-white border border-border text-ink placeholder:text-ink-soft/60 text-sm font-sans pl-10 pr-4 py-3 focus:outline-none focus:border-steel/60 transition-colors"
                />
              </div>
              <button type="submit" className="px-5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors">
                Chercher
              </button>
            </form>

            {/* Table */}
            <div className="bg-white border border-border overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-border bg-dim">
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Référence</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Désignation</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 hidden sm:table-cell">Famille</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 hidden lg:table-cell">Marque</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 hidden lg:table-cell">Mis à jour</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {FICHES.map(f => (
                    <tr key={f.ref} className="group hover:bg-dim/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-[11px] text-ink-soft whitespace-nowrap">{f.ref}</td>
                      <td className="px-5 py-4 text-ink font-sans text-sm">{f.name}</td>
                      <td className="px-5 py-4 text-ink-soft text-xs hidden sm:table-cell whitespace-nowrap">{f.family}</td>
                      <td className="px-5 py-4 text-ink-mid text-xs hidden lg:table-cell">{f.brand}</td>
                      <td className="px-5 py-4 text-ink-soft text-xs hidden lg:table-cell tabular-nums">{f.updated}</td>
                      <td className="px-5 py-4 text-right">
                        <a href="#" className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-navy-800 group-hover:text-steel transition-colors whitespace-nowrap">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                <p className="text-xs font-sans text-ink-soft">Affichage de 8 fiches sur 500+</p>
                <Link href="/ressources/fiches" className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel hover:text-navy-800 transition-colors">
                  Voir toutes les fiches →
                </Link>
              </div>
            </div>
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
              {GUIDES.map(g => (
                <Link
                  key={g.no}
                  href={g.href}
                  className="group flex items-start gap-6 px-6 py-7 hover:bg-dim/50 transition-colors"
                >
                  <span className="font-display font-black text-ink/15 text-4xl leading-none shrink-0 mt-1 group-hover:text-steel transition-colors tabular-nums">
                    {g.no}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-2">
                      {g.title}
                    </h3>
                    <p className="text-ink-mid text-sm font-sans leading-relaxed mb-3">{g.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-dim border border-border text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-ink/20 group-hover:text-steel transition-colors shrink-0 mt-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              ))}
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
