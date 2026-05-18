import { createFileRoute } from "@tanstack/react-router";
import { mealPlans } from "@/lib/mock-data";
import { GoldButton } from "@/components/GoldButton";
import { Check } from "lucide-react";

export const Route = createFileRoute("/meals")({
  component: Meals,
  head: () => ({
    meta: [
      { title: "Nigerian Meal Plan Marketplace — ResoFlex OS™" },
      { name: "description", content: "Regional Nigerian meal protocols engineered for elite performance. Macro-precise. Operator-grade." },
      { property: "og:title", content: "Nigerian Meal Plan Marketplace" },
      { property: "og:description", content: "Regional Nigerian meal protocols engineered for elite performance." },
      { property: "og:url", content: "/meals" },
    ],
    links: [{ rel: "canonical", href: "/meals" }],
  }),
});

function Meals() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-telemetry mb-2">// REGIONAL PROTOCOLS</div>
      <h1 className="font-display text-4xl font-bold">Meal Plan Marketplace</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">Choose your region. We engineer the macros around the food you already love.</p>

      <div className="grid md:grid-cols-2 gap-5 mt-10">
        {mealPlans.map((m) => (
          <div key={m.id} className="glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row">
            <div
              className="md:w-48 aspect-video md:aspect-auto relative"
              style={{ backgroundImage: m.gradient }}
            >
              <div className="absolute inset-0 telemetry-grid opacity-30 mix-blend-overlay" />
              <span className="absolute top-3 left-3 text-telemetry">{m.region.toUpperCase()}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-display text-xl font-semibold">{m.name}</h3>
              <div className="text-xs font-mono text-muted-foreground mt-1">{m.calories} kcal · daily target</div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {m.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="size-4 text-gold mt-0.5 shrink-0" />{h}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="font-display font-bold text-2xl text-gold">₦{m.priceNGN.toLocaleString()}</span>
                <GoldButton size="sm">Enroll</GoldButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
