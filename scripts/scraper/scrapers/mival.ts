/**
 * MIVAL scraper
 *
 * Site: https://mival.it/en/products/ (WooCommerce)
 *
 * Strategy:
 *   1. Scrape the listing pages (/en/products/, /en/products/page/2/, …)
 *      to collect every product's name, short description, detail URL,
 *      and WooCommerce category classes (used for famille mapping).
 *   2. For each product, fetch its detail page to extract the PDF link
 *      ("Technical data sheet") — it is only present on the detail page,
 *      not the listing.
 *
 * Pagination: WooCommerce path-based → /en/products/page/N/
 * Last page is detected from the pagination nav in the HTML.
 *
 * Concurrency: detail pages are fetched in small batches to avoid
 * hammering the server while still being reasonably fast.
 */

import * as cheerio from "cheerio"
import type { RawProduct, FamilleKey } from "../types.js"

const BASE_URL = "https://mival.it/en/products/"
const PAGE_URL = (n: number) => `https://mival.it/en/products/page/${n}/`
const REQUEST_DELAY_MS = 8600
const DETAIL_BATCH_SIZE = 3  // fetch N detail pages in parallel

// ─── WooCommerce category → Famille ──────────────────────────────────────────
// Extracted from the <li class="product product_cat-*"> on the listing page.
// Multiple category classes may match — first match wins.

const CATEGORY_TO_FAMILLE: { pattern: RegExp; famille: FamilleKey }[] = [
  { pattern: /product_cat-bellows-valves/,        famille: "robinetterie"       },
  { pattern: /product_cat-packing-valves/,         famille: "robinetterie"       },
  { pattern: /product_cat-globe-valves/,           famille: "robinetterie"       },
  { pattern: /product_cat-gate-valves/,            famille: "robinetterie"       },
  { pattern: /product_cat-ball-valves/,            famille: "robinetterie"       },
  { pattern: /product_cat-butterfly-valves/,       famille: "robinetterie"       },
  { pattern: /product_cat-check-valves/,           famille: "robinetterie"       },
  { pattern: /product_cat-bleed-valves/,           famille: "robinetterie"       },
  { pattern: /product_cat-float-valves/,           famille: "robinetterie"       },
  { pattern: /product_cat-discharge-valves/,       famille: "robinetterie"       },
  { pattern: /product_cat-safety-valves/,          famille: "robinetterie"       },
  { pattern: /product_cat-pressure-gauge-valves/,  famille: "instrumentation"    },
  { pattern: /product_cat-flow-indicator/,         famille: "instrumentation"    },
  { pattern: /product_cat-strainers/,              famille: "traitement-fluides" },
  { pattern: /product_cat-balancing-valves/,       famille: "regulation-vapeur"  },
  { pattern: /product_cat-cocks/,                  famille: "robinetterie"       },
  { pattern: /product_cat-joints/,                 famille: "robinetterie"       },
]

// ─── Intermediate type (before detail fetch) ──────────────────────────────────

