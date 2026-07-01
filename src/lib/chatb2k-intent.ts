// CHATB2K intent engine — deterministic routing from quiz answers to Paystack SKU.
import { SOVEREIGN_CATALOG, type Intent, type SovereignSKU } from "./sovereign-catalog";

export interface IntentSignal {
  intent: Intent;
  budgetNGN: number;      // upper bound the operator will spend
  commitment: "test" | "serious" | "elite"; // conversion score modifier
}

// Score = intent match (0..2) + commitment weight (0..2) + budget fit (0..1) − overshoot penalty.
export function scoreSKU(sku: SovereignSKU, s: IntentSignal): number {
  let score = 0;
  if (sku.intents.includes(s.intent)) score += 2;
  if (s.commitment === "elite") score += 2;
  else if (s.commitment === "serious") score += 1;

  if (sku.priceNGN <= s.budgetNGN) {
    score += 1 - (s.budgetNGN - sku.priceNGN) / (s.budgetNGN + 1); // prefer closer-to-budget when in budget
  } else {
    score -= 2; // hard penalty for overshooting budget
  }

  // Elite bias: only recommend Tier 6 when commitment is elite
  if (sku.tier === 6 && s.commitment !== "elite") score -= 3;
  // Bundle bias: reward Tier 5 for multi-intent operators
  if (sku.tier === 5 && s.commitment !== "test") score += 0.5;

  return score;
}

export function recommendSKU(signal: IntentSignal): SovereignSKU {
  const ranked = [...SOVEREIGN_CATALOG]
    .map((sku) => ({ sku, score: scoreSKU(sku, signal) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0].sku;
}

// Upsell progression: given the SKU just purchased, return the next-tier SKU
// that shares at least one intent. Powers post-purchase Tier 2–6 progression.
export function nextTierUpsell(currentSlug: string): SovereignSKU | null {
  const current = SOVEREIGN_CATALOG.find((s) => s.slug === currentSlug);
  if (!current) return null;
  const candidates = SOVEREIGN_CATALOG.filter(
    (s) => s.tier > current.tier && s.intents.some((i) => current.intents.includes(i)),
  );
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => a.tier - b.tier)[0];
}
