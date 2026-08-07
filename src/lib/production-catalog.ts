// PRODUCTION CATALOG — ResoFit OS™ store.resofit.fit
// Additive layer. Does NOT replace SOVEREIGN_CATALOG, checkout, webhooks or
// Revenue OS. It supplies fully launch-ready catalog records, an image
// manifest, upload queue, collection + cross-sell mappings, a search index,
// SEO metadata and an asset readiness report.

export const STORE_ORIGIN = "https://store.resofit.fit";
export const BRAND = "ResoFit OS™";

export type ProdCategory =
  | "digital"
  | "coaching"
  | "equipment"
  | "bundle";

export type ProdStatus = "active" | "draft" | "archived";

export interface ProductImageSet {
  hero: string;
  thumb: string;
  gallery: string[];
  lifestyle: string;
  detail: string;
  seo: string;
}

export interface ProductFAQ {
  q: string;
  a: string;
}

export interface ShippingRules {
  requiresShipping: boolean;
  freeShipping: boolean;
  weightKg?: number;
  dispatchDays?: number;
  zones?: string[];
  note: string;
}

export interface ProductionProduct {
  id: string;
  sku: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProdCategory;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  currency: "NGN";
  stock: number | null; // null = unlimited (digital)
  status: ProdStatus;
  images: ProductImageSet;
  altText: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  specifications: Record<string, string>;
  faq: ProductFAQ[];
  shipping: ShippingRules;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  tags: string[];
  goals: string[];
  shopifySku: string;
  paystackSku: string;
  featured: boolean;
  recommended: boolean;
  active: boolean;
  /** Bundle contents by SKU. */
  contains?: string[];
}

const img = (slug: string): ProductImageSet => ({
  hero: `/images/products/${slug}/hero.webp`,
  thumb: `/images/products/${slug}/thumb.webp`,
  gallery: [
    `/images/products/${slug}/gallery-1.webp`,
    `/images/products/${slug}/gallery-2.webp`,
    `/images/products/${slug}/gallery-3.webp`,
  ],
  lifestyle: `/images/products/${slug}/lifestyle.webp`,
  detail: `/images/products/${slug}/detail.webp`,
  seo: `/images/products/${slug}/seo.webp`,
});

const digitalShipping = (note: string): ShippingRules => ({
  requiresShipping: false,
  freeShipping: true,
  note,
});

const ironShipping = (kg: number): ShippingRules => ({
  requiresShipping: true,
  freeShipping: false,
  weightKg: kg,
  dispatchDays: 3,
  zones: ["Lagos", "Abuja", "Port Harcourt", "Nationwide"],
  note: `Freight-rated delivery. ${kg}kg dispatch within 3 working days; nationwide courier to all 36 states.`,
});

