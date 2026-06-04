import type { Product, MealPlan, Referral, Order, Transaction, TelemetryEvent } from "./types";
import hzhTee from "@/assets/hzh-compression-tee.asset.json";
import hzhLong from "@/assets/hzh-longsleeve-run.asset.json";
import forzaCharcoal from "@/assets/forzafit-charcoal-tank.asset.json";
import forzaBlue from "@/assets/forzafit-blue-runner.asset.json";
import forzaGreen from "@/assets/forzafit-green-tank.asset.json";
import hzhWhite from "@/assets/hzh-white-singlet.asset.json";

export const products: Product[] = [
  {
    id: "p1",
    slug: "sovereign-whey",
    name: "HZH Compression Tee — Performance",
    tagline: "Engineered fit. Sweat-wicking.",
    description: "Premium HZH compression performance tee — cold-pressed fabric, muscle-supportive cut, training-grade durability.",
    priceNGN: 48000,
    comparePriceNGN: 62000,
    commissionPct: 18,
    category: "apparel",
    badge: "FLAGSHIP",
    imageGradient: "linear-gradient(135deg, oklch(0.3 0.04 60), oklch(0.78 0.09 65))",
    imageUrl: hzhTee.url,
  },
  {
    id: "p2",
    slug: "tactical-resistance-kit",
    name: "ForzaFit Charcoal Performance Tank",
    tagline: "Built for big lifts.",
    description: "ForzaFit signature charcoal tank — broad-frame cut, breathable knit, gym-to-street finish.",
    priceNGN: 72000,
    comparePriceNGN: 95000,
    commissionPct: 22,
    category: "apparel",
    imageGradient: "linear-gradient(135deg, oklch(0.2 0.01 60), oklch(0.71 0.1 75))",
    imageUrl: forzaCharcoal.url,
  },
  {
    id: "p3",
    slug: "ignition-protocol",
    name: "ForzaFit Cobalt Runner Tank",
    tagline: "Track-tested. Race-ready.",
    description: "Aerodynamic runner cut in cobalt blue — minimal seams, fast-dry mesh, contoured shoulder mobility.",
    priceNGN: 35000,
    commissionPct: 30,
    category: "apparel",
    badge: "BESTSELLER",
    imageGradient: "linear-gradient(135deg, oklch(0.18 0.007 60), oklch(0.78 0.09 65))",
    imageUrl: forzaBlue.url,
  },
  {
    id: "p4",
    slug: "midnight-elite-stack",
    name: "ForzaFit Sage Training Tank",
    tagline: "Recovery-soft cotton blend.",
    description: "Sage green training tank — light compression, gentle on skin, perfect for steady-state cardio days.",
    priceNGN: 54000,
    comparePriceNGN: 68000,
    commissionPct: 20,
    category: "apparel",
    imageGradient: "linear-gradient(135deg, oklch(0.15 0.02 280), oklch(0.71 0.1 75))",
    imageUrl: forzaGreen.url,
  },
  {
    id: "p5",
    slug: "sovereign-playbook",
    name: "HZH White Performance Singlet",
    tagline: "Lightweight elite.",
    description: "Ultra-light HZH singlet — competition-grade ventilation, signature back yoke, premium stitching.",
    priceNGN: 18000,
    commissionPct: 40,
    category: "apparel",
    badge: "NEW DROP",
    imageGradient: "linear-gradient(135deg, oklch(0.2 0.01 60), oklch(0.78 0.09 65))",
    imageUrl: hzhWhite.url,
  },
  {
    id: "p6",
    slug: "command-shaker",
    name: "HZH Long-Sleeve Compression Top",
    tagline: "All-weather, all-terrain.",
    description: "Full-sleeve compression top — UV-resistant, thermal-regulating, engineered for road and trail.",
    priceNGN: 22000,
    commissionPct: 15,
    category: "apparel",
    imageGradient: "linear-gradient(135deg, oklch(0.18 0.01 60), oklch(0.71 0.1 75))",
    imageUrl: hzhLong.url,
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
  { id: "o1", reference: "RSFX-9081", product: "Sovereign Whey Isolate", amountNGN: 48000, status: "paid", createdAt: "2025-05-12" },
  { id: "o2", reference: "RSFX-9082", product: "Ignition Protocol", amountNGN: 35000, status: "paid", createdAt: "2025-05-14" },
  { id: "o3", reference: "RSFX-9083", product: "Command Shaker", amountNGN: 22000, status: "pending", createdAt: "2025-05-16" },
];

export const transactions: Transaction[] = [
  { id: "t1", type: "commission", amountNGN: 8640, createdAt: "2025-05-12", note: "Sovereign Whey ref. RSFX-9081" },
  { id: "t2", type: "commission", amountNGN: 10500, createdAt: "2025-05-14", note: "Ignition Protocol ref. RSFX-9082" },
  { id: "t3", type: "withdrawal", amountNGN: -15000, createdAt: "2025-05-15", note: "Wallet → GTBank ****2231" },
  { id: "t4", type: "commission", amountNGN: 4320, createdAt: "2025-05-16", note: "Midnight Elite ref. RSFX-9089" },
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
