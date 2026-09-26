import { createFileRoute } from "@tanstack/react-router";
import { listProducts } from "@/lib/products.functions";
import { GoldButton } from "@/components/GoldButton";
import { RouteHero } from "@/components/RouteHero";
import { RouteErrorBoundary, RouteSkeleton } from "@/components/RouteFallbacks";
import { Check } from "lucide-react";
import heroMeals from "@/assets/hero-meals.jpg";

export const Route = createFileRoute("/meals")({
  loader: async () => {
    const { products } = await listProducts();
    const mealProducts = products.filter((p) =>
      /meal|nutrition|diet/i.test(`${p.name} ${p.tagline ?? ""} ${p.category ?? ""}`)
    );
    return { mealProducts };
  },
  component: Meals,
  pendingComponent: () => <RouteSkeleton rows={4} />,
  errorComponent: ({ error, reset }) => <RouteErrorBoundary error={error} reset={reset} />,
  head: () => ({
    meta: [
      { title: "Regional Metabolic Protocols — Macro-Precise Nigerian Nutrition" },
      { name: "description", content: "Calibrate physical state performance using macro-precise, region-honest nutritional guides structured around authentic Nigerian foods with halal and non-halal balance swaps." },
      { property: "og:title", content: "Regional Metabolic Protocols — Macro-Precise Nigerian Nutrition" },
      { property: "og:description", content: "Calibrate physical state performance using macro-precise, region-honest nutritional guides structured around authentic Nigerian foods with halal and non-halal balance swaps." },
      { property: "og:url", content: "/meals" },
      { property: "og:image", content: heroMeals },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroMeals },
    ],
    links: [{ rel: "canonical", href: "/meals" }],
  }),
});

function Meals() {
  const { mealProducts } = Route.useLoaderData();
  return (
    <>
      <RouteHero
        eyebrow="REGIONAL PROTOCOLS"
        title="Macro-Precise Nigerian Nutrition"
        subtitle="Calibrate physical state performance using region-honest nutritional guides structured around authentic Nigerian foods — halal & non-halal balance swaps included."
        ctaLabel="Provision Dietary Node"
        ctaHref="#meal-grid"
        image={heroMeals}
      />

      <div id="meal-grid" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-4">
          {mealProducts.map((m) => (
            <div key={m.id} className="bg-[#121215] border border-gold/15 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-48 aspect-video md:aspect-auto relative bg-gradient-to-br from-gold/20 to-background">
                <div className="absolute inset-0 telemetry-grid opacity-30 mix-blend-overlay" />
                <span className="absolute top-3 left-3 text-telemetry">CANONICAL</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display text-xl font-semibold">{m.name}</h3>
                <div className="text-xs font-mono text-muted-foreground mt-1">{m.category ?? "Meal Plan"} · production catalog</div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {[m.tagline, m.description].filter(Boolean).slice(0, 2).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="size-4 text-gold mt-0.5 shrink-0" />{h}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-display font-bold text-2xl text-gold">₦{m.price_ngn.toLocaleString()}</span>
                  <GoldButton size="sm" className="!rounded-none" onClick={() => { window.location.href = `/products/${encodeURIComponent(m.slug)}`; }}>View</GoldButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
