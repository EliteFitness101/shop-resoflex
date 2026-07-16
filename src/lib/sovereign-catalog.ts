// SOVEREIGN OS — locked Paystack catalog.
// SOURCE OF TRUTH. Every slug here maps to a real Paystack payment page
// (or a funnel entry URL for free tier). Do NOT invent slugs.
// Prices synchronized with NaijaFit™ ladder v1.2.

export type Intent = "fat-loss" | "glute" | "muscle" | "wellness" | "meal" | "elite" | "shapewear";

export interface SovereignSKU {
  slug: string;                 // /products/<slug> — internal route
  name: string;
  tagline: string;
  tier: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  priceNGN: number;             // 0 = free entry
  intents: Intent[];
  description: string;
  badge?: string;
  // Optional override: full checkout URL (used for paystack.com/buy links
  // and the free-tier funnel entry). When absent, paystackUrl() falls back
  // to paystack.shop/pay/<slug>.
  checkoutUrl?: string;
}

export const FUNNEL_ENTRY_URL =
  "https://joy-funnel-ai.lovable.app/?rsid=rs_daaee90990874cc8b5e5&utm_source=resoflex_os&utm_medium=spa&utm_campaign=sovereign_os_v4_2&cta=sticky_mobile&funnel_origin=resoflex_os";

