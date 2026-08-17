import { z } from "zod";

const CATALOG_BASE = (process.env.CATALOG_BASE_URL || "https://catalog.resofit.fit").replace(/\/$/, "");

const CanonicalProduct = z.object({
  sku: z.string().min(1),
  handle: z.string().nullable().optional(),
  name: z.string().min(1),
  price_ngn: z.number().nonnegative().nullable().optional(),
  compare_at_price: z.number().nonnegative().nullable().optional(),
  inventory: z.number().int().nullable().optional(),
  delivery_type: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  lifecycle_state: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
});

export type CanonicalProduct = z.infer<typeof CanonicalProduct>;

export async function getCanonicalProduct(sku: string): Promise<CanonicalProduct | null> {
  const safeSku = encodeURIComponent(sku.trim());
  const response = await fetch(`${CATALOG_BASE}/api/public/products/${safeSku}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Canonical catalog unavailable (${response.status})`);

  const payload = await response.json();
  return CanonicalProduct.parse(payload?.data ?? payload);
}

export function assertPurchasable(product: CanonicalProduct, quantity: number) {
  const state = String(product.lifecycle_state ?? product.status ?? "active").toLowerCase();
  if (["archived", "inactive", "draft", "discontinued"].includes(state)) {
    throw new Error("Product is not currently purchasable");
  }
  if (product.inventory != null && product.inventory < quantity) {
    throw new Error("Requested quantity is not currently available");
  }
  if (product.price_ngn == null) throw new Error("Canonical product has no payable NGN price");
}

export function priceNgnMinor(product: CanonicalProduct, quantity: number) {
  assertPurchasable(product, quantity);
  return Math.round(product.price_ngn! * 100) * quantity;
}
