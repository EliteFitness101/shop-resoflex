// Lightweight CTA text personalization. NO layout changes — text only.
// Reads cumulative spend-by-RSID heuristic from localStorage (set after
// payment_success events). High-value RSIDs see priority phrasing.
import { ensureAttribution } from "./attribution";

const VALUE_KEY = "rsfx_rsid_value_ngn";

export function recordRsidValue(amountNGN: number): void {
  if (typeof window === "undefined") return;
  try {
    const prev = Number(localStorage.getItem(VALUE_KEY) || "0");
    localStorage.setItem(VALUE_KEY, String(prev + (amountNGN || 0)));
  } catch {}
}

export type CtaTier = "high" | "medium" | "low";

export function getCtaTier(): CtaTier {
  if (typeof window === "undefined") return "low";
  try {
    const v = Number(localStorage.getItem(VALUE_KEY) || "0");
    if (v >= 100_000) return "high";
    if (v >= 20_000) return "medium";
  } catch {}
  return "low";
}

export function smartCtaLabel(fallback = "Start Your Metabolic Reset"): string {
  // Touches attribution so RSID is materialised on first render.
  ensureAttribution();
  const tier = getCtaTier();
  if (tier === "high") return "Buy Now (Priority Access)";
  if (tier === "medium") return "Continue Transformation";
  return fallback;
}
