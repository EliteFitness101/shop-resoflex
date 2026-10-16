import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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

const SHOP_CATEGORIES = ["gear", "program", "digital", "supplement"] as const;
type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" && SHOP_CATEGORIES.includes(search.category as ShopCategory)
      ? (search.category as ShopCategory)
      : undefined,
  }),
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
  const { category: selectedCategory } = Route.useSearch();
  const navigate = useNavigate();
  const [refreshedProducts, setRefreshedProducts] = useState<Product[] | null>(null);
  const persona = usePersonalization();

  useEffect(() => {
    const sku = new URLSearchParams(window.location.search).get("sku")?.trim();
    if (!sku) return;

    listProducts()
      .then((r) => {
        const product = r.products.find((p) => p.sku === sku);
        if (product?.slug) {
          navigate({
            to: "/shop/$productId",
            params: { productId: product.slug },
            replace: true,
          });
        }
      })
      .catch(() => {});
  }, [navigate]);

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

  const visibleProducts = useMemo(
    () => selectedCategory ? products.filter((product) => product.category === selectedCategory) : products,
    [products, selectedCategory],
  );
  const categoryLabel = selectedCategory ? ({
    gear: "Equipment",
    program: "Training programs",
    digital: "Digital products",
    supplement: "Nutrition & recovery",
  } as const)[selectedCategory] : "All products";

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

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold">{categoryLabel}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{visibleProducts.length} catalog items available in this view.</p>
          </div>
          {selectedCategory && (
            <Link to="/shop" search={{ category: undefined }} className="text-[10px] font-mono uppercase tracking-widest text-gold hover:underline">
              Clear filter ×
            </Link>
          )}
        </div>
        {visibleProducts.length > 0 ? (
          <div className="reso-product-grid grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-gold/20 bg-card/40 p-6 text-sm text-muted-foreground">
            No products are currently available in this category. Try another category or view the full catalog.
            <div className="mt-4"><Link to="/shop" search={{ category: undefined }} className="text-gold font-mono uppercase tracking-widest text-xs hover:underline">View all products →</Link></div>
          </div>
        )}
      </div>
    </>
  );
}
