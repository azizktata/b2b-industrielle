/**
 * SAMSON scraper
 *
 * TWO-SOURCE STRATEGY:
 *
 * Source 1 — Product listing pages (/fr/produits/...)
 *   JS-rendered by TYPO3. Gives us: product name, reference, detail URL.
 *   Requires Playwright.
 *
 * Source 2 — Documentation index (/fr/telechargements/documentation/ with Solr filters)
 *   Also JS-rendered. Gives us: PDF links keyed by product name / reference.
 *   Requires Playwright.
 *
 * The two sources are cross-referenced by product reference number to attach
 * PDFs to the right product. Products with no matching PDF are still included.
 *
 * INSTALL (one-time):
 *   npm install -D playwright
 *   npx playwright install chromium
 */

import { chromium } from "playwright"
import type { Browser, BrowserContext, Page } from "playwright"
import type { RawProduct, FamilleKey } from "../types.js"

const SAMSON_BASE = "https://www.samsongroup.com"

// ─── Product listing URLs → Famille ──────────────────────────────────────────

const PRODUCT_URLS: { url: string; famille: FamilleKey }[] = [
  { url: `${SAMSON_BASE}/fr/produits/vannes/`,                  famille: "robinetterie"       },
  { url: `${SAMSON_BASE}/fr/produits/accessoires/`,             famille: "robinetterie"       },
  { url: `${SAMSON_BASE}/fr/produits/servomoteurs/`,            famille: "automatisme"        },
  { url: `${SAMSON_BASE}/fr/produits/regulateurs-automoteurs/`, famille: "regulation-vapeur"  },
  { url: `${SAMSON_BASE}/fr/produits/systemes-dautomation/`,    famille: "automatisme"        },
  { url: `${SAMSON_BASE}/fr/produits/sondes-et-thermostats/`,   famille: "instrumentation"    },
  { url: `${SAMSON_BASE}/fr/produits/convertisseurs/`,          famille: "instrumentation"    },
  { url: `${SAMSON_BASE}/fr/produits/systemes-modulaires/`,     famille: "regulation-vapeur"  },
]

// ─── Documentation index (Solr-filtered: SAMSON productline, FR language) ────

const DOC_INDEX_URL =
  `${SAMSON_BASE}/fr/telechargements/documentation/` +
  `?tx_solr%5Bq%5D=%2A` +
  `&tx_solr%5Bfilter%5D%5B0%5D=archive%3A0` +
  `&tx_solr%5Bfilter%5D%5B1%5D=document_productline%3ASAMSON` +
  `&tx_solr%5Bfilter%5D%5B2%5D=language%3AFR`

const PRODUCT_CARD_SEL = ".results-entry"
const RENDER_WAIT      = 2500
const NAV_TIMEOUT      = 30_000

// ─── Intermediate types ───────────────────────────────────────────────────────

interface ListingItem {
  name: string
  reference: string
  detailUrl: string
  famille: FamilleKey
}

