import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CATALOG_PUBLIC_URL =
  "https://vbqjvmnhdtdhmeeudqnn.supabase.co/functions/v1/catalog-public";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_ngn: number;
  compare_price_ngn: number | null;
  commission_pct: number;
  category: string | null;
  badge: string | null;
  image_url: string | null;
  hero_url: string | null;
  active: boolean;
};

type CanonicalProduct = {
  id: string;
  sku: string;
  handle: string;
  title: string;
  vendor?: string | null;
  product_type?: string | null;
  tags?: string[] | null;
  published?: boolean;
  variant_price?: number | null;
  variant_inventory_qty?: number | null;
  image_src?: string | null;
  body_html?: string | null;
};

type CanonicalAsset = {
  sku?: string | null;
  handle?: string | null;
  role?: string | null;
  canonical_url?: string | null;
  image_position?: number | null;
};

async function fetchCanonical<T>(resource: string, params: Record<string, string> = {}) {
  const url = new URL(`${CATALOG_PUBLIC_URL}/${resource}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Canonical catalog unavailable (${response.status})`);
  return (await response.json()) as T;
}

function toDbProduct(product: CanonicalProduct, assets: CanonicalAsset[]): DbProduct {
  const productAssets = assets
    .filter((asset) => asset.handle === product.handle || asset.sku === product.sku)
    .filter((asset) => typeof asset.canonical_url === "string" && asset.canonical_url.length > 0)
    .sort((a, b) => {
      const aHero = String(a.role ?? "").toLowerCase() === "hero" ? 0 : 1;
      const bHero = String(b.role ?? "").toLowerCase() === "hero" ? 0 : 1;
      return aHero - bHero || Number(a.image_position ?? 999) - Number(b.image_position ?? 999);
    });

  const hero = productAssets[0]?.canonical_url ?? product.image_src ?? null;

  return {
    id: product.id,
    slug: product.handle,
    name: product.title,
    tagline: product.product_type ?? null,
    description: product.body_html ?? null,
    price_ngn: Number(product.variant_price ?? 0),
    compare_price_ngn: null,
    commission_pct: 0,
    category: product.product_type ?? "gear",
    badge: Array.isArray(product.tags) ? product.tags[0] ?? null : null,
    image_url: hero,
    hero_url: hero,
    active: product.published !== false,
  };
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const [productPayload, assetPayload] = await Promise.all([
    fetchCanonical<{ data: CanonicalProduct[] }>("products", { limit: "200", offset: "0" }),
    fetchCanonical<{ data: CanonicalAsset[] }>("assets", { limit: "1000", offset: "0" }),
  ]);

  const assets = assetPayload.data ?? [];
  const products = (productPayload.data ?? []).map((product) => toDbProduct(product, assets));
  return { products };
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const [productPayload, assetPayload] = await Promise.all([
      fetchCanonical<{ data?: CanonicalProduct }>("product", { handle: data.slug }),
      fetchCanonical<{ data: CanonicalAsset[] }>("assets", { handle: data.slug, limit: "50", offset: "0" }),
    ]);
    return {
      product: productPayload.data
        ? toDbProduct(productPayload.data, assetPayload.data ?? [])
        : null,
    };
  });

export const upsertProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        slug: z.string().min(1).max(120),
        image_url: z.string().url().max(1000).nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Admin only");
    const { error } = await supabaseAdmin
      .from("products")
      .update({ image_url: data.image_url })
      .eq("handle", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
