// Collection registry — Phase 4 of the v3.0 patch.
// Additive: describes the 16 production collections and which locked
// SOVEREIGN_CATALOG slugs belong to each. No catalog duplication.

import { SOVEREIGN_CATALOG, type SovereignSKU } from "./sovereign-catalog";

export type CollectionType =
  | "category"
  | "curated"
  | "digital"
  | "membership"
  | "bundle"
  | "corporate"
  | "algorithmic";

export type Goal = "fat_loss" | "muscle_building" | "strength" | "mobility" | "longevity";
export type Experience = "beginner" | "intermediate" | "advanced";

export interface CollectionDef {
  code: string;
  name: string;
  type: CollectionType;
  parent?: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  displayOrder: number;
  visibility: "public" | "hidden";
  chatb2kPriority: number;
  landingPageSlug: string;
  /** Locked catalog slugs that belong to this collection. */
  skus: string[];
  goals: Goal[];
}

const S = {
  free: "naijafit-7day-free",
  heritage: "heritage-meal",
  mealMove: "resoflex-meal-move",
  evolution: "fitness-evolution",
  kinetic: "resoflex-kinetic",
  commander: "resoflex-commander",
  mensTank: "resoflex-mens-tank",
  ladiesSet: "resoflex-ladies-2piece",
  glute: "buttgrowthb2k",
  shaper: "25-steel-boned-latex-shaper",
  station: "resoflex-station-gym",
  bundle: "resoflex-ascension-bundle",
  vip: "resoflex-vip-preorder",
};