export const SOVEREIGN_CATALOG: SovereignSKU[] = [
  {
    slug: "naijafit-7day-free",
    name: "NaijaFit™ 7-Day Smart Meal Plan",
    tagline: "Free entry · funnel ignition.",
    tier: 0,
    priceNGN: 0,
    intents: ["meal", "wellness"],
    description: "Free 7-day smart Nigerian meal plan — jollof, ofada, moi moi, plantain, grilled fish. First-touch operator lead magnet — routes into the sovereign funnel.",
    badge: "FREE · ENTRY",
    checkoutUrl: FUNNEL_ENTRY_URL,
  },
  {
    slug: "heritage-meal",
    name: "Heritage Meal Plan",
    tagline: "Naija-native macro system.",
    tier: 1,
    priceNGN: 5_000,
    intents: ["meal", "wellness"],
    description: "Regional meal architecture — jollof, ofada, egusi, banga, moi moi, boiled yam, plantain rebuilt clean. Halal-flagged, macro-precise, Nigerian-first.",
    badge: "TIER 1 · IGNITION",
  },
  {
    slug: "resoflex-meal-move",
    name: "Enhanced Meal & Move",
    tagline: "Meal engine + training loop.",
    tier: 1,
    priceNGN: 5_000,
    intents: ["fat-loss", "wellness", "meal", "muscle"],
    description: "Enhanced Nigerian meal engineering fused with movement programming — daily protocol, portion-controlled jollof, sweet potatoes, oat swallow, grilled chicken.",
    badge: "TIER 1",
  },
  {
    slug: "fitness-evolution",
    name: "Fitness Evolution Meal & Workout",
    tagline: "Structured Naija transformation.",
    tier: 2,
    priceNGN: 10_000,
    intents: ["fat-loss", "muscle", "meal", "wellness"],
    description: "Fitness Evolution meal + workout system — Nigerian pantry macros (beans, moi moi, plantain, egg sauce), progressive strength loop, weekly progression checkpoints.",
    badge: "TIER 2",
    checkoutUrl: "https://paystack.shop/pay/fitness-evolution",
  },
  {
    slug: "resoflex-kinetic",
    name: "Personalized Meal & Workout",
    tagline: "Exit-intent operator offer.",
    tier: 3,
    priceNGN: 15_000,
    intents: ["fat-loss", "muscle", "wellness", "meal"],
    description: "Fully personalized Nigerian meal and workout program — vegetable soup, ofada, grilled fish, chicken breast, tigernuts, Greek yogurt. Adaptive weekly loops.",
    badge: "TIER 3 · PERSONALIZED",
  },
  {
    slug: "resoflex-commander",
    name: "Premium Meal & Workout + BioSync Scale",
    tagline: "Premium stack · free BioSync scale.",
    tier: 4,
    priceNGN: 25_000,
    intents: ["fat-loss", "muscle", "wellness", "meal"],
    description: "Premium Nigerian meal & workout command — ships with the ResoFlex Digital BioSync Weighing Scale included. Full personalization, 1:1 coaching layer, telemetry review.",
    badge: "TIER 4 · COMMANDER",
  },
  {
    slug: "resoflex-mens-tank",
    name: "ResoFlex™ Men's Sleeveless Fitness Tank",
    tagline: "Sweat-wicking · XS to XXXL.",
    tier: 2,
    priceNGN: 12_000,
    intents: ["muscle", "wellness"],
    description: "Signature men's sleeveless fitness tank — breathable performance knit, engineered fit for training and street. Sizes XS · S · M · L · XL · XXL · XXXL.",
    badge: "APPAREL",
  },
  {
    slug: "resoflex-ladies-2piece",
    name: "ResoFlex™ Ladies 2-Piece Sports Set",
    tagline: "Curve-sculpting · XS to XXXL.",
    tier: 3,
    priceNGN: 22_500,
    intents: ["shapewear", "wellness", "muscle"],
    description: "Two-piece sports set — princess-seam contouring, high-rise compression, four-way stretch. Studio-to-street. Sizes XS · S · M · L · XL · XXL · XXXL.",
    badge: "APPAREL",
  },
  {
    slug: "buttgrowthb2k",
    name: "ButtGrowth B2K Premium",
    tagline: "Glute hypertrophy program.",
    tier: 4,
    priceNGN: 35_000,
    intents: ["glute", "muscle"],
    description: "Targeted glute + posterior-chain hypertrophy. 12-week progressive-load system.",
    badge: "SPECIALIST",
  },
  {
    slug: "25-steel-boned-latex-shaper",
    name: "25 Steel Boned Latex Shaper",
    tagline: "Signature waist compression.",
    tier: 4,
    priceNGN: 35_000,
    intents: ["shapewear", "wellness"],
    description: "Twenty-five steel-boned latex waist trainer. Medical-grade compression, curve-sculpting, all-day wear.",
    badge: "SHAPEWEAR",
    checkoutUrl: "https://paystack.com/buy/25-steel-boned-latex-shaper-whtfvh",
  },
  {
    slug: "resoflex-commander",
    name: "NaijaFit™ Complete Personalized Wellness Package",
    tagline: "Full-stack sovereign command.",
    tier: 5,
    priceNGN: 45_000,
    intents: ["fat-loss", "muscle", "wellness", "meal"],
    description: "Complete personalized wellness command — 1:1 coaching layer, full meal + workout stack, telemetry review, sovereign concierge.",
    badge: "TIER 5 · COMMANDER",
  },
  {
    slug: "resoflex-ascension-bundle",
    name: "ResoFlex Ascension Bundle",
    tagline: "Full-stack transformation.",
    tier: 5,
    priceNGN: 75_000,
    intents: ["fat-loss", "muscle", "glute", "wellness", "meal"],
    description: "Commander + Kinetic + Meal & Move + Wellness rolled into one deploy. Best-value bundle.",
    badge: "TIER 5 · BUNDLE",
    checkoutUrl: "https://paystack.com/buy/the-resoflex-ascension-bundle-fgrcoy",
  },
  {
    slug: "resoflex-vip-preorder",
    name: "ResoFlex VIP Preorder",
    tagline: "Sovereign concierge access.",
    tier: 6,
    priceNGN: 150_000,
    intents: ["elite"],
    description: "Tier 6 — private-line coaching, early drops, direct founder access. Capped seats per quarter.",
    badge: "TIER 6 · ELITE",
  },
];

export const CATALOG_BY_SLUG = new Map(SOVEREIGN_CATALOG.map((s) => [s.slug, s]));

export function getSKU(slug: string): SovereignSKU | undefined {
  return CATALOG_BY_SLUG.get(slug);
}

// Returns the verified checkout URL for a SKU.
// Honors per-SKU override (paystack.com/buy or funnel entry).
export function paystackUrl(slug: string): string {
  const sku = CATALOG_BY_SLUG.get(slug);
  if (sku?.checkoutUrl) return sku.checkoutUrl;
  return `https://paystack.shop/pay/${slug}`;
}

export function skusByTier(tier: SovereignSKU["tier"]): SovereignSKU[] {
  return SOVEREIGN_CATALOG.filter((s) => s.tier === tier);
}
