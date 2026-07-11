import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CurrencySwitcher } from "@/components/PriceTag";
import { RouteHero } from "@/components/RouteHero";
import { RouteErrorBoundary, RouteSkeleton } from "@/components/RouteFallbacks";
import { PersonalizedPanel } from "@/components/PersonalizedPanel";
import { usePersonalization } from "@/hooks/use-personalization";

import { products as mockProducts } from "@/lib/mock-data";
import { listProducts } from "@/lib/products.functions";
import heroShop from "@/assets/hero-shop.jpg";

export const Route = createFileRoute("/shop")({
  component: Shop,
  pendingComponent: () => <RouteSkeleton rows={6} />,
  errorComponent: ({ error, reset }) => <RouteErrorBoundary error={error} reset={reset} />,
  head: () => ({
    meta: [
      { title: "Tactical Commerce Arsenal — ResoFlex™ Hardware Ecosystem" },
      { name: "description", content: "Access premium high-performance fitness hardware arrays and digital SaaS expansion tools built for absolute biometric telemetry tracking." },
      { property: "og:title", content: "Tactical Commerce Arsenal — ResoFlex™ Hardware Ecosystem" },
      { property: "og:description", content: "Access premium high-performance fitness hardware arrays and digital SaaS expansion tools built for absolute biometric telemetry tracking." },
      { property: "og:url", content: "/shop" },
      { property: "og:image", content: heroShop },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroShop },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

function Shop() {
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const persona = usePersonalization();
  useEffect(() => {
    listProducts()
      .then((r) => {
        const m: Record<string, string> = {};
        for (const p of r.products) if (p.image_url) m[p.slug] = p.image_url;
        setImageMap(m);
      })
      .catch(() => {});
  }, []);

  // Reorder mock products so ones matching persona intent surface first.
  const products = useMemo(() => {
    const decorated = mockProducts.map((p) => ({ ...p, imageUrl: imageMap[p.slug] ?? null }));
    if (!persona.hasProfile) return decorated;
    // Weight: exact-slug match to a recommended SKU beats category match.
    const boostSlugs = new Set(persona.ranked.map((r) => r.slug));
    return [...decorated].sort((a, b) => Number(boostSlugs.has(b.slug)) - Number(boostSlugs.has(a.slug)));
  }, [imageMap, persona.hasProfile, persona.ranked]);

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