export const PRODUCTION_CATALOG: ProductionProduct[] = [
  {
    id: "prod_res_dig_reset",
    sku: "RES-DIG-RESET",
    slug: "7-day-reset",
    title: "7-Day Reset",
    subtitle: "The 7-day metabolic ignition protocol.",
    category: "digital",
    brand: BRAND,
    price: 5000,
    compareAtPrice: 12000,
    currency: "NGN",
    stock: null,
    status: "active",
    images: img("7-day-reset"),
    altText: "ResoFit 7-Day Reset digital program cover with Nigerian meal plating",
    description:
      "The 7-Day Reset is the fastest entry into the ResoFit system. Seven structured days of Nigerian-first nutrition, daily movement blocks, hydration targets and sleep protocol — engineered to break stagnation in one week. Built around jollof, ofada, moi moi, plantain, grilled fish and beans, portioned to real macro targets instead of imported food lists. Delivered instantly as a downloadable protocol pack the moment payment clears.",
    shortDescription: "7 structured days of Nigerian-first nutrition and movement. Instant download.",
    benefits: [
      "Break a stalled metabolism within seven days",
      "Nigerian pantry meals — no imported ingredients required",
      "Daily movement blocks that need zero equipment",
      "Hydration, sleep and step targets built in",
      "Instant delivery — secure download link on payment",
    ],
    specifications: {
      Format: "PDF protocol pack",
      Length: "7 days",
      Delivery: "Instant download",
      Equipment: "None required",
      Level: "Beginner to intermediate",
    },
    faq: [
      { q: "How fast do I get it?", a: "Your secure download link is issued the moment your payment is confirmed." },
      { q: "Do I need a gym?", a: "No. Every movement block is bodyweight and home-friendly." },
      { q: "Are the meals Nigerian?", a: "Yes — jollof, ofada, moi moi, beans, plantain and grilled fish, macro-portioned." },
    ],
    shipping: digitalShipping("Digital download. No shipping required."),
    seoTitle: "7-Day Reset — Nigerian Metabolic Reset Program | ResoFit OS™",
    seoDescription:
      "Start the ResoFit 7-Day Reset: Nigerian-first meals, daily movement blocks and hydration targets. Instant download, ₦5,000.",
    keywords: ["7 day reset", "nigerian meal plan", "fat loss nigeria", "metabolic reset", "resofit"],
    tags: ["digital", "reset", "beginner", "nutrition", "hero"],
    goals: ["fat_loss", "longevity"],
    shopifySku: "RES-DIG-RESET",
    paystackSku: "RES-DIG-RESET",
    featured: true,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_dig_nut",
    sku: "RES-DIG-NUT",
    slug: "nigerian-nutrition-protocol",
    title: "Nigerian Nutrition Protocol",
    subtitle: "Macro architecture for the Nigerian plate.",
    category: "digital",
    brand: BRAND,
    price: 15000,
    compareAtPrice: 25000,
    currency: "NGN",
    stock: null,
    status: "active",
    images: img("nigerian-nutrition-protocol"),
    altText: "Nigerian Nutrition Protocol digital guide with jollof rice and grilled fish macro plating",
    description:
      "A complete nutrition operating system for Nigerian bodies and Nigerian markets. The protocol maps swallow, rice, beans, soups and street staples into precise macro bands, then gives you swap tables, market-price budgeting, halal flags and portion visuals so you never guess again. Includes a 4-week rotating menu, shopping lists priced in naira, and eating-out rules for owambe, buka and office canteens.",
    shortDescription: "Full macro system for Nigerian food — swaps, portions, naira-priced shopping lists.",
    benefits: [
      "Macro bands mapped to real Nigerian meals",
      "Naira-priced weekly shopping lists",
      "Swap tables for swallow, rice, beans and soups",
      "Halal-flagged and allergy-aware options",
      "Owambe, buka and canteen survival rules",
    ],
    specifications: {
      Format: "PDF + swap tables",
      Coverage: "4-week rotating menu",
      Delivery: "Instant download",
      Cuisine: "Nigerian regional",
      Level: "All levels",
    },
    faq: [
      { q: "Is it vegetarian friendly?", a: "Yes — beans, moi moi, egusi and vegetable-forward rotations are included." },
      { q: "Does it cost more to eat this way?", a: "No. Shopping lists are priced against typical Nigerian market rates." },
    ],
    shipping: digitalShipping("Digital download. No shipping required."),
    seoTitle: "Nigerian Nutrition Protocol — Macro Meal System | ResoFit OS™",
    seoDescription:
      "Macro-precise Nigerian nutrition: swap tables, 4-week menus and naira-priced shopping lists. Instant download from ResoFit OS™.",
    keywords: ["nigerian nutrition", "macro meal plan nigeria", "jollof macros", "naija diet plan"],
    tags: ["digital", "nutrition", "meal-plan", "protocol"],
    goals: ["fat_loss", "muscle_building", "longevity"],
    shopifySku: "RES-DIG-NUT",
    paystackSku: "RES-DIG-NUT",
    featured: false,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_dig_90d",
    sku: "RES-DIG-90D",
    slug: "90-day-metabolic-transformation",
    title: "90-Day Metabolic Transformation",
    subtitle: "The full twelve-week rebuild.",
    category: "digital",
    brand: BRAND,
    price: 45000,
    compareAtPrice: 75000,
    currency: "NGN",
    stock: null,
    status: "active",
    images: img("90-day-metabolic-transformation"),
    altText: "ResoFit 90-Day Metabolic Transformation program cover with progressive training chart",
    description:
      "Ninety days of progressive training and nutrition periodisation — the deepest digital deployment in the ResoFit stack. Three phases: ignition, load, and expression. Each phase ships its own training block, macro targets, deload logic and weekly checkpoint scorecard. Designed for the operator who wants a full body-composition rebuild without a coach on retainer.",
    shortDescription: "12 weeks of periodised training and nutrition across three progressive phases.",
    benefits: [
      "Three periodised phases with built-in deloads",
      "Weekly checkpoint scorecards and progress logic",
      "Gym or home equipment tracks",
      "Nutrition targets that shift with each phase",
      "Instant download with lifetime access",
    ],
    specifications: {
      Format: "PDF program + trackers",
      Length: "90 days / 12 weeks",
      Phases: "Ignition · Load · Expression",
      Equipment: "Gym or home track",
      Level: "Intermediate to advanced",
    },
    faq: [
      { q: "Can I run it at home?", a: "Yes — every session has a home-equipment substitution track." },
      { q: "What if I miss a week?", a: "The phase logic includes catch-up and deload rules so you never restart from zero." },
    ],
    shipping: digitalShipping("Digital download. No shipping required."),
    seoTitle: "90-Day Metabolic Transformation Program | ResoFit OS™",
    seoDescription:
      "Twelve weeks of periodised Nigerian training and nutrition. Three phases, weekly scorecards, instant download.",
    keywords: ["90 day transformation", "body recomposition nigeria", "12 week program", "metabolic training"],
    tags: ["digital", "program", "transformation", "advanced"],
    goals: ["fat_loss", "muscle_building", "strength"],
    shopifySku: "RES-DIG-90D",
    paystackSku: "RES-DIG-90D",
    featured: true,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_coach_01",
    sku: "RES-COACH-01",
    slug: "chatb2k-premium-coaching",
    title: "ChatB2K™ Premium Coaching",
    subtitle: "Always-on AI coaching with human oversight.",
    category: "coaching",
    brand: BRAND,
    price: 25000,
    compareAtPrice: 40000,
    currency: "NGN",
    stock: null,
    status: "active",
    images: img("chatb2k-premium-coaching"),
    altText: "ChatB2K Premium Coaching dashboard showing habit streaks and meal telemetry",
    description:
      "ChatB2K™ Premium is the coaching layer of ResoFit OS™ — a monthly subscription that pairs the AI coach with human programme review. Daily check-ins, adaptive meal and workout generation, habit streaks, macro logging and a monthly plan rewrite based on your telemetry. Cancel anytime; your logs stay yours.",
    shortDescription: "Monthly AI coaching subscription with adaptive plans and human plan review.",
    benefits: [
      "Adaptive meal and workout plans regenerated monthly",
      "Daily AI check-ins and habit streak tracking",
      "Macro, weight, sleep and mood telemetry",
      "Human review of your programme each cycle",
      "Cancel anytime — no lock-in",
    ],
    specifications: {
      Billing: "Monthly subscription",
      Access: "ChatB2K™ dashboard + coach",
      Review: "Monthly human programme review",
      Delivery: "Instant account activation",
      Support: "WhatsApp concierge line",
    },
    faq: [
      { q: "Is it a real person or AI?", a: "Both — AI runs daily coaching, a human reviews your programme every cycle." },
      { q: "Can I cancel?", a: "Yes, anytime. Access runs to the end of the paid cycle." },
    ],
    shipping: digitalShipping("Subscription access. No shipping required."),
    seoTitle: "ChatB2K™ Premium Coaching Subscription | ResoFit OS™",
    seoDescription:
      "Monthly AI coaching with human programme review: adaptive Nigerian meal plans, workouts, habit tracking and telemetry.",
    keywords: ["ai fitness coach nigeria", "online coaching", "chatb2k", "fitness subscription"],
    tags: ["coaching", "subscription", "ai", "premium"],
    goals: ["fat_loss", "muscle_building", "longevity", "mobility"],
    shopifySku: "RES-COACH-01",
    paystackSku: "RES-COACH-01",
    featured: true,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_iron_15",
    sku: "RES-IRON-15",
    slug: "15kg-cast-iron-set",
    title: "15kg Cast Iron Set",
    subtitle: "Entry strength deck for the home floor.",
    category: "equipment",
    brand: BRAND,
    price: 95000,
    compareAtPrice: 120000,
    currency: "NGN",
    stock: 40,
    status: "active",
    images: img("15kg-cast-iron-set"),
    altText: "ResoFit 15kg cast iron dumbbell and plate set on a home gym floor",
    description:
      "Fifteen kilogrammes of solid cast iron with a machined bar and quick-lock collars. The entry deck for anyone building a home training floor — enough load for pressing, rowing, curling and accessory work, compact enough to live under a bed. Powder-coated against Lagos humidity.",
    shortDescription: "15kg machined cast iron set with quick-lock collars. Compact home strength entry.",
    benefits: [
      "Solid cast iron — no sand or cement fill",
      "Humidity-resistant powder coat",
      "Quick-lock collars for fast load changes",
      "Compact storage footprint",
      "Nationwide freight delivery",
    ],
    specifications: {
      "Total load": "15 kg",
      Material: "Cast iron, powder coated",
      Bar: "Machined knurled bar",
      Collars: "Quick-lock spinlock",
      Warranty: "12 months structural",
    },
    faq: [
      { q: "Is it real cast iron?", a: "Yes — solid cast iron, not cement or sand filled plastic." },
      { q: "How long is delivery?", a: "Dispatch within 3 working days, nationwide courier thereafter." },
    ],
    shipping: ironShipping(15),
    seoTitle: "15kg Cast Iron Dumbbell Set — Home Gym Nigeria | ResoFit OS™",
    seoDescription:
      "Solid 15kg cast iron set with machined bar and quick-lock collars. Powder coated, nationwide delivery across Nigeria.",
    keywords: ["15kg dumbbell set", "cast iron weights nigeria", "home gym equipment lagos"],
    tags: ["equipment", "strength", "home-gym", "entry"],
    goals: ["strength", "muscle_building"],
    shopifySku: "RES-IRON-15",
    paystackSku: "RES-IRON-15",
    featured: false,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_iron_30",
    sku: "RES-IRON-30",
    slug: "30kg-cast-iron-set",
    title: "30kg Cast Iron Set",
    subtitle: "The progression deck.",
    category: "equipment",
    brand: BRAND,
    price: 165000,
    compareAtPrice: 200000,
    currency: "NGN",
    stock: 28,
    status: "active",
    images: img("30kg-cast-iron-set"),
    altText: "ResoFit 30kg cast iron weight set with stacked plates and machined bar",
    description:
      "Thirty kilogrammes of graded cast iron plates across the full increment ladder, with machined bar and quick-lock collars. The natural second step once 15kg stops challenging your press and row. Built for progressive overload in a home or garage floor without commercial-rack economics.",
    shortDescription: "30kg graded cast iron plate ladder for genuine progressive overload at home.",
    benefits: [
      "Full increment ladder for micro-progression",
      "Machined bar with knurled grip",
      "Powder coated against humidity and rust",
      "Supports press, row, squat and accessory work",
      "Nationwide freight delivery",
    ],
    specifications: {
      "Total load": "30 kg",
      Material: "Cast iron, powder coated",
      Plates: "Graded increment ladder",
      Collars: "Quick-lock spinlock",
      Warranty: "12 months structural",
    },
    faq: [
      { q: "Can I upgrade from the 15kg set?", a: "Yes — plates share the same bar diameter and collars." },
      { q: "Does it include a bench?", a: "No. Pair it with the Adjustable Elite Bench." },
    ],
    shipping: ironShipping(30),
    seoTitle: "30kg Cast Iron Weight Set — Progressive Home Gym | ResoFit OS™",
    seoDescription:
      "30kg graded cast iron plate set with machined bar. Built for progressive overload at home. Nationwide Nigerian delivery.",
    keywords: ["30kg weight set", "cast iron plates nigeria", "progressive overload home gym"],
    tags: ["equipment", "strength", "home-gym", "progression"],
    goals: ["strength", "muscle_building"],
    shopifySku: "RES-IRON-30",
    paystackSku: "RES-IRON-30",
    featured: true,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_iron_50",
    sku: "RES-IRON-50",
    slug: "50kg-cast-iron-set",
    title: "50kg Cast Iron Set",
    subtitle: "Full home strength arsenal.",
    category: "equipment",
    brand: BRAND,
    price: 265000,
    compareAtPrice: 320000,
    currency: "NGN",
    stock: 18,
    status: "active",
    images: img("50kg-cast-iron-set"),
    altText: "ResoFit 50kg cast iron set with full plate ladder and machined barbell",
    description:
      "The full fifty-kilogramme arsenal: complete plate ladder, machined barbell and quick-lock collars. Enough load to run every compound lift in the ResoFit programming — squat, deadlift, press, row — from a home floor. This is the equipment core of the Apex Bundle.",
    shortDescription: "50kg complete cast iron arsenal for every compound lift, at home.",
    benefits: [
      "Runs every compound lift in ResoFit programming",
      "Complete plate ladder with micro increments",
      "Machined barbell rated for full load",
      "Powder coated, humidity resistant",
      "Core component of the Apex Bundle",
    ],
    specifications: {
      "Total load": "50 kg",
      Material: "Cast iron, powder coated",
      Bar: "Machined barbell, full-load rated",
      Collars: "Quick-lock spinlock",
      Warranty: "12 months structural",
    },
    faq: [
      { q: "Is 50kg enough long term?", a: "For most home operators, yes — combined with tempo and volume progression." },
      { q: "Is delivery included?", a: "Freight is rated at checkout by delivery zone." },
    ],
    shipping: ironShipping(50),
    seoTitle: "50kg Cast Iron Set — Complete Home Strength Arsenal | ResoFit OS™",
    seoDescription:
      "Complete 50kg cast iron plate ladder and machined barbell for full compound training at home. Nationwide Nigerian delivery.",
    keywords: ["50kg weight set nigeria", "home barbell set", "cast iron arsenal", "strength equipment lagos"],
    tags: ["equipment", "strength", "home-gym", "flagship"],
    goals: ["strength", "muscle_building"],
    shopifySku: "RES-IRON-50",
    paystackSku: "RES-IRON-50",
    featured: true,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_bench_01",
    sku: "RES-BENCH-01",
    slug: "adjustable-elite-bench",
    title: "Adjustable Elite Bench",
    subtitle: "Seven-angle commercial-grade platform.",
    category: "equipment",
    brand: BRAND,
    price: 145000,
    compareAtPrice: 185000,
    currency: "NGN",
    stock: 22,
    status: "active",
    images: img("adjustable-elite-bench"),
    altText: "ResoFit Adjustable Elite Bench set to incline in a home gym",
    description:
      "A seven-angle adjustable bench built on a commercial-gauge steel frame with high-density padding and non-slip feet. Flat, incline, decline and upright positions unlock the full pressing and accessory library. Folds for storage without tools.",
    shortDescription: "Seven-angle commercial-gauge adjustable bench. Flat to upright, folds for storage.",
    benefits: [
      "Seven locking angles from decline to upright",
      "Commercial-gauge steel frame",
      "High-density non-tearing padding",
      "Non-slip feet for tiled and concrete floors",
      "Tool-free fold-down storage",
    ],
    specifications: {
      Angles: "7 locking positions",
      Frame: "Commercial-gauge steel",
      "Load rating": "300 kg",
      Padding: "High-density, tear resistant",
      Warranty: "24 months frame",
    },
    faq: [
      { q: "What load can it take?", a: "Rated to 300kg including user and load." },
      { q: "Does it fold?", a: "Yes — tool-free fold-down for flat storage." },
    ],
    shipping: ironShipping(24),
    seoTitle: "Adjustable Elite Bench — 7-Angle Home Gym Bench | ResoFit OS™",
    seoDescription:
      "Commercial-gauge 7-angle adjustable bench rated to 300kg. Folds for storage. Nationwide delivery across Nigeria.",
    keywords: ["adjustable bench nigeria", "gym bench lagos", "incline bench", "home gym bench"],
    tags: ["equipment", "strength", "home-gym", "bench"],
    goals: ["strength", "muscle_building"],
    shopifySku: "RES-BENCH-01",
    paystackSku: "RES-BENCH-01",
    featured: false,
    recommended: true,
    active: true,
  },
  {
    id: "prod_res_bundle_apex",
    sku: "RES-BUNDLE-APEX",
    slug: "buchi-power-apex-bundle",
    title: "Buchi Power Apex Bundle",
    subtitle: "The complete deployment — iron, bench, coaching, nutrition, 90 days.",
    category: "bundle",
    brand: BRAND,
    price: 495000,
    compareAtPrice: 695000,
    currency: "NGN",
    stock: 10,
    status: "active",
    images: img("buchi-power-apex-bundle"),
    altText: "Buchi Power Apex Bundle showing 50kg iron set, elite bench and digital program covers",
    description:
      "Everything, in one deploy. The Apex Bundle ships the 50kg Cast Iron Set and Adjustable Elite Bench, then activates ChatB2K™ Premium Coaching, the Nigerian Nutrition Protocol and the 90-Day Metabolic Transformation against your account. One payment, one delivery, one operating system — at bundle economics rather than five separate purchases.",
    shortDescription: "50kg iron, elite bench, premium coaching, nutrition protocol and the 90-day program in one deploy.",
    benefits: [
      "Five products, one payment, bundle pricing",
      "Physical equipment shipped nationwide",
      "Digital components activate instantly",
      "Coaching subscription included for the first cycle",
      "Highest-value path into ResoFit OS™",
    ],
    specifications: {
      Contains: "RES-IRON-50 · RES-BENCH-01 · RES-COACH-01 · RES-DIG-NUT · RES-DIG-90D",
      "Physical weight": "74 kg",
      Delivery: "Freight + instant digital activation",
      Saving: "₦200,000 against separate purchase",
      Seats: "Limited monthly allocation",
    },
    faq: [
      { q: "How does delivery work?", a: "Digital components activate immediately; equipment ships by freight within 3 working days." },
      { q: "Is coaching ongoing?", a: "The first coaching cycle is included; renew monthly if you want to continue." },
    ],
    shipping: {
      requiresShipping: true,
      freeShipping: true,
      weightKg: 74,
      dispatchDays: 3,
      zones: ["Lagos", "Abuja", "Port Harcourt", "Nationwide"],
      note: "Free nationwide freight on the Apex Bundle. Digital components activate instantly.",
    },
    seoTitle: "Buchi Power Apex Bundle — Complete Home Gym + Coaching | ResoFit OS™",
    seoDescription:
      "50kg cast iron, elite bench, ChatB2K™ coaching, nutrition protocol and the 90-day transformation in one bundle. Save ₦200,000.",
    keywords: ["home gym bundle nigeria", "apex bundle", "complete fitness package", "buchi power"],
    tags: ["bundle", "premium", "featured", "equipment", "coaching"],
    goals: ["strength", "muscle_building", "fat_loss", "longevity"],
    shopifySku: "RES-BUNDLE-APEX",
    paystackSku: "RES-BUNDLE-APEX",
    featured: true,
    recommended: true,
    active: true,
    contains: ["RES-IRON-50", "RES-BENCH-01", "RES-COACH-01", "RES-DIG-NUT", "RES-DIG-90D"],
  },
];

