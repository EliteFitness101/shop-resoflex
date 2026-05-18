import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { CurrencySwitcher } from "@/components/PriceTag";
import { products } from "@/lib/mock-data";

export const Route = createFileRoute("/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Sovereign Shop — ResoFlex OS™" },
      { name: "description", content: "Premium Nigerian fitness commerce. Supplements, gear, and digital programs with built-in referral commissions." },
      { property: "og:title", content: "Sovereign Shop — ResoFlex OS™" },
      { property: "og:description", content: "Premium Nigerian fitness commerce with built-in referral commissions." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

function Shop() {
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
