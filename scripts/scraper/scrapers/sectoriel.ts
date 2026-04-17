/**
 * SECTORIEL scraper
 *
 * Scrapes multiple product listing pages from sectoriel.com.
 * Each URL maps to a specific famille — the mapping is defined in PRODUCT_URLS below.
 * Add new URLs there as you expand coverage.
 *
 * Structure confirmed from live HTML:
 *   .product-info                        → one product card
 *   .product-item-link                   → product name + detail URL
 *   .product-item-description            → short description
 *   .documentation-link                  → individual PDF link
 *   (label is the link text, type inferred from URL path segment)
 */

import * as cheerio from "cheerio";
import type { RawProduct } from "../types.js";
import type { FamilleKey } from "../types.js";

// ─── URL → Famille mapping ────────────────────────────────────────────────────
// Add new URLs here. The famille is used directly by the normalizer —
// no keyword detection needed for Sectoriel since the URL tells us the famille.

const PRODUCT_URLS: { url: string; famille: FamilleKey }[] = [
  //   {
  //     url: "https://www.sectoriel.com/fr/vannes-a-siege-incline.html",
  //     famille: "robinetterie",
  //   },
  //   {
  //     url: "https://www.sectoriel.com/fr/soupapes-de-surete.html",
  //     famille: "robinetterie",
  //   },
  // ── Add more URLs below as needed ──
  {
    url: "https://www.sectoriel.com/fr/electrovannes.html",
    famille: "automatisme",
  },
  {
    url: "https://www.sectoriel.com/fr/equipements-gaz.html",
    famille: "robinetterie",
  },
  {
    url: "https://www.sectoriel.com/fr/reducteurs-de-pression-deverseurs.html",
    famille: "regulation-vapeur",
  },
  {
    url: "https://www.sectoriel.com/fr/instrumentation.html",
    famille: "instrumentation",
  },
  {
    url: "https://www.sectoriel.com/fr/equipements-vapeur-purgeurs-vapeur-detendeurs-vapeur.html",
    famille: "regulation-vapeur",
  },
  {
    url: "https://www.sectoriel.com/fr/reservoirs-equipements-air-comprime.html",
    famille: "traitement-fluides",
  },
  {
    url: "https://www.sectoriel.com/fr/robinets-manuels-avec-boitier-fin-de-course.html",
    famille: "robinetterie",
  },
  {
    url: "https://www.sectoriel.com/fr/vannes-motorisees-pneumatiques.html",
    famille: "automatisme",
  },
  {
    url: "https://www.sectoriel.com/fr/vannes-motorisees-electriques.html",
    famille: "automatisme",
  },
  {
    url: "https://www.sectoriel.com/fr/vannes-guillotine-vannes-a-opercule-vannes-a-manchon.html",
    famille: "robinetterie",
  },
  {
    url: "https://www.sectoriel.com/fr/vannes-de-regulation.html",
    famille: "robinetterie",
  },
  {
    url: "https://www.sectoriel.com/fr/robinetterie-plastique.html",
    famille: "robinetterie",
  },
];

const REQUEST_DELAY_MS = 8600;
const PAGE_SIZE = 12;
// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeSectoriel(): Promise<RawProduct[]> {
  console.log(`[SECTORIEL] Starting — ${PRODUCT_URLS.length} category URL(s)`);
  const allProducts: RawProduct[] = [];

  for (const { url, famille } of PRODUCT_URLS) {
    try {
      const products = await scrapeAllPages(url, famille);
      allProducts.push(...products);
    } catch (err) {
      console.error(`[SECTORIEL] Failed: ${url}`, err);
    }
    await delay(REQUEST_DELAY_MS);
  }

  console.log(`[SECTORIEL] Done — ${allProducts.length} total products`);
  return allProducts;
}

// ─── Paginator ───────────────────────────────────────────────────────────────

async function scrapeAllPages(
  baseUrl: string,
  famille: FamilleKey,
): Promise<RawProduct[]> {
  // Page 1: also gives us the total article count
  const firstHtml = await fetchHtml(baseUrl);
  const $first = cheerio.load(firstHtml);

  const total = parseTotalCount($first);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  console.log(`[SECTORIEL] ${baseUrl}`);
  console.log(`[SECTORIEL]   ${total} articles → ${totalPages} page(s)`);

  const products = parseProducts($first, baseUrl, famille);
  console.log(
    `[SECTORIEL]   Page 1/${totalPages}: ${products.length} products`,
  );

  for (let page = 2; page <= totalPages; page++) {
    await delay(REQUEST_DELAY_MS);
    const pageUrl = `${baseUrl}?p=${page}`;
    const html = await fetchHtml(pageUrl);
    const $page = cheerio.load(html);
    const pageProducts = parseProducts($page, baseUrl, famille);
    console.log(
      `[SECTORIEL]   Page ${page}/${totalPages}: ${pageProducts.length} products`,
    );
    products.push(...pageProducts);
  }

  return products;
}

// ─── Total count parser ───────────────────────────────────────────────────────

function parseTotalCount($: cheerio.CheerioAPI): number {
  const text =
    $(".toolbar-amount").first().text() ||
    $(".toolbar-number").first().text() ||
    ""

  const numbers = text.match(/\d+/g)

  if (numbers && numbers.length > 0) {
    return parseInt(numbers[numbers.length - 1], 10) // ✅ dernier nombre
  }

  const fallback = $(".product-info").length
  console.warn(`[SECTORIEL] fallback count: ${fallback}`)
  return fallback
}

// ─── Product parser ───────────────────────────────────────────────────────────

function parseProducts(
  $: cheerio.CheerioAPI,
  sourceUrl: string,
  famille: FamilleKey,
): RawProduct[] {
  const products: RawProduct[] = [];

  $(".product-info").each((_, el) => {
    const $el = $(el);

    const name = $el.find(".product-item-link").first().text().trim();
    if (!name) return;

    const shortDescription =
      $el.find(".product-item-description").first().text().trim() || undefined;

    const pdfs: { label: string; url: string }[] = [];

    $el.find(".list-documentation a.documentation-link").each((_, a) => {
      const href = $(a).attr("href")?.trim();
      const label = $(a).text().trim();

      if (!href || !label) return;
      if (!href.toLowerCase().includes(".pdf")) return;
      if (pdfs.some((p) => p.url === href)) return;

      pdfs.push({ label, url: href });
    });

    products.push({
      name,
      marque: "SECTORIEL",
      pdfs,
      shortDescription,
      sourceUrl,
      // _famille is a scraper-only hint consumed by normalizer.ts
      // so it can skip keyword detection (URL already encodes the famille)
      _famille: famille,
    } as RawProduct & { _famille: FamilleKey });
  });

  return products;
}

// ─── HTTP fetch ───────────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "fr-FR,fr;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