export const BY_SKU = new Map(PRODUCTION_CATALOG.map((p) => [p.sku, p]));
export const BY_SLUG = new Map(PRODUCTION_CATALOG.map((p) => [p.slug, p]));

export function getProductionProduct(key: string): ProductionProduct | undefined {
  return BY_SKU.get(key) ?? BY_SLUG.get(key);
}

// ---------------------------------------------------------------- collections

export const PRODUCTION_COLLECTIONS: Record<string, string[]> = {
  "best-sellers": ["RES-DIG-RESET", "RES-DIG-90D", "RES-IRON-30", "RES-COACH-01"],
  "new-arrivals": ["RES-BUNDLE-APEX", "RES-BENCH-01", "RES-IRON-50"],
  "home-gym": ["RES-IRON-15", "RES-IRON-30", "RES-IRON-50", "RES-BENCH-01"],
  "digital-programs": ["RES-DIG-RESET", "RES-DIG-NUT", "RES-DIG-90D"],
  coaching: ["RES-COACH-01"],
  bundles: ["RES-BUNDLE-APEX"],
  nutrition: ["RES-DIG-NUT", "RES-DIG-RESET"],
  strength: ["RES-IRON-15", "RES-IRON-30", "RES-IRON-50", "RES-BENCH-01", "RES-DIG-90D"],
  featured: PRODUCTION_CATALOG.filter((p) => p.featured).map((p) => p.sku),
  premium: ["RES-BUNDLE-APEX", "RES-COACH-01", "RES-IRON-50", "RES-DIG-90D"],
};

