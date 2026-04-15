import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import ProductsCatalog from "@/components/ProductsCatalog"
import QuickRFQ from "@/components/QuickRFQ"

export const metadata: Metadata = {
  title: "Catalogue Produits",
  description: "Robinetterie industrielle, régulation vapeur, instrumentation, traitement des fluides et automatisme — catalogue complet Techniflux.",
}

/* ── Representative product data (stub — replace with CMS/DB) ── */
const PRODUCTS: Record<string, Product[]> = {
  robinetterie: [
    { ref: "VBF-025-40", name: "Vanne à bille pleine alésage", spec: "DN 25 · PN 40 · Inox 316", brand: "Samson", tag: "Stock" },
    { ref: "VPF-050-16", name: "Vanne papillon à oreilles", spec: "DN 50 · PN 16 · GGG50", brand: "Samson", tag: "Stock" },
    { ref: "VSP-015-10", name: "Soupape de sécurité ressort", spec: "DN 15 · 1–10 bar · Laiton", brand: "Yoshitake", tag: "Sur commande" },
    { ref: "CAR-040-16", name: "Clapet anti-retour à disque", spec: "DN 40 · PN 16 · Fonte", brand: "IMI Norgren", tag: "Stock" },
    { ref: "VRG-025-25", name: "Vanne de régulation 2 voies", spec: "DN 25 · PN 25 · Corps inox", brand: "Samson", tag: "Stock" },
    { ref: "VGO-080-10", name: "Vanne guillotine platine", spec: "DN 80 · PN 10 · Fonte GJL", brand: "Emerson", tag: "Sur commande" },
  ],
  vapeur: [
    { ref: "PTE-015-16", name: "Purgeur thermostatique à bouchon expansible", spec: "DN 15 · PN 16 · 0.5–16 bar", brand: "Spirax Sarco", tag: "Stock" },
    { ref: "PFL-025-40", name: "Purgeur flottant avec clapet de sécurité", spec: "DN 25 · PN 40 · Inox", brand: "Gestra", tag: "Stock" },
    { ref: "PBM-020-16", name: "Purgeur bimétallique résistant aux coups de bélier", spec: "DN 20 · PN 16 · Inox 316", brand: "Spirax Sarco", tag: "Stock" },
    { ref: "DET-025-10", name: "Détendeur vapeur à soufflet", spec: "DN 25 · 2–10 bar aval · Corps acier", brand: "Yoshitake", tag: "Stock" },
    { ref: "SEP-050-16", name: "Séparateur vapeur cyclonique", spec: "DN 50 · PN 16 · Fonte", brand: "Spirax Sarco", tag: "Sur commande" },
    { ref: "STH-040-40", name: "Station de traitement vapeur complète", spec: "DN 40 · PN 40 · Filtre + Détendeur + Purgeur", brand: "Gestra", tag: "Sur projet" },
  ],
  instrumentation: [
    { ref: "MAN-100-25", name: "Manomètre glycérine Ø 100 mm", spec: "0–25 bar · G½ · Cl. 1.0 · INOX", brand: "Wika", tag: "Stock" },
    { ref: "MAN-160-40", name: "Manomètre process haute pression", spec: "0–600 bar · G½ · Cl. 0.5", brand: "Wika", tag: "Stock" },
    { ref: "THB-100-120", name: "Thermomètre bimétallique industriel", spec: "0–120 °C · L 100 mm · Inox", brand: "Wika", tag: "Stock" },
    { ref: "TRT-001-200", name: "Transmetteur de température 4-20 mA", spec: "−50–200 °C · PT100 · IP 67", brand: "Vega", tag: "Stock" },
    { ref: "PRS-016-01", name: "Pressostat réglable électronique", spec: "1–16 bar · 2 contacts · IP 65", brand: "Wika", tag: "Stock" },
    { ref: "NIV-001-VEG", name: "Capteur de niveau radar 80 GHz", spec: "0–30 m · 4-20 mA · IP 68", brand: "Vega", tag: "Sur commande" },
  ],
  fluides: [
    { ref: "FIL-025-005", name: "Filtre coalescent 5 μm", spec: "DN 25 · 16 bar · Corps alu", brand: "Parker", tag: "Stock" },
    { ref: "FIL-040-001", name: "Filtre haute précision 0.01 μm", spec: "DN 40 · 16 bar · ISO Cl. 1", brand: "Beko", tag: "Stock" },
    { ref: "SEP-HE-025", name: "Séparateur huile-eau cyclonique", spec: "DN 25 · 10 Nm³/h · IP 54", brand: "Beko", tag: "Stock" },
    { ref: "SEC-REF-010", name: "Sécheur réfrigérant classe 4", spec: "10 Nm³/h · PDP +3 °C · 230V", brand: "Parker", tag: "Stock" },
    { ref: "REG-AIR-015", name: "Régulateur de pression air", spec: "DN 15 · 0.5–10 bar · Laiton", brand: "IMI Norgren", tag: "Stock" },
    { ref: "LUB-012-025", name: "Lubrificateur brouillard d'huile", spec: "DN 25 · 12 bar · Polycarbonate", brand: "Festo", tag: "Stock" },
  ],
  automatisme: [
    { ref: "EV2-015-24", name: "Électrovanne 2/2 voies normalement fermée", spec: "DN 15 · 24 VDC · EPDM · IP 65", brand: "Bürkert", tag: "Stock" },
    { ref: "EV3-025-230", name: "Électrovanne 3/2 voies pilotée", spec: "DN 25 · 230 VAC · Inox · IP 67", brand: "Bürkert", tag: "Stock" },
    { ref: "VMO-040-3P", name: "Vanne motorisée 3 points", spec: "DN 40 · 24 VDC · Fonte · Nm 50", brand: "Samson", tag: "Stock" },
    { ref: "ACT-DP-050", name: "Actionneur pneumatique double effet", spec: "DN 50 · 6 bar · Alu anodisé", brand: "IMI Norgren", tag: "Stock" },
    { ref: "POS-420-01", name: "Positionneur électropneumatique HART", spec: "4-20 mA · HART 7 · ATEX II 2G", brand: "Samson", tag: "Sur commande" },
    { ref: "VRM-050-SL", name: "Vanne de régulation motorisée smart", spec: "DN 50 · PROFIBUS · Inox · IP 68", brand: "Bürkert", tag: "Sur projet" },
  ],
}

