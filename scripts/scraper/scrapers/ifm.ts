/**
 * iFm scraper
 *
 * ifm.com is a client-side Angular SPA — fetch returns an empty shell.
 * Playwright is required to let the JS render before extracting data.
 *
 * INSTALL (one-time):
 *   npm install -D playwright
 *   npx playwright install chromium
 *
 * PAGINATION
 * The hash fragment #/best/{page}/{size} drives the Angular router.
 * We navigate to each hash URL and wait for Angular to re-render.
 * Total count is read from the DOM after first page loads.
 *
 * PDFs
 * Built directly from SKU — no detail page visits needed:
 *   https://www.ifm.com/download/files/{SKU}-datasheet-fr/$file/{SKU}-datasheet-fr.pdf
 */

import { chromium } from "playwright"
import type { Browser, BrowserContext, Page } from "playwright"
import type { RawProduct, FamilleKey } from "../types.js"

// ─── URL → Famille mapping ────────────────────────────────────────────────────

const PRODUCT_URLS: { url: string; famille: FamilleKey }[] = [
  // Capteurs pression
  { url: "https://www.ifm.com/fr/fr/category/200_020_010_010", famille: "instrumentation" },
  { url: "https://www.ifm.com/fr/fr/category/200_020_010_020", famille: "instrumentation" },
  // Capteurs débit
  { url: "https://www.ifm.com/fr/fr/category/200_020_020_010", famille: "instrumentation" },
  { url: "https://www.ifm.com/fr/fr/category/200_020_020_020", famille: "instrumentation" },
  // Capteurs niveau
  { url: "https://www.ifm.com/fr/fr/category/200_020_030_010", famille: "instrumentation" },
  { url: "https://www.ifm.com/fr/fr/category/200_020_030_020", famille: "instrumentation" },
  // Capteurs température
  { url: "https://www.ifm.com/fr/fr/category/200_020_040_010", famille: "instrumentation" },
  // Capteurs position
  { url: "https://www.ifm.com/fr/fr/category/200_010_010_010", famille: "instrumentation" },
  { url: "https://www.ifm.com/fr/fr/category/200_010_020_010", famille: "instrumentation" },
  // Vision industrielle
  { url: "https://www.ifm.com/fr/fr/category/200_060_010",     famille: "instrumentation" },
]

const PAGE_SIZE    = 50
const ITEM_SEL    = ".ifm-result-item__product-info-inner"
const RENDER_WAIT = 2000   // ms after navigation to let Angular settle
const NAV_TIMEOUT = 30_000

// ─── PDF URL constructor ──────────────────────────────────────────────────────