export function collectionProducts(code: string): ProductionProduct[] {
  return (PRODUCTION_COLLECTIONS[code] ?? []).map((s) => BY_SKU.get(s)!).filter(Boolean);
}

// ------------------------------------------------------------- relationships

/** Production cross-sell ladder: 15kg → 30kg → bench → nutrition → 90d → coaching → apex. */
export const CROSS_SELLS: Record<string, string[]> = {
  "RES-IRON-15": ["RES-IRON-30", "RES-BENCH-01", "RES-DIG-NUT"],
  "RES-IRON-30": ["RES-IRON-50", "RES-BENCH-01", "RES-DIG-90D"],
  "RES-IRON-50": ["RES-BENCH-01", "RES-BUNDLE-APEX", "RES-DIG-90D"],
  "RES-BENCH-01": ["RES-IRON-50", "RES-DIG-90D", "RES-BUNDLE-APEX"],
  "RES-DIG-RESET": ["RES-DIG-NUT", "RES-DIG-90D", "RES-COACH-01"],
  "RES-DIG-NUT": ["RES-DIG-90D", "RES-COACH-01", "RES-IRON-15"],
  "RES-DIG-90D": ["RES-COACH-01", "RES-IRON-30", "RES-BENCH-01"],
  "RES-COACH-01": ["RES-BUNDLE-APEX", "RES-DIG-90D", "RES-IRON-50"],
  "RES-BUNDLE-APEX": ["RES-COACH-01"],
};

