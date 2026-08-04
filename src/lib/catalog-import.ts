// Master catalog import engine — Phase 3.
// Pure, client-safe logic: CSV parsing, validation, SKU-based dedupe and
// upsert planning. Persistence lives in catalog-import.functions.ts.

export type Entity =
  | "collections"
  | "products"
  | "product_variants"
  | "product_collection_mappings"
  | "product_assets"
  | "inventory";

export interface ImportIssue {
  row: number;
  field?: string;
  message: string;
}

export interface ImportPlan<T = Record<string, string>> {
  entity: Entity;
  rows: T[];
  valid: T[];
  duplicates: ImportIssue[];
  errors: ImportIssue[];
  summary: { total: number; valid: number; duplicate: number; invalid: number };
}

/** RFC4180-ish CSV parser: handles quoted fields, embedded commas and newlines. */
export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;

  const src = text.replace(/\r\n?/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (nonEmpty.length === 0) return [];
  const header = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((r) => {
    const o: Record<string, string> = {};
    header.forEach((h, idx) => (o[h] = (r[idx] ?? "").trim()));
    return o;
  });
}

const REQUIRED: Record<Entity, string[]> = {
  collections: ["collection_code", "collection_name"],
  products: ["sku", "name", "price_ngn"],
  product_variants: ["variant_sku", "parent_sku"],
  product_collection_mappings: ["product_sku", "collection_code"],
  product_assets: ["sku", "file_name"],
  inventory: ["variant_sku", "stock_level"],
};

const KEY: Record<Entity, (r: Record<string, string>) => string> = {
  collections: (r) => r.collection_code,
  products: (r) => r.sku,
  product_variants: (r) => r.variant_sku,
  product_collection_mappings: (r) => `${r.product_sku}::${r.collection_code}`,
  product_assets: (r) => `${r.sku}::${r.file_name}`,
  inventory: (r) => r.variant_sku,
};

const NUMERIC: Partial<Record<Entity, string[]>> = {
  products: ["price_ngn", "bulk_price_ngn", "bulk_threshold", "recommendation_priority"],
  inventory: ["stock_level"],
  product_assets: ["width", "height", "file_size_kb"],
};

/** Validate + dedupe a parsed CSV into an upsert plan. */
export function buildImportPlan(entity: Entity, rows: Record<string, string>[]): ImportPlan {
  const errors: ImportIssue[] = [];
  const duplicates: ImportIssue[] = [];
  const seen = new Set<string>();
  const valid: Record<string, string>[] = [];

  rows.forEach((r, i) => {
    const rowNo = i + 2; // account for header line
    let ok = true;

    for (const f of REQUIRED[entity]) {
      if (!r[f]) {
        errors.push({ row: rowNo, field: f, message: `Missing required field "${f}"` });
        ok = false;
      }
    }
    for (const f of NUMERIC[entity] ?? []) {
      if (r[f] && Number.isNaN(Number(r[f]))) {
        errors.push({ row: rowNo, field: f, message: `"${f}" must be numeric (got "${r[f]}")` });
        ok = false;
      }
    }
    if (!ok) return;

    const key = KEY[entity](r);
    if (seen.has(key)) {
      duplicates.push({ row: rowNo, message: `Duplicate key "${key}" — later row ignored` });
      return;
    }
    seen.add(key);
    valid.push(r);
  });

  return {
    entity,
    rows,
    valid,
    duplicates,
    errors,
    summary: {
      total: rows.length,
      valid: valid.length,
      duplicate: duplicates.length,
      invalid: errors.length,
    },
  };
}

export function importFromCSV(entity: Entity, csv: string): ImportPlan {
  return buildImportPlan(entity, parseCSV(csv));
}

export const CATALOG_FILES: Record<string, Entity> = {
  "01_collections_master.csv": "collections",
  "02_products_master.csv": "products",
  "03_product_variants_master.csv": "product_variants",
  "04_product_collection_mapping.csv": "product_collection_mappings",
  "05_product_assets_manifest.csv": "product_assets",
  "06_inventory_seed.csv": "inventory",
};
