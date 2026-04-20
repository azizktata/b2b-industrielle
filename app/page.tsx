import Link from "next/link"
import Header from "@/components/Header"
// import HeroPhoto from "@/components/HeroPhoto"  ← swap HeroSlider for HeroPhoto once you have real photos in /public/images/
import ProductsCatalog from "@/components/ProductsCatalog"
import ContactForm from "@/components/ContactForm"
import HeroPhoto from "@/components/HeroPhoto"

/* ── Static data ──────────────────────────────────────── */
const BRANDS = ["Sectoriel", "Samson", "Mival", "Adca", "Sferaco", "Ifm"]

const STATS = [
  { value: "30",    label: "Années d'expertise" },
  { value: "2 500+", label: "Références en stock" },
  { value: "< 12 h", label: "Délai de devis" },
  { value: "100%",   label: "SAV certifié fabricant" },
]

const SERVICES = [
  {
    no: "01",
    title: "SAV & Dépannage",
    body: "Réparation agréée de robinetterie industrielle. Pièces d'origine, traçabilité complète, intervention rapide sur site ou en atelier.",
    href: "/services/sav",
  },
  {
    no: "02",
    title: "Dimensionnement Technique",
    body: "Étude et sélection sur mesure. Courbes de perte de charge, schémas cotés, documentation CCTP pour bureaux d'études et appels d'offres.",
    href: "#dimensionnement",
  },
  {
    no: "03",
    title: "Audit Vapeur",
    body: "Diagnostic complet de vos réseaux vapeur. État des purgeurs, pertes énergétiques, plan d'action chiffré avec ROI estimé.",
    href: "/services/audit",
  },
]

const RESSOURCES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    label: "Catalogues PDF",
    description: "Catalogues fournisseurs Spirax, Gestra, Wika, Bürkert — feuilletables en ligne et téléchargeables.",
    count: "12 catalogues",
    href: "/ressources#catalogues",
    accent: "bg-navy-900",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    label: "Fiches Techniques",
    description: "Courbes de perte de charge, schémas cotés, certifications CE et matériaux pour chaque référence.",
    count: "500+ fiches",
    href: "/ressources#fiches",
    accent: "bg-steel",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    label: "Guides de Sélection",
    description: "Comment dimensionner un purgeur vapeur ? Choisir un régulateur ? Nos ingénieurs répondent.",
    count: "8 guides",
    href: "/ressources#guides",
    accent: "bg-graphite",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    label: "Lexique Technique",
    description: "Clapet, soupape, purgeur flottant, ATEX, PED… définitions précises pour techniciens et acheteurs.",
    count: "80 termes",
    href: "/ressources#lexique",
    accent: "bg-navy-700",
  },
]