export function crossSells(sku: string): ProductionProduct[] {
  return (CROSS_SELLS[sku] ?? []).map((s) => BY_SKU.get(s)!).filter(Boolean);
}

// ------------------------------------------------------------------- homepage

export const HOMEPAGE_RAILS = {
  featured: PRODUCTION_CATALOG.filter((p) => p.featured),
  recommended: PRODUCTION_CATALOG.filter((p) => p.recommended),
  trending: collectionProducts("best-sellers"),
  mostPopular: ["RES-DIG-RESET", "RES-IRON-30", "RES-COACH-01"].map((s) => BY_SKU.get(s)!),
  newArrivals: collectionProducts("new-arrivals"),
  digital: PRODUCTION_CATALOG.filter((p) => p.category === "digital"),
  equipment: PRODUCTION_CATALOG.filter((p) => p.category === "equipment"),
  bundles: PRODUCTION_CATALOG.filter((p) => p.category === "bundle"),
};

// --------------------------------------------------------------- search index

export interface SearchDoc {
  sku: string;
  slug: string;
  title: string;
  category: string;
  brand: string;
  haystack: string;
}

export const SEARCH_INDEX: SearchDoc[] = PRODUCTION_CATALOG.map((p) => ({
  sku: p.sku,
  slug: p.slug,
  title: p.title,
  category: p.category,
  brand: p.brand,
  haystack: [
    p.sku,
    p.slug,
    p.title,
    p.subtitle,
    p.category,
    p.brand,
    ...p.tags,
    ...p.keywords,
    ...p.goals,
    p.shortDescription,
    ...(p.contains ?? []),
  ]
    .join(" ")
    .toLowerCase(),
}));

