import { z } from "zod";

const CanonicalProduct = z.object({
  sku: z.string().min(1),
  handle: z.string().nullable().optional(),
  name: z.string().min(1),
  title: z.string().nullable().optional(),
  product_type: z.string().nullable().optional(),
  price_ngn: z.number().nonnegative().nullable().optional(),
  variant_price: z.number().nonnegative().nullable().optional(),
  compare_at_price: z.number().nonnegative().nullable().optional(),
  inventory: z.number().int().nullable().optional(),
  variant_inventory_qty: z.number().int().nullable().optional(),
  delivery_type: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  lifecycle_state: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  image_src: z.string().nullable().optional(),
});

export type CanonicalProduct = z.infer<typeof CanonicalProduct>;

export async function getCanonicalProduct(sku: string): Promise<CanonicalProduct | null> {
  const lookupKey = sku.trim();
  if (!lookupKey || lookupKey.length > 160 || !/^[A-Za-z0-9_-]+$/.test(lookupKey)) return null;

  // Checkout must read the canonical database directly, not fetch the public catalog hostname
  // (which may be protected by Cloudflare). Credentials remain server-only.
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://vbqjvmnhdtdhmeeudqnn.supabase.co").replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) throw new Error("Canonical catalog server credential is not configured");
  const headers = { accept: "application/json", apikey: supabaseKey, authorization: `Bearer ${supabaseKey}` };
  const select = "sku,handle,title,product_type,tags,variant_price,variant_inventory_qty,image_src,body_html,published";

  for (const field of ["sku", "handle"] as const) {
    const params = new URLSearchParams({ select, published: "eq.true", [field]: `eq.${lookupKey}`, limit: "1" });
    const response = await fetch(`${supabaseUrl}/rest/v1/products?${params}`, { headers, cache: "no-store" });
    if (!response.ok) throw new Error(`Canonical catalog unavailable (${response.status})`);
    const rows = await response.json();
    const raw = Array.isArray(rows) ? rows[0] : null;
    if (!raw) continue;
    const imageCandidate = raw.image_url ?? raw.image_src ?? null;
    const absoluteImage = typeof imageCandidate === "string" && /^https?:\/\//i.test(imageCandidate) ? imageCandidate : null;
    return CanonicalProduct.parse({
      ...raw,
      name: raw.name ?? raw.title,
      price_ngn: raw.price_ngn ?? raw.variant_price,
      inventory: raw.inventory ?? raw.variant_inventory_qty,
      image_url: absoluteImage,
      image_src: imageCandidate,
    });
  }
  return null;
}

export function assertPurchasable(product: CanonicalProduct, quantity: number) {
  const state = String(product.lifecycle_state ?? product.status ?? "active").toLowerCase();
  if (["archived", "inactive", "draft", "discontinued"].includes(state)) {
    throw new Error("Product is not currently purchasable");
  }
  const type = String(product.product_type ?? "").toLowerCase();
  const delivery = String(product.delivery_type ?? "").toLowerCase();
  const inventoryManaged = !(type.includes("digital") || type.includes("meal plan") || type.includes("coaching") || type.includes("subscription") || delivery.includes("digital"));
  if (inventoryManaged && product.inventory != null && product.inventory < quantity) {
    throw new Error("Requested quantity is not currently available");
  }
  if (product.price_ngn == null) throw new Error("Canonical product has no payable NGN price");
}

export function priceNgnMinor(product: CanonicalProduct, quantity: number) {
  assertPurchasable(product, quantity);
  return Math.round(product.price_ngn! * 100) * quantity;
}
