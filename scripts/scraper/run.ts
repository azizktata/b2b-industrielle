/**
 * Scraper orchestrator
 *
 * Usage:
 *   npx tsx scripts/scraper/run.ts              # run all brands
 *   npx tsx scripts/scraper/run.ts samson        # run one brand
 *   npx tsx scripts/scraper/run.ts samson sferaco # run two brands
 *
 * Output:
 *   data/products.json
 *   data/guides.json
 *   data/catalogues.json
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { scrapeSamson } from "./scrapers/samson.js";
import { scrapeSectoriel } from "./scrapers/sectoriel.js";
import { scrapeMival } from "./scrapers/mival.js";
import { scrapeIfm }      from "./scrapers/ifm.js"
import { scrapeSferaco } from "./scrapers/sferaco.js";
import { scrapeAdca }     from "./scrapers/adca.js"

import {
  normaliseProducts,
  normaliseGuides,
  normaliseCatalogues,
} from "./normalizer.js";

import type {
  RawProduct,
  RawGuide,
  RawCatalogue,
  Product,
  Guide,
  Catalogue,
} from "./types.js";

// ─── Paths ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../../data");

// ─── Brand registry ──────────────────────────────────────────────────────────

type BrandResult = {
  products: RawProduct[];
  guides: RawGuide[];
  catalogues: RawCatalogue[];
};

const SCRAPERS: Record<string, () => Promise<BrandResult>> = {
  samson: async () => {
    const products = await scrapeSamson();
    return { products, guides: [], catalogues: [] };
  },

  // Uncomment and implement as you build each scraper:
  sectoriel: async () => {
    const products = await scrapeSectoriel();
    return { products, guides: [], catalogues: [] };
  },
  mival: async () => {
    const products = await scrapeMival();
    return { products, guides: [], catalogues: [] };
  },
  ifm: async () => {
    const products = await scrapeIfm()
    return { products, guides: [], catalogues: [] }
  },
  sferaco: async () => {
    const products = await scrapeSferaco();
    return { products, guides: [], catalogues: [] };
  },
  adca: async () => {
    const  products  = await scrapeAdca();
    return { products, guides: [], catalogues: [] };
  },
};

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Determine which brands to run from CLI args
  const args = process.argv.slice(2).map((a) => a.toLowerCase());
  const brandsToRun = args.length > 0 ? args : Object.keys(SCRAPERS);

  const unknown = brandsToRun.filter((b) => !SCRAPERS[b]);
  if (unknown.length > 0) {
    console.error(`Unknown brand(s): ${unknown.join(", ")}`);
    console.error(`Available: ${Object.keys(SCRAPERS).join(", ")}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  // Load existing data so we can merge (don't wipe other brands on partial runs)
  const existing = loadExisting();

  // Run selected scrapers
  const allRawProducts: RawProduct[] = [];
  const allRawGuides: RawGuide[] = [];
  const allRawCatalogues: RawCatalogue[] = [];

  for (const brand of brandsToRun) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`  Running scraper: ${brand.toUpperCase()}`);
    console.log(`${"─".repeat(60)}`);

    try {
      const result = await SCRAPERS[brand]();
      allRawProducts.push(...result.products);
      allRawGuides.push(...result.guides);
      allRawCatalogues.push(...result.catalogues);
    } catch (err) {
      console.error(`[${brand}] Scraper failed:`, err);
      // Continue with other brands — don't abort the whole run
    }
  }

  // Normalise fresh results
  const freshProducts = normaliseProducts(allRawProducts);
  const freshGuides = normaliseGuides(allRawGuides);
  const freshCatalogues = normaliseCatalogues(allRawCatalogues);

  // Merge with existing data from other brands (replace only matching IDs)
  const mergedProducts = mergeById(
    existing.products,
    freshProducts,
    brandsToRun,
  );
  const mergedGuides = mergeById(existing.guides, freshGuides, brandsToRun);
  const mergedCatalogues = mergeById(
    existing.catalogues,
    freshCatalogues,
    brandsToRun,
  );

  // Write output
  writeJson("products.json", mergedProducts);
  writeJson("guides.json", mergedGuides);
  writeJson("catalogues.json", mergedCatalogues);

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("  Scrape complete");
  console.log("═".repeat(60));
  console.log(`  Products  : ${mergedProducts.length}`);
  console.log(`  Guides    : ${mergedGuides.length}`);
  console.log(`  Catalogues: ${mergedCatalogues.length}`);
  console.log(`  Output    : ${DATA_DIR}/`);
  console.log("═".repeat(60) + "\n");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadExisting(): {
  products: Product[];
  guides: Guide[];
  catalogues: Catalogue[];
} {
  const load = <T>(file: string): T[] => {
    const path = resolve(DATA_DIR, file);
    if (!existsSync(path)) return [];
    try {
      return JSON.parse(readFileSync(path, "utf-8")) as T[];
    } catch {
      return [];
    }
  };

  return {
    products: load<Product>("products.json"),
    guides: load<Guide>("guides.json"),
    catalogues: load<Catalogue>("catalogues.json"),
  };
}

/**
 * Merge strategy for partial runs:
 * - Keep existing items from brands NOT in this run (untouched)
 * - Replace items from brands that were just scraped (fresh data wins)
 */
function mergeById<T extends { id: string; marque: string }>(
  existing: T[],
  fresh: T[],
  scrapedBrands: string[],
): T[] {
  const scrapedUppercase = scrapedBrands.map((b) => b.toUpperCase());

  // Keep existing items from brands we didn't touch this run
  const kept = existing.filter(
    (item) => !scrapedUppercase.includes(item.marque.toUpperCase()),
  );

  // Merge: kept + fresh, sorted by marque then id
  return [...kept, ...fresh].sort(
    (a, b) => a.marque.localeCompare(b.marque) || a.id.localeCompare(b.id),
  );
}

function writeJson(filename: string, data: unknown) {
  const path = resolve(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[output] Written: ${path}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
