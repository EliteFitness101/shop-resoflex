import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles, Heart, ShoppingBag, TrendingUp, Activity,
  Cpu, Archive, ArrowRight, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/ecosystem")({
  component: Ecosystem,
  head: () => ({
    meta: [
      { title: "Ecosystem Network — ResoFlex OS™" },
      { name: "description", content: "Africa's connected wellness, commerce, creator economy and AI infrastructure ecosystem — Elite NG, Joy Reset, ResoFit, Resonance Fitness and ResoFlex Unified OS." },
      { property: "og:title", content: "Ecosystem Network — ResoFlex OS™" },
      { property: "og:description", content: "An interconnected institutional-grade ecosystem of wellness, creator economy, commerce and AI infrastructure." },
    ],
    links: [{ rel: "canonical", href: "/ecosystem" }],
  }),
});

type Node = {
  id: string;
  name: string;
  tag: string;
  desc: string;
  metric: { label: string; value: string };
  Icon: typeof Sparkles;
  href: string;
  external?: boolean;
};

const NODES: Node[] = [
  { id: "elite",     name: "Elite NG",            tag: "Creator Economy", desc: "Media, culture, modeling, brand partnerships and creator monetization.", metric: { label: "CREATORS", value: "1.2K+" }, Icon: Sparkles,    href: "/elite" },
  { id: "joy",       name: "Joy Reset",           tag: "AI Funnels",      desc: "AI transformation funnels, onboarding, lead nurturing and activation.",   metric: { label: "FUNNELS",  value: "ACTIVE" }, Icon: Heart,       href: "/autopilot" },
  { id: "shop",      name: "ResoFit Shop",        tag: "Commerce",        desc: "Digital products, wellness vaults, subscriptions and Paystack rails.",     metric: { label: "ORDERS",   value: "LIVE"   }, Icon: ShoppingBag, href: "/shop" },
  { id: "evolution", name: "ResoFit Evolution",   tag: "Transformation",  desc: "Personal growth, wellness journeys and performance optimization.",         metric: { label: "PROGRAMS", value: "12" },     Icon: TrendingUp,  href: "/meals" },
  { id: "resonance", name: "Resonance Fitness",   tag: "Core Brand",      desc: "Fitness, nutrition, recovery, heritage wellness and community impact.",    metric: { label: "REGIONS",  value: "3" },      Icon: Activity,    href: "/agents" },
  { id: "os",        name: "ResoFlex Unified OS", tag: "Infrastructure",  desc: "Analytics, AI engines, creator infra, commerce automation and vaults.",    metric: { label: "UPTIME",   value: "99.9%" }, Icon: Cpu,         href: "/" },
  { id: "legacy",    name: "ResoFit Legacy",      tag: "Foundation",      desc: "Original platform, innovation archive and ecosystem knowledge base.",       metric: { label: "SINCE",    value: "2019"   }, Icon: Archive,     href: "/elite" },
];

// SVG node positions (viewBox 800x600), arranged as a halo around the OS hub.
const POS: Record<string, { x: number; y: number }> = {
  elite:     { x: 400, y:  90 },
  joy:       { x: 660, y: 190 },
  shop:      { x: 700, y: 410 },
  evolution: { x: 480, y: 520 },
  resonance: { x: 240, y: 520 },
  legacy:    { x: 100, y: 410 },
  os:        { x: 400, y: 300 }, // hub
};

