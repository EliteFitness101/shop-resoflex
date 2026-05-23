import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CurrencySwitcher } from "@/components/PriceTag";
import { products as mockProducts } from "@/lib/mock-data";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Sovereign Shop — ResoFlex OS™" },
      { name: "description", content: "Premium Nigerian fitness commerce with built-in referral commissions." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

function Shop() {
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  useEffect(() => {
    listProducts()
      .then((r) => {
        const m: Record<string, string> = {};
        for (const p of r.products) if (p.image_url) m[p.slug] = p.image_url;
        setImageMap(m);
      })
      .catch(() => {});
  }, []);

  const products = mockProducts.map((p) => ({ ...p, imageUrl: imageMap[p.slug] ?? null }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-telemetry mb-2">// ARSENAL · LIVE INVENTORY</div>
          <h1 className="font-display text-4xl font-bold">Sovereign Shop</h1>
          <p className="text-muted-foreground text-sm mt-2">Every SKU vetted. Every commission tracked. Every order audited.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-telemetry">CURRENCY</span>
          <CurrencySwitcher />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
