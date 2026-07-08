// @ts-nocheck — runs via `bun test`; bun:test types are provided at runtime, no new deps.
import { describe, expect, it } from "bun:test";
import { resolveVariantCheckout } from "./checkout-variants";

const curvyShaper = {
  id: "c-test",
  slug: "curvy-shaper",
  name: "Curvy Shaper",
  sizes: ["S", "M", "L"],
};

const sizeLessProduct = {
  id: "p-test",
  slug: "hzh-tee",
  name: "HZH Tee",
  sizes: undefined,
};

describe("resolveVariantCheckout", () => {
  it("rejects when selected size is not in the variant list", () => {
    const r = resolveVariantCheckout({ product: curvyShaper, size: "XXL" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("invalid_size");
      expect(r.expectedVariants).toEqual(["S", "M", "L"]);
      expect(r.resolvedSku).toBe("curvy-shaper");
      expect(r.message).toContain("XXL");
    }
  });

  it("rejects when size is required but missing", () => {
    const r = resolveVariantCheckout({ product: curvyShaper, size: null });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("missing_size");
  });

  it("rejects unknown product", () => {
    const r = resolveVariantCheckout({ product: null, size: "L" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("unsupported_product");
  });

  it("accepts a valid size on a curvy product and returns SKU + variant", () => {
    const r = resolveVariantCheckout({ product: curvyShaper, size: "L" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.sku).toBe("curvy-shaper");
      expect(r.variant).toBe("L");
      expect(r.expectedVariants).toEqual(["S", "M", "L"]);
    }
  });

  it("accepts size-less products with variant=null", () => {
    const r = resolveVariantCheckout({ product: sizeLessProduct, size: null });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.sku).toBe("hzh-tee");
      expect(r.variant).toBeNull();
    }
  });
});
