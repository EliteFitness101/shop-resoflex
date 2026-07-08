// Sovereign catalog integrity validator.
// Reuse-only: consumes SOVEREIGN_CATALOG + paystackUrl + verifyCheckoutUrl.
// Emits a structured report. Never runs in production runtime — invoke from
// CI, pre-deploy scripts, or ad-hoc via `bun run src/lib/catalog-validator.ts`.

import { SOVEREIGN_CATALOG, paystackUrl, type SovereignSKU } from "./sovereign-catalog";
import { verifyCheckoutUrl } from "./checkout-url";

export type CatalogIssueSeverity = "error" | "warn";

export interface CatalogIssue {
  slug: string;
  severity: CatalogIssueSeverity;
  code: string;
  message: string;
}

export interface CatalogReport {
  totalSkus: number;
  errors: CatalogIssue[];
  warnings: CatalogIssue[];
  ok: boolean;
}

const VALID_TIERS = new Set([0, 1, 2, 3, 4, 5, 6]);

export function validateCatalog(catalog: SovereignSKU[] = SOVEREIGN_CATALOG): CatalogReport {
  const errors: CatalogIssue[] = [];
  const warnings: CatalogIssue[] = [];

  const seenSlug = new Map<string, number>();
  const seenUrl = new Map<string, number>();

  for (const sku of catalog) {
    const push = (severity: CatalogIssueSeverity, code: string, message: string) => {
      (severity === "error" ? errors : warnings).push({ slug: sku.slug, severity, code, message });
    };

    if (!sku.slug) push("error", "missing_slug", "SKU missing slug");
    if (!sku.name) push("error", "missing_name", `Missing product name: ${sku.slug}`);
    if (!sku.description) push("warn", "missing_description", `Missing description: ${sku.slug}`);
    if (!sku.tagline) push("warn", "missing_tagline", `Missing tagline: ${sku.slug}`);
    if (!Array.isArray(sku.intents) || sku.intents.length === 0)
      push("warn", "empty_intents", `No intents mapped: ${sku.slug}`);
    if (!VALID_TIERS.has(sku.tier))
      push("error", "invalid_tier", `Invalid tier ${sku.tier} for ${sku.slug}`);
    if (typeof sku.priceNGN !== "number" || sku.priceNGN < 0)
      push("error", "invalid_price", `Invalid price for ${sku.slug}: ${sku.priceNGN}`);

    // Duplicate slug
    seenSlug.set(sku.slug, (seenSlug.get(sku.slug) ?? 0) + 1);

    // Checkout URL — reuse paystackUrl resolver.
    const url = paystackUrl(sku.slug);
    const verified = verifyCheckoutUrl(url);
    if (!verified.ok) {
      push("error", `checkout_${verified.reason}`, `${verified.message} (${sku.slug})`);
    }
    seenUrl.set(url, (seenUrl.get(url) ?? 0) + 1);
  }

  for (const [slug, count] of seenSlug) {
    if (count > 1) {
      errors.push({
        slug,
        severity: "error",
        code: "duplicate_slug",
        message: `Slug appears ${count} times: ${slug}`,
      });
    }
  }
  for (const [url, count] of seenUrl) {
    if (count > 1) {
      warnings.push({
        slug: url,
        severity: "warn",
        code: "duplicate_checkout_url",
        message: `Checkout URL shared by ${count} SKUs: ${url}`,
      });
    }
  }

  return {
    totalSkus: catalog.length,
    errors,
    warnings,
    ok: errors.length === 0,
  };
}

export function formatCatalogReport(report: CatalogReport): string {
  const lines: string[] = [];
  lines.push(`Sovereign catalog · ${report.totalSkus} SKUs · ${report.ok ? "OK" : "FAIL"}`);
  if (report.errors.length) {
    lines.push(`\nErrors (${report.errors.length}):`);
    for (const e of report.errors) lines.push(`  ✗ [${e.code}] ${e.message}`);
  }
  if (report.warnings.length) {
    lines.push(`\nWarnings (${report.warnings.length}):`);
    for (const w of report.warnings) lines.push(`  ! [${w.code}] ${w.message}`);
  }
  return lines.join("\n");
}