interface DocEntry {
  name: string
  pdfUrl: string
  label: string
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeSamson(): Promise<RawProduct[]> {
  console.log("[SAMSON] Launching Chromium …")
  const browser: Browser = await chromium.launch({ headless: true })
  const context: BrowserContext = await browser.newContext({
    locale: "fr-FR",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  })

  try {
    const listingItems = await scrapeListingPages(context)
    console.log(`[SAMSON] ${listingItems.length} products from listing pages`)

    const docEntries = await scrapeDocIndex(context)
    console.log(`[SAMSON] ${docEntries.length} documents from doc index`)

    const products = crossReference(listingItems, docEntries)
    console.log(`[SAMSON] ${products.length} final products`)
    return products
  } finally {
    await browser.close()
    console.log("[SAMSON] Browser closed")
  }
}

// ─── Phase 1: product listings ────────────────────────────────────────────────

async function scrapeListingPages(context: BrowserContext): Promise<ListingItem[]> {
  const all: ListingItem[] = []

  for (const { url, famille } of PRODUCT_URLS) {
    const page = await context.newPage()
    try {
      const items = await scrapeListingAllPages(page, url, famille)
      all.push(...items)
    } finally {
      await page.close()
    }
  }

  return all
}

async function scrapeListingAllPages(
  page: Page,
  baseUrl: string,
  famille: FamilleKey
): Promise<ListingItem[]> {
  const all: ListingItem[] = []
  let pageNum = 0

  console.log(`[SAMSON] Listing → ${baseUrl}`)

  while (true) {
    // TYPO3 Solr pagination uses tx_solr[page]=N (same as doc index)
    const url =
      pageNum === 0
        ? baseUrl
        : `${baseUrl}?tx_solr%5Bpage%5D=${pageNum}`

    await page.goto(url, { waitUntil: "networkidle", timeout: NAV_TIMEOUT })

    const appeared = await page
      .waitForSelector(PRODUCT_CARD_SEL, { timeout: 10_000 })
      .then(() => true)
      .catch(() => false)

    if (!appeared) {
      console.log(`[SAMSON]   Page ${pageNum}: no cards — done`)
      break
    }

    await page.waitForTimeout(RENDER_WAIT)

    const items = await page.evaluate(
      ({ sel, base }: { sel: string; base: string }) =>
        Array.from(document.querySelectorAll(sel)).map((el) => {
          const href = el.querySelector("a.results-entry--link")?.getAttribute("href") ?? ""
          const reference = el.querySelector(".results-topic, h5")?.textContent?.trim() ?? ""
          const description = el.querySelector(".result-content, p")?.textContent?.trim() ?? ""
          return {
            reference,
            description,
            href: href.startsWith("http") ? href : `${base}${href}`,
          }
        }),
      { sel: PRODUCT_CARD_SEL, base: SAMSON_BASE }
    )

    if (items.length === 0) {
      console.log(`[SAMSON]   Page ${pageNum}: 0 items — done`)
      break
    }

    const pageItems: ListingItem[] = items
      .filter((i) => i.reference)
      .map((i) => ({
        name: i.description ? `${i.reference} — ${i.description}` : i.reference,
        reference: i.reference,
        detailUrl: i.href,
        famille,
      }))

    console.log(`[SAMSON]   Page ${pageNum}: ${pageItems.length} products`)
    all.push(...pageItems)
    pageNum++
  }

  return all
}

// ─── Phase 2: documentation index ────────────────────────────────────────────

async function scrapeDocIndex(context: BrowserContext): Promise<DocEntry[]> {
  const page = await context.newPage()
  const all: DocEntry[] = []
  let pageNum = 0

  try {
    while (true) {
      const url =
        pageNum === 0
          ? DOC_INDEX_URL
          : `${DOC_INDEX_URL}&tx_solr%5Bpage%5D=${pageNum}`

      console.log(`[SAMSON] Doc index page ${pageNum}`)
      await page.goto(url, { waitUntil: "networkidle", timeout: NAV_TIMEOUT })
      await page.waitForTimeout(RENDER_WAIT)

      const docs = await page.evaluate(() => {
        // TYPO3 Solr renders results as table rows or list items depending on config
        const rows = Array.from(document.querySelectorAll(
          "table tbody tr, .download-list tbody tr, " +
          ".tx-solr-results-list li, .results-list li, ul.solr-results li"
        ))

        return rows
          .map((row) => {
            const link = row.querySelector("a[href*='.pdf']") as HTMLAnchorElement | null
            if (!link) return null

            const pdfUrl = link.href
            const label =
              link.getAttribute("title")?.trim() ||
              row.querySelector(".doc-type, td:nth-child(2)")?.textContent?.trim() ||
              "DOCUMENT"
            const name =
              row.querySelector(".doc-title, .title, td:nth-child(1)")?.textContent?.trim() ||
              link.textContent?.trim() ||
              ""

            return name && pdfUrl ? { name, pdfUrl, label } : null
          })
          .filter(Boolean) as { name: string; pdfUrl: string; label: string }[]
      })

      if (docs.length === 0) {
        console.log(`[SAMSON]   Page ${pageNum}: 0 docs — done`)
        break
      }

      console.log(`[SAMSON]   Page ${pageNum}: ${docs.length} docs`)
      all.push(...docs)
      pageNum++
    }
  } finally {
    await page.close()
  }

  return all
}

// ─── Phase 3: cross-reference listings ↔ docs ─────────────────────────────────

function crossReference(
  items: ListingItem[],
  docs: DocEntry[]
): RawProduct[] {
  return items.map((item) => {
    // Match docs whose name contains the product reference (e.g. "3241", "7110")
    // Reference numbers are typically 4+ digits
    const ref = item.reference.trim()

    const matchingDocs = docs.filter((doc) => {
      // Direct inclusion check — "Type 3241" matches reference "3241"
      return (
        doc.name.includes(ref) ||
        // Also match if doc name contains a numeric token that appears in the product name
        new RegExp(`\\b${ref}\\b`, "i").test(doc.name)
      )
    })

    const seen = new Set<string>()
    const pdfs = matchingDocs
      .filter((doc) => !seen.has(doc.pdfUrl) && seen.add(doc.pdfUrl))
      .map((doc) => ({ label: doc.label, url: doc.pdfUrl }))

    return {
      name: item.name,
      marque: "SAMSON",
      pdfs,
      sourceUrl: item.detailUrl,
      _famille: item.famille,
    } as RawProduct & { _famille: FamilleKey }
  })
}