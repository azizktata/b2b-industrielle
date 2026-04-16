/**
 * SAMSON scraper
 *
 * Source URL (already filtered by you):
 *   https://www.samsongroup.com/fr/telechargements/documentation/
 *   ?tx_solr[q]=*
 *   &tx_solr[filter][0]=archive:0
 *   &tx_solr[filter][1]=document_productline:SAMSON
 *   &tx_solr[filter][2]=language:FR
 *
 * The page is rendered server-side by TYPO3 + Apache Solr, so plain
 * fetch + cheerio is enough — no headless browser needed.
 *
 * Pagination: Solr pages are appended as &tx_solr[page]=N (0-indexed).
 * We keep fetching until a page returns zero results.
 */

import * as cheerio from "cheerio"
import type { RawProduct } from "../types.js"

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL =
  "https://www.samsongroup.com/fr/telechargements/documentation/" +
  "?tx_solr%5Bq%5D=%2A" +
  "&tx_solr%5Bfilter%5D%5B0%5D=archive%3A0" +
  "&tx_solr%5Bfilter%5D%5B1%5D=document_productline%3ASAMSON" +
  "&tx_solr%5Bfilter%5D%5B2%5D=language%3AFR"

// Append &tx_solr%5Bpage%5D=N for pages > 0
const PAGE_PARAM = "&tx_solr%5Bpage%5D="

const SAMSON_BASE = "https://www.samsongroup.com"

// Polite delay between page requests (ms) — avoids hammering the server
const REQUEST_DELAY_MS = 9600

// ─── Types ───────────────────────────────────────────────────────────────────

interface SamsonRow {
  name: string
  docType: string          // raw label from the page, e.g. "FICHE TECHNIQUE"
  pdfUrl: string
  productLine: string
  language: string
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeSamson(): Promise<RawProduct[]> {
  console.log("[SAMSON] Starting scrape …")

  const allRows: SamsonRow[] = []
  let page = 0

  while (true) {
    const url = page === 0 ? BASE_URL : `${BASE_URL}${PAGE_PARAM}${page}`
    console.log(`[SAMSON] Fetching page ${page} → ${url}`)

    const rows = await fetchPage(url)

    if (rows.length === 0) {
      console.log(`[SAMSON] Page ${page} returned 0 rows — stopping pagination.`)
      break
    }

    console.log(`[SAMSON] Page ${page}: ${rows.length} rows`)
    allRows.push(...rows)
    page++

    await delay(REQUEST_DELAY_MS)
  }

  console.log(`[SAMSON] Total raw rows: ${allRows.length}`)

  // Group rows by product name → one Product with multiple PDFs
  const products = groupIntoProducts(allRows)

  console.log(`[SAMSON] Grouped into ${products.length} products`)
  return products
}

// ─── Page fetching ────────────────────────────────────────────────────────────

async function fetchPage(url: string): Promise<SamsonRow[]> {
  const res = await fetch(url, {
    headers: {
      // Mimic a real browser — TYPO3 sometimes blocks headless requests
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  })

  if (!res.ok) {
    console.error(`[SAMSON] HTTP ${res.status} on ${url}`)
    return []
  }

  const html = await res.text()
  return parseRows(html)
}

// ─── HTML parsing ─────────────────────────────────────────────────────────────

function parseRows(html: string): SamsonRow[] {
  const $ = cheerio.load(html)
  const rows: SamsonRow[] = []

  const cards = $(".results-teaser")

  cards.each((_, el) => {
    const container = $(el)

    // --- 1. Document type ---
    const docType = container
      .find(".documentText .walletInfo")
      .first()
      .text()
      .trim()

    // --- 2. Product name ---
    const rawName = container
      .find(".documentText h5")
      .first()
      .text()
      .replace(/\n/g, " ")
      .trim()

    const name = cleanProductName(rawName)

    // --- 3. PDFs (only FR) ---
    container.find(".updatedDocuments a").each((_, a) => {
      const link = $(a)
      const label = link.text().trim() // [FR], [DE], etc.

      if (!label.includes("FR")) return // ✅ ONLY FR

      const href = link.attr("href") ?? ""
      const pdfUrl = href.startsWith("http")
        ? href
        : `${SAMSON_BASE}${href}`

      if (name && pdfUrl) {
        rows.push({
          name,
          docType,
          language: "FR",
          productLine: "SAMSON",
          pdfUrl,
        })
      }
    })
  })

  return rows
}
function cleanProductName(name: string): string {
  return name
    .split("\n")               // split lines
    .map((s) => s.trim())
    .filter(Boolean)
    .pop() ?? name            // take LAST line (actual product)
}

// ─── Grouping: one Product per unique product name ────────────────────────────

function groupIntoProducts(rows: SamsonRow[]): RawProduct[] {
  // Multiple rows can share the same product name but have different doc types
  // (e.g. "Vanne type 3241" has a Fiche Technique AND a Dessin d'assemblage)
  const map = new Map<string, RawProduct>()

  for (const row of rows) {
    const key = normaliseKey(row.name)

    if (!map.has(key)) {
      map.set(key, {
        name: row.name,
        marque: "SAMSON",
        pdfs: [],
        sourceUrl: BASE_URL,
      })
    }

    const product = map.get(key)!

    // Only add the PDF if we haven't seen this URL already
    if (!product.pdfs.some((p) => p.url === row.pdfUrl)) {
      product.pdfs.push({
        label: row.docType || "DOCUMENT",
        url: row.pdfUrl,
      })
    }
  }

  // Filter: must have at least one PDF
  return [...map.values()].filter((p) => p.pdfs.length > 0)
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function normaliseKey(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ")
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}