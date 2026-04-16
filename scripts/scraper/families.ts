import type { FamilleKey, ApplicationKey, PdfType } from "./types.js"
 
// ─── Famille keyword rules ────────────────────────────────────────────────────
// Evaluated top-to-bottom; first match wins.
// Add more keywords here as you discover product names during scraping.

export const FAMILLE_RULES: { famille: FamilleKey; keywords: RegExp }[] = [
  {
    famille: "regulation-vapeur",
    // Must come before "robinetterie" — purgeurs/détendeurs are also "vannes" but
    // are more specifically régulation vapeur.
    keywords:
      /purgeur|purge|steam.?trap|séparateur|separateur|détendeur|detendeur|régulateur.?(de.?)?(pression|température|vapeur)|regulateur|pressure.?reducing|réducteur.?de.?pression/i,
  },
  {
    famille: "robinetterie",
    keywords:
      /vanne|valve|soupape|robinet|clapet|papillon|bille|opercule|guillotine|manchon|globe|ball.?valve|gate.?valve|butterfly/i,
  },
  {
    famille: "instrumentation",
    keywords:
      /manomètre|manometre|thermomètre|thermometre|pressostat|pressure.?switch|thermostat|capteur|transmetteur|transmitter|indicateur|gauge|jauge|niveau|débitmètre|debitmetre|flow.?meter/i,
  },
  {
    famille: "traitement-fluides",
    keywords:
      /filtre|filter|filtration|sécheur|secheur|dryer|air.?comprimé|air.?comprime|compressed.?air|déshydrateur|deshydrateur|séparateur.?d.?eau/i,
  },
  {
    famille: "automatisme",
    keywords:
      /électrovanne|electrovanne|solenoid|motorisée|motorisee|actuator|servomoteur|pneumatique|pneumatic|vanne.?motorisée|vanne.?pneumatique/i,
  },
]
  // Robinetterie Industrielle : Vannes · Soupapes · Clapets
// Régulation Vapeur: Purgeurs · Détendeurs · Séparateurs
// Instrumentation: Capteurs · Indicateurs · Contrôleurs . Manomètres · Thermomètres · Pressostats
// Traitement des Fluides: Filtres · Distributeurs · Réservoirs . Filtres · Sécheurs · Air Comprimé
// Automatisme:  Électrovannes · Vannes Motorisées

// ─── Application keyword rules ────────────────────────────────────────────────
 
export const APPLICATION_RULES: { application: ApplicationKey; keywords: RegExp }[] = [
  {
    application: "reseau-vapeur",
    keywords: /vapeur|steam|condensat|condensate|purgeur|purge/i,
  },
  {
    application: "air-comprime",
    keywords: /air.?comprimé|air.?comprime|compressed.?air|pneumatique|pneumatic/i,
  },
  {
    application: "eau-surchauffee",
    keywords: /eau.?surchauffée|eau.?surchauffee|surchauffé|caloporteur|hot.?water|fluide.?caloporteur/i,
  },
]

// ─── PDF type label mapping ───────────────────────────────────────────────────
// Keys are normalised (trimmed, uppercased) label prefixes from the source site.
 
export const PDF_TYPE_MAP: { pattern: RegExp; type: PdfType }[] = [
  { pattern: /fiche.?technique|information.?sheet|informations.?techniques|datenblatt/i, type: "fiche-technique" },
  { pattern: /dessin|assembly|drawing|assemblage/i,                                       type: "dessin" },
  { pattern: /installation|maintenance|mise.?en.?service|notice|instruction/i,            type: "installation" },
  { pattern: /catalogue|catalog/i,                                                        type: "catalogue" },
  { pattern: /.*/, type: "fiche-technique" }, // default to "fiche-technique" if no other pattern matches
]

// ─── Helper functions ─────────────────────────────────────────────────────────
 
export function detectFamille(text: string): FamilleKey | null {
  for (const rule of FAMILLE_RULES) {
    if (rule.keywords.test(text)) return rule.famille
  }
  return null
}
 
export function detectApplications(text: string): ApplicationKey[] {
  return APPLICATION_RULES.filter((r) => r.keywords.test(text)).map((r) => r.application)
}
 
export function detectPdfType(label: string): PdfType {
  for (const rule of PDF_TYPE_MAP) {
    if (rule.pattern.test(label)) return rule.type
  }
  return "other"
}
 
/** Convert a free-form name into a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}