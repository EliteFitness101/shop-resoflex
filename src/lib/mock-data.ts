import type { Product, MealPlan, Referral, Order, Transaction, TelemetryEvent } from "./types";
import img1 from "@/assets/shop-product-1.jpg.asset.json";
import img2 from "@/assets/shop-product-2.jpg.asset.json";
import img3 from "@/assets/shop-product-3.jpg.asset.json";
import img4 from "@/assets/shop-product-4.jpg.asset.json";
import img5 from "@/assets/shop-product-5.jpg.asset.json";
import img6 from "@/assets/shop-product-6.jpg.asset.json";
import curvy1 from "@/assets/curvy-1.jpg.asset.json";
import curvy2 from "@/assets/curvy-2.jpg.asset.json";
import curvy3 from "@/assets/curvy-3.jpg.asset.json";
import curvy4 from "@/assets/curvy-4.jpg.asset.json";
import curvy5 from "@/assets/curvy-5.jpg.asset.json";
import curvy6 from "@/assets/curvy-6.jpg.asset.json";
import curvy7 from "@/assets/curvy-7.jpg.asset.json";
import curvy8 from "@/assets/curvy-8.jpg.asset.json";
import curvy9 from "@/assets/curvy-9.jpg.asset.json";
import curvy10 from "@/assets/curvy-10.jpg.asset.json";

const UNIT_NGN = 12000;
const COMPARE_NGN = 15000;
const CURVY_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const CURVY_GRADIENT = "linear-gradient(135deg, oklch(0.22 0.04 350), oklch(0.78 0.09 65))";