interface ListingItem {
  name: string
  shortDescription: string
  detailUrl: string
  famille: FamilleKey | null
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeMival(): Promise<RawProduct[]> {
  console.log("[MIVAL] Starting scrape …")

  // Step 1: collect all listing items across all pages
  const items = await scrapeAllListingPages()
  console.log(`[MIVAL] ${items.length} products found across listing pages`)

  // Step 2: fetch detail page for each item to get PDF link
  const products = await fetchAllDetailPages(items)
  console.log(`[MIVAL] Done — ${products.length} products with data`)

  return products
}

// ─── Listing pages ────────────────────────────────────────────────────────────

async function scrapeAllListingPages(): Promise<ListingItem[]> {
  // Fetch page 1 to determine total page count
  const firstHtml = await fetchHtml(BASE_URL)
  const $first = cheerio.load(firstHtml)

  const totalPages = parseLastPage($first)
  console.log(`[MIVAL] ${totalPages} listing page(s)`)

  const items: ListingItem[] = parseListingItems($first)
  console.log(`[MIVAL] Page 1/${totalPages}: ${items.length} items`)

  for (let page = 2; page <= totalPages; page++) {
    await delay(REQUEST_DELAY_MS)
    const html = await fetchHtml(PAGE_URL(page))
    const $ = cheerio.load(html)
    const pageItems = parseListingItems($)
    console.log(`[MIVAL] Page ${page}/${totalPages}: ${pageItems.length} items`)
    items.push(...pageItems)
  }

  return items
}

function parseLastPage($: cheerio.CheerioAPI): number {
  // WooCommerce pagination: <a class="page-numbers" href=".../page/8/">8</a>
  // The last numbered link (before →) holds the total page count.
  let max = 1
  $("a.page-numbers, span.page-numbers").each((_, el) => {
    const n = parseInt($(el).text().trim(), 10)
    if (!isNaN(n) && n > max) max = n
  })
  return max
}

function parseListingItems($: cheerio.CheerioAPI): ListingItem[] {
  const items: ListingItem[] = []

  // WooCommerce: ul.products > li.product
  $("ul.products li.product").each((_, li) => {
    const $li = $(li)

    const name = $li.find("h2.woocommerce-loop-product__title").text().trim()
    if (!name) return

    const detailUrl =
      $li.find("a.woocommerce-loop-product__link").first().attr("href")?.trim() ?? ""
    if (!detailUrl) return

    const shortDescription =
      $li.find(".woocommerce-product-details__short-description").text().trim()

    // Famille from WooCommerce category classes on the <li>
    const liClass = $li.attr("class") ?? ""
    const famille = detectFamilleFromClass(liClass)

    items.push({ name, shortDescription, detailUrl, famille })
  })

  return items
}

function detectFamilleFromClass(classes: string): FamilleKey | null {
  for (const { pattern, famille } of CATEGORY_TO_FAMILLE) {
    if (pattern.test(classes)) return famille
  }
  return null
}

// ─── Detail pages ─────────────────────────────────────────────────────────────

async function fetchAllDetailPages(items: ListingItem[]): Promise<RawProduct[]> {
  const results: RawProduct[] = []

  // Process in batches to be polite
  for (let i = 0; i < items.length; i += DETAIL_BATCH_SIZE) {
    const batch = items.slice(i, i + DETAIL_BATCH_SIZE)

    const batchResults = await Promise.all(
      batch.map((item) => fetchDetailPage(item))
    )

    results.push(...batchResults.filter((p): p is RawProduct => p !== null))

    const progress = Math.min(i + DETAIL_BATCH_SIZE, items.length)
    console.log(`[MIVAL] Detail pages: ${progress}/${items.length}`)

    if (progress < items.length) await delay(REQUEST_DELAY_MS)
  }

  return results
}

async function fetchDetailPage(item: ListingItem): Promise<RawProduct | null> {
  try {
    const html = await fetchHtml(item.detailUrl)
    const $ = cheerio.load(html)

    // PDF link: <a href="...pdf">Technical data sheet</a>
    // Sits directly in the product summary area, outside tabs
    const pdfs: { label: string; url: string }[] = []

    $("a[href]").each((_, a) => {
      const href = $(a).attr("href")?.trim() ?? ""
      const label = $(a).text().trim()

      if (!href.toLowerCase().includes(".pdf")) return
      if (!label) return
      // Skip footer/nav links that happen to be PDFs
      if ($(a).closest("footer, nav, .similar-products").length > 0) return
      if (pdfs.some((p) => p.url === href)) return

      pdfs.push({ label, url: href })
    })

    return {
      name: item.name,
      marque: "MIVAL",
      pdfs,
      shortDescription: item.shortDescription || undefined,
      sourceUrl: item.detailUrl,
      _famille: item.famille,
    } as RawProduct & { _famille: FamilleKey | null }

  } catch (err) {
    console.error(`[MIVAL] Detail page failed: ${item.detailUrl}`, err)
    return null
  }
}

// ─── HTTP fetch ───────────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  return res.text()
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}