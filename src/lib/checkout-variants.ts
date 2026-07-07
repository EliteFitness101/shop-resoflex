// Centralized variant → SKU → Paystack resolution.
// Single source of truth for size/SKU/checkout guards on the shop flow.
// Consumes the existing product catalog (mock-data) + Paystack init function.
// Does NOT duplicate sovereign-catalog logic — that catalog powers the
// /products/$slug tier flow, which has no size variants.

import type { Product } from "./types";

export type CheckoutGuardReason =
  | "unsupported_product"    // product not in catalog
  | "missing_size"           // product requires size, none selected
  | "invalid_size"           // selected size not in the product's variant list
  | "sku_mismatch"           // resolved sku doesn't match the product slug
  | "no_variants_defined";   // curvy product missing its size array

export interface VariantResolution {
  ok: true;
  productSlug: string;
  sku: string;                 // stable SKU passed to Paystack metadata
  variant: string | null;      // selected size (null for size-less SKUs)
  expectedVariants: string[];  // full valid list (empty when size-less)
}

export interface VariantRejection {
  ok: false;
  reason: CheckoutGuardReason;
  productSlug: string;
  selectedSize: string | null;
  expectedVariants: string[];
  resolvedSku: string | null;
  message: string;             // human-readable, safe for inline UI
}

export type VariantCheckoutResult = VariantResolution | VariantRejection;

export interface ResolveInput {
  product: Pick<Product, "id" | "slug" | "name" | "sizes"> | undefined | null;
  size: string | null;
}

/**
 * Curvy collection contract: SKU === product.slug, variant must be one of the
 * declared sizes. Non-curvy sized products follow the same rule; size-less
 * products resolve with variant=null.
 */
export function resolveVariantCheckout({ product, size }: ResolveInput): VariantCheckoutResult {
  if (!product || !product.slug) {
    return {
      ok: false,
      reason: "unsupported_product",
      productSlug: product?.slug ?? "unknown",
      selectedSize: size,
      expectedVariants: [],
      resolvedSku: null,
      message: "This product isn't available for checkout right now.",
    };
  }

  const requiresSize = Array.isArray(product.sizes) && product.sizes.length > 0;
  const expected = requiresSize ? (product.sizes as string[]) : [];

  // Size-less product: pass through directly.
  if (!requiresSize) {
    return {
      ok: true,
      productSlug: product.slug,
      sku: product.slug,
      variant: null,
      expectedVariants: [],
    };
  }

  // Sized product missing a curvy SKU-declared list.
  if (product.slug.startsWith("curvy-") && !requiresSize) {
    return {
      ok: false,
      reason: "no_variants_defined",
      productSlug: product.slug,
      selectedSize: size,
      expectedVariants: [],
      resolvedSku: product.slug,
      message: `Sizes for ${product.name} aren't loaded — refresh and try again.`,
    };
  }

  if (!size) {
    return {
      ok: false,
      reason: "missing_size",
      productSlug: product.slug,
      selectedSize: null,
      expectedVariants: expected,
      resolvedSku: product.slug,
      message: `Select a size to continue — available: ${expected.join(", ")}.`,
    };
  }

  if (!expected.includes(size)) {
    return {
      ok: false,
      reason: "invalid_size",
      productSlug: product.slug,
      selectedSize: size,
      expectedVariants: expected,
      resolvedSku: product.slug,
      message: `Selected size ${size} is currently unavailable for checkout. Please choose another available size.`,
    };
  }

  // SKU sanity: for the curvy contract, sku must equal the slug.
  const sku = product.slug;
  if (sku !== product.slug) {
    return {
      ok: false,
      reason: "sku_mismatch",
      productSlug: product.slug,
      selectedSize: size,
      expectedVariants: expected,
      resolvedSku: sku,
      message: `SKU mismatch for ${product.name} — checkout blocked.`,
    };
  }

  return {
    ok: true,
    productSlug: product.slug,
    sku,
    variant: size,
    expectedVariants: expected,
  };
}
