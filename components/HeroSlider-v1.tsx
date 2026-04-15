"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"

/* ── Slide data ─────────────────────────────────────────── */
const SLIDES = [
  {
    eyebrow: "RÉSEAUX VAPEUR",
    lines: ["MAÎTRISEZ", "CHAQUE", "PRESSION"],
    body: "Purgeurs, détendeurs, séparateurs — distributeur agréé Spirax Sarco et Gestra, SAV certifié fabricant.",
    specs: [
      { k: "DN", v: "15 – 100" },
      { k: "PN", v: "6 – 40" },
      { k: "TEMP. MAX", v: "250 °C" },
      { k: "FLUIDE", v: "VAPEUR" },
    ],
    cta: { label: "Voir Régulation Vapeur", href: "/produits/vapeur" },
  },
  {
    eyebrow: "INSTRUMENTATION",
    lines: ["MESUREZ", "AVEC", "PRÉCISION"],
    body: "Manomètres, thermomètres, transmetteurs Wika et Vega — gamme complète pour toutes conditions industrielles.",
    specs: [
      { k: "PLAGE", v: "0 – 600 bar" },
      { k: "PRÉCISION", v: "Cl. 0.5" },
      { k: "PROTECTION", v: "IP 67/68" },
      { k: "GAMME", v: "WIKA / VEGA" },
    ],
    cta: { label: "Voir Instrumentation", href: "/produits/instrumentation" },
  },
  {
    eyebrow: "AIR COMPRIMÉ",
    lines: ["PROTÉGEZ", "VOS", "MACHINES"],
    body: "Filtration, séchage, régulation de pression. Solutions Beko, Parker et Norgren pour réseaux industriels.",
    specs: [
      { k: "ISO CLASS", v: "1:2:1" },
      { k: "POINT DE ROSÉE", v: "−40 °C" },
      { k: "FILTRATION", v: "0.01 μm" },
      { k: "DÉBIT MAX", v: "1000 Nm³/h" },
    ],
    cta: { label: "Voir Traitement Fluides", href: "/produits/fluides" },
  },
] as const

const BRANDS = ["Spirax Sarco", "Samson", "Gestra", "Wika", "Bürkert", "Parker", "Beko"]
const DURATION = 6000 // ms per slide
const TICK = 60      // ms per progress tick

