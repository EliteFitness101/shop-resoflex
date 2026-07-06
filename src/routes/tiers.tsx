import { createFileRoute, Link } from "@tanstack/react-router";
import { SOVEREIGN_CATALOG, skusByTier, type SovereignSKU } from "@/lib/sovereign-catalog";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { track } from "@/lib/analytics";
import { ArrowRight, Crown } from "lucide-react";

export const Route = createFileRoute("/tiers")({
  component: TiersPage,
  head: () => ({
    meta: [
      { title: "NaijaFit™ Tier System — ResoFlex Sovereign OS" },
      { name: "description", content: "Tier 1 to Tier 6 progression: Commander entry through VIP concierge. Locked Paystack catalog, zero fallback." },
      { property: "og:title", content: "NaijaFit™ Tier System" },
      { property: "og:description", content: "The full ResoFlex progression path — 8 sovereign SKUs across 6 tiers." },
      { property: "og:url", content: "https://shop-resoflex.lovable.app/tiers" },
    ],
    links: [{ rel: "canonical", href: "https://shop-resoflex.lovable.app/tiers" }],
  }),
});

const TIER_ORDER: SovereignSKU["tier"][] = [0, 1, 2, 3, 4, 5, 6];

const TIER_LABEL: Record<SovereignSKU["tier"], string> = {
  0: "FREE · FUNNEL ENTRY",
  1: "IGNITION",
  2: "DAILY PROTOCOL",
  3: "PREMIUM WELLNESS",
  4: "SPECIALIST",
  5: "FULL STACK",
  6: "SOVEREIGN ELITE",
};

function TierCard({ sku }: { sku: SovereignSKU }) {
  return (
    <div className="glass-panel rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-telemetry">// TIER {sku.tier}</div>
          <div className="font-display font-semibold text-lg mt-1">{sku.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{sku.tagline}</div>
        </div>
        {sku.badge && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-gold border border-gold/40 px-2 py-1 rounded">
            {sku.badge}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground/90 leading-relaxed">{sku.description}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="font-display text-xl font-bold text-gold">
          {sku.priceNGN === 0 ? "FREE" : `₦${sku.priceNGN.toLocaleString()}`}
        </div>
        <Link
          to="/products/$slug"
          params={{ slug: sku.slug }}
          onClick={() => track("cta_click", { cta: "tier_deploy", sku: sku.slug, tier: sku.tier })}
        >
          <GoldButton size="sm">
            Deploy <ArrowRight className="size-3.5" />
          </GoldButton>
        </Link>
      </div>
    </div>
  );
}

function TiersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <Crown className="size-8 mx-auto text-gold" />
        <div className="text-telemetry mt-3">// NAIJAFIT™ TIER SYSTEM</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
          Six tiers. One <span className="text-gold">sovereign</span> path.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Every operator enters at Tier 1 and ascends. Locked catalog · verified Paystack routes · zero dead links.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {TIER_ORDER.map((t) => (
          <TacticalPanel key={t} label={`TIER ${t}`}>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold">
              {TIER_LABEL[t]}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {skusByTier(t).length} SKU{skusByTier(t).length === 1 ? "" : "s"}
            </div>
          </TacticalPanel>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {TIER_ORDER.map((t) => {
          const skus = skusByTier(t);
          if (skus.length === 0) return null;
          return (
            <section key={t}>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="text-telemetry">// TIER {t}</div>
                  <h2 className="font-display text-2xl font-bold mt-1">{TIER_LABEL[t]}</h2>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {skus.length} deploy{skus.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skus.map((sku) => <TierCard key={sku.slug} sku={sku} />)}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        // Catalog verified · {SOVEREIGN_CATALOG.length} SKUs · Paystack-locked · updated live
      </div>
    </div>
  );
}