export function searchProducts(q: string): ProductionProduct[] {
  const term = q.trim().toLowerCase();
  if (!term) return PRODUCTION_CATALOG;
  const terms = term.split(/\s+/);
  return SEARCH_INDEX.filter((d) => terms.every((t) => d.haystack.includes(t)))
    .map((d) => BY_SKU.get(d.sku)!)
    .filter(Boolean);
}

// ------------------------------------------------------------------------ SEO

export function productSeo(p: ProductionProduct) {
  const url = `${STORE_ORIGIN}/products/${p.slug}`;
  const ogImage = `${STORE_ORIGIN}${p.images.seo}`;
  return {
    canonical: url,
    meta: [
      { title: p.seoTitle },
      { name: "description", content: p.seoDescription },
      { name: "keywords", content: p.keywords.join(", ") },
      { property: "og:title", content: p.seoTitle },
      { property: "og:description", content: p.seoDescription },
      { property: "og:type", content: "product" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: p.seoTitle },
      { name: "twitter:description", content: p.seoDescription },
      { name: "twitter:image", content: ogImage },
    ],
    productJsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      sku: p.sku,
      description: p.shortDescription,
      image: [ogImage, `${STORE_ORIGIN}${p.images.hero}`],
      brand: { "@type": "Brand", name: p.brand },
      offers: {
        "@type": "Offer",
        priceCurrency: p.currency,
        price: p.price,
        availability:
          p.stock === null || p.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url,
      },
    },
    breadcrumbJsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${STORE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${STORE_ORIGIN}/shop` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  };
}

// -------------------------------------------------------------- image manifest

export type AssetRole =
  | "hero"
  | "thumb"
  | "gallery-1"
  | "gallery-2"
  | "gallery-3"
  | "lifestyle"
  | "detail"
  | "seo";

export interface ManifestEntry {
  sku: string;
  slug: string;
  role: AssetRole;
  path: string;
  alt: string;
  width: number;
  height: number;
  aspect: string;
  formats: ("webp" | "avif")[];
  responsiveWidths: number[];
  lazy: boolean;
  blurPlaceholder: boolean;
  openGraph: boolean;
  twitter: boolean;
}

const ROLE_SPEC: Record<AssetRole, { w: number; h: number; aspect: string }> = {
  hero: { w: 1600, h: 2000, aspect: "4:5" },
  thumb: { w: 600, h: 600, aspect: "1:1" },
  "gallery-1": { w: 1600, h: 1600, aspect: "1:1" },
  "gallery-2": { w: 1600, h: 1600, aspect: "1:1" },
  "gallery-3": { w: 1600, h: 1600, aspect: "1:1" },
  lifestyle: { w: 1920, h: 1280, aspect: "3:2" },
  detail: { w: 1600, h: 1600, aspect: "1:1" },
  seo: { w: 1200, h: 630, aspect: "1.91:1" },
};

export const ASSET_ROLES = Object.keys(ROLE_SPEC) as AssetRole[];

export const IMAGE_MANIFEST: ManifestEntry[] = PRODUCTION_CATALOG.flatMap((p) =>
  ASSET_ROLES.map((role) => {
    const spec = ROLE_SPEC[role];
    return {
      sku: p.sku,
      slug: p.slug,
      role,
      path: `/images/products/${p.slug}/${role}.webp`,
      alt: `${p.altText} — ${role.replace("-", " ")}`,
      width: spec.w,
      height: spec.h,
      aspect: spec.aspect,
      formats: ["webp", "avif"] as ("webp" | "avif")[],
      responsiveWidths: [320, 640, 960, 1280, spec.w].filter((w) => w <= spec.w),
      lazy: role !== "hero",
      blurPlaceholder: true,
      openGraph: role === "seo",
      twitter: role === "seo",
    };
  }),
);

export const REQUIRED_IMAGE_COUNT = IMAGE_MANIFEST.length;

// -------------------------------------------------------------- upload queue

export interface UploadQueueItem {
  sku: string;
  title: string;
  slug: string;
  shots: { role: AssetRole; brief: string; path: string }[];
}

const SHOT_BRIEFS: Record<AssetRole, string> = {
  hero: "Primary hero — product front, clean background, centred, 4:5",
  thumb: "Square crop for cards and rails, 1:1",
  "gallery-1": "Front view, full product",
  "gallery-2": "Side / angled view",
  "gallery-3": "Packaging or contents laid out",
  lifestyle: "In-use lifestyle shot, real Nigerian setting, 3:2",
  detail: "Close-up on material, finish or key detail",
  seo: "Open Graph / Twitter card composite, 1200×630",
};

export const UPLOAD_QUEUE: UploadQueueItem[] = PRODUCTION_CATALOG.map((p) => ({
  sku: p.sku,
  title: p.title,
  slug: p.slug,
  shots: ASSET_ROLES.map((role) => ({
    role,
    brief: SHOT_BRIEFS[role],
    path: `/images/products/${p.slug}/${role}.webp`,
  })),
}));

// ------------------------------------------------------------ validation

export interface ValidationIssue {
  level: "error" | "warning";
  sku: string;
  message: string;
}

export function validateCatalog(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenSku = new Set<string>();
  const seenSlug = new Set<string>();
  for (const p of PRODUCTION_CATALOG) {
    if (seenSku.has(p.sku)) issues.push({ level: "error", sku: p.sku, message: "Duplicate SKU" });
    if (seenSlug.has(p.slug)) issues.push({ level: "error", sku: p.sku, message: "Duplicate slug" });
    seenSku.add(p.sku);
    seenSlug.add(p.slug);
    if (!p.altText) issues.push({ level: "error", sku: p.sku, message: "Missing alt text" });
    if (!p.seoTitle || !p.seoDescription)
      issues.push({ level: "error", sku: p.sku, message: "Incomplete SEO metadata" });
    if (!p.images.seo) issues.push({ level: "error", sku: p.sku, message: "Missing OG image" });
    if (p.images.gallery.length < 3)
      issues.push({ level: "warning", sku: p.sku, message: "Fewer than 3 gallery images" });
    if (!p.shopifySku || !p.paystackSku)
      issues.push({ level: "error", sku: p.sku, message: "Missing Shopify/Paystack mapping" });
    if (p.category === "equipment" && !p.shipping.requiresShipping)
      issues.push({ level: "warning", sku: p.sku, message: "Equipment without shipping rules" });
    if (!CROSS_SELLS[p.sku]?.length)
      issues.push({ level: "warning", sku: p.sku, message: "No cross-sell mapping" });
    if (!searchProducts(p.sku).some((r) => r.sku === p.sku))
      issues.push({ level: "error", sku: p.sku, message: "Not searchable by SKU" });
  }
  return issues;
}

// -------------------------------------------------- asset readiness report

export interface ReadinessReport {
  totalProducts: number;
  totalSkus: number;
  requiredImages: number;
  uploadedImages: number;
  missingImages: number;
  optimizedImages: number;
  brokenAssets: string[];
  seoCompletenessPct: number;
  catalogIssues: ValidationIssue[];
  readinessPct: number;
  missingByProduct: { sku: string; title: string; missing: AssetRole[] }[];
}

/**
 * Builds the readiness report. `uploadedPaths` is the set of asset paths the
 * Media Library reports as present (pass an empty set before upload).
 * `brokenPaths` are paths that resolved but failed validation.
 */
export function buildReadinessReport(
  uploadedPaths: Set<string> = new Set(),
  brokenPaths: string[] = [],
): ReadinessReport {
  const missingByProduct = PRODUCTION_CATALOG.map((p) => ({
    sku: p.sku,
    title: p.title,
    missing: ASSET_ROLES.filter(
      (role) => !uploadedPaths.has(`/images/products/${p.slug}/${role}.webp`),
    ),
  })).filter((r) => r.missing.length > 0);

  const uploaded = IMAGE_MANIFEST.filter((m) => uploadedPaths.has(m.path)).length;
  const missing = REQUIRED_IMAGE_COUNT - uploaded;
  const issues = validateCatalog();

  const seoFields = PRODUCTION_CATALOG.length * 4; // title, desc, og, alt
  const seoDone = PRODUCTION_CATALOG.reduce(
    (n, p) =>
      n +
      (p.seoTitle ? 1 : 0) +
      (p.seoDescription ? 1 : 0) +
      (p.images.seo ? 1 : 0) +
      (p.altText ? 1 : 0),
    0,
  );
  const seoPct = Math.round((seoDone / seoFields) * 100);

  const dataPct = issues.some((i) => i.level === "error") ? 60 : 100;
  const assetPct = REQUIRED_IMAGE_COUNT ? Math.round((uploaded / REQUIRED_IMAGE_COUNT) * 100) : 100;
  const readinessPct = Math.round(dataPct * 0.5 + assetPct * 0.35 + seoPct * 0.15);

  return {
    totalProducts: PRODUCTION_CATALOG.length,
    totalSkus: new Set(PRODUCTION_CATALOG.map((p) => p.sku)).size,
    requiredImages: REQUIRED_IMAGE_COUNT,
    uploadedImages: uploaded,
    missingImages: missing,
    optimizedImages: uploaded, // pipeline emits webp+avif on upload
    brokenAssets: brokenPaths,
    seoCompletenessPct: seoPct,
    catalogIssues: issues,
    readinessPct,
    missingByProduct,
  };
}