export const products: Product[] = [
  {
    id: "p1",
    slug: "sovereign-whey",
    name: "HZH Compression Tee — Performance",
    tagline: "Engineered fit. Sweat-wicking.",
    description: "Premium HZH compression performance tee — cold-pressed fabric, muscle-supportive cut, training-grade durability. ₦8,500/unit on orders of 10+.",
    priceNGN: UNIT_NGN,
    comparePriceNGN: COMPARE_NGN,
    commissionPct: 18,
    category: "gear",
    badge: "FLAGSHIP",
    imageGradient: "linear-gradient(135deg, oklch(0.3 0.04 60), oklch(0.78 0.09 65))",
    imageUrl: img1.url,
  },
  {
    id: "p2",
    slug: "tactical-resistance-kit",
    name: "ForzaFit Charcoal Performance Tank",
    tagline: "Built for big lifts.",
    description: "ForzaFit signature charcoal tank — broad-frame cut, breathable knit, gym-to-street finish. ₦8,500/unit on orders of 10+.",
    priceNGN: UNIT_NGN,
    comparePriceNGN: COMPARE_NGN,
    commissionPct: 22,
    category: "gear",
    imageGradient: "linear-gradient(135deg, oklch(0.2 0.01 60), oklch(0.71 0.1 75))",
    imageUrl: img2.url,
  },
  {
    id: "p3",
    slug: "ignition-protocol",
    name: "ForzaFit Cobalt Runner Tank",
    tagline: "Track-tested. Race-ready.",
    description: "Aerodynamic runner cut in cobalt blue — minimal seams, fast-dry mesh, contoured shoulder mobility. ₦8,500/unit on orders of 10+.",
    priceNGN: UNIT_NGN,
    comparePriceNGN: COMPARE_NGN,
    commissionPct: 30,
    category: "gear",
    badge: "BESTSELLER",
    imageGradient: "linear-gradient(135deg, oklch(0.18 0.007 60), oklch(0.78 0.09 65))",
    imageUrl: img3.url,
  },
  {
    id: "p4",
    slug: "midnight-elite-stack",
    name: "ForzaFit Sage Training Tank",
    tagline: "Recovery-soft cotton blend.",
    description: "Sage green training tank — light compression, gentle on skin, perfect for steady-state cardio days. ₦8,500/unit on orders of 10+.",
    priceNGN: UNIT_NGN,
    comparePriceNGN: COMPARE_NGN,
    commissionPct: 20,
    category: "gear",
    imageGradient: "linear-gradient(135deg, oklch(0.15 0.02 280), oklch(0.71 0.1 75))",
    imageUrl: img4.url,
  },
  {
    id: "p5",
    slug: "sovereign-playbook",
    name: "HZH White Performance Singlet",
    tagline: "Lightweight elite.",
    description: "Ultra-light HZH singlet — competition-grade ventilation, signature back yoke, premium stitching. ₦8,500/unit on orders of 10+.",
    priceNGN: UNIT_NGN,
    comparePriceNGN: COMPARE_NGN,
    commissionPct: 40,
    category: "gear",
    badge: "NEW DROP",
    imageGradient: "linear-gradient(135deg, oklch(0.2 0.01 60), oklch(0.78 0.09 65))",
    imageUrl: img5.url,
  },
  {
    id: "p6",
    slug: "command-shaker",
    name: "HZH Long-Sleeve Compression Top",
    tagline: "All-weather, all-terrain.",
    description: "Full-sleeve compression top — UV-resistant, thermal-regulating, engineered for road and trail. ₦8,500/unit on orders of 10+.",
    priceNGN: UNIT_NGN,
    comparePriceNGN: COMPARE_NGN,
    commissionPct: 15,
    category: "gear",
    imageGradient: "linear-gradient(135deg, oklch(0.18 0.01 60), oklch(0.71 0.1 75))",
    imageUrl: img6.url,
  },
  // ── ResoFlex™ Women Curvy Collection — ₦25,000 / variant · XS–XXXL ──
  {
    id: "c1", slug: "curvy-graphite-set", name: "ResoFlex Curvy Set — Graphite",
    tagline: "Curve-design tight wrap. Studio-to-street.",
    description: "Two-piece tight-wrap set in graphite grey. Curve-engineered seams sculpt and support XS–XXXL frames. Buttery soft-touch knit, squat-proof leggings, breathable cap-sleeve top.",
    priceNGN: 25000, commissionPct: 18, category: "gear", badge: "CURVY",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy1.url, sizes: CURVY_SIZES,
  },
  {
    id: "c2", slug: "curvy-wine-set", name: "ResoFlex Curvy Set — Wine",
    tagline: "Bold burgundy. Body-sculpting fit.",
    description: "Signature wine-burgundy two-piece. Princess-seam contouring, high-rise compression leggings, cap-sleeve curve top. Sizes XS through XXXL.",
    priceNGN: 25000, commissionPct: 18, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy2.url, sizes: CURVY_SIZES,
  },
  {
    id: "c3", slug: "curvy-cobalt-set", name: "ResoFlex Curvy Set — Cobalt",
    tagline: "Studio cobalt. Streamlined silhouette.",
    description: "Cobalt blue tight-wrap set. Four-way stretch, curve-design panels, full-length compression leggings. XS–XXXL.",
    priceNGN: 25000, commissionPct: 18, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy3.url, sizes: CURVY_SIZES,
  },
  {
    id: "c4", slug: "curvy-onyx-set", name: "ResoFlex Curvy Set — Onyx",
    tagline: "All-black essential. Wears every day.",
    description: "Wardrobe-anchor black two-piece. Curve-sculpting seams, no-camel-toe gusset, opaque squat-proof knit. XS–XXXL.",
    priceNGN: 25000, commissionPct: 18, category: "gear", badge: "BESTSELLER",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy4.url, sizes: CURVY_SIZES,
  },
  {
    id: "c5", slug: "curvy-wine-zip", name: "ResoFlex Curvy Zip Jacket Set — Wine",
    tagline: "Long-sleeve curve jacket + matching leggings.",
    description: "Full-zip mock-neck jacket with thumbholes paired with matching leggings. Curve-design side panels, wine-burgundy colourway. XS–XXXL.",
    priceNGN: 25000, commissionPct: 20, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy5.url, sizes: CURVY_SIZES,
  },
  {
    id: "c6", slug: "curvy-cocoa-zip", name: "ResoFlex Curvy Zip Jacket Set — Cocoa",
    tagline: "Warm cocoa brown. Sculpted jacket.",
    description: "Cocoa-brown full-zip jacket + leggings. Thumbholes, mock collar, princess-seam shaping. XS–XXXL.",
    priceNGN: 25000, commissionPct: 20, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy6.url, sizes: CURVY_SIZES,
  },
  {
    id: "c7", slug: "curvy-onyx-zip", name: "ResoFlex Curvy Zip Jacket Set — Onyx",
    tagline: "Stealth black zip set. Curve-shaped.",
    description: "All-black zip jacket + leggings, mock collar, thumbholes, curve panels. XS–XXXL.",
    priceNGN: 25000, commissionPct: 20, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy7.url, sizes: CURVY_SIZES,
  },
  {
    id: "c8", slug: "curvy-camel-zip", name: "ResoFlex Curvy Zip Jacket Set — Camel",
    tagline: "Soft camel. Refined performance.",
    description: "Camel-tan full-zip jacket + matching leggings. Curve seams, thumbholes, mock neck. XS–XXXL.",
    priceNGN: 25000, commissionPct: 20, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy8.url, sizes: CURVY_SIZES,
  },
  {
    id: "c9", slug: "curvy-rose-zip", name: "ResoFlex Curvy Zip Jacket Set — Rose",
    tagline: "Statement rose. Confident silhouette.",
    description: "Vibrant rose-pink zip jacket + leggings. Curve-design panels, thumbholes, mock collar. XS–XXXL.",
    priceNGN: 25000, commissionPct: 20, category: "gear", badge: "NEW DROP",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy9.url, sizes: CURVY_SIZES,
  },
  {
    id: "c10", slug: "curvy-rose-tee", name: "ResoFlex Curve-Design Tight Wrap Tee — Rose",
    tagline: "Signature curve seams. Tight wrap.",
    description: "Curve-design short-sleeve tight-wrap tee in dusty rose. Princess seams sculpt waist + bust, lightweight breathable knit. XS–XXXL.",
    priceNGN: 25000, commissionPct: 18, category: "gear",
    imageGradient: CURVY_GRADIENT, imageUrl: curvy10.url, sizes: CURVY_SIZES,
  },
];


