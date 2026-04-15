"use client"

import { useState } from "react"
import Link from "next/link"

const NAV = [
  { label: "Produits",   href: "/produits" },
  { label: "Marques",    href: "/marques" },
  { label: "Ressources", href: "/ressources" },
  { label: "Services",   href: "/services" },
  // { label: "Contact",    href: "/contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950 border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-steel flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <path d="M5 9l7 4 7-4M5 15l7 4 7-4M5 9V15M19 9v6" />
            </svg>
          </div>
          <div>
            <p className="font-display font-black text-white text-sm uppercase tracking-[0.2em] leading-none">
              LOGO
            </p>
            <p className="text-white/35 text-[9px] uppercase tracking-[0.25em] font-sans leading-none mt-0.5">
              Régulation &amp; Vapeur
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center flex-1">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-4 h-16 flex items-center text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-white/55 hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            href="/recherche"
            className="w-9 h-9 flex items-center justify-center text-white/45 hover:text-white transition-colors"
            aria-label="Recherche technique"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
          <Link
            href="/devis"
            className="flex items-center gap-2 px-5 py-2.5 bg-steel text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Demande de Devis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden ml-auto p-2 text-white/55 hover:text-white"
          aria-label={open ? "Fermer" : "Menu"}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-950 border-t border-white/8">
          <nav className="px-4 py-3 flex flex-col">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-4 text-xs font-bold uppercase tracking-[0.25em] font-sans text-white/55 hover:text-white border-b border-white/5 last:border-0"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/devis"
              onClick={() => setOpen(false)}
              className="mt-4 mb-2 py-4 bg-steel text-white text-xs font-bold uppercase tracking-[0.2em] font-sans text-center hover:bg-steel-lt transition-colors"
            >
              Demande de Devis
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
