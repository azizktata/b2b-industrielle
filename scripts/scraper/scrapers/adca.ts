/**
 * ADCA scraper
 *
 * Source: https://www.valsteam.com/fr/adca/ category pages
 *
 * Structure (confirmed from live HTML):
 *   article.product__box__item          → one product card (top-level or sub-model)
 *   figcaption h6                        → product name/reference
 *   figcaption p, figcaption div         → short description
 *   .product__box__item--fields          → spec table (matière, tailles, etc.) — ignored
 *   div.files-zone a.file                → PDF links
 *     title attribute                    → PDF label ("FICHE TECHNIQUE", etc.)
 *     href                               → absolute URL on valsteam.com
 *   .submodels__expand__item article     → sub-model cards (scraped same as top-level)
 *
 * No pagination — all products are rendered server-side on the category page.
 * No detail page fetch needed — PDFs are already in the listing HTML (collapsed divs).
 *
 * To add more URLs: add entries to PRODUCT_URLS below.
 */

import * as cheerio from "cheerio"
import type { RawProduct, FamilleKey } from "../types.js"

// ─── URL → Famille mapping ────────────────────────────────────────────────────

const PRODUCT_URLS: { url: string; famille: FamilleKey }[] = [
  {
    url: "https://www.valsteam.com/fr/adca/vannes-de-regulation/pc-28",
    famille: "regulation-vapeur",
  },
  {
    url: "https://www.valsteam.com/fr/adca/detendeurs-regulateurs-de-pression/pc-441",
    famille: "regulation-vapeur",
  },
  {
    url: "https://www.valsteam.com/fr/adca/purgeurs/pc-31",
    famille: "regulation-vapeur",
  },
  {
    url: "https://www.valsteam.com/fr/adca/auxiliaires-de-tuyauterie/pc-25",
    famille: "robinetterie",
  },
  // ── Add more URLs below as needed ─────────────────────────────────────────
]

const REQUEST_DELAY_MS = 1200

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeAdca(): Promise<RawProduct[]> {
  console.log(`[ADCA] Starting — ${PRODUCT_URLS.length} category URL(s)`)
  const allProducts: RawProduct[] = []

  for (const { url, famille } of PRODUCT_URLS) {
    try {
      const products = await scrapeCategoryPage(url, famille)
      allProducts.push(...products)
    } catch (err) {
      console.error(`[ADCA] Failed: ${url}`, err)
    }
    await delay(REQUEST_DELAY_MS)
  }

  console.log(`[ADCA] Done — ${allProducts.length} total products`)
  return allProducts
}

// ─── Category page scraper ────────────────────────────────────────────────────

async function scrapeCategoryPage(
  url: string,
  famille: FamilleKey
): Promise<RawProduct[]> {
  const html = await fetchHtml(url)
  const $ = cheerio.load(html)
  const products: RawProduct[] = []

  // All product articles — both top-level and sub-models inside
  // .submodels__expand__item are matched by this selector.
  // We exclude "parent" articles that have no PDFs and only have a
  // "VOIR SOUS-MODÈLES" button — those are just grouping shells.
  $("article.product__box__item").each((_, article) => {
    const $article = $(article)

    // ── Name ─────────────────────────────────────────────────────────────────
    const name = $article.find("figcaption h6").first().text().trim()
    if (!name) return

    // ── Short description ─────────────────────────────────────────────────────
    // Description lives in figcaption — can be a <p> or a <div>, sometimes
    // wrapped in a <span>. We grab all text content and clean it up.
    const descRaw = $article
      .find("figcaption")
      .clone()
      .find("h6")           // remove the title from the clone
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim()

    const shortDescription = descRaw.length > 5 ? descRaw : undefined

    // ── PDFs ─────────────────────────────────────────────────────────────────
    // The files zone is a sibling div of the article's main row, identified
    // by id="collapseFiles{N}" and class "files-zone".
    // PDF links: a.file with href pointing to a PDF.
    // Label comes from the title attribute (most reliable) or the
    // p.font--title text inside the figcaption of each PDF item.
    const pdfs: { label: string; url: string }[] = []

    $article.find(".files-zone a.file[href]").each((_, a) => {
      const $a = $(a)
      const href = $a.attr("href")?.trim() ?? ""

      if (!href.toLowerCase().includes(".pdf")) return

      // Resolve relative paths (some hrefs start with /zArchives/...)
      const pdfUrl = href.startsWith("http")
        ? href
        : `https://www.valsteam.com${href}`

      // Label: prefer title attribute, fall back to figcaption text
      const label =
        $a.attr("title")?.trim() ||
        $a.find("p.font--title").first().text().trim() ||
        "DOCUMENT"

      if (pdfs.some((p) => p.url === pdfUrl)) return // deduplicate

      pdfs.push({ label, url: pdfUrl })
    })

    // Skip shell products (no PDFs, only has a "VOIR SOUS-MODÈLES" button)
    // Their sub-models are scraped separately as their own articles.
    if (pdfs.length === 0 && $article.find(".submodels button").length > 0) return

    products.push({
      name,
      marque: "ADCA",
      pdfs,
      shortDescription,
      sourceUrl: url,
      _famille: famille,
    } as RawProduct & { _famille: FamilleKey })
  })

  console.log(`[ADCA] ${url} → ${products.length} products`)
  return products
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
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  return res.text()
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}