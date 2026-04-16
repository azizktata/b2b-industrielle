       
// ─── Taxonomy ────────────────────────────────────────────────────────────────
export type MarqueKey =
  | "SAMSON"
  | "SECTORIEL"
  | "MIVAL"
  | "iFm"
  | "sferaco"
  | "ADCA"
 
export type FamilleKey =
  | "robinetterie"
  | "regulation-vapeur"
  | "instrumentation"
  | "traitement-fluides"
  | "automatisme"
 
export type ApplicationKey =
  | "reseau-vapeur"
  | "air-comprime"
  | "eau-surchauffee"
 
export type PdfType =
  | "fiche-technique"
  | "catalogue"
  | "installation"
  | "dessin"
  | "other"


export interface ProductPdf {
  label: string      // e.g. "FICHE TECHNIQUE", "DESSIN D'ASSEMBLAGE"
  url: string
  type: PdfType
}
 
export interface Product {
  id: string
  name: string
  marque: MarqueKey
  famille: FamilleKey | null   // null = couldn't classify → filtered out before write
  application: ApplicationKey[]
  shortDescription?: string
  pdfs: ProductPdf[]
  sourceUrl: string
  scrapedAt: string
}
 
export interface Guide {
  id: string
  name: string
  marque: MarqueKey
  famille: FamilleKey | null
  pdfUrl: string
  sourceUrl: string
  scrapedAt: string
}
 
export interface Catalogue {
  id: string
  name: string
  marque: MarqueKey
  pdfUrl: string
  sourceUrl: string
  scrapedAt: string
}
// ─── Raw scraper output (before normalisation) ────────────────────────────────
 
export interface RawProduct {
  name: string
  marque: MarqueKey
  pdfs: { label: string; url: string }[]
  shortDescription?: string
  sourceUrl: string
}
 
export interface RawGuide {
  name: string
  marque: MarqueKey
  pdfUrl: string
  sourceUrl: string
}
 
export interface RawCatalogue {
  name: string
  marque: MarqueKey
  pdfUrl: string
  sourceUrl: string
}
 