// Catalog import persistence — Phase 3 (server side).
// Applies a validated import plan with SKU-based upserts, writes an audit
// row to catalog_sync_audit, and rolls back on partial failure.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CATALOG_ROLES = ["admin", "super_admin", "catalog_admin", "content_admin"];

const rowSchema = z.record(z.string(), z.string());

const inputSchema = z.object({
  entity: z.enum([
    "collections",
    "products",
    "product_variants",
    "product_collection_mappings",
    "product_assets",
    "inventory",
  ]),
  rows: z.array(rowSchema).max(2000),
  source: z.string().max(120).default("csv"),
  dryRun: z.boolean().default(false),
});

function num(v: string | undefined, fallback: number | null = null) {
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
}
function bool(v: string | undefined, fallback = false) {
  if (v === undefined || v === "") return fallback;
  return /^(1|true|yes|y)$/i.test(v);
}

export const importCatalogRows = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => inputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = (roles ?? []).some((r: { role: string }) => CATALOG_ROLES.includes(r.role));
    if (!allowed) throw new Error("Catalog admin role required");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const audit = async (status: string, succeeded: number, failed: number, message?: string) => {
      await supabaseAdmin.from("catalog_sync_audit").insert({
        source: data.source,
        entity: data.entity,
        action: data.dryRun ? "dry_run" : "upsert",
        rows_processed: data.rows.length,
        rows_succeeded: succeeded,
        rows_failed: failed,
        status,
        error_message: message ?? null,
        performed_by: context.userId,
      });
    };

    if (data.dryRun) {
      await audit("ok", data.rows.length, 0);
      return { ok: true, dryRun: true, applied: 0 };
    }

    try {
      let applied = 0;

      if (data.entity === "collections") {
        const payload = data.rows.map((r) => ({
          collection_code: r.collection_code,
          name: r.collection_name,
          type: r.type || "category",
          parent_collection: r.parent_collection || null,
          description: r.description || null,
          banner_url: r.hero_banner || null,
          thumbnail_image: r.thumbnail_image || null,
          seo_title: r.seo_title || null,
          meta_description: r.meta_description || null,
          open_graph_image: r.open_graph_image || null,
          sort_order: num(r.display_order, 0) as number,
          active: (r.visibility || "public") !== "hidden",
          shopify_collection_id: r.shopify_collection_id || null,
          chatb2k_priority: num(r.chatb2k_priority, 0) as number,
          landing_page_slug: r.landing_page_slug || null,
        }));
        const { error } = await supabaseAdmin
          .from("collections")
          .upsert(payload, { onConflict: "collection_code" });
        if (error) throw error;
        applied = payload.length;
      } else if (data.entity === "products") {
        const payload = data.rows.map((r) => ({
          sku: r.sku,
          slug: r.slug || r.sku.toLowerCase().replace(/_/g, "-"),
          name: r.name,
          tagline: r.tagline || null,
          description: r.description || null,
          price_ngn: num(r.price_ngn, 0) as number,
          bulk_price_ngn: num(r.bulk_price_ngn),
          bulk_threshold: num(r.bulk_threshold, 3) as number,
          category: r.category || null,
          hero_image_asset: r.hero_image_asset || null,
          status: r.status || "published",
          digital_product: bool(r.digital_product),
          requires_shipping: bool(r.requires_shipping, true),
          chatb2k_enabled: bool(r.chatb2k_enabled, true),
          recommendation_priority: num(r.recommendation_priority, 0) as number,
          commission_pct: num(r.commission_pct, 0) as number,
          active: (r.status || "published") === "published",
        }));
        const { error } = await supabaseAdmin.from("products").upsert(payload, { onConflict: "slug" });
        if (error) throw error;
        applied = payload.length;
      } else if (data.entity === "product_variants") {
        const { data: products } = await supabaseAdmin.from("products").select("id, sku");
        const byS = new Map((products ?? []).map((p: any) => [p.sku, p.id]));
        const payload = data.rows
          .filter((r) => byS.has(r.parent_sku))
          .map((r) => ({
            product_id: byS.get(r.parent_sku)!,
            sku: r.variant_sku,
            title: [r.size, r.color].filter(Boolean).join(" / ") || r.variant_sku,
            size: r.size || null,
            color: r.color || null,
            price_ngn: num(r.price_ngn, 0) as number,
            stock_qty: num(r.stock_level, 0) as number,
            status: r.status || "active",
            active: (r.status || "active") === "active",
          }));
        const { error } = await supabaseAdmin
          .from("product_variants")
          .upsert(payload, { onConflict: "sku" });
        if (error) throw error;
        applied = payload.length;
      } else if (data.entity === "product_collection_mappings") {
        const [{ data: products }, { data: collections }] = await Promise.all([
          supabaseAdmin.from("products").select("id, sku"),
          supabaseAdmin.from("collections").select("id, collection_code"),
        ]);
        const pMap = new Map((products ?? []).map((p: any) => [p.sku, p.id]));
        const cMap = new Map((collections ?? []).map((c: any) => [c.collection_code, c.id]));
        const payload = data.rows
          .filter((r) => pMap.has(r.product_sku) && cMap.has(r.collection_code))
          .map((r, i) => ({
            product_id: pMap.get(r.product_sku)!,
            collection_id: cMap.get(r.collection_code)!,
            product_sku: r.product_sku,
            collection_code: r.collection_code,
            position: num(r.position, i) as number,
          }));
        const { error } = await supabaseAdmin.from("product_collection_mappings").upsert(payload);
        if (error) throw error;
        applied = payload.length;
      } else if (data.entity === "product_assets") {
        const payload = data.rows.map((r) => ({
          sku: r.sku,
          variant_sku: r.variant_sku || null,
          asset_type: r.asset_type || "image",
          file_name: r.file_name,
          relative_path: r.relative_path || null,
          cdn_url: r.cdn_url || null,
          alt_text: r.alt_text || null,
          width: num(r.width),
          height: num(r.height),
          format: r.format || null,
          file_size_kb: num(r.file_size_kb),
          is_hero: bool(r.is_hero),
          seo_title: r.seo_title || null,
          open_graph_asset: bool(r.open_graph_asset),
        }));
        const { error } = await supabaseAdmin.from("product_assets").insert(payload);
        if (error) throw error;
        applied = payload.length;
      } else {
        // inventory seed → ledger deltas against existing variants
        const { data: variants } = await supabaseAdmin.from("product_variants").select("id, sku");
        const vMap = new Map((variants ?? []).map((v: any) => [v.sku, v.id]));
        const payload = data.rows
          .filter((r) => vMap.has(r.variant_sku))
          .map((r) => ({
            variant_id: vMap.get(r.variant_sku)!,
            delta: num(r.stock_level, 0) as number,
            reason: r.reason || "csv_seed",
            reference: data.source,
          }));
        const { error } = await supabaseAdmin.from("inventory_ledger").insert(payload);
        if (error) throw error;
        applied = payload.length;
      }

      await audit("ok", applied, 0);
      return { ok: true, dryRun: false, applied };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown import failure";
      await audit("failed", 0, data.rows.length, message);
      throw new Error(`Import rolled back: ${message}`);
    }
  });

export const listCatalogAudit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("catalog_sync_audit")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);
    return { entries: data ?? [] };
  });
