"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

/*
  IMAGES REQUIRED — place in /public/images/:
    hero-vapeur.jpg        Réseau vapeur / chaufferie industrielle (paysage, haute résolution)
    hero-instrumentation.jpg  Tableau d'instrumentation / panel de contrôle
    hero-air.jpg           Station de traitement air comprimé industrielle
*/

const SLIDES = [
  {
    image: "/hero-1.jfif",
    eyebrow: "RÉSEAUX VAPEUR",
    headline: ["MAÎTRISEZ", "CHAQUE", "PRESSION"],
    accent: 2,
    body: "Purgeurs, détendeurs, séparateurs — distributeur agréé Spirax Sarco et Gestra, SAV certifié fabricant.",
    tag: "DN 15–100 · PN 6–40 · 250 °C max",
    cta: { label: "Voir Régulation Vapeur", href: "/produits/vapeur" },
  },
  {
    image: "/hero-2.jfif",
    eyebrow: "INSTRUMENTATION",
    headline: ["MESUREZ", "AVEC", "PRÉCISION"],
    accent: 2,
    body: "Manomètres, thermomètres, transmetteurs Wika et Vega — gamme complète pour toutes conditions industrielles.",
    tag: "0–600 bar · Cl. 0.5 · IP 67/68",
    cta: { label: "Voir Instrumentation", href: "/produits/instrumentation" },
  },
  {
    image: "/images/hero-air.jpg",
    eyebrow: "AIR COMPRIMÉ",
    headline: ["PROTÉGEZ", "VOS", "MACHINES"],
    accent: 2,
    body: "Filtration, séchage, régulation de pression. Solutions Beko, Parker et Norgren pour réseaux industriels.",
    tag: "ISO Cl. 1:2:1 · −40 °C PDP · 0.01 μm",
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
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* ── Overlays: gradient from bottom-navy + top vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to right, oklch(0.13 0.038 249 / 0.92) 0%, oklch(0.13 0.038 249 / 0.70) 55%, oklch(0.13 0.038 249 / 0.40) 100%)",
        }}
      />
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.018) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.018) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-20 items-center py-20 lg:py-0">

        {/* Left — text */}
        <div className="flex flex-col justify-center pt-8">
          {/* Eyebrow */}
          {/* <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-steel-lt" />
            <span className="text-steel-lt text-xs font-semibold uppercase tracking-[0.3em] font-sans">
              {slide.eyebrow}
            </span>
          </div> */}

          {/* Headline */}
          <h1 className="font-display font-black text-white uppercase text-fluid-hero leading-none mb-6 tracking-tight">
            {slide.headline[0]}
            <br />
            {slide.headline[1]}
            <br />
            <span className="text-steel">{slide.headline[2]}</span>
          </h1>

          {/* Body */}
          <p className="text-white/60 text-base max-w-xl mb-3 font-sans" style={{ lineHeight: "1.8" }}>
            {slide.body}
          </p>

          {/* Technical tag */}
          {/* <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-mono mb-10">
            {slide.tag}
          </p> */}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-steel text-white text-xs font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel-lt transition-colors"
            >
              {slide.cta.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/devis"
              className="inline-flex items-center gap-3 px-7 py-3.5 border border-white/25 text-white text-xs font-bold uppercase tracking-[0.2em] font-sans hover:border-white/45 hover:bg-white/5 transition-colors"
            >
              Demande de Devis
            </Link>
          </div>

          {/* Technical search */}
          <div className="mt-8">
            <form action="/recherche" method="get">
              <div className="flex">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/35" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="q"
                    placeholder="DN25 PN40  ·  purgeur vapeur  ·  Spirax…"
                    className="w-full bg-white/8 border border-white/18 text-white placeholder:text-white/30 text-sm font-sans pl-10 pr-4 py-3.5 focus:outline-none focus:border-steel/60 transition-colors"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="px-5 bg-navy-900/80 border border-white/18 border-l-0 text-white/50 hover:text-white transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
                          <div className="flex flex-wrap gap-2 items-center mt-2">
                {BRANDS.map(brand => (
                  <Link
                    key={brand}
                    href={`/marques/${brand.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    className="px-3.5 py-2 border border-white/15 text-white/55 text-[10px] font-bold uppercase tracking-[0.15em] font-sans hover:border-steel hover:text-steel transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
                {/* <Link
                  href="/marques"
                  className="mt-2 px-3.5 py-2 text-white/30 text-[10px] uppercase tracking-[0.15em] font-sans hover:text-white/55 transition-colors"
                >
                  Toutes →
                </Link> */}
              </div>
            {/* <p className="text-white/22 text-[9px] uppercase tracking-[0.22em] font-sans mt-2">
              Référence · DN · PN · Marque · Application
            </p> */}
          </div>
        </div>

        {/* Right — stats panel */}
        <div className="hidden lg:flex flex-col gap-px bg-white/8">
          {[
            { k: "Années d'expertise", v: "35+" },
            { k: "Références en stock", v: "2 500+" },
            { k: "Délai de devis", v: "< 12 h" },
            { k: "SAV certifié", v: "100%" },
          ].map(({ k, v }) => (
            <div key={k} className="bg-navy-950/60 backdrop-blur-sm px-7 py-6">
              <p className="text-white/35 text-[10px] uppercase tracking-[0.25em] font-sans mb-2">{k}</p>
              <p className="text-white font-display font-bold text-3xl tracking-tight">{v}</p>
            </div>
          ))}
          <div className="bg-steel/15 backdrop-blur-sm px-7 py-4 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 bg-steel-lt shrink-0" />
            <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-sans">
              Distributeur Agréé — SAV Certifié Fabricant
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">


            {/* Slide indicators */}
            <div className="flex items-center gap-5 ml-auto">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => restart(i)}
                  className={`flex flex-col items-start gap-1.5 transition-opacity ${active === i ? "opacity-100" : "opacity-30 hover:opacity-55"}`}
                >
                  <span className="text-white text-[10px] uppercase tracking-[0.2em] font-sans">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative w-14 h-px bg-white/25 overflow-hidden block">
                    {active === i && (
                      <span
                        className="absolute inset-y-0 left-0 bg-steel-lt"
                        style={{ width: `${progress}%`, transition: `width ${TICK}ms linear` }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