/* ── SVG schematic panels ─────────────────────────────── */
function SteamNetworkSVG() {
  return (
    <svg viewBox="0 0 520 340" fill="none" className="w-full h-full opacity-80" aria-hidden>
      {/* grid */}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => <line key={`gv${i}`} x1={i*52} y1="0" x2={i*52} y2="340" stroke="white" strokeWidth="0.4" opacity="0.07"/>)}
      {[0,1,2,3,4,5,6].map(i => <line key={`gh${i}`} x1="0" y1={i*56} x2="520" y2={i*56} stroke="white" strokeWidth="0.4" opacity="0.07"/>)}
      {/* main steam header */}
      <line x1="20" y1="100" x2="500" y2="100" stroke="white" strokeWidth="4.5" opacity="0.9"/>
      {/* flow arrows */}
      <path d="M170 91 L190 100 L170 109" fill="white" opacity="0.7"/>
      <path d="M310 91 L330 100 L310 109" fill="white" opacity="0.7"/>
      {/* entry from left – main valve */}
      <polygon points="8,88 20,100 8,112" fill="white" opacity="0.8"/>
      <polygon points="32,88 20,100 32,112" fill="white" opacity="0.8"/>
      <line x1="20" y1="88" x2="20" y2="74" stroke="white" strokeWidth="2" opacity="0.6"/>
      {/* Branch 1 – x=140 */}
      <line x1="140" y1="100" x2="140" y2="270" stroke="white" strokeWidth="2.5" opacity="0.75"/>
      <polygon points="129,148 140,162 129,176" fill="white" opacity="0.8"/>
      <polygon points="151,148 140,162 151,176" fill="white" opacity="0.8"/>
      <line x1="140" y1="148" x2="140" y2="132" stroke="white" strokeWidth="1.5" opacity="0.55"/>
      <rect x="127" y="220" width="26" height="22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.75"/>
      <line x1="127" y1="220" x2="153" y2="242" stroke="white" strokeWidth="1" opacity="0.5"/>
      {/* Branch 2 – x=280 */}
      <line x1="280" y1="100" x2="280" y2="270" stroke="white" strokeWidth="2.5" opacity="0.75"/>
      <polygon points="269,148 280,162 269,176" fill="white" opacity="0.8"/>
      <polygon points="291,148 280,162 291,176" fill="white" opacity="0.8"/>
      <line x1="280" y1="148" x2="280" y2="132" stroke="white" strokeWidth="1.5" opacity="0.55"/>
      <rect x="267" y="220" width="26" height="22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.75"/>
      <line x1="267" y1="220" x2="293" y2="242" stroke="white" strokeWidth="1" opacity="0.5"/>
      {/* Branch 3 – x=420 */}
      <line x1="420" y1="100" x2="420" y2="270" stroke="white" strokeWidth="2.5" opacity="0.75"/>
      <polygon points="409,148 420,162 409,176" fill="white" opacity="0.8"/>
      <polygon points="431,148 420,162 431,176" fill="white" opacity="0.8"/>
      <line x1="420" y1="148" x2="420" y2="132" stroke="white" strokeWidth="1.5" opacity="0.55"/>
      <rect x="407" y="220" width="26" height="22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.75"/>
      <line x1="407" y1="220" x2="433" y2="242" stroke="white" strokeWidth="1" opacity="0.5"/>
      {/* condensate return */}
      <line x1="140" y1="270" x2="420" y2="270" stroke="white" strokeWidth="2" opacity="0.3" strokeDasharray="10 5"/>
      {/* gauges above header */}
      {[140,280,420].map(cx => (
        <g key={cx}>
          <line x1={cx} y1="100" x2={cx} y2="70" stroke="white" strokeWidth="1.5" opacity="0.5"/>
          <circle cx={cx} cy="52" r="22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.65"/>
          <line x1={cx} y1="52" x2={cx + 10} y2="42" stroke="white" strokeWidth="1.5" opacity="0.85"/>
          <circle cx={cx} cy="52" r="3" fill="white" opacity="0.8"/>
          <text x={cx} y="86" fill="white" fontSize="8" textAnchor="middle" fontFamily="monospace" opacity="0.4">PT</text>
        </g>
      ))}
      {/* labels */}
      <text x="260" y="92" fill="white" fontSize="7.5" textAnchor="middle" fontFamily="monospace" opacity="0.3" letterSpacing="3">DN 100 — PN 16 — VAPEUR HP</text>
      <text x="140" y="305" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.35">PURGEUR</text>
      <text x="280" y="305" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.35">PURGEUR</text>
      <text x="420" y="305" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.35">PURGEUR</text>
      <text x="280" y="330" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.2" letterSpacing="3">RETOUR CONDENSATS</text>
    </svg>
  )
}

function InstrumentationSVG() {
  const cx = 260, cy = 170, R = 125
  const START_DEG = 140
  const SPAN_DEG = 260
  const toPolar = (deg: number, r: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  })
  const ticks = Array.from({ length: 17 }, (_, i) => i)
  return (
    <svg viewBox="0 0 520 340" fill="none" className="w-full h-full opacity-80" aria-hidden>
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => <line key={`gv${i}`} x1={i*52} y1="0" x2={i*52} y2="340" stroke="white" strokeWidth="0.4" opacity="0.07"/>)}
      {[0,1,2,3,4,5,6].map(i => <line key={`gh${i}`} x1="0" y1={i*56} x2="520" y2={i*56} stroke="white" strokeWidth="0.4" opacity="0.07"/>)}
      {/* outer rings */}
      <circle cx={cx} cy={cy} r={R + 16} stroke="white" strokeWidth="1" fill="none" opacity="0.18"/>
      <circle cx={cx} cy={cy} r={R} stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* ticks */}
      {ticks.map(i => {
        const deg = START_DEG + (i / 16) * SPAN_DEG
        const major = i % 4 === 0
        const inner = toPolar(deg, major ? R - 14 : R - 8)
        const outer = toPolar(deg, R - 2)
        return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="white" strokeWidth={major ? 2 : 1} opacity={major ? 0.9 : 0.5}/>
      })}
      {/* numeric labels */}
      {[0, 4, 8, 12, 16].map(val => {
        const pt = toPolar(START_DEG + (val / 16) * SPAN_DEG, R - 28)
        return <text key={val} x={pt.x} y={pt.y + 4} fill="white" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold" opacity="0.8">{val}</text>
      })}
      {/* BAR label */}
      <text x={cx} y={cy + 42} fill="white" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.5" letterSpacing="3">BAR</text>
      {/* needle at 8 bar */}
      {(() => {
        const pt = toPolar(START_DEG + (8 / 16) * SPAN_DEG, R - 22)
        return <>
          <line x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="white" strokeWidth="2.5" opacity="0.95"/>
          <circle cx={cx} cy={cy} r="7" stroke="white" strokeWidth="2" fill="none" opacity="0.9"/>
          <circle cx={cx} cy={cy} r="3" fill="white" opacity="0.9"/>
        </>
      })()}
      {/* branding inside */}
      <text x={cx} y={cy + 70} fill="white" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.35" letterSpacing="4">TECHNIFLUX</text>
      <text x={cx} y={cy + 84} fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.25" letterSpacing="2">PN 16 — EN 837-1</text>
      {/* process connection at bottom */}
      <rect x={cx - 24} y={cy + R + 4} width="48" height="9" stroke="white" strokeWidth="1" fill="none" opacity="0.4"/>
      <line x1={cx} y1={cy + R + 13} x2={cx} y2={cy + R + 32} stroke="white" strokeWidth="2" opacity="0.35"/>
      {/* secondary instruments flanking */}
      {[80, 440].map(scx => (
        <g key={scx}>
          <circle cx={scx} cy={70} r="36" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
          <line x1={scx} y1="70" x2={scx + (scx < 260 ? 12 : -12)} y2="55" stroke="white" strokeWidth="1.5" opacity="0.5"/>
          <circle cx={scx} cy={70} r="3" fill="white" opacity="0.4"/>
          <text x={scx} y="120" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.3">{scx < 260 ? "TT-01" : "FT-01"}</text>
        </g>
      ))}
      {/* pipe connections */}
      <line x1="60" y1={cy} x2={cx - R} y2={cy} stroke="white" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.35"/>
      <line x1={cx + R} y1={cy} x2="460" y2={cy} stroke="white" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.35"/>
    </svg>
  )
}

