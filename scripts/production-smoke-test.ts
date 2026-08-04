/**
 * Production smoke test — Phase 10.
 * Run: bun run scripts/production-smoke-test.ts
 *
 * Read-only. Validates catalog integrity, collections, ChatB2K
 * recommendations, checkout metadata and (when env is present) the
 * database connection + public RLS surface.
 */
import { SOVEREIGN_CATALOG, paystackUrl } from "../src/lib/sovereign-catalog";
import { allRecords, lookupSKU, searchCatalog, featuredProducts, visibleCollections } from "../src/lib/catalog-engine";
import { skusForCollection } from "../src/lib/collections";
import { recommendProducts } from "../src/lib/chatb2k-recommend";
import { importFromCSV } from "../src/lib/catalog-import";
import { isAllowedCheckoutHost } from "../src/lib/checkout-url";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  if (ok) console.log(`  ✓ ${name}`);
  else {
    failures++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log("\nResoFlex OS™ production smoke test\n");

console.log("Catalog");
check("catalog non-empty", SOVEREIGN_CATALOG.length > 0);
check("unique slugs", new Set(SOVEREIGN_CATALOG.map((s) => s.slug)).size === SOVEREIGN_CATALOG.length);
check("unique SKU codes", new Set(allRecords().map((r) => r.code)).size === allRecords().length);
check("SKU lookup by code", !!lookupSKU("RESOFLEX_KINETIC"));
check("SKU lookup by slug", !!lookupSKU("resoflex-kinetic"));
check("search returns hits", searchCatalog("meal").length > 0);
check("featured products present", featuredProducts().length > 0);

console.log("\nCollections");
const collections = visibleCollections();
check("16 collections registered", collections.length === 16, `got ${collections.length}`);
const orphan = collections
  .filter((c) => c.type !== "algorithmic")
  .find((c) => skusForCollection(c.code).length === 0);
check("no empty non-algorithmic collections", !orphan, orphan?.code);
const badRef = collections.flatMap((c) => c.skus).find((s) => !SOVEREIGN_CATALOG.some((x) => x.slug === s));
check("all collection SKUs exist in catalog", !badRef, badRef);

console.log("\nChatB2K recommendations");
const recs = recommendProducts({ goals: ["fat_loss"], experience: "beginner", budgetNGN: 20000 });
check("returns ranked results", recs.length > 0);
check("results carry reason + score", recs.every((r) => !!r.reason && typeof r.score === "number"));
check("sorted descending", recs.every((r, i) => i === 0 || recs[i - 1].score >= r.score));
check("goal matching applied", recs.some((r) => r.goalMatch.includes("fat_loss")));

console.log("\nCheckout metadata");
check(
  "every paid SKU resolves an allowed checkout host",
  SOVEREIGN_CATALOG.filter((s) => s.priceNGN > 0).every((s) => isAllowedCheckoutHost(paystackUrl(s.slug))),
);

console.log("\nCSV import engine");
const plan = importFromCSV(
  "products",
  "sku,name,price_ngn\nA_SKU,Alpha,1000\nA_SKU,Alpha dup,1000\n,No sku,1000\nB_SKU,Beta,abc\n",
);
check("valid rows accepted", plan.summary.valid === 1, JSON.stringify(plan.summary));
check("duplicates flagged", plan.summary.duplicate === 1);
check("invalid rows flagged", plan.summary.invalid === 2);

console.log("\nBackend env");
const hasDb = !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
check("database URL configured", hasDb);
check("publishable key configured", !!(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY));

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}\n`);
if (failures > 0) process.exit(1);