export const mealPlans: MealPlan[] = [
  {
    id: "m1",
    name: "Lagos Lean Protocol",
    region: "Southwest",
    calories: 2200,
    priceNGN: 25000,
    highlights: ["Jollof rebuilt clean", "Suya protein bowls", "Zobo electrolyte stack"],
    gradient: "linear-gradient(135deg, oklch(0.2 0.04 30), oklch(0.78 0.09 65))",
  },
  {
    id: "m2",
    name: "Abuja Operator Stack",
    region: "Central",
    calories: 2800,
    priceNGN: 28000,
    highlights: ["Tuwo + egusi macros", "Pepper soup recovery", "Kunu pre-workout"],
    gradient: "linear-gradient(135deg, oklch(0.2 0.02 60), oklch(0.71 0.1 75))",
  },
  {
    id: "m3",
    name: "Port Harcourt Power Plan",
    region: "Southsouth",
    calories: 3000,
    priceNGN: 32000,
    highlights: ["Banga + plantain cycle", "Native soup proteins", "Palm wine reset day"],
    gradient: "linear-gradient(135deg, oklch(0.18 0.04 20), oklch(0.78 0.09 65))",
  },
  {
    id: "m4",
    name: "Kano Recovery Regimen",
    region: "North",
    calories: 2400,
    priceNGN: 24000,
    highlights: ["Miyan kuka greens", "Tsire skewers", "Fura da nono nightly"],
    gradient: "linear-gradient(135deg, oklch(0.2 0.03 90), oklch(0.71 0.1 75))",
  },
];

export const referrals: Referral[] = [
  { id: "r1", email: "ade.o***@gmail.com", joinedAt: "2025-04-12", earningsNGN: 18400, status: "active" },
  { id: "r2", email: "ngozi***@yahoo.com", joinedAt: "2025-04-29", earningsNGN: 12200, status: "active" },
  { id: "r3", email: "kunle***@proton.me", joinedAt: "2025-05-03", earningsNGN: 7800, status: "active" },
  { id: "r4", email: "fati***@gmail.com", joinedAt: "2025-05-10", earningsNGN: 0, status: "pending" },
  { id: "r5", email: "tobi***@outlook.com", joinedAt: "2025-05-14", earningsNGN: 4200, status: "active" },
];

export const orders: Order[] = [
  { id: "o1", reference: "RSFX-9081", product: "HZH Compression Tee", amountNGN: 12000, status: "paid", createdAt: "2025-05-12" },
  { id: "o2", reference: "RSFX-9082", product: "ForzaFit Cobalt Runner (10x bulk)", amountNGN: 85000, status: "paid", createdAt: "2025-05-14" },
  { id: "o3", reference: "RSFX-9083", product: "HZH Long-Sleeve Top", amountNGN: 12000, status: "pending", createdAt: "2025-05-16" },
];

export const transactions: Transaction[] = [
  { id: "t1", type: "commission", amountNGN: 2160, createdAt: "2025-05-12", note: "HZH Compression Tee ref. RSFX-9081" },
  { id: "t2", type: "commission", amountNGN: 25500, createdAt: "2025-05-14", note: "Cobalt Runner bulk ref. RSFX-9082" },
  { id: "t3", type: "withdrawal", amountNGN: -15000, createdAt: "2025-05-15", note: "Wallet → GTBank ****2231" },
  { id: "t4", type: "commission", amountNGN: 1800, createdAt: "2025-05-16", note: "HZH Long-Sleeve ref. RSFX-9089" },
];

export const telemetry: TelemetryEvent[] = [
  { id: "tl1", timestamp: "13:42:01", level: "info", source: "auth.gateway", message: "Session token rotated for OP-2811" },
  { id: "tl2", timestamp: "13:41:48", level: "info", source: "paystack.webhook", message: "charge.success processed — RSFX-9089" },
  { id: "tl3", timestamp: "13:40:11", level: "warn", source: "rate.limit", message: "IP 102.89.x.x throttled — 21 req/s" },
  { id: "tl4", timestamp: "13:38:55", level: "threat", source: "auth.gateway", message: "Bruteforce attempt blocked — admin@" },
  { id: "tl5", timestamp: "13:37:22", level: "info", source: "cdn.edge", message: "Cache warmed — /shop, /elite, /meals" },
  { id: "tl6", timestamp: "13:35:09", level: "info", source: "referral.engine", message: "Commission accrued — 8,640 NGN" },
];

export const stats = {
  activeOperators: 2_811,
  monthlyVolumeNGN: 142_500_000,
  agentsOnline: 184,
  systemUptime: 99.987,
};
