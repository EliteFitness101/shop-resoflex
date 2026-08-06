import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSKU, paystackUrl, SOVEREIGN_CATALOG } from "@/lib/sovereign-catalog";
import { nextTierUpsell } from "@/lib/chatb2k-intent";
import { GoldButton } from "@/components/GoldButton";
import { TacticalPanel } from "@/components/TacticalPanel";
import { track } from "@/lib/analytics";
import { decorateUrl, ensureAttribution } from "@/lib/attribution";
import { verifyCheckoutUrl } from "@/lib/checkout-url";
import { usePersonalization } from "@/hooks/use-personalization";
import { companionSKU } from "@/lib/personalization";
import { ArrowRight, ExternalLink, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const WHATSAPP_E164 = "2348000000000";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const sku = getSKU(params.slug);
    if (!sku) throw notFound();
    return { sku };
  },
  notFoundComponent: NotFoundSKU,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-telemetry">// SKU ROUTE ERROR</div>
        <h1 className="font-display text-2xl font-bold mt-2">Something failed.</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 text-gold font-mono uppercase text-xs tracking-widest hover:underline"
        >
          Retry
        </button>
      </div>
    );
  },
  component: ProductRoute,
  head: ({ loaderData }) => {
    const sku = loaderData?.sku;
    if (!sku) return { meta: [{ title: "Product — ResoFlex OS" }] };
    const url = `https://shop-resoflex.lovable.app/products/${sku.slug}`;
    return {
      meta: [
        { title: `${sku.name} — ResoFlex Sovereign OS` },
        { name: "description", content: sku.description },
        { property: "og:title", content: sku.name },
        { property: "og:description", content: sku.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: sku.name },
        { name: "twitter:description", content: sku.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: sku.name,
            description: sku.description,
            sku: sku.slug,
            brand: { "@type": "Brand", name: "ResoFlex OS" },
            offers: {
              "@type": "Offer",
              priceCurrency: "NGN",
              price: sku.priceNGN,
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://shop-resoflex.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Tiers", item: "https://shop-resoflex.lovable.app/tiers" },
              { "@type": "ListItem", position: 3, name: sku.name, item: url },
            ],
          }),
        },
      ],
    };
  },

});

function NotFoundSKU() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="text-telemetry">// SKU NOT IN LOCKED CATALOG</div>
      <h1 className="font-display text-3xl font-bold mt-2">Unknown deploy.</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        This slug isn't in the Sovereign catalog. Zero-dead-link policy — no fallback served.
      </p>
      <Link to="/tiers" className="inline-block mt-6">
        <GoldButton>See the Tier map</GoldButton>
      </Link>
    </div>
  );
}