export const COLLECTIONS: CollectionDef[] = [
  {
    code: "commercial-luxe",
    name: "Commercial Luxe",
    type: "curated",
    description: "Flagship commercial-grade equipment and premium command stacks.",
    seoTitle: "Commercial Luxe — Premium Fitness Equipment | ResoFlex OS™",
    metaDescription: "Commercial-grade Nigerian fitness equipment and premium coaching stacks from ResoFlex OS™.",
    displayOrder: 1,
    visibility: "public",
    chatb2kPriority: 60,
    landingPageSlug: "commercial-luxe",
    skus: [S.station, S.commander, S.vip],
    goals: ["strength", "muscle_building"],
  },
  {
    code: "home-gym-essentials",
    name: "Home Gym Essentials",
    type: "category",
    description: "Everything required to build a sovereign home training deck.",
    seoTitle: "Home Gym Essentials | ResoFlex OS™",
    metaDescription: "Compact, high-output home gym equipment engineered for Nigerian homes.",
    displayOrder: 2,
    visibility: "public",
    chatb2kPriority: 55,
    landingPageSlug: "home-gym-essentials",
    skus: [S.station, S.mealMove],
    goals: ["strength", "muscle_building", "fat_loss"],
  },
  {
    code: "coach-buchi-signature",
    name: "Coach Buchi Signature Collection",
    type: "curated",
    description: "Programs personally architected by Coach Buchi.",
    seoTitle: "Coach Buchi Signature Collection | ResoFlex OS™",
    metaDescription: "Signature transformation programs designed by Coach Buchi for Nigerian operators.",
    displayOrder: 3,
    visibility: "public",
    chatb2kPriority: 85,
    landingPageSlug: "coach-buchi-signature",
    skus: [S.commander, S.kinetic, S.glute],
    goals: ["fat_loss", "muscle_building"],
  },
  {
    code: "best-sellers",
    name: "Best Sellers",
    type: "algorithmic",
    description: "Highest-converting protocols across the ladder.",
    seoTitle: "Best Sellers | ResoFlex OS™",
    metaDescription: "The most-purchased ResoFlex meal, training and apparel protocols.",
    displayOrder: 4,
    visibility: "public",
    chatb2kPriority: 70,
    landingPageSlug: "best-sellers",
    skus: [S.evolution, S.kinetic, S.ladiesSet, S.shaper],
    goals: ["fat_loss", "muscle_building"],
  },
  {
    code: "mens-activewear",
    name: "Men's Activewear",
    type: "category",
    parent: "performance-activewear",
    description: "Engineered men's training apparel.",
    seoTitle: "Men's Activewear | ResoFlex OS™",
    metaDescription: "Sweat-wicking men's training apparel, XS to XXXL.",
    displayOrder: 5,
    visibility: "public",
    chatb2kPriority: 40,
    landingPageSlug: "mens-activewear",
    skus: [S.mensTank],
    goals: ["muscle_building", "strength"],
  },
  {
    code: "womens-activewear",
    name: "Women's Activewear",
    type: "category",
    parent: "performance-activewear",
    description: "Contoured women's performance sets.",
    seoTitle: "Women's Activewear | ResoFlex OS™",
    metaDescription: "Curve-sculpting women's activewear sets, XS to XXXL.",
    displayOrder: 6,
    visibility: "public",
    chatb2kPriority: 45,
    landingPageSlug: "womens-activewear",
    skus: [S.ladiesSet],
    goals: ["fat_loss", "mobility"],
  },
  {
    code: "curvy-collection",
    name: "Curvy Collection",
    type: "category",
    parent: "womens-activewear",
    description: "Plus-friendly contouring pieces, XS through XXXL.",
    seoTitle: "Curvy Collection | ResoFlex OS™",
    metaDescription: "Plus-size friendly Nigerian fitness fashion with true XS–XXXL sizing.",
    displayOrder: 7,
    visibility: "public",
    chatb2kPriority: 50,
    landingPageSlug: "curvy-collection",
    skus: [S.ladiesSet, S.shaper],
    goals: ["fat_loss", "longevity"],
  },
  {
    code: "performance-activewear",
    name: "Performance Activewear",
    type: "category",
    description: "All ResoFlex™ performance apparel.",
    seoTitle: "Performance Activewear | ResoFlex OS™",
    metaDescription: "Four-way stretch performance apparel engineered for training and street.",
    displayOrder: 8,
    visibility: "public",
    chatb2kPriority: 42,
    landingPageSlug: "performance-activewear",
    skus: [S.mensTank, S.ladiesSet],
    goals: ["muscle_building", "mobility"],
  },
  {
    code: "combat-training",
    name: "Combat Training",
    type: "category",
    description: "Conditioning protocols for combat-style output.",
    seoTitle: "Combat Training | ResoFlex OS™",
    metaDescription: "High-output conditioning programs for combat and athletic performance.",
    displayOrder: 9,
    visibility: "public",
    chatb2kPriority: 35,
    landingPageSlug: "combat-training",
    skus: [S.evolution, S.mealMove],
    goals: ["fat_loss", "strength"],
  },
  {
    code: "gym-accessories",
    name: "Gym Accessories",
    type: "category",
    description: "Support gear, shapers and training accessories.",
    seoTitle: "Gym Accessories | ResoFlex OS™",
    metaDescription: "Waist trainers, support gear and accessories for daily training.",
    displayOrder: 10,
    visibility: "public",
    chatb2kPriority: 30,
    landingPageSlug: "gym-accessories",
    skus: [S.shaper],
    goals: ["fat_loss", "mobility"],
  },
  {
    code: "digital-programs",
    name: "Digital Programs",
    type: "digital",
    description: "Instantly delivered training and transformation systems.",
    seoTitle: "Digital Programs | ResoFlex OS™",
    metaDescription: "Instant-download Nigerian training and transformation programs.",
    displayOrder: 11,
    visibility: "public",
    chatb2kPriority: 75,
    landingPageSlug: "digital-programs",
    skus: [S.evolution, S.kinetic, S.glute, S.mealMove],
    goals: ["fat_loss", "muscle_building", "strength"],
  },
  {
    code: "meal-plans",
    name: "Meal Plans",
    type: "digital",
    description: "Nigerian-first macro architecture — jollof, ofada, egusi, moi moi.",
    seoTitle: "Nigerian Meal Plans | ResoFlex OS™",
    metaDescription: "Macro-precise Nigerian meal plans built on jollof, ofada, egusi and moi moi.",
    displayOrder: 12,
    visibility: "public",
    chatb2kPriority: 90,
    landingPageSlug: "meal-plans",
    skus: [S.free, S.heritage, S.mealMove, S.evolution],
    goals: ["fat_loss", "longevity"],
  },
  {
    code: "memberships",
    name: "Memberships",
    type: "membership",
    description: "Recurring coaching and telemetry access.",
    seoTitle: "Memberships | ResoFlex OS™",
    metaDescription: "Ongoing coaching, telemetry review and concierge membership tiers.",
    displayOrder: 13,
    visibility: "public",
    chatb2kPriority: 65,
    landingPageSlug: "memberships",
    skus: [S.commander, S.vip],
    goals: ["longevity", "muscle_building"],
  },
  {
    code: "vip-bundles",
    name: "VIP Bundles",
    type: "bundle",
    description: "Full-stack deployments at bundle economics.",
    seoTitle: "VIP Bundles | ResoFlex OS™",
    metaDescription: "Best-value ResoFlex bundles combining meals, training and coaching.",
    displayOrder: 14,
    visibility: "public",
    chatb2kPriority: 80,
    landingPageSlug: "vip-bundles",
    skus: [S.bundle, S.vip],
    goals: ["fat_loss", "muscle_building", "longevity"],
  },
  {
    code: "corporate-wellness",
    name: "Corporate Wellness",
    type: "corporate",
    description: "Team and enterprise wellness deployments.",
    seoTitle: "Corporate Wellness | ResoFlex OS™",
    metaDescription: "Corporate wellness deployments for Nigerian teams and enterprises.",
    displayOrder: 15,
    visibility: "public",
    chatb2kPriority: 25,
    landingPageSlug: "corporate-wellness",
    skus: [S.bundle, S.station, S.heritage],
    goals: ["longevity", "mobility"],
  },
  {
    code: "chatb2k-recommended",
    name: "ChatB2K Recommended",
    type: "algorithmic",
    description: "Dynamically ranked by the ChatB2K™ personalization engine.",
    seoTitle: "ChatB2K Recommended | ResoFlex OS™",
    metaDescription: "AI-ranked product recommendations from the ChatB2K™ coaching engine.",
    displayOrder: 16,
    visibility: "public",
    chatb2kPriority: 100,
    landingPageSlug: "chatb2k-recommended",
    skus: [],
    goals: ["fat_loss", "muscle_building", "strength", "mobility", "longevity"],
  },
];

