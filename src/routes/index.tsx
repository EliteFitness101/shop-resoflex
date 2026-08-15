import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ScarcityBanner } from "@/components/ScarcityBanner";
import { TacticalPanel } from "@/components/TacticalPanel";
import { ProductCard } from "@/components/ProductCard";
import { GoldButton } from "@/components/GoldButton";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PlusSizeHero } from "@/components/PlusSizeHero";
import { HeroCarousel } from "@/components/HeroCarousel";
import { StickyCTA } from "@/components/StickyCTA";
import { PersonalizedPanel } from "@/components/PersonalizedPanel";
import { products, mealPlans, stats } from "@/lib/mock-data";
import { attachScrollDepthTracking, track } from "@/lib/analytics";
import { decorateUrl, ensureAttribution } from "@/lib/attribution";
import { Activity, Coins, Flame, ShieldCheck, Sparkles, TrendingUp, Users, ExternalLink } from "lucide-react";

const CHATB2K_URL = "https://chatb2k.resofit.fit";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "ResoFlex OS™ — Sovereign Performance Operating System" },
      { name: "description", content: "Nigerian luxury fitness ecosystem: elite supplements, training programs, meal plans, and a referral commerce engine." },
      { property: "og:title", content: "ResoFlex OS™ — Sovereign Performance Operating System" },
      { property: "og:description", content: "Nigerian luxury fitness ecosystem: elite supplements, training programs, meal plans, and a referral commerce engine." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Landing() {
  useEffect(() => {
    ensureAttribution();
    track("landing_view");
    const cleanup = attachScrollDepthTracking();
    return cleanup;
  }, []);
  return (
    <>
      <ScarcityBanner />
      <HeroCarousel />
      <PlusSizeHero />
      <StickyCTA />




      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 telemetry-grid opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-20 md:pt-24 md:pb-32 text-center">
          <div className="text-telemetry mb-4 inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            SYSTEM ONLINE · LAGOS · ABUJA · PORT HARCOURT
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter">
            Engineer your <span className="text-gold">sovereign</span><br className="hidden sm:block" /> physical state.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
            ResoFlex™ Empire OS — Nigeria's elite performance operating system. Premium supplements, tactical programs, regional meal protocols, and a sovereign referral economy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" onClick={() => track("cta_click", { cta: "hero_shop" })}>
              <GoldButton size="lg">Enter the Shop</GoldButton>
            </Link>
            <a
              href={decorateUrl(CHATB2K_URL)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { cta: "chatb2k_assessment", target: "external" })}
              className="inline-flex items-center gap-2 font-mono uppercase tracking-widest text-xs sm:text-sm px-5 py-3 rounded border border-gold/50 text-gold hover:bg-gold/10 hover:shadow-gold transition min-h-11"
            >
              <Sparkles className="size-4" /> ChatB2K Assessment <ExternalLink className="size-3.5 opacity-70" />
            </a>
          </div>
          <div className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // Free 60-second readiness scan · unified backend · no signup required
          </div>

          {/* Metric strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: "ACTIVE OPERATORS", value: stats.activeOperators.toLocaleString(), Icon: Users },
              { label: "MONTHLY VOLUME", value: `₦${(stats.monthlyVolumeNGN/1_000_000).toFixed(1)}M`, Icon: TrendingUp },
              { label: "AGENTS ONLINE", value: stats.agentsOnline.toString(), Icon: Activity },
              { label: "UPTIME", value: `${stats.systemUptime}%`, Icon: ShieldCheck },
            ].map((m) => (
              <TacticalPanel key={m.label} label={m.label}>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-2xl text-gold">{m.value}</span>
                  <m.Icon className="size-5 text-gold/60" />
                </div>
              </TacticalPanel>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="mb-8">
          <PersonalizedPanel surface="home" />
        </div>
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-telemetry mb-2">// ARSENAL</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Tactical commerce</h2>
          </div>
          <Link to="/shop" className="text-xs font-mono uppercase tracking-widest text-gold hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WELLNESS / MEAL PLANS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-telemetry mb-2">// REGIONAL PROTOCOLS</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Naija wellness, engineered.</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl">Meal plans built around real Nigerian foods — macro-precise, region-honest, operator-grade.</p>
          </div>
          <Link to="/meals" className="text-xs font-mono uppercase tracking-widest text-gold hover:underline">Browse →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealPlans.map((m) => (
            <div key={m.id} className="glass-panel rounded-lg overflow-hidden">
              <div className="aspect-square relative" style={{ backgroundImage: m.gradient }}>
                <div className="absolute inset-0 telemetry-grid opacity-30 mix-blend-overlay" />
                <span className="absolute bottom-3 left-3 text-telemetry">{m.region.toUpperCase()}</span>
              </div>
              <div className="p-4">
                <div className="font-display font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.calories} kcal · ₦{m.priceNGN.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REFERRAL HIGHLIGHT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="glass-panel rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 telemetry-grid opacity-30" />
          <div className="relative p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-telemetry mb-3 inline-flex items-center gap-2"><Coins className="size-3.5"/> AGENT NETWORK</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Earn while you build the movement.</h2>
              <p className="mt-3 text-muted-foreground">Up to <span className="text-gold font-semibold">40% commission</span> on every referred operator. Real-time wallet, instant Paystack payouts, transparent telemetry.</p>
              <div className="mt-6 flex gap-3">
                <Link to="/agents"><GoldButton>Become an Agent</GoldButton></Link>
                <Link to="/wallet"><GoldButton variant="outline">View Wallet</GoldButton></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "AVG. AGENT/MO", v: "₦184K" },
                { l: "TOP TIER/MO", v: "₦2.1M" },
                { l: "PAYOUT SPEED", v: "<24h" },
                { l: "TIERS", v: "3" },
              ].map((s) => (
                <TacticalPanel key={s.l} label={s.l}>
                  <div className="font-display font-bold text-2xl text-gold">{s.v}</div>
                </TacticalPanel>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <Flame className="size-8 mx-auto text-gold mb-3" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Operators don't wait.</h2>
          <p className="mt-3 text-muted-foreground">Provision your access. Run the protocol. Dominate the quarter.</p>
          <Link to="/register" search={{ ref: "" }}><GoldButton size="lg" className="mt-6">Provision Access</GoldButton></Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <div className="text-telemetry mb-2 text-center">// SIGNALS</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-8">Frequently transmitted</h2>
        <FAQAccordion items={[
          { q: "Is ResoFlex shipping inside Nigeria?", a: "Yes — flagship hubs in Lagos, Abuja, and Port Harcourt. 24–72h delivery nationwide via vetted couriers. Digital products deliver instantly." },
          { q: "How do referral commissions work?", a: "Every product carries a fixed commission (15–40%). Earnings credit to your wallet in real-time on charge.success and clear for withdrawal in <24h." },
          { q: "Can I pay in USD?", a: "Pricing is NGN-native. The currency switcher in the header previews USD equivalents; checkout settles in NGN via Paystack." },
          { q: "Are meal plans halal-compatible?", a: "Yes — every regional protocol includes halal and non-halal swaps documented per meal." },
        ]} />
      </section>

    </>
  );
}