/* ── Page ─────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* <HeroSlider /> */}
      <HeroPhoto />
        {/* ↑ Swap to <HeroPhoto /> once real photos are in /public/images/ */}

        <ProductsCatalog />

        {/* ── STATS ── */}
        <section className="bg-graphite py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-white/8">
              {STATS.map(({ value, label }) => (
                <div key={label} className="px-8 py-4 text-center lg:text-left">
                  <p className="font-display font-black text-white text-5xl leading-none tabular-nums mb-2">
                    {value}
                  </p>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-sans leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRANDS ── */}
        <section className="bg-white py-16 lg:py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-2">
                  Nos Partenaires
                </p>
                <h2 className="font-display font-bold text-ink text-fluid-h2 uppercase tracking-tight">
                  Marques Représentées
                </h2>
                <p className="text-ink-soft text-sm font-sans mt-2">
                  Distributeur agréé — capacité SAV certifiée fabricant sur l&apos;ensemble du catalogue.
                </p>
              </div>
              <Link
                href="/marques"
                className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink hover:text-steel transition-colors whitespace-nowrap"
              >
                Toutes les marques →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {BRANDS.map(brand => (
                <Link
                  key={brand}
                  href={`/marques/${brand.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                  className="h-20 border border-border flex items-center justify-center px-3 text-[10px] font-bold text-ink-mid uppercase tracking-[0.15em] font-sans hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all text-center leading-tight"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── RESSOURCES TECHNIQUES ── */}
        <section className="bg-dim py-16 lg:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-2">
                  Hub Documentation
                </p>
                <h2 className="font-display font-bold text-ink text-fluid-h2 uppercase tracking-tight">
                  Ressources Techniques
                </h2>
                <p className="text-ink-soft text-sm font-sans mt-2 max-w-lg">
                  Catalogues, fiches techniques, guides de sélection et lexique — tout ce dont votre bureau d&apos;études a besoin, centralisé.
                </p>
              </div>
              <Link
                href="/ressources"
                className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink hover:text-steel transition-colors whitespace-nowrap shrink-0"
              >
                Accéder aux ressources →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RESSOURCES.map(r => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="group bg-white border border-border flex flex-col overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Top accent bar */}
                  <div className={`h-1 w-full ${r.accent} group-hover:opacity-80 transition-opacity`} />
                  <div className="flex flex-col gap-4 p-6 flex-1">
                    <div className="text-navy-800 group-hover:text-steel transition-colors">
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight mb-1.5">
                        {r.label}
                      </h3>
                      <p className="text-ink-soft text-xs font-sans leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft">
                        {r.count}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel group-hover:text-navy-800 transition-colors">
                        Accéder →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">

              {/* Left heading */}
              <div className="flex flex-col justify-start pt-1">
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  Expertise Technique
                </p>
                <h2 className="font-display font-bold text-ink text-fluid-h2 uppercase tracking-tight leading-none mb-6">
                  Nos Services
                </h2>
                <p className="text-ink-mid text-sm font-sans leading-relaxed max-w-xs">
                  Au-delà de la distribution — un partenaire technique pour vos équipes maintenance et bureaux d&apos;études.
                </p>
                {/* <Link
                  href="/services"
                  className="mt-8 inline-flex items-center gap-3 px-6 py-3.5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors self-start"
                >
                  Tous les services
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link> */}
              </div>

              {/* Right: service rows */}
              <div className="flex flex-col divide-y divide-border">
                {SERVICES.map(s => (
                  <div
                    key={s.no}
      
                    className="group flex items-start gap-6 py-8 first:pt-0 last:pb-0 hover:bg-dim/60 -mx-6 px-6 transition-colors"
                  >
                    <span className="font-display font-black text-ink/20 text-3xl leading-none shrink-0 mt-1 group-hover:text-steel transition-colors">
                      {s.no}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-2">
                        {s.title}
                      </h3>
                      <p className="text-ink-mid text-sm font-sans leading-relaxed">{s.body}</p>
                    </div>
                    {/* <svg
                      className="w-4 h-4 text-ink/25 group-hover:text-steel transition-colors shrink-0 mt-1.5"
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DIMENSIONNEMENT FORM ── */}
        {/* <section id="dimensionnement" className="bg-dim border-t border-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">

              
              <div className="flex flex-col justify-start pt-1">
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  Service 02
                </p>
                <h2 className="font-display font-bold text-ink text-fluid-h2 uppercase tracking-tight leading-none mb-6">
                  Étude &<br />Dimensionnement
                </h2>
                <p className="text-ink-mid text-sm font-sans leading-relaxed max-w-xs mb-6">
                  Transmettez vos paramètres de process. Notre équipe technique vous retourne une sélection justifiée, avec courbes et schémas cotés, sous 24 h ouvrées.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Sélection sur spec (DN, PN, fluide, T°)",
                    "Calculs de perte de charge",
                    "Documentation CCTP / appel d'offres",
                    "Schémas et dessins cotés",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-xs font-sans text-ink-mid">
                      <span className="w-1 h-1 bg-steel shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

             
              <div className="bg-white border border-border p-6 lg:p-8">
                <DimensionnementForm />
              </div>
            </div>
          </div>
        </section> */}

        {/* ── PARTENARIAT ── */}
        <section className="bg-dim border-t border-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-center">

              {/* Left copy */}
              <div>
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.35em] font-sans mb-4">Développement Commercial</p>
                <h2 className="font-display font-black text-ink uppercase text-fluid-h2 tracking-tight leading-none mb-6">
                  Travaillons<br />Ensemble
                </h2>
                <p className="text-ink-mid text-base font-sans leading-relaxed max-w-lg mb-10">
                  Distributeurs, bureaux d&apos;études, représentants commerciaux — rejoignez notre réseau spécialisé en régulation industrielle et développez vos marchés avec le soutien d&apos;une équipe technique de référence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/partenariat#contact"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy-900 text-white text-xs font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
                  >
                    Discuter d&apos;une opportunité
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link
                    href="/partenariat"
                    className="inline-flex items-center justify-center px-8 py-4 border border-border text-ink-mid text-xs font-bold uppercase tracking-[0.2em] font-sans hover:border-ink hover:text-ink transition-colors"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>

              {/* Right: 3 tracks */}
              <div className="flex flex-col gap-px bg-border">
                {[
                  {
                    title: "Réseau Distributeurs",
                    body: "Accédez à un catalogue multi-marques, un support technique dédié et des conditions adaptées à votre activité.",
                  },
                  {
                    title: "Projets Industrie",
                    body: "Collaborez sur des affaires complexes : dimensionnement, sourcing, assistance à la mise en œuvre.",
                  },
                  {
                    title: "Représentation Commerciale",
                    body: "Devenez représentant sur votre territoire ou secteur — accompagnement commercial et technique inclus.",
                  },
                ].map(({ title, body }) => (
                  <div key={title} className="bg-surface px-7 py-6 flex items-start gap-5">
                    <div className="w-1.5 h-1.5 bg-steel shrink-0 mt-2" />
                    <div>
                      <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight mb-1">{title}</h3>
                      <p className="text-ink-soft text-sm font-sans leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="bg-navy-900 py-16 lg:py-24"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.02) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight mb-4">
                Devis Technique Rapide
              </h2>
              <p className="text-white/55 text-base font-sans leading-relaxed max-w-xl">
                Fluide, pression, débit, DN — envoyez vos spécifications et recevez une offre personnalisée sous 12 heures ouvrées.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/devis"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-steel text-white font-bold uppercase tracking-[0.2em] text-xs font-sans hover:bg-steel-lt transition-colors"
              >
                Demander un Devis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs font-sans hover:bg-white/5 hover:border-white/40 transition-colors"
              >
                Contacter un Technicien
              </Link>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="bg-surface py-16 lg:py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-20">

              {/* Left: info */}
              <div>
                <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">
                  Nous Contacter
                </p>
                <h2 className="font-display font-bold text-ink text-fluid-h2 uppercase tracking-tight leading-none mb-8">
                  Parlons de<br />Votre Projet
                </h2>

                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink/40 mb-3">
                      Téléphone
                    </p>
                    <a href="tel:+33100000000" className="text-ink font-display font-bold text-xl uppercase tracking-tight hover:text-steel transition-colors">
                      +33 (0)1 XX XX XX XX
                    </a>
                    <p className="text-ink-soft text-xs font-sans mt-1">Lun–Ven, 8 h – 18 h</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink/40 mb-3">
                      Email
                    </p>
                    <a href="mailto:contact@logo.fr" className="text-ink font-sans text-sm hover:text-steel transition-colors">
                      contact@logo.fr
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink/40 mb-3">
                      Délai de réponse
                    </p>
                    <p className="text-ink text-sm font-sans">Sous 24 h ouvrées</p>
                  </div>

                  {/* Urgency callout */}
                  {/* <div className="bg-navy-900 px-5 py-4 mt-2">
                    <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans mb-1">
                      Urgence maintenance
                    </p>
                    <p className="text-white/55 text-xs font-sans leading-relaxed">
                      Pour les demandes urgentes de pièces de rechange ou de dépannage, appelez directement votre commercial.
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Right: form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-navy-950 text-white/45 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-steel flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M5 9l7 4 7-4M5 15l7 4 7-4M5 9V15M19 9v6" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-black text-white text-sm uppercase tracking-[0.2em] leading-none">LOGO</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-sans mt-0.5">Régulation &amp; Vapeur</p>
                </div>
              </div>
              <p className="text-sm font-sans leading-relaxed">
                Spécialiste en robinetterie industrielle, régulation vapeur et instrumentation depuis 30 ans.
              </p>
            </div>

            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] font-sans mb-4">Produits</h4>
              <ul className="space-y-2.5 text-sm font-sans">
                {[
                  { label: "Robinetterie Industrielle", slug: "robinetterie" },
                  { label: "Régulation Vapeur",         slug: "regulation-vapeur" },
                  { label: "Instrumentation",           slug: "instrumentation" },
                  { label: "Traitement des Fluides",    slug: "traitement-fluides" },
                  { label: "Automatisme",               slug: "automatisme" },
                ].map(({ label, slug }) => (
                  <li key={slug}>
                    <Link href={`/produits/famille/${slug}`} className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] font-sans mb-4">Services</h4>
              <ul className="space-y-2.5 text-sm font-sans">
                {["SAV & Dépannage", "Dimensionnement", "Audit Vapeur", "Ressources Techniques", "Espace Client Pro"].map(name => (
                  <li key={name}>
                    <Link href={`/services/${name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")}`} className="hover:text-white transition-colors">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] font-sans mb-4">Contact</h4>
              <ul className="space-y-3 text-sm font-sans">
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-steel" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" viewBox="0 0 24 24"><path d="M3 5h18v14H3zM3 5l9 8 9-8"/></svg>
                  <span>contact@logo.fr</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-steel" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <span>+33 (0)1 XX XX XX XX</span>
                </li>
                <li className="pt-2">
                  <Link href="/devis" className="inline-flex items-center gap-2 px-5 py-3 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors">
                    Demande de Devis
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs font-sans">
            <p>© 2025 LOGO. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
