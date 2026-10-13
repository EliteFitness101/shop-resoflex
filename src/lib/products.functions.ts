import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CATALOG_PUBLIC_URL =
  "https://vbqjvmnhdtdhmeeudqnn.supabase.co/functions/v1/catalog-public";

export type DbProduct = {
  id: string;
  sku: string;
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
  gallery_urls: string[];
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
  const isUsableImageUrl = (url: string | null | undefined): url is string => {
    if (typeof url !== "string" || !url.startsWith("https://")) return false;
    const normalized = url.toLowerCase();
    // Old Vercel Blob copies are returning 403; don't surface them as storefront images.
    if (normalized.includes("public.blob.vercel-storage.com")) return false;
    // These older ImageKit paths are not in the current live manifest.
    if (normalized.includes("ik.imagekit.io/resofit/catalog/")) return false;
    if (normalized.includes("ik.imagekit.io/resofit808/assets/products/") && !normalized.includes("updatedat=")) return false;
    return true;
  };
  const isProviderCdn = (url: string | null | undefined): url is string =>
    isUsableImageUrl(url) &&
    (url.includes("cdn.shopify.com") || url.includes("res.cloudinary.com/paystack"));

  const productAssets = assets
    .filter((asset) => asset.handle === product.handle || asset.sku === product.sku)
    .filter((asset) => isUsableImageUrl(asset.canonical_url))
    .sort((a, b) => {
      const aHero = String(a.role ?? "").toLowerCase() === "hero" ? 0 : 1;
      const bHero = String(b.role ?? "").toLowerCase() === "hero" ? 0 : 1;
      return aHero - bHero || Number(a.image_position ?? 999) - Number(b.image_position ?? 999);
    });

  // Keep the canonical provider's CDN image as the storefront hero (Shopify or
  // Paystack). ImageKit remains a fallback/gallery source for roles the provider
  // has not uploaded. This prevents stale Blob or legacy ImageKit URLs winning.
  const providerHero = isProviderCdn(product.image_src) ? product.image_src : null;
  const assetHero = productAssets.find((asset) => String(asset.role ?? "").toLowerCase() === "hero")?.canonical_url ?? productAssets[0]?.canonical_url ?? null;
  const hero = providerHero ?? assetHero ?? (isUsableImageUrl(product.image_src) ? product.image_src : null);
  const galleryUrls = Array.from(
    new Set([hero, ...productAssets.map((asset) => asset.canonical_url), product.image_src].filter(isUsableImageUrl)),
  ).slice(0, 6);

  return {
    id: product.id,
    sku: product.sku,
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
    gallery_urls: galleryUrls.length ? galleryUrls : hero ? [hero] : [],
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
    // Direct canonical DB lookup is the authoritative fallback for single-product
    // resolution. This prevents a catalog-public route mismatch from producing
    // false 404s on legacy /shop/$productId deep links.
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("id,sku,handle,title,vendor,product_type,tags,published,variant_price,variant_inventory_qty,image_src,body_html")
      .eq("handle", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(`Canonical product lookup failed: ${error.message}`);
    if (!row) return { product: null };
    const { data: assets, error: assetError } = await supabaseAdmin
      .from("resofit_catalog_assets")
      .select("sku,handle,role,canonical_url,image_position")
      .or(`handle.eq.${data.slug},sku.eq.${row.sku}`)
      .order("image_position", { ascending: true });
    if (assetError) throw new Error(`Canonical asset lookup failed: ${assetError.message}`);
    return { product: toDbProduct(row as CanonicalProduct, (assets ?? []) as CanonicalAsset[]) };
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