type Product = { ref: string; name: string; spec: string; brand: string; tag: string }

const FAMILIES = [
  { id: "robinetterie", label: "Robinetterie Industrielle", sub: "Vannes · Soupapes · Clapets" },
  { id: "vapeur",       label: "Régulation Vapeur",        sub: "Purgeurs · Détendeurs · Séparateurs" },
  { id: "instrumentation", label: "Instrumentation",       sub: "Manomètres · Thermomètres · Pressostats" },
  { id: "fluides",      label: "Traitement des Fluides",   sub: "Filtres · Sécheurs · Air Comprimé" },
  { id: "automatisme",  label: "Automatisme",              sub: "Électrovannes · Vannes Motorisées" },
]

const TAG_STYLE: Record<string, string> = {
  "Stock": "bg-steel/10 text-steel",
  "Sur commande": "bg-ink/6 text-ink-mid",
  "Sur projet": "bg-navy-800/10 text-navy-800",
}

/* ── Page (Server Component) ── */
export default function ProduitsPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  // Extract the reference from URL (e.g., /produits?devis=VBF-025-40)
  const activeDevis = typeof searchParams.devis === 'string' ? searchParams.devis : null
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
                  Robinetterie, régulation vapeur, instrumentation, traitement des fluides et automatisme — sélection par famille technique ou par application process.
                </p>
              </div>
              {/* Quick search */}
              <form action="/recherche" method="get" className="flex w-full lg:w-80">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="search" name="q"
                    placeholder="Référence, DN, PN, marque…"
                    className="w-full bg-white/6 border border-white/14 text-white placeholder:text-white/30 text-sm font-sans pl-10 pr-4 py-3 focus:outline-none focus:border-steel/60 transition-colors"
                  />
                </div>
                <button type="submit" aria-label="Rechercher" className="px-4 bg-steel text-white hover:bg-steel-lt transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── FAMILY / APPLICATION TOGGLE ── */}
        <ProductsCatalog />

        {/* ── PRODUCT LISTINGS BY FAMILY ── */}
        {FAMILIES.map(fam => (
          <section key={fam.id} id={fam.id} className="border-t border-border py-14 lg:py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">{fam.sub}</p>
                  <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-tight">{fam.label}</h2>
                </div>
                {/* <Link
                  href={`#${fam.id}`}
                  className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink hover:text-steel transition-colors whitespace-nowrap"
                >
                  Voir toute la gamme →
                </Link> */}
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(PRODUCTS[fam.id] ?? []).map(p => (
                  <div key={p.ref} className="group bg-white border border-border flex flex-col hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-ink/12 group-hover:bg-steel transition-colors" />
                    <div className="p-6 flex flex-col gap-4 flex-1 relative">
                      {/* Tag */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] text-ink-soft tracking-wider">{p.ref}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] font-sans px-2 py-0.5 ${TAG_STYLE[p.tag] ?? ""}`}>
                          {p.tag}
                        </span>
                      </div>
                      {/* Name */}
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight leading-tight mb-2">
                          {p.name}
                        </h3>
                        <p className="text-ink-soft text-xs font-sans leading-relaxed">{p.spec}</p>
                      </div>
                      {/* Brand + actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">{p.brand}</span>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/ressources#fiches`}
                            className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft hover:text-ink transition-colors"
                          >
                            Fiche tech.
                          </Link>
                          <Link
                            href={`?devis=${p.ref}`}
              scroll={false} // Important: prevents page jump to top
                            className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans bg-navy-900 text-white px-3 py-1.5 hover:bg-steel transition-colors"
                          >
                            Devis →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

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
                href="#contact"
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
      {/* 4. The Modal (Only renders/hydrates when ref is present) */}
      {/* {activeDevis && <QuickRFQ productRef={activeDevis} />} */}
    </>
  )
}
