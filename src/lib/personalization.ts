// Personalization core — reads existing health_profiles / daily_logs / ceo_tasks
// shape and produces ranked SovereignSKU recommendations + score telemetry.
// Reuses SOVEREIGN_CATALOG + scoreSKU. No new tables, no duplicate catalog.

import { SOVEREIGN_CATALOG, type Intent, type SovereignSKU } from "./sovereign-catalog";
import { scoreSKU, type IntentSignal } from "./chatb2k-intent";

// Minimal structural shapes so we don't couple to Supabase types at compile time.
export interface PersonaProfile {
  goal?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  target_weight_kg?: number | null;
  budget_ngn?: number | null;
  preferred_foods?: string | null;
  foods_to_avoid?: string | null;
  religious_restrictions?: string | null;
  medical_conditions?: string | null;
  full_name?: string | null;
  ai_summary?: string | null;
}
export interface PersonaLog {
  water_ml?: number | null;
  calories?: number | null;
  protein_g?: number | null;
}
export interface PersonaTask {
  is_done?: boolean | null;
}

const WATER_TARGET_ML = 3000;

// ---------- Intent inference ----------
const INTENT_KEYWORDS: Array<[Intent, RegExp]> = [
  ["fat-loss", /(fat[- ]?loss|lose|cut|shred|slim|weight[- ]?loss)/i],
  ["glute", /(glute|butt|hip|posterior)/i],
  ["muscle", /(muscle|bulk|hypertroph|mass|strong)/i],
  ["shapewear", /(shape|waist|corset|latex)/i],
  ["meal", /(meal|diet|nutrit|food|jollof|naija)/i],
  ["wellness", /(wellness|diabet|hormone|health|recover|sleep|stress)/i],
  ["elite", /(elite|concierge|vip|founder)/i],
];

export function inferIntent(profile: PersonaProfile | null | undefined): Intent {
  if (!profile) return "wellness";
  const hay = [profile.goal, profile.medical_conditions, profile.preferred_foods]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const [intent, rx] of INTENT_KEYWORDS) {
    if (rx.test(hay)) return intent;
  }
  return "wellness";
}

// ---------- Scores ----------
export interface Scores {
  health: number;
  habit: number;
  ceo: number;
}

export function computeScores(
  profile: PersonaProfile | null | undefined,
  log: PersonaLog | null | undefined,
  tasks: PersonaTask[] | null | undefined,
): Scores {
  const water = Number(log?.water_ml ?? 0);
  const cals = Number(log?.calories ?? 0);
  const protein = Number(log?.protein_g ?? 0);
  const health = profile
    ? Math.min(
        100,
        Math.round((water / WATER_TARGET_ML) * 40 + Math.min(30, protein / 3) + Math.min(30, cals / 60)),
      )
    : 0;
  const done = (tasks ?? []).filter((t) => t?.is_done).length;
  const habit = tasks && tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  const ceo = tasks && tasks.length > 0 ? habit : 0;
  return { health, habit, ceo };
}

// ---------- Ranking ----------
export interface RankOptions {
  limit?: number;
  excludeSlugs?: string[];
}

function inferCommitment(profile: PersonaProfile | null | undefined): IntentSignal["commitment"] {
  const budget = Number(profile?.budget_ngn ?? 0);
  if (budget >= 100_000) return "elite";
  if (budget >= 20_000) return "serious";
  return "test";
}

function inferBudget(profile: PersonaProfile | null | undefined): number {
  const budget = Number(profile?.budget_ngn ?? 0);
  if (budget > 0) return budget;
  return 40_000; // sensible default midpoint
}

// Memoized: same profile+options usually yields same ranking during a session.
const rankCache = new Map<string, SovereignSKU[]>();

export function rankSKUs(
  profile: PersonaProfile | null | undefined,
  options: RankOptions = {},
): SovereignSKU[] {
  const intent = inferIntent(profile);
  const commitment = inferCommitment(profile);
  const budgetNGN = inferBudget(profile);
  const excludeSlugs = options.excludeSlugs ?? [];
  const cacheKey = JSON.stringify({
    intent,
    commitment,
    budgetNGN,
    exc: excludeSlugs.slice().sort(),
    lim: options.limit ?? 0,
  });
  const cached = rankCache.get(cacheKey);
  if (cached) return cached;

  const signal: IntentSignal = { intent, commitment, budgetNGN };
  const ranked = SOVEREIGN_CATALOG
    .filter((s) => !excludeSlugs.includes(s.slug))
    .map((sku) => ({ sku, score: scoreSKU(sku, signal) }))
    .sort((a, b) => b.score - a.score)
    .map((r) => r.sku);
  const out = options.limit ? ranked.slice(0, options.limit) : ranked;
  rankCache.set(cacheKey, out);
  return out;
}

export function topRecommendation(profile: PersonaProfile | null | undefined): SovereignSKU {
  return rankSKUs(profile, { limit: 1 })[0] ?? SOVEREIGN_CATALOG[0];
}

// Companion SKU — best next SKU that shares intent with the current one.
export function companionSKU(
  currentSlug: string,
  profile: PersonaProfile | null | undefined,
): SovereignSKU | null {
  const ranked = rankSKUs(profile, { excludeSlugs: [currentSlug] });
  return ranked[0] ?? null;
}

// ---------- Bundle tier label ----------
export type BundleTier = "Starter" | "Core" | "Elite" | "Executive" | "Transformation" | "Coach Recommended";

export function suggestBundleTier(profile: PersonaProfile | null | undefined): BundleTier {
  if (!profile) return "Starter";
  const budget = Number(profile.budget_ngn ?? 0);
  const commitment = inferCommitment(profile);
  if (commitment === "elite") return "Executive";
  if (budget >= 60_000) return "Transformation";
  if (budget >= 30_000) return "Elite";
  if (budget >= 15_000) return "Core";
  if (profile.ai_summary) return "Coach Recommended";
  return "Starter";
}

// ---------- Nigerian wellness guidance (derived only) ----------
export interface WellnessSwaps {
  halal: boolean;
  vegetarian: boolean;
  hydrationLiters: number;
  proteinFocus: string[];
}

export function wellnessSwaps(profile: PersonaProfile | null | undefined): WellnessSwaps {
  const religion = (profile?.religious_restrictions ?? "").toLowerCase();
  const avoid = (profile?.foods_to_avoid ?? "").toLowerCase();
  const halal = /halal|muslim|islam/.test(religion) || /pork|non-halal/.test(avoid);
  const vegetarian = /veg/.test(religion) || /meat|beef|chicken/.test(avoid);
  const proteinFocus = vegetarian
    ? ["beans", "moi moi", "tofu", "egg", "groundnut"]
    : halal
      ? ["chicken", "beef", "fish", "egg", "beans"]
      : ["chicken", "fish", "beef", "egg", "beans"];
  return { halal, vegetarian, hydrationLiters: 3, proteinFocus };
}
