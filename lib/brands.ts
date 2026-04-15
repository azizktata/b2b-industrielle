export type Brand = {
  id: string
  name: string
  origin: string
  specialty: string
  desc: string
  longDesc: string
  products: string[]
  productDetail: { name: string; refs: string[] }[]
  sav: boolean
  agree: "Distributeur Agréé" | "Distributeur Officiel" | "Partenaire Commercial"
  catalogues: { title: string; pages: string; size: string; desc: string }[]
  applications: string[]
}

export const BRANDS: Brand[] = [
  {
    id: "spirax-sarco",
    name: "Spirax Sarco",
    origin: "Royaume-Uni",
    specialty: "Régulation Vapeur",
    desc: "Leader mondial de la gestion de la vapeur et des fluides de process. Purgeurs, vannes de régulation, séparateurs, échangeurs et systèmes de récupération des condensats.",
    longDesc: "Fondé en 1888, Spirax Sarco est le leader mondial incontesté de la gestion de la vapeur industrielle. Avec plus de 130 ans d'expérience et des équipes d'ingénieurs présentes dans 60 pays, Spirax Sarco est le référent technique pour tous les systèmes vapeur. Leurs produits couvrent l'ensemble du cycle vapeur — de la génération à la récupération des condensats — avec une fiabilité et une longévité exemplaires dans les industries les plus exigeantes.",
    products: ["Purgeurs vapeur", "Détendeurs de pression", "Séparateurs vapeur", "Vannes de régulation", "Échangeurs thermiques", "Systèmes condensat"],
    productDetail: [
      { name: "Purgeurs vapeur", refs: ["TRAP-FT14HC", "TRAP-BK45", "TRAP-TD52", "TRAP-IFT14"] },
      { name: "Détendeurs de pression", refs: ["PRV-25P", "PRV-25S", "BRV10"] },
      { name: "Séparateurs vapeur", refs: ["SEP1-DN50", "SEP1-DN80", "AO13"] },
      { name: "Vannes de régulation", refs: ["SPIRA-TROL-K", "SPIRA-TROL-LE"] },
    ],
    sav: true,
    agree: "Distributeur Agréé",
    catalogues: [
      { title: "Catalogue Général Vapeur 2024", pages: "348 p.", size: "18 MB", desc: "Gamme complète purgeurs, séparateurs, détendeurs, vannes, échangeurs." },
      { title: "Guide de sélection des purgeurs", pages: "64 p.", size: "4 MB", desc: "Méthode de sélection, tableaux de capacités, exemples d'application." },
    ],
    applications: ["Réseau vapeur haute pression", "Stérilisation agroalimentaire", "Chauffage industriel", "Séchage et étuvage", "Process chimique"],
  },
  {
    id: "gestra",
    name: "Gestra",
    origin: "Allemagne",
    specialty: "Purgeurs & Vapeur",
    desc: "Spécialiste allemand de la technique de vapeur et des systèmes de conditionnement des condensats. Gamme UNA de purgeurs flottants haute pression et series BK/MK.",
    longDesc: "Fondée en 1902 à Brême, Gestra est une référence mondiale en technique de vapeur. Reconnue pour la robustesse et la précision de ses purgeurs flottants haute pression (série UNA), Gestra répond aux applications les plus critiques en raffinerie, chimie et pétrochimie. La marque développe également des systèmes complets de conditionnement des condensats et d'automatisation des réseaux vapeur.",
    products: ["Purgeurs flottants UNA", "Purgeurs thermodynamiques", "Régulateurs de niveau", "Clapets vapeur", "Systèmes condensat", "Vannes de régulation"],
    productDetail: [
      { name: "Purgeurs flottants", refs: ["UNA-25", "UNA-26", "UNA-45", "UNA-46"] },
      { name: "Purgeurs thermodynamiques", refs: ["MK25/2A", "MK45-1", "BK45"] },
      { name: "Systèmes condensat", refs: ["RK86A", "RKL86", "APT14"] },
    ],
    sav: true,
    agree: "Distributeur Agréé",
    catalogues: [
      { title: "Purgeurs & Conditionnement Vapeur", pages: "210 p.", size: "12 MB", desc: "Purgeurs thermostatiques, flottants, thermodynamiques, UNA series." },
      { title: "Systèmes Complets Vapeur", pages: "88 p.", size: "5 MB", desc: "Stations de régulation, modules condensat, systèmes d'automatisation." },
    ],
    applications: ["Raffinerie & Pétrochimie", "Chimie fine", "Industrie papier/carton", "Process haute pression", "Réseaux vapeur basse pression"],
  },
  {
    id: "wika",
    name: "Wika",
    origin: "Allemagne",
    specialty: "Instrumentation",
    desc: "Référence mondiale en instrumentation de mesure de pression et de température. Manomètres, thermomètres, transmetteurs, jauges de niveau pour toutes industries.",
    longDesc: "Wika (Alexander Wiegand SE & Co. KG) est le leader mondial de la mesure de la pression et de la température depuis 1946. Avec plus de 9 000 collaborateurs et des sites de production dans 16 pays, Wika couvre l'ensemble des besoins en instrumentation de process : manométrie, thermométrie, transmetteurs numériques, capteurs de niveau et systèmes d'étalonnage. Présent dans toutes les industries critiques, de la chimie à l'offshore en passant par la pharmaceutique.",
    products: ["Manomètres industriels", "Thermomètres bimétalliques", "Transmetteurs 4-20 mA", "Pressostats", "Capteurs de niveau", "Calibrateurs"],
    productDetail: [
      { name: "Manomètres", refs: ["A10-01", "S-10", "232.50", "213.53"] },
      { name: "Thermomètres", refs: ["TH10", "A52", "TF65"] },
      { name: "Transmetteurs", refs: ["S-10", "S-20", "MH-1"] },
    ],
    sav: true,
    agree: "Distributeur Agréé",
    catalogues: [
      { title: "Instrumentation de Mesure Industrielle 2024", pages: "560 p.", size: "24 MB", desc: "Manomètres, thermomètres, transmetteurs, calibrateurs — gamme complète." },
      { title: "Instruments pour la Vapeur", pages: "96 p.", size: "6 MB", desc: "Sélection dédiée aux applications vapeur — matériaux, classes de précision." },
    ],
    applications: ["Industrie chimique & pétrochimique", "Oil & Gas / Offshore", "Pharmacie & Biotech", "Agroalimentaire", "Énergie & Utilities"],
  },
  {
    id: "burkert",
    name: "Bürkert",
    origin: "Allemagne",
    specialty: "Électrovannes & Automatisme",
    desc: "Solutions de contrôle des fluides : électrovannes, vannes de process, capteurs, régulateurs et systèmes de contrôle pour l'industrie chimique, agroalimentaire et pharmaceutique.",
    longDesc: "Fondée en 1946, Bürkert Fluid Control Systems est un fabricant allemand de systèmes de contrôle de fluides reconnu pour la qualité et l'innovation de ses électrovannes et vannes de process. De l'électrovanne d'entrée de gamme aux systèmes de contrôle décentralisé EDIP (Efficient Device Integration Platform), Bürkert couvre tous les niveaux de complexité pour les applications industrielles et hygiéniques.",
    products: ["Électrovannes 2/2 et 3/2", "Vannes de process", "Régulateurs de débit", "Capteurs de débit", "Systèmes de contrôle", "Vannes aseptiques"],
    productDetail: [
      { name: "Électrovannes standard", refs: ["5282", "5404", "6013", "6014"] },
      { name: "Vannes de process", refs: ["2000", "2012", "3323"] },
      { name: "Mesure & Capteurs", refs: ["8045", "8098", "8020"] },
    ],
    sav: true,
    agree: "Distributeur Agréé",
    catalogues: [
      { title: "Vannes Automatisées & Électrovannes 2024", pages: "280 p.", size: "15 MB", desc: "Électrovannes, vannes de process, capteurs, systèmes de contrôle." },
    ],
    applications: ["Chimie & Pétrochimie", "Agroalimentaire & Boissons", "Pharmacie & Biopharma", "Traitement des eaux", "Automatisation industrielle"],
  },
  {
    id: "samson",
    name: "Samson AG",
    origin: "Allemagne",
    specialty: "Vannes de Régulation",
    desc: "Fabricant de référence en vannes de régulation et de contrôle industriel. Gamme complète de corps de vanne, actionneurs pneumatiques et positionneurs pour tous fluides.",
    longDesc: "Samson AG, fondée en 1907 à Francfort, est un fabricant de premier plan en vannes de régulation pour l'industrie de process. Leurs corps de vanne séries 3000, 3500 et 3800 couvrent toutes les tailles de DN et classes de pression ANSI/EN, avec des matériaux adaptés aux fluides les plus corrosifs. Les positionneurs HART Série 3730 sont une référence du marché pour la précision et la diagnostique avancée.",
    products: ["Vannes de régulation série 3000", "Actionneurs pneumatiques", "Positionneurs HART", "Vannes de sécurité", "Clapets industriels"],
    productDetail: [
      { name: "Corps de vanne", refs: ["3251-1", "3252", "3256", "3260"] },
      { name: "Actionneurs", refs: ["3271", "3277", "3278"] },
      { name: "Positionneurs", refs: ["3730-5", "3731-5", "3785"] },
    ],
    sav: true,
    agree: "Distributeur Agréé",
    catalogues: [
      { title: "Vannes de Régulation — Séries 3000", pages: "164 p.", size: "11 MB", desc: "Corps de vanne, actionneurs pneumatiques, positionneurs HART." },
      { title: "Positionneurs & Diagnostique", pages: "72 p.", size: "4 MB", desc: "Série 3730, HART 7, PROFIBUS, diagnostique embarqué." },
    ],
    applications: ["Raffinage & Pétrochimie", "Chimie fine", "Centrales thermiques", "Papier & Carton", "Process gaz & LNG"],
  },
  {
    id: "yoshitake",
    name: "Yoshitake",
    origin: "Japon",
    specialty: "Régulation Vapeur",
    desc: "Fabricant japonais spécialisé dans les purgeurs et régulateurs vapeur. Conception robuste, haute précision et longévité exemplaire pour les applications industrielles critiques.",
    longDesc: "Yoshitake Inc., fondée en 1936 à Nagoya, est un fabricant japonais réputé pour la qualité de ses purgeurs vapeur et régulateurs de pression. Les produits Yoshitake allient la rigueur de l'ingénierie japonaise à une robustesse mécanique exceptionnelle. Leurs purgeurs thermostatiques à bouchon et à soufflet sont particulièrement appréciés dans l'industrie textile, agroalimentaire et les réseaux de chauffage industriel.",
    products: ["Purgeurs thermostatiques", "Détendeurs vapeur", "Soupapes de sécurité", "Robinets flotteurs", "Clapets de retenue"],
    productDetail: [
      { name: "Purgeurs thermostatiques", refs: ["GTB-1A", "GTB-2A", "GT-2A"] },
      { name: "Détendeurs vapeur", refs: ["GD-8", "GD-27", "GD-28E"] },
      { name: "Soupapes de sécurité", refs: ["GS-16C", "GS-16M"] },
    ],
    sav: false,
    agree: "Distributeur Officiel",
    catalogues: [
      { title: "Catalogue Général Yoshitake", pages: "144 p.", size: "8 MB", desc: "Purgeurs, détendeurs, soupapes, robinets vapeur." },
    ],
    applications: ["Industrie textile", "Agroalimentaire & Séchage", "Chauffage industriel", "Blanchisserie industrielle", "Réseau vapeur basse pression"],
  },
  {
    id: "imi-norgren",
    name: "IMI Norgren",
    origin: "Royaume-Uni",
    specialty: "Pneumatique & Air Comprimé",
    desc: "Solutions pneumatiques et de traitement de l'air comprimé. FRL (filtres, régulateurs, lubrificateurs), actionneurs et vannes pneumatiques pour l'automatisme industriel.",
    longDesc: "IMI Norgren, division d'IMI plc, est un spécialiste mondial de la technologie de mouvement par fluide. La gamme B07 et B74 de FRL (filtres-régulateurs-lubrificateurs) est une référence pour la préparation de l'air comprimé dans les systèmes d'automatisation. Norgren couvre également les actionneurs pneumatiques, distributeurs, vannes de process et systèmes de vide pour toutes les industries d'automatisation.",
    products: ["Unités FRL", "Actionneurs pneumatiques", "Vannes directionnelles", "Régulateurs de pression", "Détecteurs de position"],
    productDetail: [
      { name: "Unités FRL", refs: ["B74G", "B07-200", "B68G"] },
      { name: "Actionneurs", refs: ["RA", "RCA", "RT"] },
      { name: "Vannes directionnelles", refs: ["V61", "V65", "SXE"] },
    ],
    sav: false,
    agree: "Distributeur Officiel",
    catalogues: [
      { title: "Pneumatique & Air Comprimé IMI Norgren", pages: "320 p.", size: "16 MB", desc: "FRL, actionneurs, distributeurs, vannes de process et régulation." },
    ],
    applications: ["Automatisation industrielle", "Industrie automobile", "Emballage & Conditionnement", "Machines outils", "Manutention"],
  },
  {
    id: "parker",
    name: "Parker Hannifin",
    origin: "États-Unis",
    specialty: "Traitement Air Comprimé",
    desc: "Leader mondial de la technologie de mouvement et de contrôle. Filtration, séchage et régulation de l'air comprimé — gamme complète pour ISO 8573 classes 1 à 5.",
    longDesc: "Parker Hannifin, fondée en 1917, est le leader mondial des technologies de mouvement et de contrôle. La division Filtration & Séparation de Parker couvre l'ensemble du traitement de l'air comprimé industriel, depuis les filtres préliminaires jusqu'aux filtres stériles pour applications pharmaceutiques. La gamme Finite Filter et les sécheurs réfrigérants série CRD sont des références de l'industrie.",
    products: ["Filtres coalescents", "Sécheurs réfrigérants", "Régulateurs pression", "Lubrificateurs", "Déshuilleurs", "Filtres stériles"],
    productDetail: [
      { name: "Filtres", refs: ["AO-MF", "AO-SH", "AO-AR"] },
      { name: "Sécheurs", refs: ["CRD010", "CRD025", "CRD060"] },
      { name: "Régulateurs", refs: ["R07-200", "R18-400"] },
    ],
    sav: false,
    agree: "Distributeur Officiel",
    catalogues: [
      { title: "Traitement Air Comprimé — Série G", pages: "196 p.", size: "9 MB", desc: "Filtres, régulateurs, lubrificateurs, sécheurs, séparateurs HO." },
    ],
    applications: ["Industrie générale", "Pharmacie & Biotech", "Agroalimentaire", "Électronique", "Industrie automobile"],
  },
  {
    id: "beko",
    name: "Beko Technologies",
    origin: "Allemagne",
    specialty: "Traitement Air & Condensats",
    desc: "Spécialiste du traitement de l'air comprimé et de la gestion des condensats. Sécheurs, filtres, séparateurs huile-eau et systèmes de récupération d'énergie.",
    longDesc: "Beko Technologies GmbH est un spécialiste allemand reconnu pour ses solutions innovantes de traitement de l'air comprimé et de gestion des condensats. La gamme BEKOKAT (décomposition catalytique des huiles) et les séparateurs ÖWAMAT représentent la technologie de pointe en matière de conformité environnementale. Beko propose également des systèmes de monitoring de la qualité de l'air en continu.",
    products: ["Sécheurs réfrigérants", "Séparateurs huile-eau", "Filtres haute précision", "Gestion condensats", "Monitoring qualité air"],
    productDetail: [
      { name: "Sécheurs", refs: ["DRYPOINT-RA-ECO", "DRYPOINT-M-ECO"] },
      { name: "Séparateurs condensat", refs: ["ÖWAMAT-10", "ÖWAMAT-14", "BEKOKAT-25"] },
      { name: "Monitoring", refs: ["METPOINT-OCV", "METPOINT-BDL"] },
    ],
    sav: false,
    agree: "Distributeur Officiel",
    catalogues: [
      { title: "Solutions Air Comprimé Industriel Beko", pages: "120 p.", size: "7 MB", desc: "Sécheurs réfrigérants, dessicants, filtration, condensats." },
    ],
    applications: ["Industrie générale", "Pharmacie", "Traitement eaux & effluents", "Agroalimentaire", "Chimie verte"],
  },
  {
    id: "vega",
    name: "Vega",
    origin: "Allemagne",
    specialty: "Mesure de Niveau & Pression",
    desc: "Instrumentation de niveau et de pression pour process difficiles. Capteurs radar 80 GHz, capacitifs, hydrostatiques et à ondes guidées pour liquides, solides et interfaces.",
    longDesc: "Vega Grieshaber KG, fondée en 1959, est le spécialiste mondial de la mesure de niveau et de la pression de process pour les applications difficiles. La technologie radar VEGAPULS à 80 GHz représente l'état de l'art pour la mesure sans contact, y compris pour les liquides sous vapeur, les solides pulvérulents et les milieux à forte viscosité. La plateforme numérique VEGA Connect simplifie la configuration, la maintenance et la surveillance à distance.",
    products: ["Radars VEGAPULS", "Capteurs capacitifs", "Hydrostatiques", "Ondes guidées", "Systèmes de visualisation"],
    productDetail: [
      { name: "Radars de niveau", refs: ["VEGAPULS-64", "VEGAPULS-C21", "VEGAPULS-31"] },
      { name: "Capteurs pression", refs: ["VEGABAR-82", "VEGABAR-87"] },
      { name: "Afficheurs", refs: ["VEGADIS-81", "VEGADIS-82"] },
    ],
    sav: false,
    agree: "Distributeur Officiel",
    catalogues: [
      { title: "Instrumentation de Niveau & Pression Vega", pages: "230 p.", size: "13 MB", desc: "Radars, capacitifs, hydrostatiques, guidés — VEGAPULS series." },
    ],
    applications: ["Chimie & Pétrochimie", "Agroalimentaire", "Traitement des eaux", "Mines & Cimenteries", "Pharmacie"],
  },
  {
    id: "emerson",
    name: "Emerson",
    origin: "États-Unis",
    specialty: "Automatisme & Régulation",
    desc: "Technologies d'automatisation industrielle et d'instrumentation. Vannes Fisher, transmetteurs Rosemount et systèmes DCS DeltaV pour les industries de process.",
    longDesc: "Emerson Electric, fondée en 1890, est l'un des plus grands groupes industriels mondiaux spécialisés dans les technologies d'automatisation et de contrôle. La division Final Control (vannes Fisher) et la division Measurement & Analytical (Rosemount) sont des références mondiales dans leurs domaines respectifs. Emerson intervient dans les industries les plus critiques : oil & gas, raffinage, nucléaire, chimie et LNG.",
    products: ["Vannes de régulation Fisher", "Transmetteurs Rosemount", "Actionneurs", "Analyseurs", "Systèmes DCS"],
    productDetail: [
      { name: "Vannes de régulation", refs: ["Fisher-EZ", "Fisher-D3", "Fisher-ET"] },
      { name: "Transmetteurs", refs: ["Rosemount-3051", "Rosemount-644", "Rosemount-8732"] },
    ],
    sav: false,
    agree: "Partenaire Commercial",
    catalogues: [
      { title: "Vannes & Instruments Emerson", pages: "400 p.", size: "22 MB", desc: "Vannes Fisher, transmetteurs Rosemount, actionneurs, systèmes DCS." },
    ],
    applications: ["Oil & Gas / Raffinage", "Chimie & Pétrochimie", "Nucléaire", "LNG & Gaz naturel", "Mines"],
  },
  {
    id: "festo",
    name: "Festo",
    origin: "Allemagne",
    specialty: "Pneumatique & Automatisme",
    desc: "Leader en technologie pneumatique et en automatisation de process. Actionneurs, distributeurs, terminaux de vannes et solutions d'entraînement électrique.",
    longDesc: "Festo AG & Co. KG, fondée en 1925 à Esslingen, est le leader mondial de la technologie pneumatique et l'un des principaux acteurs de l'automatisation industrielle. La gamme comprend plus de 30 000 références couvrant la totalité du spectre de l'automatisation : actionneurs pneumatiques, distributeurs, terminaux de vannes CPX/MPA, systèmes électriques et solutions IoT pour l'industrie 4.0.",
    products: ["Actionneurs linéaires", "Distributeurs pneumatiques", "Terminaux de vannes", "Vérins pneumatiques", "Entraînements électriques"],
    productDetail: [
      { name: "Actionneurs & vérins", refs: ["DSNU", "ADN", "DSBC"] },
      { name: "Distributeurs", refs: ["VUVS", "VUVB", "MH"] },
      { name: "Terminaux de vannes", refs: ["CPX-MPA", "VTUG", "VTOC"] },
    ],
    sav: false,
    agree: "Partenaire Commercial",
    catalogues: [
      { title: "Pneumatique & Automatisme Festo", pages: "520 p.", size: "28 MB", desc: "Actionneurs, distributeurs, terminaux, drives électriques, IoT." },
    ],
    applications: ["Automatisation industrielle", "Emballage & Logistique", "Industrie automobile", "Machines spéciales", "Robotique"],
  },
]

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find(b => b.id === slug)
}

export function getAllBrandSlugs(): string[] {
  return BRANDS.map(b => b.id)
}