function AirComprimeSVG() {
  return (
    <svg viewBox="0 0 520 340" fill="none" className="w-full h-full opacity-80" aria-hidden>
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => <line key={`gv${i}`} x1={i*52} y1="0" x2={i*52} y2="340" stroke="white" strokeWidth="0.4" opacity="0.07"/>)}
      {[0,1,2,3,4,5,6].map(i => <line key={`gh${i}`} x1="0" y1={i*56} x2="520" y2={i*56} stroke="white" strokeWidth="0.4" opacity="0.07"/>)}
      {/* horizontal main air line at y=170 */}
      <line x1="10" y1="170" x2="55" y2="170" stroke="white" strokeWidth="3.5" opacity="0.85"/>
      {/* FILTER block */}
      <rect x="55" y="128" width="82" height="84" stroke="white" strokeWidth="2" fill="none" opacity="0.85"/>
      <polygon points="70,148 121,148 96,198" stroke="white" strokeWidth="1.5" fill="none" opacity="0.65"/>
      <line x1="91" y1="198" x2="101" y2="198" stroke="white" strokeWidth="2" opacity="0.6"/>
      <text x="96" y="225" fill="white" fontSize="8.5" textAnchor="middle" fontFamily="monospace" opacity="0.55" letterSpacing="1">FILTRE</text>
      <text x="96" y="237" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.3">5 μm</text>
      <line x1="137" y1="170" x2="168" y2="170" stroke="white" strokeWidth="3.5" opacity="0.85"/>
      {/* DRYER block */}
      <rect x="168" y="122" width="90" height="96" stroke="white" strokeWidth="2" fill="none" opacity="0.85"/>
      <path d="M182 143 C194 156 222 143 234 156" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M182 164 C194 177 222 164 234 177" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M182 185 C194 198 222 185 234 198" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <text x="213" y="233" fill="white" fontSize="8.5" textAnchor="middle" fontFamily="monospace" opacity="0.55" letterSpacing="1">SÉCHEUR</text>
      <text x="213" y="245" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.3">−40°C PDP</text>
      <line x1="258" y1="170" x2="290" y2="170" stroke="white" strokeWidth="3.5" opacity="0.85"/>
      {/* REGULATOR (circle) */}
      <circle cx="322" cy="170" r="38" stroke="white" strokeWidth="2" fill="none" opacity="0.85"/>
      <path d="M302 170 L311 159 L311 181 L322 170 L333 159 L333 181 L342 170" stroke="white" strokeWidth="1.5" fill="none" opacity="0.55"/>
      <rect x="310" y="124" width="24" height="9" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <line x1="322" y1="133" x2="322" y2="137" stroke="white" strokeWidth="2" opacity="0.65"/>
      <text x="322" y="226" fill="white" fontSize="8.5" textAnchor="middle" fontFamily="monospace" opacity="0.55" letterSpacing="1">RÉGULATEUR</text>
      <text x="322" y="238" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.3">0 – 10 BAR</text>
      <line x1="360" y1="170" x2="394" y2="170" stroke="white" strokeWidth="3.5" opacity="0.85"/>
      {/* GAUGE on outlet */}
      <line x1="406" y1="135" x2="406" y2="170" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="406" cy="116" r="26" stroke="white" strokeWidth="1.5" fill="none" opacity="0.65"/>
      <line x1="406" y1="116" x2="415" y2="105" stroke="white" strokeWidth="1.5" opacity="0.85"/>
      <circle cx="406" cy="116" r="3" fill="white" opacity="0.8"/>
      {/* outlet + distribution */}
      <line x1="394" y1="170" x2="510" y2="170" stroke="white" strokeWidth="3.5" opacity="0.85"/>
      <line x1="450" y1="170" x2="450" y2="240" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="480" y1="170" x2="480" y2="260" stroke="white" strokeWidth="2" opacity="0.35"/>
      <line x1="510" y1="170" x2="510" y2="280" stroke="white" strokeWidth="2" opacity="0.2"/>
      {/* flow arrow */}
      <path d="M220 162 L240 170 L220 178" fill="white" opacity="0.6"/>
      {/* labels */}
      <text x="20" y="158" fill="white" fontSize="7" fontFamily="monospace" opacity="0.35">ENTRÉE</text>
      <text x="490" y="158" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.35">SORTIE</text>
      <text x="260" y="300" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity="0.2" letterSpacing="3">STATION DE TRAITEMENT — AIR COMPRIMÉ INDUSTRIEL</text>
    </svg>
  )
}

