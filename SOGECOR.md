# SOGECOR — Catalogue Numérique Techniflux

## Vue d'ensemble

Techniflux est un distributeur B2B spécialisé en robinetterie industrielle, régulation vapeur et instrumentation. Ce site centralise en un seul endroit les produits, documentations techniques et catalogues de six marques partenaires, organisés selon les réalités métier des utilisateurs.

---

## Les 6 Marques Distribuées

| Marque | `MarqueKey` | Spécialité |
|---|---|---|
| SAMSON | `SAMSON` | Vannes de régulation, actionneurs, positionneurs HART |
| SECTORIEL | `SECTORIEL` | Électrovannes, vannes industrielles, instrumentation |
| MIVAL | `MIVAL` | Robinetterie industrielle (Italie) |
| iFm | `iFm` | Instrumentation & capteurs |
| sferaco | `sferaco` | Vannes à sphère, robinetterie |
| ADCA | `ADCA` | Régulation vapeur (via Valsteam) |

---

## Taxonomie Produits

### Familles (`FamilleKey`)

| Clé | Libellé | Produits types |
|---|---|---|
| `robinetterie` | Robinetterie Industrielle | Vannes, soupapes, clapets |
| `regulation-vapeur` | Régulation Vapeur | Purgeurs, détendeurs, séparateurs |
| `instrumentation` | Instrumentation | Manomètres, thermomètres, pressostats |
| `traitement-fluides` | Traitement des Fluides | Filtres, sécheurs, air comprimé |
| `automatisme` | Automatisme | Électrovannes, vannes motorisées |

### Applications (`ApplicationKey`)

| Clé | Libellé |
|---|---|
| `reseau-vapeur` | Réseau Vapeur |
| `air-comprime` | Air Comprimé |
| `eau-surchauffee` | Eau Surchauffée / Fluides Caloporteurs |

---

## Sources à Scraper par Marque

### SAMSON ✅ (88 produits scrapés)
- **Produits** : https://www.samsongroup.com/fr/telechargements/documentation/
  - Filtres actifs : Langue FR/EN + Gamme de produits : SAMSON
  - Seulement les produits classifiables dans une famille

### SECTORIEL ⏳ (à implémenter)
- **Produits** :
  - https://www.sectoriel.com/fr/electrovannes.html
  - https://www.sectoriel.com/fr/vannes-a-siege-incline.html
  - https://www.sectoriel.com/fr/equipements-gaz.html
  - https://www.sectoriel.com/fr/reducteurs-de-pression-deverseurs.html
  - https://www.sectoriel.com/fr/soupapes-de-surete.html
  - https://www.sectoriel.com/fr/instrumentation.html
  - https://www.sectoriel.com/fr/equipements-vapeur-purgeurs-vapeur-detendeurs-vapeur.html
  - https://www.sectoriel.com/fr/reservoirs-equipements-air-comprime.html
  - https://www.sectoriel.com/fr/robinets-manuels-avec-boitier-fin-de-course.html
  - https://www.sectoriel.com/fr/vannes-motorisees-pneumatiques.html
  - https://www.sectoriel.com/fr/vannes-motorisees-electriques.html
  - https://www.sectoriel.com/fr/vannes-guillotine-vannes-a-opercule-vannes-a-manchon.html
  - https://www.sectoriel.com/fr/vannes-de-regulation.html
  - https://www.sectoriel.com/fr/robinetterie-plastique.html
- **Guides** : https://www.sectoriel.com/fr/guide-technique
- **Catalogues** : https://www.sectoriel.com/fr/catalogues

### MIVAL ⏳ (à implémenter)
- **Produits** : https://mival.it/en/products/
- **Catalogues** : https://mival.it/en/catalogs/

### iFm ⏳ (à implémenter)
- **Produits** : https://www.ifm.com/fr/fr/category/200_020_010_001#/best/1/50

### sferaco ⏳ (à implémenter)
- **Produits** : https://www.sferaco.com/fr/vannes-a-sphere-laiton-fonte-pvc.html
- **Catalogues** : https://www.sferaco.com/fr/catalogue-documentation
- **Guides** : https://www.sferaco.com/fr/guides-techniques

### ADCA ⏳ (à implémenter)
- **Produits** : https://www.valsteam.com/fr/produits/adca
- **Documentation** : https://www.valsteam.com/fr/documentation/centre-de-telechargement

---

## Pipeline de Scraping

```
npm run scrape
  └─ scripts/scraper/run.ts
       ├─ Lance les scrapers par marque (séquentiellement)
       ├─ scripts/scraper/normalizer.ts
       │    ├─ detectFamille() → classification par regex sur le nom
       │    ├─ detectApplications() → tags d'application
       │    └─ detectPdfType() → type de chaque PDF
       ├─ Fusionne avec les données existantes (par marque)
       └─ Écrit dans data/products.json, data/guides.json, data/catalogues.json
```

**Scraper partiel** : `npm run scrape -- SAMSON` (remplace uniquement SAMSON, conserve les autres marques)

**Famille non classifiable** : Les produits sans famille détectée sont exclus (`famille: null` → filtrés avant écriture).

---

## État actuel

| Marque | Produits | Guides | Catalogues | Scraper |
|---|---|---|---|---|
| SAMSON | 88 | 0 | 0 | ✅ Implémenté |
| SECTORIEL | 0 | 0 | 0 | ⏳ À faire |
| MIVAL | 0 | 0 | 0 | ⏳ À faire |
| iFm | 0 | 0 | 0 | ⏳ À faire |
| sferaco | 0 | 0 | 0 | ⏳ À faire |
| ADCA | 0 | 0 | 0 | ⏳ À faire |

---

## Personas Cibles

- **Techniciens de maintenance** — accès rapide à la référence produit et à la fiche technique depuis mobile, sur le terrain
- **Bureaux d'études** — consultation des dimensions, données techniques et documents d'assemblage
- **Acheteurs** — identification des produits par marque et demande de devis (Panier de Devis, pas de cart e-commerce)

---

## Routage Produits

| URL | Contenu |
|---|---|
| `/produits` | Catalogue complet, groupé par famille (avec search `?q=` et filter `?application=`) |
| `/produits?q=purgeur` | Recherche fuzzy sur tous les produits |
| `/produits/famille/[famille]` | Catégorie famille (ex: `/produits/famille/regulation-vapeur`) |
| `/produits/[id]` | Fiche produit (ex: `/produits/samson-vanne-type-3250`) |
