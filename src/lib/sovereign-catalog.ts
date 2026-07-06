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
    description: "Free 7-day smart Nigerian meal plan. First-touch operator lead magnet — routes into the sovereign funnel.",
    badge: "FREE · ENTRY",
    checkoutUrl: FUNNEL_ENTRY_URL,
  },
  {
    slug: "naijafit-5000",
    name: "NaijaFit™ Enhanced Wellness Meal Plan",
    tagline: "Enhanced meal engineering.",
    tier: 1,
    priceNGN: 5_000,
    intents: ["meal", "wellness"],
    description: "Enhanced Nigerian wellness meal plan — regional macros, halal-flagged, cost-optimized for local pantry.",
    badge: "TIER 1 · IGNITION",
  },
  {
    slug: "resoflex-meal-move",
    name: "NaijaFit™ Personalized Meal & Workout Plan",
    tagline: "Meal engine + training loop.",
    tier: 2,
    priceNGN: 15_000,
    intents: ["fat-loss", "wellness", "meal", "muscle"],
    description: "Personalized meal engineering fused with movement programming. Daily protocol — the habit lock.",
    badge: "TIER 2",
  },
  {
    slug: "wellness-protocol",
    name: "NaijaFit™ Premium Wellness + Digital Scale",
    tagline: "Premium wellness · free scale.",
    tier: 3,
    priceNGN: 25_000,
    intents: ["wellness"],
    description: "Premium wellness protocol — hormonal balance, recovery, sleep. Ships with free digital body-composition scale.",
    badge: "TIER 3",
  },
  {
    slug: "heritage-meal",
    name: "Heritage Meal Protocol",
    tagline: "Naija-native macro system.",
    tier: 3,
    priceNGN: 25_000,
    intents: ["meal", "wellness"],
    description: "Regional meal architecture — jollof, egusi, banga rebuilt clean. Halal-flagged, macro-precise.",
  },
  {
    slug: "resoflex-kinetic",
    name: "NaijaFit™ Diabetic Meal & Wellness Program",
    tagline: "Diabetic-safe · glucose-stable.",
    tier: 4,
    priceNGN: 30_000,
    intents: ["wellness", "meal"],
    description: "Diabetic-safe meal and wellness program — glycemic-controlled Nigerian recipes, glucose stability, medical-grade tracking.",
    badge: "TIER 4 · SPECIALIST",
  },
  {
    slug: "buttgrowthb2k",
    name: "ButtGrowth B2K",
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
