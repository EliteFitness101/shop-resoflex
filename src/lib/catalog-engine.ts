// Catalog engine — Phase 4. Read-only query layer over the locked
// SOVEREIGN_CATALOG plus the collection registry. Purely additive:
// existing getSKU/paystackUrl helpers remain the source of truth.

import { SOVEREIGN_CATALOG, getSKU, type SovereignSKU } from "./sovereign-catalog";
import {
  COLLECTIONS,
  collectionsForSKU,
  experienceForSKU,
  goalsForSKU,
  skusForCollection,
  type CollectionDef,
  type Experience,
  type Goal,
} from "./collections";

export type Category =
  | "meal"
  | "program"
  | "apparel"
  | "shapewear"
  | "equipment"
  | "bundle"
  | "membership";

/** Derived, stable SKU code used for Paystack metadata + CSV import joins. */
export function skuCode(slug: string): string {
  return slug.toUpperCase().replace(/-/g, "_");
}

export function categoryOf(sku: SovereignSKU): Category {
  if (sku.slug.includes("station")) return "equipment";
  if (sku.slug.includes("bundle")) return "bundle";
  if (sku.slug.includes("vip")) return "membership";
  if (sku.intents.includes("shapewear") && sku.slug.includes("shaper")) return "shapewear";
  if (sku.badge === "APPAREL") return "apparel";
  if (sku.intents.includes("meal") && !sku.intents.includes("muscle")) return "meal";
  return "program";
}

export function isDigital(sku: SovereignSKU): boolean {
  const c = categoryOf(sku);
  return c === "meal" || c === "program" || c === "membership";
}

export interface CatalogRecord {
  sku: SovereignSKU;
  code: string;
  category: Category;
  digital: boolean;
  goals: Goal[];
  experience: Experience[];
  collections: string[];
}

export function toRecord(sku: SovereignSKU): CatalogRecord {
  return {
    sku,
    code: skuCode(sku.slug),
    category: categoryOf(sku),
    digital: isDigital(sku),
    goals: goalsForSKU(sku),
    experience: experienceForSKU(sku),
    collections: collectionsForSKU(sku.slug).map((c) => c.code),
  };
}

const RECORDS: CatalogRecord[] = SOVEREIGN_CATALOG.map(toRecord);
const BY_CODE = new Map(RECORDS.map((r) => [r.code, r]));

export function allRecords(): CatalogRecord[] {
  return RECORDS;
}

/** SKU-code lookup (RESOFLEX_KINETIC) — falls back to slug lookup. */
export function lookupSKU(codeOrSlug: string): CatalogRecord | undefined {
  const direct = BY_CODE.get(codeOrSlug.toUpperCase().replace(/-/g, "_"));
  if (direct) return direct;
  const s = getSKU(codeOrSlug);
  return s ? toRecord(s) : undefined;
}

export function filterByCollection(code: string): CatalogRecord[] {
  return skusForCollection(code).map(toRecord);
}

export function filterByCategory(category: Category): CatalogRecord[] {
  return RECORDS.filter((r) => r.category === category);
}

export function filterByGoal(goal: Goal): CatalogRecord[] {
  return RECORDS.filter((r) => r.goals.includes(goal));
}

export function searchCatalog(query: string): CatalogRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return RECORDS;
  return RECORDS.filter((r) =>
    [r.sku.name, r.sku.tagline, r.sku.description, r.sku.badge ?? "", r.code, r.category]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function featuredProducts(limit = 6): CatalogRecord[] {
  const featuredCodes = new Set(
    COLLECTIONS.filter((c) => c.chatb2kPriority >= 70).flatMap((c) => c.skus),
  );
  return RECORDS.filter((r) => featuredCodes.has(r.sku.slug)).slice(0, limit);
}

export function visibleCollections(): CollectionDef[] {
  return COLLECTIONS.filter((c) => c.visibility === "public").sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
}
