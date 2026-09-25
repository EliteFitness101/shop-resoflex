import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CurrencySwitcher } from "@/components/PriceTag";
import { RouteHero } from "@/components/RouteHero";
import { RouteErrorBoundary, RouteSkeleton } from "@/components/RouteFallbacks";
import { PersonalizedPanel } from "@/components/PersonalizedPanel";
import { usePersonalization } from "@/hooks/use-personalization";

import { products as mockProducts } from "@/lib/mock-data";
import { listProducts, type DbProduct } from "@/lib/products.functions";
import type { Product } from "@/lib/types";
import heroShop from "@/assets/hero-shop.jpg";

function toStoreProduct(product: DbProduct): Product {
  const allowedCategories = new Set(["supplement", "gear", "program", "digital"]);
  const category = allowedCategories.has(String(product.category).toLowerCase())
    ? (String(product.category).toLowerCase() as Product["category"])
    : "gear";

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline ?? product.category ?? "ResoFlex™ product",
    description: product.description ?? "",
    priceNGN: product.price_ngn,
    comparePriceNGN: product.compare_price_ngn ?? undefined,
    commissionPct: product.commission_pct,
    category,
    badge: product.badge ?? undefined,
    imageGradient: "linear-gradient(135deg, oklch(0.22 0.04 60), oklch(0.78 0.09 65))",
    imageUrl: product.image_url ?? product.hero_url ?? null,
  };
}

export const Route = createFileRoute("/shop")({
  component: Shop,
  loader: async () => {
    try {
      const result = await listProducts();
      return { liveProducts: result.products.map(toStoreProduct) };
    } catch {
      return { liveProducts: [] as Product[] };
    }
  },
  pendingComponent: () => <RouteSkeleton rows={6} />,
  errorComponent: ({ error, reset }) => <RouteErrorBoundary error={error} reset={reset} />,
  head: () => ({
    meta: [
      { title: "Tactical Commerce Arsenal — ResoFlex™ Hardware Ecosystem" },
      { name: "description", content: "Access premium high-performance fitness hardware arrays and digital SaaS expansion tools built for absolute biometric telemetry tracking." },
      { property: "og:title", content: "Tactical Commerce Arsenal — ResoFlex™ Hardware Ecosystem" },
      { property: "og:description", content: "Access premium high-performance fitness hardware arrays and digital SaaS expansion tools built for absolute biometric telemetry tracking." },
      { property: "og:url", content: "https://store.resofit.fit/shop" },
      { property: "og:image", content: `https://store.resofit.fit${heroShop}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `https://store.resofit.fit${heroShop}` },
    ],
    links: [{ rel: "canonical", href: "https://store.resofit.fit/shop" }],
  }),
});

function Shop() {
  const { liveProducts } = Route.useLoaderData();
  const [refreshedProducts, setRefreshedProducts] = useState<Product[] | null>(null);
  const persona = usePersonalization();

  useEffect(() => {
    listProducts()
      .then((r) => setRefreshedProducts(r.products.map(toStoreProduct)))
      .catch(() => {});
  }, []);

  // Production source of truth is the canonical ResoFit catalog. The bundled
  // Lovable/mock catalog remains only as an explicit fallback if the canonical
  // catalog endpoint is temporarily unavailable.
  const products = useMemo(() => {
    const baseProducts =
      refreshedProducts && refreshedProducts.length > 0
        ? refreshedProducts
        : liveProducts.length > 0
          ? liveProducts
          : mockProducts;

    if (!persona.hasProfile) return baseProducts;

    const boostSlugs = new Set(persona.ranked.map((r) => r.slug));
    return [...baseProducts].sort(
      (a, b) => Number(boostSlugs.has(b.slug)) - Number(boostSlugs.has(a.slug)),
    );
  }, [liveProducts, refreshedProducts, persona.hasProfile, persona.ranked]);

  return (
    <>
      <RouteHero
        eyebrow="ARSENAL · LIVE INVENTORY"
        title="Tactical Commerce Arsenal"
        subtitle="Premium high-performance fitness hardware arrays and digital SaaS expansion tools — built for absolute biometric telemetry tracking."
        ctaLabel="Equip Operator Node"
        ctaHref="#arsenal-grid"
        image={heroShop}
      />

      <div id="arsenal-grid" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="mb-6">
          <PersonalizedPanel surface="shop" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="text-telemetry">// SKU MATRIX</div>
          <div className="flex items-center gap-3">
            <span className="text-telemetry">CURRENCY</span>
            <CurrencySwitcher />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </>
  );
}
