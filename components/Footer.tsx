import Link from 'next/link'
import { BRANDS } from '@/lib/brands'

export default function Footer() {
  return (
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
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] font-sans mb-4">Marques</h4>
              <ul className="space-y-2.5 text-sm font-sans">
                {BRANDS.map(({ id, name }) => (
                  <li key={id}>
                    <Link href={`/marques/${id}`} className="hover:text-white transition-colors">
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
  )
}
