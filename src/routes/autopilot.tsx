import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import {
  Activity, TrendingUp, Target, Zap, Bot, Sparkles, AlertTriangle, ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/autopilot")({
  component: Autopilot,
  head: () => ({
    meta: [
      { title: "AI Business Autopilot — ResoFlex OS™" },
      { name: "description", content: "Self-operating marketing, funnel, and revenue optimization engine." },
      { property: "og:title", content: "AI Business Autopilot — ResoFlex OS™" },
      { property: "og:description", content: "Self-operating marketing, funnel, and revenue optimization engine." },
    ],
  }),
});

// Deterministic pseudo-random so the dashboard "moves" without backend.
function pulse(seed: number, base: number, range: number) {
  return base + Math.sin(seed / 7) * range;
}

const swarms = [
  { id: "111-120", name: "Ad Analysis Swarm", range: "ChatB2K111–120", role: "Scans ad spend, CTR & CPC for waste." },
  { id: "121-140", name: "Conversion Optimizers", range: "ChatB2K121–140", role: "Rewrites CTA copy & funnel order." },
  { id: "141-160", name: "Revenue Forecasters", range: "ChatB2K141–160", role: "Projects NGN inflow per cohort." },
  { id: "161-173", name: "Retention & Upsell", range: "ChatB2K161–173", role: "Triggers VIP offers & win-backs." },
] as const;

const recommendations = [
  { tag: "FUNNEL", text: "Shorten onboarding from 5 → 3 steps to lift activation +12%.", impact: "+₦184k/wk" },
  { tag: "UPSELL", text: "Surface Elite tier on success page within 4s of payment.", impact: "+₦92k/wk" },
  { tag: "PRICING", text: "Promote Starter plan above the fold for cold traffic.", impact: "+8.4% CVR" },
  { tag: "RETENTION", text: "Fire VIP win-back to dormant 14d cohort tonight 21:00.", impact: "+₦61k/wk" },
] as const;

function Autopilot() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const metrics = useMemo(
    () => [
      { label: "CONVERSION", value: `${pulse(t, 6.8, 0.6).toFixed(2)}%`, trend: "+0.42", icon: Target },
      { label: "ROAS", value: `${pulse(t, 4.3, 0.4).toFixed(2)}x`, trend: "+0.18", icon: TrendingUp },
      { label: "DAILY REV", value: `₦${Math.round(pulse(t, 1_840_000, 120_000)).toLocaleString()}`, trend: "+₦92k", icon: Zap },
      { label: "AUTOPILOT", value: "ACTIVE", trend: `${swarms.reduce((a, _) => a + 1, 0)} swarms`, icon: Bot },
    ],
    [t],
  );

  const funnel = [
    { stage: "Visit", rate: pulse(t, 100, 0) },
    { stage: "Engage", rate: pulse(t, 58, 3) },
    { stage: "Checkout", rate: pulse(t, 17, 1.5) },
    { stage: "Paid", rate: pulse(t, 6.8, 0.6) },
    { stage: "Upsell", rate: pulse(t, 2.4, 0.4) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-telemetry">// AI BUSINESS AUTOPILOT ENGINE · ABAE v1</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            Sovereign <span className="text-gold">autopilot</span> is operating.
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Continuous marketing, funnel, and revenue optimization. Swarms tuning CTAs, pricing weight, and retention triggers in real time.
          </p>
        </div>
        <GoldButton>
          <Sparkles className="size-4" /> Apply top recommendation
        </GoldButton>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <TacticalPanel key={m.label} label={m.label} status={(t + i) % 3 === 0 ? "LIVE" : "OK"}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-2xl text-gold">{m.value}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                  {m.trend} · 24h
                </div>
              </div>
              <m.icon className="size-6 text-gold/60" />
            </div>
          </TacticalPanel>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-4">
        <TacticalPanel label="FUNNEL · LIVE FLOW" status="OPTIMIZING" className="lg:col-span-2">
          <div className="space-y-3">
            {funnel.map((f, i) => (
              <div key={f.stage}>
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                  <span className="text-muted-foreground">{f.stage}</span>
                  <span className="text-gold">{f.rate.toFixed(1)}%</span>
                </div>
                <div className="h-2 mt-1 rounded bg-gold/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold transition-all duration-700"
                    style={{ width: `${Math.min(100, f.rate)}%`, opacity: 1 - i * 0.12 }}
                  />
                </div>
              </div>
            ))}
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground pt-1 flex items-center gap-1.5">
              <AlertTriangle className="size-3 text-gold" />
              Drop-off detected at Checkout · auto-deploying friction reducer.
            </div>
          </div>
        </TacticalPanel>

        <TacticalPanel label="SWARM · CHATB2K" status={`${swarms.length} ACTIVE`}>
          <div className="space-y-3">
            {swarms.map((s, i) => (
              <div key={s.id} className="flex items-start gap-2.5">
                <span
                  className={`mt-1 size-2 rounded-full shrink-0 ${
                    (t + i) % 2 === 0 ? "bg-gold animate-pulse" : "bg-gold/40"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-semibold">{s.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {s.range}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.role}</div>
                </div>
              </div>
            ))}
          </div>
        </TacticalPanel>
      </div>

      <TacticalPanel label="RECOMMENDATIONS · APPLY ONE-CLICK" status="QUEUED">
        <div className="grid sm:grid-cols-2 gap-3">
          {recommendations.map((r) => (
            <div
              key={r.text}
              className="rounded-lg border border-gold/15 p-3.5 hover:border-gold/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold/80">{r.tag}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold">{r.impact}</span>
              </div>
              <div className="text-sm mt-1.5">{r.text}</div>
              <button className="mt-2 text-[11px] font-mono uppercase tracking-widest text-gold inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                Deploy <ArrowUpRight className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </TacticalPanel>

      <TacticalPanel label="ECOSYSTEM LAUNCHER" status="UNLOCKED ON PAYMENT">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: "Gym", to: "/elite" },
            { label: "Meals", to: "/meals" },
            { label: "Glow", to: "/shop" },
            { label: "Elite", to: "/elite" },
            { label: "AI Tools", to: "/agents" },
            { label: "Vault", to: "/wallet" },
          ].map((m) => (
            <a
              key={m.label}
              href={m.to}
              className="rounded-lg border border-gold/15 hover:border-gold/40 hover:bg-gold/5 transition p-3 text-center"
            >
              <Activity className="size-4 text-gold mx-auto" />
              <div className="text-xs font-mono uppercase tracking-widest mt-1.5">{m.label}</div>
            </a>
          ))}
        </div>
      </TacticalPanel>
    </div>
  );
}