function ProductRoute() {
  const { sku } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const upsell = nextTierUpsell(sku.slug);
  const persona = usePersonalization();
  const companion = persona.hasProfile ? companionSKU(sku.slug, persona.profile) : null;

  useEffect(() => {
    ensureAttribution();
    track("product_view", { sku: sku.slug, tier: sku.tier, price: sku.priceNGN });
  }, [sku.slug, sku.tier, sku.priceNGN]);

  const total = sku.priceNGN * qty;
  const checkoutHref = decorateUrl(paystackUrl(sku.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <Link to="/tiers" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-gold">
        ← Tier map
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-xl overflow-hidden aspect-square relative">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(135deg, oklch(0.2 0.04 60), oklch(0.78 0.09 65))" }}
          />
          <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />
          <div className="absolute bottom-4 left-4">
            <div className="text-telemetry">// TIER {sku.tier}</div>
            {sku.badge && (
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold mt-1">{sku.badge}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{sku.name}</h1>
            <p className="text-muted-foreground mt-1">{sku.tagline}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{sku.description}</p>

          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-display text-3xl font-bold text-gold">
                {sku.priceNGN === 0 ? "FREE" : `₦${total.toLocaleString()}`}
              </div>
              {sku.priceNGN > 0 && (
                <div className="text-xs text-muted-foreground">
                  ₦{sku.priceNGN.toLocaleString()} × {qty}
                </div>
              )}
            </div>

            {sku.priceNGN > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Qty</span>
                {[1, 2, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQty(n)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition ${
                      qty === n ? "bg-gold border-gold text-black font-bold" : "border-gold/20 text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            <a
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                const verified = verifyCheckoutUrl(checkoutHref);
                if (!verified.ok) {
                  e.preventDefault();
                  track("checkout_guard_failure", {
                    sku: sku.slug,
                    reason: verified.reason,
                    resolvedUrl: checkoutHref,
                  });
                  return;
                }
                track("checkout_guard_success", { sku: sku.slug, tier: sku.tier, qty, amount: total });
                track("checkout_started", { sku: sku.slug, tier: sku.tier, qty, amount: total });
                if (companion) {
                  track("recommendation_purchased", { sku: sku.slug, companion: companion.slug, surface: "product" });
                }
              }}
              className="mt-5 block"
            >
              <GoldButton size="lg" className="w-full">
                {sku.priceNGN === 0 ? "Enter Funnel — Free" : "Deploy via Paystack"} <ExternalLink className="size-4" />
              </GoldButton>
            </a>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <ShieldCheck className="size-3 text-gold" /> {sku.priceNGN === 0 ? "Funnel · attribution-tracked" : "Paystack · verified · encrypted"}
            </div>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
              `ResoFlex — I want to deploy ${sku.name} (${sku.slug}). Tier ${sku.tier}.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { sku: sku.slug, source: "product_page" })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-gold/30 text-gold hover:bg-gold/10 transition text-sm font-mono uppercase tracking-wider min-h-11"
          >
            <MessageCircle className="size-4" /> Chat concierge on WhatsApp
          </a>
        </div>
      </div>

      {upsell && (
        <TacticalPanel label={`AUTO-UPSELL · TIER ${upsell.tier}`} status="READY" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="font-display font-semibold text-lg">{upsell.name}</div>
              <div className="text-sm text-muted-foreground">{upsell.tagline}</div>
              <div className="font-display text-lg font-bold text-gold mt-1">
                ₦{upsell.priceNGN.toLocaleString()}
              </div>
            </div>
            <Link to="/products/$slug" params={{ slug: upsell.slug }}>
              <GoldButton variant="outline">
                Ascend to Tier {upsell.tier} <ArrowRight className="size-4" />
              </GoldButton>
            </Link>
          </div>
        </TacticalPanel>
      )}

      {companion && companion.slug !== sku.slug && companion.slug !== upsell?.slug && (
        <TacticalPanel label={`AI COMPANION · ${persona.bundleTier.toUpperCase()}`} status="MATCHED" className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2 text-telemetry text-gold">
                <Sparkles className="size-3.5" /> CHATB2K RECOMMENDS
              </div>
              <div className="font-display font-semibold text-lg mt-1">{companion.name}</div>
              <div className="text-sm text-muted-foreground">{companion.tagline}</div>
              <div className="font-display text-lg font-bold text-gold mt-1">
                {companion.priceNGN === 0 ? "FREE" : `₦${companion.priceNGN.toLocaleString()}`}
              </div>
            </div>
            <Link
              to="/products/$slug"
              params={{ slug: companion.slug }}
              onClick={() =>
                track("bundle_recommended", {
                  sku: sku.slug,
                  companion: companion.slug,
                  bundleTier: persona.bundleTier,
                  surface: "product",
                })
              }
            >
              <GoldButton>
                Pair it up <ArrowRight className="size-4" />
              </GoldButton>
            </Link>
          </div>
        </TacticalPanel>
      )}

      <div className="mt-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">
        // Catalog-locked · {SOVEREIGN_CATALOG.length} SKUs · slug verified on load
      </div>
    </div>
  );
}
