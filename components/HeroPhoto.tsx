"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

const SLIDES = [
  {
    image: "/hero-1.jfif",
    eyebrow: "RÉSEAUX VAPEUR",
    headline: ["MAÎTRISEZ", "CHAQUE", "PRESSION"],
    body: "Purgeurs, détendeurs, séparateurs — distributeur agréé Spirax Sarco et Gestra, SAV certifié fabricant.",
    cta: { label: "Voir Régulation Vapeur", href: "/produits/vapeur" },
  },
  {
    image: "/hero-2.jfif",
    eyebrow: "INSTRUMENTATION",
    headline: ["MESUREZ", "AVEC", "PRÉCISION"],
    body: "Manomètres, thermomètres, transmetteurs Wika et Vega — gamme complète pour toutes conditions industrielles.",
    cta: { label: "Voir Instrumentation", href: "/produits/instrumentation" },
  },
  {
    image: "/hero-air.jpg",
    eyebrow: "AIR COMPRIMÉ",
    headline: ["PROTÉGEZ", "VOS", "MACHINES"],
    body: "Filtration, séchage, régulation de pression. Solutions Beko, Parker et Norgren pour réseaux industriels.",
    cta: { label: "Voir Traitement Fluides", href: "/produits/fluides" },
  },
] as const

const BRANDS = ["Spirax Sarco", "Samson", "Gestra", "Wika", "Bürkert", "Parker", "Beko"]
const DURATION = 7000
const TICK = 60

export default function HeroPhoto() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const restart = useCallback((index: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (progRef.current) clearInterval(progRef.current)
    setActive(index)
    setProgress(0)
    progRef.current = setInterval(() => {
      setProgress(p => Math.min(p + 100 / (DURATION / TICK), 100))
    }, TICK)
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % SLIDES.length
        setProgress(0)
        return next
      })
    }, DURATION)
  }, [])

  useEffect(() => {
    restart(0)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (progRef.current) clearInterval(progRef.current)
    }
  }, [restart])

  const slide = SLIDES[active]

  return (
    <section
      className="relative bg-navy-950 overflow-hidden flex flex-col"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* ── Background image with crossfade ── */}
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
        </div>
      ))}

      {/* ── Overlays ── */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, oklch(0.13 0.038 249 / 0.95) 0%, oklch(0.13 0.038 249 / 0.75) 50%, oklch(0.13 0.038 249 / 0.4) 100%)" }}
      />
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{ backgroundImage: "linear-gradient(var(--navy-700) 1px, transparent 1px), linear-gradient(90deg, var(--navy-700) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* ── Main content ── */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-center py-12">
        
        {/* Left — Text Content */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-12 h-px bg-steel-lt" />
            <span className="text-steel-lt text-xs font-bold uppercase tracking-[0.4em]">{slide.eyebrow}</span>
          </div>

          <h1 className="font-display font-black text-white uppercase text-fluid-hero leading-[0.9] mb-8 tracking-tighter">
            {slide.headline[0]}<br />
            {slide.headline[1]}<br />
            <span className="text-steel">{slide.headline[2]}</span>
          </h1>

          <p className="text-white/70 text-lg max-w-xl mb-10 font-sans leading-relaxed">
            {slide.body}
          </p>

          <div className="flex flex-wrap gap-5">
            <Link href={slide.cta.href} className="group inline-flex items-center gap-4 px-8 py-4 bg-steel text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-steel-lt transition-all">
              {slide.cta.label}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/devis" className="inline-flex items-center px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
              Demande de Devis
            </Link>
          </div>
        </div>

        {/* Right — Technical Brand Search Panel */}
        <div className="flex flex-col bg-navy-900/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/10 bg-white/5">
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-steel" /> RECHERCHE TECHNIQUE
            </h3>
            
            <form action="/recherche" method="get" className="space-y-4">
              <div className="relative">
                <input
                  type="search"
                  name="q"
                  placeholder="DN, PN, ou Référence..."
                  className="w-full bg-navy-950/50 border border-white/10 text-white placeholder:text-white/20 text-sm pl-4 pr-12 py-4 focus:outline-none focus:border-steel transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-4 text-steel hover:text-steel-lt transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                </button>
              </div>
            </form>
          </div>

          <div className="p-8">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Filtrer par Marque</p>
            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              {BRANDS.map(brand => (
                <Link
                  key={brand}
                  href={`/marques/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bg-navy-900/60 p-4 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:bg-steel hover:text-white transition-all text-center border-[0.5px] border-white/5"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto p-6 bg-steel/10 flex items-center gap-4">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border border-navy-950 bg-navy-900 flex items-center justify-center text-[8px] text-white font-bold">SAV</div>
                <div className="w-8 h-8 rounded-full border border-navy-950 bg-steel flex items-center justify-center text-[8px] text-white font-bold">ISO</div>
             </div>
             <p className="text-white/40 text-[9px] uppercase tracking-tighter leading-tight">
                Distributeur Officiel & <br/><span className="text-white/60">Centre de Maintenance Agréé</span>
             </p>
          </div>
        </div>
      </div>

      {/* ── Progress Indicators ── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-8 pb-10">
        <div className="flex items-center gap-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => restart(i)}
              className={`group flex items-center gap-3 transition-all ${active === i ? "opacity-100" : "opacity-30"}`}
            >
              <span className="text-white text-[10px] font-bold font-mono">0{i + 1}</span>
              <div className="relative w-16 h-[2px] bg-white/10 overflow-hidden">
                {active === i && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-steel transition-all linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}