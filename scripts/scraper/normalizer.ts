/**
 * Normalizer
 *
 * Receives raw scraped data from each brand scraper and maps it to the
 * final Product / Guide / Catalogue schema used by Next.js.
 *
 * Responsibilities:
 *  - Detect famille from product name
 *  - Detect application tags
 *  - Normalise PDF type labels
 *  - Generate deterministic IDs (slug)
 *  - Deduplicate by PDF URL across brands
 *  - Drop products with no classifiable famille
 */
import type {
  RawProduct,
  RawGuide,
  RawCatalogue,
  Product,
  Guide,
  Catalogue,
  FamilleKey,
} from "./types.js";
import {
  detectFamille,
  detectApplications,
  detectPdfType,
  slugify,
} from "./families.js";

// Some scrapers (e.g. Sectoriel) know the famille from the URL and pass it
// through as _famille to skip keyword detection.
type RawProductWithHint = RawProduct & { _famille?: FamilleKey }

// ─── Products ─────────────────────────────────────────────────────────────────

export function normaliseProducts(raws: RawProduct[]): Product[] {
  const seen = new Set<string>(); // dedup by id
  const results: Product[] = [];

  for (const raw of raws) {
    const hint = (raw as RawProductWithHint)._famille
    const searchText = `${raw.name} ${raw.shortDescription ?? ""}`;
    const famille: FamilleKey | null = hint ?? detectFamille(searchText)

    // Drop anything we can't classify — keeps the catalogue clean
    if (!famille) {
      console.warn(
        `[normalizer] No famille match for "${raw.name}" (${raw.marque}) — skipped`,
      );
      continue;
    }

    const id = slugify(`${raw.marque}-${raw.name}`);

    if (seen.has(id)) {
      // Merge PDFs into the existing entry instead of duplicating
      const existing = results.find((p) => p.id === id)!;
      for (const pdf of raw.pdfs) {
        const pdfUrl = pdf.url;
        if (!existing.pdfs.some((p) => p.url === pdfUrl)) {
          existing.pdfs.push({
            label: pdf.label,
            url: pdfUrl,
            type: detectPdfType(pdf.label),
          });
        }
      }
      continue;
    }

    seen.add(id);
    results.push({
      id,
      name: raw.name,
      marque: raw.marque,
      famille,
      application: detectApplications(searchText),
      shortDescription: raw.shortDescription,
      pdfs: raw.pdfs.map((pdf) => ({
        label: pdf.label,
        url: pdf.url,
        type: detectPdfType(pdf.label),
      })),
      sourceUrl: raw.sourceUrl,
      scrapedAt: new Date().toISOString(),
    });
  }

  return results;
}

// ─── Guides ───────────────────────────────────────────────────────────────────
 
export function normaliseGuides(raws: RawGuide[]): Guide[] {
  const seen = new Set<string>()
  const results: Guide[] = []
 
  for (const raw of raws) {
    const id = slugify(`guide-${raw.marque}-${raw.name}`)
    if (seen.has(id)) continue
    seen.add(id)
 
    results.push({
      id,
      name: raw.name,
      marque: raw.marque,
      famille: detectFamille(raw.name),
      pdfUrl: raw.pdfUrl,
      sourceUrl: raw.sourceUrl,
      scrapedAt: new Date().toISOString(),
    })
  }
 
  return results
}
 
// ─── Catalogues ───────────────────────────────────────────────────────────────
 
export function normaliseCatalogues(raws: RawCatalogue[]): Catalogue[] {
  const seen = new Set<string>()
  const results: Catalogue[] = []
 
  for (const raw of raws) {
    const id = slugify(`catalogue-${raw.marque}-${raw.name}`)
    if (seen.has(id)) continue
    seen.add(id)
 
    results.push({
      id,
      name: raw.name,
      marque: raw.marque,
      pdfUrl: raw.pdfUrl,
      sourceUrl: raw.sourceUrl,
      scrapedAt: new Date().toISOString(),
    })
  }
 
  return results
}