export const COLLECTION_BY_CODE = new Map(COLLECTIONS.map((c) => [c.code, c]));

export function getCollection(code: string): CollectionDef | undefined {
  return COLLECTION_BY_CODE.get(code);
}

/** Collections a given SKU slug belongs to. */
export function collectionsForSKU(slug: string): CollectionDef[] {
  return COLLECTIONS.filter((c) => c.skus.includes(slug));
}

/** Resolved SKU objects for a collection (algorithmic collections resolve empty). */
export function skusForCollection(code: string): SovereignSKU[] {
  const c = COLLECTION_BY_CODE.get(code);
  if (!c) return [];
  return c.skus
    .map((slug) => SOVEREIGN_CATALOG.find((s) => s.slug === slug))
    .filter((s): s is SovereignSKU => !!s);
}

/** Goal tags derived from a SKU's locked intents. */
export function goalsForSKU(sku: SovereignSKU): Goal[] {
  const g = new Set<Goal>();
  for (const i of sku.intents) {
    if (i === "fat-loss") g.add("fat_loss");
    if (i === "muscle" || i === "glute") g.add("muscle_building");
    if (i === "muscle") g.add("strength");
    if (i === "shapewear") g.add("mobility");
    if (i === "wellness" || i === "meal" || i === "elite") g.add("longevity");
  }
  if (g.size === 0) g.add("longevity");
  return [...g];
}

/** Experience fit derived from tier: low tiers suit beginners, high tiers advanced. */
export function experienceForSKU(sku: SovereignSKU): Experience[] {
  if (sku.tier <= 1) return ["beginner", "intermediate"];
  if (sku.tier <= 3) return ["beginner", "intermediate", "advanced"];
  return ["intermediate", "advanced"];
}
