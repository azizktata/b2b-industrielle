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
    id: "sectoriel", 
    name: "Sectoriel", 
    origin: "Tunisie", 
    specialty: "Distribution Industrielle", 
    desc: "Distributeur multi-marques spécialisé en vapeur, air comprimé et instrumentation.", 
    longDesc: "Sectoriel est un distributeur industriel spécialisé dans les équipements de régulation vapeur, d’air comprimé et d’instrumentation. Il propose une sélection de marques internationales reconnues et accompagne les industriels dans leurs projets techniques.", 
    products: [], 
    productDetail: [], 
    sav: true, 
    agree: "Distributeur Officiel", 
    catalogues: [], 
    applications: ["Réseau vapeur", "Air comprimé", "Instrumentation industrielle"], 
  }, 
  { 
    id: "samson", 
    name: "Samson", 
    origin: "Allemagne", 
    specialty: "Vannes de Régulation", 
    desc: "Fabricant de référence en vannes de régulation et systèmes de contrôle industriel.", 
    longDesc: "Samson est un fabricant allemand reconnu pour ses vannes de régulation, actionneurs et positionneurs destinés aux industries de process. La marque est une référence mondiale pour la précision et la fiabilité de ses équipements.", 
    products: ["Vannes de régulation", "Actionneurs", "Positionneurs"], 
    productDetail: [], 
    sav: true, 
    agree: "Partenaire Commercial", 
    catalogues: [], 
    applications: ["Raffinage", "Chimie", "Énergie", "Process industriel"], 
  }, 
  { 
    id: "mival", 
    name: "Mival", 
    origin: "Italie", 
    specialty: "Robinetterie Industrielle", 
    desc: "Fabricant italien de robinetterie industrielle pour fluides et process.", 
    longDesc: "Mival est un fabricant italien spécialisé dans la robinetterie industrielle, notamment les vannes à bille, vannes papillon et solutions pour le contrôle des fluides dans les installations industrielles.", 
    products: ["Vannes à bille", "Vannes papillon"], 
    productDetail: [], 
    sav: false, 
    agree: "Distributeur Officiel", 
    catalogues: [], 
    applications: ["Traitement des fluides", "Industrie générale"], 
  }, 
  { 
    id: "adca", 
    name: "Adca", 
    origin: "Portugal", 
    specialty: "Régulation Vapeur", 
    desc: "Spécialiste des équipements vapeur : purgeurs, vannes et régulateurs.", 
    longDesc: "ADCA est un fabricant européen spécialisé dans les équipements pour réseaux vapeur : purgeurs, détendeurs, vannes de régulation et accessoires. La marque est reconnue pour son excellent rapport qualité/prix.", 
    products: ["Purgeurs vapeur", "Détendeurs", "Vannes de régulation"], 
    productDetail: [], 
    sav: true, 
    agree: "Distributeur Officiel", 
    catalogues: [], 
    applications: ["Réseau vapeur", "Chauffage industriel"], 
  }, 
  { 
    id: "sferaco", 
    name: "Sferaco", 
    origin: "France", 
    specialty: "Robinetterie & Plomberie Industrielle", 
    desc: "Fabricant de robinetterie industrielle et accessoires pour fluides.", 
    longDesc: "Sferaco est une marque française spécialisée dans la robinetterie industrielle, les raccords et accessoires pour réseaux d’eau, gaz et fluides industriels.", 
    products: ["Vannes", "Raccords", "Clapets"], 
    productDetail: [], 
    sav: false, 
    agree: "Distributeur Officiel", 
    catalogues: [], 
    applications: ["Eau", "Gaz", "Industrie générale"], 
  }, 
  { 
    id: "ifm", 
    name: "Ifm", 
    origin: "Allemagne", 
    specialty: "Instrumentation & Capteurs", 
    desc: "Capteurs industriels et solutions d’automatisation.", 
    longDesc: "IFM est un fabricant allemand de capteurs industriels, systèmes d’automatisation et solutions IoT pour l’industrie. La marque est reconnue pour la fiabilité et la simplicité d’intégration de ses produits.", 
    products: ["Capteurs", "Détecteurs", "Automatisation"], 
    productDetail: [], 
    sav: false, 
    agree: "Distributeur Officiel", 
    catalogues: [], 
    applications: ["Automatisation industrielle", "Instrumentation"], 
  }, 
] 
 
export function getBrandBySlug(slug: string): Brand | undefined { 
  return BRANDS.find(b => b.id === slug) 
} 
 
export function getAllBrandSlugs(): string[] { 
  return BRANDS.map(b => b.id) 
} 