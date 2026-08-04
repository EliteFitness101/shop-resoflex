// ChatB2K™ product personalization — Phase 5.
// Extends (does not replace) src/lib/personalization.ts by adding
// goal + experience matching on top of the existing intent scorer.

import { allRecords, type CatalogRecord } from "./catalog-engine";
import { COLLECTION_BY_CODE, type Experience, type Goal } from "./collections";
import { scoreSKU } from "./chatb2k-intent";
import { inferIntent, type PersonaProfile } from "./personalization";

export interface RecommendationInput {
  goals?: Goal[];
  experience?: Experience;
  budgetNGN?: number;
  commitment?: "test" | "serious" | "elite";
  collectionCode?: string;
}

export interface Recommendation {
  product: CatalogRecord;
  reason: string;
  goalMatch: Goal[];
  collectionMatch: string[];
  score: number;
}

const EXPERIENCE_WEIGHT = 1.5;
const GOAL_WEIGHT = 2;
const COLLECTION_WEIGHT = 1.25;

/** Derive a recommendation input from an existing health profile row. */
export function inputFromProfile(profile: PersonaProfile | null | undefined): RecommendationInput {
  const intent = inferIntent(profile);
  const goals: Goal[] = [];
  if (intent === "fat-loss") goals.push("fat_loss");
  if (intent === "muscle" || intent === "glute") goals.push("muscle_building", "strength");
  if (intent === "shapewear") goals.push("mobility");
  if (intent === "wellness" || intent === "meal" || intent === "elite") goals.push("longevity");
  const budget = profile?.budget_ngn ?? undefined;
  return {
    goals: goals.length ? goals : ["longevity"],
    experience: "beginner",
    budgetNGN: budget ?? undefined,
    commitment: budget && budget >= 100_000 ? "elite" : budget && budget >= 25_000 ? "serious" : "test",
  };
}

function reasonFor(r: CatalogRecord, goalMatch: Goal[], collectionMatch: string[], exp?: Experience) {
  const bits: string[] = [];
  if (goalMatch.length) bits.push(`matches your ${goalMatch.join(" + ").replace(/_/g, " ")} goal`);
  if (exp && r.experience.includes(exp)) bits.push(`built for ${exp} operators`);
  if (collectionMatch.length) {
    const name = COLLECTION_BY_CODE.get(collectionMatch[0])?.name;
    if (name) bits.push(`part of ${name}`);
  }
  if (!bits.length) bits.push("high-performing across the ladder");
  return `${r.sku.name} ${bits.join(", ")}.`;
}

export function recommendProducts(
  input: RecommendationInput,
  opts: { limit?: number } = {},
): Recommendation[] {
  const goals = input.goals ?? [];
  const budget = input.budgetNGN ?? 100_000;
  const commitment = input.commitment ?? "serious";

  const scored = allRecords().map((r) => {
    const goalMatch = r.goals.filter((g) => goals.includes(g));
    const collectionMatch = input.collectionCode
      ? r.collections.filter((c) => c === input.collectionCode)
      : r.collections;

    let score = scoreSKU(r.sku, {
      intent: r.sku.intents[0],
      budgetNGN: budget,
      commitment,
    });
    score += goalMatch.length * GOAL_WEIGHT;
    if (input.experience && r.experience.includes(input.experience)) score += EXPERIENCE_WEIGHT;
    if (input.collectionCode) score += collectionMatch.length ? COLLECTION_WEIGHT : -COLLECTION_WEIGHT;
    score += (COLLECTION_BY_CODE.get(r.collections[0] ?? "")?.chatb2kPriority ?? 0) / 100;

    return {
      product: r,
      reason: reasonFor(r, goalMatch, collectionMatch, input.experience),
      goalMatch,
      collectionMatch,
      score: Math.round(score * 100) / 100,
    } satisfies Recommendation;
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, opts.limit ?? 6);
}

export function topRecommendationFor(profile: PersonaProfile | null): Recommendation | null {
  const list = recommendProducts(inputFromProfile(profile), { limit: 1 });
  return list[0] ?? null;
}
