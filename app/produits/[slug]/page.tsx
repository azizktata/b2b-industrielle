import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"

// Simulation de récupération de données (à remplacer par ton fetch réel)
async function getProductBySlug(slug: string) {
  // Ici, on simule une recherche dans ton objet PRODUCTS ou DB
  // Pour l'exemple, on retourne un produit type "Vanne de régulation"
  return {
    ref: "VRG-025-25",
    name: "Vanne de régulation 2 voies",
    family: "robinetterie",
    brand: "Samson",
    tag: "Stock",
    description: "Vanne de régulation haute performance conçue pour le contrôle précis des fluides neutres ou agressifs. Architecture modulaire permettant l'adaptation de différents servomoteurs pneumatiques ou électriques.",
    specs: {
      "Diamètre Nominal": "DN 25",
      "Pression Nominale": "PN 25",
      "Matériau Corps": "Inox 316L (1.4404)",
      "Température Max": "+220 °C",
      "Raccordement": "Brides RF",
      "Étanchéité": "Classe IV (Métal/Métal)",
    },
    features: [
      "Siège interchangeable sans démontage du corps",
      "Tige guidée haute précision pour éviter les vibrations",
      "Option garniture d'étanchéité autoréglable",
      "Conformité DESP 2014/68/UE",
    ]
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  return (
    <>
      <Header />
      <main className="bg-surface min-h-screen">
        
        {/* ── BREADCRUMBS & BACKGROUND HEADER ── */}
        <section className="relative bg-navy-950 pt-12 pb-32 overflow-hidden">
          {/* Blueprint grid overlay - Cohérence avec la Hero */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: "linear-gradient(var(--navy-700) 1px, transparent 1px), linear-gradient(90deg, var(--navy-700) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 mb-8">
              <Link href="/" className="hover:text-white/60">Accueil</Link>
              <span>/</span>
              <Link href="/produits" className="hover:text-white/60">Produits</Link>
              <span>/</span>
              <span className="text-steel-lt uppercase">{product.family}</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-steel/20 border border-steel/30 text-steel-lt text-[10px] font-bold uppercase tracking-widest mb-4">
                  {product.brand} • Réf. {product.ref}
                </span>
                <h1 className="font-display font-black text-white uppercase text-4xl lg:text-6xl tracking-tighter leading-none">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-3">
                <Link href={`/devis?ref=${product.ref}`} className="px-8 py-4 bg-steel text-white text-xs font-bold uppercase tracking-widest hover:bg-steel-lt transition-all">
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCT CONTENT ── */}
        <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Product Image & Quick Info */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white border border-border p-8 lg:p-12 shadow-sm relative group">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-steel/20" />
                <div className="aspect-[4/3] relative flex items-center justify-center bg-dim/30">
                  {/* Placeholder pour l'image produit réelle */}
                  <div className="text-ink-soft/20 font-display font-black text-8xl uppercase rotate-[-10deg] select-none">
                    {product.brand}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border p-8">
                <h3 className="text-ink font-display font-bold text-xl uppercase mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-steel" /> Description Technique
                </h3>
                <p className="text-ink-mid leading-relaxed font-sans">
                  {product.description}
                </p>
                <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink-mid">
                      <svg className="w-5 h-5 text-steel shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Technical Specs Table */}
            <div className="lg:col-span-5">
              <div className="bg-navy-900 text-white sticky top-8">
                <div className="p-8 border-b border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-steel-lt">Spécifications Générales</h3>
                </div>
                <div className="divide-y divide-white/5 font-sans">
                  {Object.entries(product.specs).map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center p-6 hover:bg-white/5 transition-colors">
                      <span className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">{label}</span>
                      <span className="text-sm font-mono font-medium text-white/90">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-8 bg-white/5 space-y-4">
                  <Link href="/contact" className="flex items-center justify-between group text-[10px] font-bold uppercase tracking-widest">
                    <span>Télécharger la fiche technique (PDF)</span>
                    <svg className="w-4 h-4 text-steel group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                  </Link>
                  <hr className="border-white/10" />
                  <p className="text-white/30 text-[9px] uppercase leading-tight italic">
                    Note : Pour des configurations spécifiques (ATEX, dégraissage oxygène), veuillez consulter notre bureau d'études.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── RELATED / SIMILAR ── */}
        <section className="bg-dim border-t border-border py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-8">Produits Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
              {/* On pourrait mapper ici les produits de la même famille */}
              <div className="h-32 border border-border bg-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                Liaison technique suggérée...
              </div>
              <div className="h-32 border border-border bg-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                Liaison technique suggérée...
              </div>
              <div className="h-32 border border-border bg-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                Liaison technique suggérée...
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}