function Ecosystem() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-telemetry mb-3 inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gold animate-pulse" /> ECOSYSTEM · NETWORK MAP
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Africa's connected <span className="text-gold">wellness, commerce</span> & AI infrastructure.
        </h1>
        <p className="mt-4 text-muted-foreground text-sm sm:text-base">
          Seven institutional-grade properties operating as one sovereign operating system —
          creator economy, transformation, commerce, analytics and AI vault delivery.
        </p>
      </div>

      {/* Network map */}
      <div className="mt-10 glass-panel rounded-2xl p-3 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" />
        <svg viewBox="0 0 800 600" className="relative w-full h-auto" role="img" aria-label="Ecosystem network">
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--gold) / 0.55)" />
              <stop offset="100%" stopColor="hsl(var(--gold) / 0)" />
            </radialGradient>
            <linearGradient id="edge" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(var(--gold) / 0.05)" />
              <stop offset="50%" stopColor="hsl(var(--gold) / 0.55)" />
              <stop offset="100%" stopColor="hsl(var(--gold) / 0.05)" />
            </linearGradient>
          </defs>

          {/* Hub glow */}
          <circle cx={POS.os.x} cy={POS.os.y} r="160" fill="url(#hubGlow)" />

          {/* Edges from hub to every spoke */}
          {NODES.filter((n) => n.id !== "os").map((n) => {
            const active = hover === n.id || hover === "os";
            return (
              <line
                key={`e-${n.id}`}
                x1={POS.os.x} y1={POS.os.y}
                x2={POS[n.id].x} y2={POS[n.id].y}
                stroke="url(#edge)"
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? "0" : "4 6"}
                opacity={active ? 1 : 0.6}
                style={{ transition: "all 250ms ease" }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => {
            const p = POS[n.id];
            const isHub = n.id === "os";
            const r = isHub ? 56 : 42;
            const active = hover === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "transform 250ms ease" }}
              >
                <circle
                  r={r + (active ? 6 : 0)}
                  fill="hsl(var(--background) / 0.7)"
                  stroke="hsl(var(--gold) / 0.6)"
                  strokeWidth={isHub ? 2 : 1.2}
                  style={{ filter: active ? "drop-shadow(0 0 14px hsl(var(--gold) / 0.6))" : "none", transition: "all 250ms ease" }}
                />
                <foreignObject x={-r} y={-r} width={r * 2} height={r * 2}>
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
                    <n.Icon className={`text-gold ${isHub ? "size-7" : "size-5"}`} />
                    <div className={`mt-1 font-display font-semibold leading-tight ${isHub ? "text-[11px] sm:text-sm" : "text-[9px] sm:text-[11px]"}`}>
                      {n.name}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Legend / connection vocabulary */}
        <div className="relative mt-4 flex flex-wrap gap-2 justify-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {["Growth", "Creator", "Wellness", "Commerce", "Analytics", "AI", "Vaults", "Community"].map((t) => (
            <span key={t} className="px-2 py-1 rounded border border-gold/15 bg-gold/5">{t}</span>
          ))}
        </div>
      </div>

      {/* Node detail grid */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NODES.map((n) => (
          <NodeCard key={n.id} node={n} highlighted={hover === n.id} onHover={setHover} />
        ))}
      </div>

      {/* Narrative flow */}
      <div className="mt-14 glass-panel rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute inset-0 telemetry-grid opacity-20" />
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="text-telemetry mb-3">// ECOSYSTEM NARRATIVE</div>
          <p className="font-display text-xl sm:text-2xl">
            "Building Africa's connected <span className="text-gold">wellness, commerce, creator economy</span> and <span className="text-gold">AI infrastructure</span> ecosystem."
          </p>
        </div>
        <ol className="relative mt-8 grid gap-2 max-w-md mx-auto">
          {["Elite NG","Joy Reset","ResoFit Evolution","Resonance Fitness","ResoFit Shop","ResoFlex Unified OS","ResoFit Legacy Platform"].map((step, i, arr) => (
            <li key={step} className="flex items-center gap-3">
              <span className="size-7 grid place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold font-mono text-xs shrink-0">{i+1}</span>
              <span className="glass-panel rounded-md px-3 py-2 flex-1 font-display text-sm">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="size-3.5 text-gold/50 shrink-0" />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function NodeCard({ node, highlighted, onHover }: { node: Node; highlighted: boolean; onHover: (id: string | null) => void }) {
  const Inner = (
    <div
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className={`glass-panel rounded-xl p-5 h-full relative overflow-hidden transition-all duration-300 ${
        highlighted ? "border-gold/60 shadow-gold -translate-y-0.5" : "hover:-translate-y-0.5 hover:border-gold/40"
      }`}
    >
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="size-11 rounded-lg bg-gradient-gold/20 border border-gold/30 grid place-items-center">
          <node.Icon className="size-5 text-gold" />
        </div>
        <span className="text-telemetry">{node.tag.toUpperCase()}</span>
      </div>
      <div className="relative mt-4">
        <div className="font-display font-semibold text-lg">{node.name}</div>
        <p className="mt-1 text-sm text-muted-foreground">{node.desc}</p>
      </div>
      <div className="relative mt-4 flex items-center justify-between">
        <div>
          <div className="text-telemetry">{node.metric.label}</div>
          <div className="font-display font-bold text-gold text-lg leading-tight">{node.metric.value}</div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-gold">
          Visit {node.external ? <ExternalLink className="size-3" /> : <ArrowRight className="size-3" />}
        </span>
      </div>
    </div>
  );
  return node.external
    ? <a href={node.href} target="_blank" rel="noopener noreferrer">{Inner}</a>
    : <Link to={node.href}>{Inner}</Link>;
}
