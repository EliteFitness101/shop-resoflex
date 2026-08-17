import { z } from "zod";

const CATALOG_BASE = (process.env.CATALOG_BASE_URL || "https://catalog.resofit.fit").replace(/\/$/, "");

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
  image_src: z.string().url().nullable().optional(),
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
  const raw = payload?.data ?? payload;
  return CanonicalProduct.parse({
    ...raw,
    name: raw.name ?? raw.title,
    price_ngn: raw.price_ngn ?? raw.variant_price,
    inventory: raw.inventory ?? raw.variant_inventory_qty,
    image_url: raw.image_url ?? raw.image_src,
  });
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