function buildPdfUrl(sku: string): { label: string; url: string } {
  return {
    label: "FICHE TECHNIQUE",
    url: `https://www.ifm.com/download/files/${sku}-datasheet-fr/$file/${sku}-datasheet-fr.pdf`,
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeIfm(): Promise<RawProduct[]> {
  console.log("[iFm] Launching Chromium …")

  const browser: Browser = await chromium.launch({ headless: true })
  const context: BrowserContext = await browser.newContext({
    locale: "fr-FR",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  })

  const allProducts: RawProduct[] = []

  try {
    for (const { url, famille } of PRODUCT_URLS) {
      try {
        const products = await scrapeCategory(context, url, famille)
        allProducts.push(...products)
      } catch (err) {
        console.error(`[iFm] Failed: ${url}`, err)
      }
    }
  } finally {
    await browser.close()
    console.log("[iFm] Browser closed")
  }

  console.log(`[iFm] Done — ${allProducts.length} total products`)
  return allProducts
}

// ─── Category scraper ─────────────────────────────────────────────────────────

async function scrapeCategory(
  context: BrowserContext,
  baseUrl: string,
  famille: FamilleKey
): Promise<RawProduct[]> {
  const page: Page = await context.newPage()

  try {
    // Page 1: navigate and wait for Angular to render
    await gotoHashPage(page, baseUrl, 1)

    const total = await readTotalCount(page, baseUrl)
    const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1

    console.log(`[iFm] ${baseUrl}`)
    console.log(`[iFm]   ${total} products → ${totalPages} page(s)`)

    const products: RawProduct[] = []

    const p1 = await extractProducts(page, baseUrl, famille)
    console.log(`[iFm]   Page 1/${totalPages}: ${p1.length} products`)
    products.push(...p1)

    for (let p = 2; p <= totalPages; p++) {
      await gotoHashPage(page, baseUrl, p)
      const items = await extractProducts(page, baseUrl, famille)
      console.log(`[iFm]   Page ${p}/${totalPages}: ${items.length} products`)
      products.push(...items)
    }

    return products
  } finally {
    await page.close()
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

async function gotoHashPage(page: Page, baseUrl: string, pageNum: number): Promise<void> {
  const url = `${baseUrl}#/best/${pageNum}/${PAGE_SIZE}`

  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: NAV_TIMEOUT,
  })

  // Wait for at least one product card to appear
  try {
    await page.waitForSelector(ITEM_SEL, { timeout: NAV_TIMEOUT })
  } catch {
    console.warn(`[iFm]   No product cards found on page ${pageNum} — selector may need updating`)
  }

  // Extra buffer for Angular change detection to finish
  await page.waitForTimeout(RENDER_WAIT)
}

// ─── Total count ──────────────────────────────────────────────────────────────

async function readTotalCount(page: Page, baseUrl: string): Promise<number> {
  // Try multiple possible count selectors ifm may use
  const countSelectors = [
    ".ifm-search-result-count",
    "[data-test='result-count']",
    ".result-count",
    ".ifm-result-count",
    // Generic: any element whose text looks like "N produits / results"
  ]

  for (const sel of countSelectors) {
    try {
      const text = await page.locator(sel).first().textContent({ timeout: 3000 })
      const match = (text ?? "").match(/(\d[\d\s]*)/)
      if (match) return parseInt(match[1].replace(/\s/g, ""), 10)
    } catch {
      // try next selector
    }
  }

  // Last resort: count items currently visible
  const onPage = await page.locator(ITEM_SEL).count()
  console.warn(`[iFm]   Could not read total count for ${baseUrl} — found ${onPage} on page`)
  return onPage
}

// ─── Product extraction ───────────────────────────────────────────────────────

async function extractProducts(
  page: Page,
  sourceUrl: string,
  famille: FamilleKey
): Promise<RawProduct[]> {
  // Run extraction entirely inside the browser context — faster than
  // crossing the Playwright bridge per element
  const items = await page.evaluate((sel: string) => {
    return Array.from(document.querySelectorAll(sel)).map((el) => {
      const sku =
        el.querySelector(".ifm-result-item__product-link")?.textContent?.trim() ?? ""

      const detailHref =
        el.querySelector("a.ifm-result-item__product-link-wrapper")
          ?.getAttribute("href") ?? ""

      const description =
        el.querySelector(".ifm-result-item__product-description")
          ?.textContent?.trim() ?? ""

      // First 3 spec pairs as a compact string
      const specs = Array.from(el.querySelectorAll(".ifm-labeled-value-section__entry"))
        .slice(0, 3)
        .map((entry) => {
          const label = entry.querySelector(".ifm-labeled-value-section__label")
            ?.textContent?.trim()
          const value = entry.querySelector(".ifm-labeled-value-section__value")
            ?.textContent?.trim()
          return label && value ? `${label}: ${value}` : null
        })
        .filter(Boolean)
        .join(" | ")

      return { sku, detailHref, description, specs }
    })
  }, ITEM_SEL)

  return items
    .filter((item) => !!item.sku)
    .map((item) => ({
      name: item.description ? `${item.sku} – ${item.description}` : item.sku,
      marque: "iFm" as const,
      pdfs: [buildPdfUrl(item.sku)],
      shortDescription: item.specs || item.description || undefined,
      sourceUrl: item.detailHref
        ? `https://www.ifm.com${item.detailHref}`
        : sourceUrl,
      _famille: famille,
    } as RawProduct & { _famille: FamilleKey }))
}