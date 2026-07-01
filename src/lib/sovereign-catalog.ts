// SOVEREIGN OS — locked Paystack catalog.
// SOURCE OF TRUTH. Every slug here must be a real Paystack payment page.
// Do NOT invent slugs. Do NOT reference SKUs outside this list.

export type Intent = "fat-loss" | "glute" | "muscle" | "wellness" | "meal" | "elite";

export interface SovereignSKU {
  slug: string;              // paystack.shop/pay/<slug> — verified
  name: string;
  tagline: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  priceNGN: number;
  intents: Intent[];
  description: string;
  badge?: string;
}

export const SOVEREIGN_CATALOG: SovereignSKU[] = [
  {
    slug: "resoflex-commander",
    name: "ResoFlex Commander",
    tagline: "Entry protocol · fat-loss trigger.",
    tier: 1,
    priceNGN: 12_000,
    intents: ["fat-loss", "wellness"],
    description: "Tier 1 entry — the metabolic reset kit that opens the funnel. First-time operators start here.",
    badge: "TIER 1 · ENTRY",
  },
  {
    slug: "resoflex-kinetic",
    name: "ResoFlex Kinetic",
    tagline: "Kinetic conditioning stack.",
    tier: 2,
    priceNGN: 18_000,
    intents: ["fat-loss", "muscle"],
    description: "Tier 2 conditioning — kinetic training + supplement stack. Post-Commander upgrade path.",
    badge: "TIER 2",
  },
  {
    slug: "resoflex-meal-move",
    name: "ResoFlex Meal & Move",
    tagline: "Meal engine + training loop.",
    tier: 3,
    priceNGN: 25_000,
    intents: ["fat-loss", "wellness", "meal"],
    description: "Tier 3 daily protocol — meal engineering fused with movement programming. The habit lock.",
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
    slug: "wellness-protocol",
    name: "Wellness Protocol",
    tagline: "Recovery · hormones · sleep.",
    tier: 4,
    priceNGN: 35_000,
    intents: ["wellness"],
    description: "Tier 4 recovery layer — hormonal balance, sleep optimization, stress modulation.",
    badge: "TIER 4",
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
    slug: "resoflex-ascension-bundle",
    name: "ResoFlex Ascension Bundle",
    tagline: "Full-stack transformation.",
    tier: 5,
    priceNGN: 75_000,
    intents: ["fat-loss", "muscle", "glute", "wellness", "meal"],
    description: "Tier 5 — Commander + Kinetic + Meal & Move + Wellness rolled into one deploy. Best value.",
    badge: "TIER 5 · BUNDLE",
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

export function paystackUrl(slug: string): string {
  return `https://paystack.shop/pay/${slug}`;
}

export function skusByTier(tier: SovereignSKU["tier"]): SovereignSKU[] {
  return SOVEREIGN_CATALOG.filter((s) => s.tier === tier);
}