const SVGS = [SteamNetworkSVG, InstrumentationSVG, AirComprimeSVG]

/* ── Component ─────────────────────────────────────────── */
export default function HeroSlider() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progRef = useRef<NodeJS.Timeout | null>(null)

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
  const SlideSVG = SVGS[active]

  return (
    <section
      className="relative bg-navy-900 overflow-hidden flex flex-col"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.022) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.022) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center py-20 lg:py-0">

        {/* Left — text */}
        <div className="flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-steel-lt" />
            <span className="text-steel-lt text-xs font-semibold uppercase tracking-[0.3em] font-sans">
              {slide.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-white uppercase text-fluid-hero leading-none mb-6 tracking-tight">
            {slide.lines[0]}
            <br />
            {slide.lines[1]}
            <br />
            <span className="text-steel">{slide.lines[2]}</span>
          </h1>

          {/* Body */}
          <p className="text-white/55 text-base leading-[1.75] max-w-xl mb-10 font-sans" style={{ lineHeight: "1.8" }}>
            {slide.body}
          </p>

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
              className="inline-flex items-center gap-3 px-7 py-3.5 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] font-sans hover:border-white/40 hover:bg-white/5 transition-colors"
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
                    className="w-full bg-white/6 border border-white/14 text-white placeholder:text-white/30 text-sm font-sans pl-10 pr-4 py-3.5 focus:outline-none focus:border-steel/60 transition-colors"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="px-5 bg-navy-800 border border-white/14 border-l-0 text-white/50 hover:text-white hover:bg-navy-700 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-white/22 text-[9px] uppercase tracking-[0.22em] font-sans mt-2">
              Référence · DN · PN · Marque · Application
            </p>
          </div>
        </div>

        {/* Right — spec panel + SVG illustration */}
        <div className="hidden lg:flex flex-col gap-0 w-[420px] xl:w-[480px]">

          {/* SVG schematic */}
          <div className="h-[220px] w-full">
            <SlideSVG />
          </div>

          {/* Spec grid */}
          <div className="grid grid-cols-2 gap-px bg-white/8">
            {slide.specs.map((s) => (
              <div key={s.k} className="bg-navy-900 px-6 py-5">
                <p className="text-white/35 text-[10px] uppercase tracking-[0.25em] font-sans mb-2">{s.k}</p>
                <p className="text-white font-display font-bold text-xl tracking-tight">{s.v}</p>
              </div>
            ))}
          </div>

          {/* Trust tag */}
          <div className="border border-white/10 px-5 py-3 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 bg-steel-lt shrink-0" />
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-sans">
              Distributeur Agréé — SAV Certifié Fabricant
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar: brand search + slide indicators ── */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">

            {/* Brand search */}
            <div className="flex-1 min-w-0">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans mb-3">
                Recherche rapide par marque
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                {BRANDS.map(brand => (
                  <Link
                    key={brand}
                    href={`/marques/${brand.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    className="px-3.5 py-2 border border-white/15 text-white/55 text-[10px] font-bold uppercase tracking-[0.15em] font-sans hover:border-steel hover:text-steel transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
                <Link
                  href="/marques"
                  className="px-3.5 py-2 text-white/30 text-[10px] uppercase tracking-[0.15em] font-sans hover:text-white/55 transition-colors"
                >
                  Toutes →
                </Link>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-5 shrink-0">
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
