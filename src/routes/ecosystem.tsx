import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Heart, ShoppingBag, TrendingUp, Activity,
  Cpu, Archive, ArrowRight, ExternalLink, Gauge,
} from "lucide-react";

export const Route = createFileRoute("/ecosystem")({
  component: Ecosystem,
  head: () => ({
    meta: [
      { title: "Ecosystem Network — ResoFlex Unified OS™" },
      { name: "description", content: "Africa's connected wellness, commerce, creator economy and AI infrastructure ecosystem — Elite NG, Joy Reset, ResoFit Evolution, Resonance Fitness, ResoFit Shop and ResoFlex Unified OS." },
      { name: "keywords", content: "AI wellness platform, creator economy infrastructure, African wellness innovation, wellness commerce ecosystem, digital wellness platform, creator monetization ecosystem" },
      { property: "og:title", content: "Ecosystem Network — ResoFlex Unified OS™" },
      { property: "og:description", content: "An interconnected institutional-grade ecosystem of wellness, creator economy, commerce and AI infrastructure." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sovereign-resofit.lovable.app/ecosystem" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ecosystem Network — ResoFlex Unified OS™" },
      { name: "twitter:description", content: "Africa's connected wellness, commerce, creator economy and AI infrastructure ecosystem." },
    ],
    links: [{ rel: "canonical", href: "https://sovereign-resofit.lovable.app/ecosystem" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ResoFlex Unified OS",
        url: "https://sovereign-resofit.lovable.app/ecosystem",
        description: "Africa's connected wellness, commerce, creator economy and AI infrastructure ecosystem.",
        subOrganization: [
          { "@type": "Organization", name: "Elite NG" },
          { "@type": "Organization", name: "Joy Reset" },
          { "@type": "Organization", name: "ResoFit Shop" },
          { "@type": "Organization", name: "ResoFit Evolution" },
          { "@type": "Organization", name: "Resonance Fitness" },
          { "@type": "Organization", name: "ResoFit Legacy Platform" },
        ],
      }),
    }],
  }),
});

type Status = "Growing" | "Active" | "Scaling" | "Expansion" | "Archive";

type Node = {
  id: string;
  name: string;
  tag: string;
  desc: string;
  metric: { label: string; value: string };
  Icon: typeof Sparkles;
  href: string;
  external?: boolean;
  status: Status;
};

const STATUS_DOT: Record<Status, string> = {
  Growing:   "bg-emerald-400",
  Active:    "bg-sky-400",
  Scaling:   "bg-gold",
  Expansion: "bg-fuchsia-400",
  Archive:   "bg-muted-foreground",
};

const NODES: Node[] = [
  { id: "elite",     name: "Elite NG",            tag: "Creator Economy", desc: "Media, culture, modeling, brand partnerships and creator monetization.", metric: { label: "CREATORS", value: "1.2K+" }, Icon: Sparkles,    href: "/elite",     status: "Growing"   },
  { id: "joy",       name: "Joy Reset",           tag: "AI Funnels",      desc: "AI transformation funnels, onboarding, lead nurturing and activation.",   metric: { label: "FUNNELS",  value: "ACTIVE" }, Icon: Heart,       href: "/autopilot", status: "Active"    },
  { id: "shop",      name: "ResoFit Shop",        tag: "Commerce",        desc: "Digital products, wellness vaults, subscriptions and Paystack rails.",     metric: { label: "ORDERS",   value: "LIVE"   }, Icon: ShoppingBag, href: "/shop",      status: "Scaling"   },
  { id: "evolution", name: "ResoFit Evolution",   tag: "Transformation",  desc: "Personal growth, wellness journeys and performance optimization.",         metric: { label: "PROGRAMS", value: "12" },     Icon: TrendingUp,  href: "/meals",     status: "Scaling"   },
  { id: "resonance", name: "Resonance Fitness",   tag: "Core Brand",      desc: "Fitness, nutrition, recovery, heritage wellness and community impact.",    metric: { label: "REGIONS",  value: "3" },      Icon: Activity,    href: "/agents",    status: "Growing"   },
  { id: "os",        name: "ResoFlex Unified OS", tag: "Infrastructure",  desc: "Analytics, AI engines, creator infra, commerce automation and vaults.",    metric: { label: "UPTIME",   value: "99.9%" }, Icon: Cpu,         href: "/",          status: "Expansion" },
  { id: "legacy",    name: "ResoFit Legacy",      tag: "Foundation",      desc: "Original platform, innovation archive and ecosystem knowledge base.",       metric: { label: "SINCE",    value: "2019"   }, Icon: Archive,     href: "/elite",     status: "Archive"   },
];

// SVG node positions (viewBox 800x600), arranged as a halo around the OS hub.
// Desktop layout (viewBox 800x600)
const POS: Record<string, { x: number; y: number }> = {
  elite:     { x: 400, y:  90 },
  joy:       { x: 660, y: 190 },
  shop:      { x: 700, y: 410 },
  evolution: { x: 480, y: 520 },
  resonance: { x: 240, y: 520 },
  legacy:    { x: 100, y: 410 },
  os:        { x: 400, y: 300 },
};

// Mobile layout (viewBox 600x720) — wider node spread, larger touch targets
const POS_M: Record<string, { x: number; y: number }> = {
  elite:     { x: 300, y:  90 },
  joy:       { x: 510, y: 230 },
  shop:      { x: 510, y: 490 },
  evolution: { x: 300, y: 630 },
  resonance: { x:  90, y: 490 },
  legacy:    { x:  90, y: 230 },
  os:        { x: 300, y: 360 },
};


const INVESTOR_METRICS = [
  { label: "Ecosystem Reach",         value: 1_250_000, suffix: "+" },
  { label: "Active Funnels",          value: 24,        suffix: ""  },
  { label: "Creator Opportunities",   value: 1200,      suffix: "+" },
  { label: "Wellness Programs",       value: 12,        suffix: ""  },
  { label: "Commerce Channels",       value: 7,         suffix: ""  },
  { label: "Strategic Partnerships",  value: 18,        suffix: "+" },
  { label: "Revenue Infrastructure",  value: 99,        suffix: "%" },
  { label: "Expansion Readiness",     value: 100,       suffix: "%" },
];

const ECOSYSTEM_METRICS = [
  { label: "Creator Ecosystem",     value: 1200, suffix: "+" },
  { label: "Wellness Programs",     value: 12,   suffix: ""  },
  { label: "Digital Vault Assets",  value: 340,  suffix: "+" },
  { label: "Commerce Products",     value: 48,   suffix: ""  },
  { label: "Active Funnels",        value: 24,   suffix: ""  },
  { label: "Growth Opportunities",  value: 60,   suffix: "+" },
];

function useCountUp(target: number, run: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!run) { setVal(0); return; }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, run, duration]);
  return val;
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  const n = useCountUp(value, seen);
  const fmt = n >= 1000 ? n.toLocaleString() : String(n);
  return <div ref={ref} className="font-display font-bold text-gold text-2xl sm:text-3xl leading-none">{fmt}{suffix}</div>;
}

function Ecosystem() {
  const [hover, setHover] = useState<string | null>(null);
  const [investor, setInvestor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const pos = isMobile ? POS_M : POS;
  const vb = isMobile ? "0 0 600 720" : "0 0 800 600";
  const hubR = isMobile ? 64 : 56;
  const nodeR = isMobile ? 52 : 42;
  const hubGlowR = isMobile ? 180 : 160;


  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-telemetry mb-3 inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gold animate-pulse" /> ECOSYSTEM · COMMAND CENTER
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Africa's connected <span className="text-gold">wellness, commerce</span> & AI infrastructure.
        </h1>
        <p className="mt-4 text-muted-foreground text-sm sm:text-base">
          A unified ecosystem designed to transform communities through wellness,
          innovation, commerce, culture, and scalable digital infrastructure.
        </p>

        {/* Investor Mode toggle */}
        <button
          onClick={() => setInvestor((v) => !v)}
          className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-widest transition-all ${
            investor ? "border-gold bg-gold/10 text-gold shadow-gold" : "border-gold/30 text-muted-foreground hover:border-gold/60"
          }`}
          aria-pressed={investor}
        >
          <Gauge className="size-3.5" />
          Investor Mode {investor ? "· ON" : "· OFF"}
        </button>
      </div>

      {/* Investor metrics panel */}
      {investor && (
        <div className="mt-8 glass-panel rounded-2xl p-5 sm:p-8 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" />
          <div className="relative text-telemetry mb-4">// INSTITUTIONAL METRICS · PLACEHOLDER</div>
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INVESTOR_METRICS.map((m) => (
              <div key={m.label} className="glass-panel rounded-xl p-4 border border-gold/20">
                <Counter value={m.value} suffix={m.suffix} />
                <div className="text-telemetry mt-2">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Network map */}
      <div className="mt-10 glass-panel rounded-2xl p-3 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" />
        <svg viewBox={vb} className="relative w-full h-auto" role="img" aria-label="Ecosystem network">
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

          <circle cx={pos.os.x} cy={pos.os.y} r={hubGlowR} fill="url(#hubGlow)" />

          {NODES.filter((n) => n.id !== "os").map((n) => {
            const active = hover === n.id || hover === "os";
            return (
              <g key={`e-${n.id}`}>
                <line
                  x1={pos.os.x} y1={pos.os.y}
                  x2={pos[n.id].x} y2={pos[n.id].y}
                  stroke="url(#edge)"
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={active ? "0" : "4 6"}
                  opacity={active ? 1 : 0.6}
                  style={{ transition: "all 250ms ease" }}
                />
                {active && (
                  <circle r="3" fill="hsl(var(--gold))">
                    <animateMotion
                      dur="1.8s"
                      repeatCount="indefinite"
                      path={`M ${pos.os.x} ${pos.os.y} L ${pos[n.id].x} ${pos[n.id].y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {NODES.map((n) => {
            const p = pos[n.id];
            const isHub = n.id === "os";
            const r = isHub ? hubR : nodeR;
            const active = hover === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover((cur) => (cur === n.id ? null : n.id))}
                style={{ cursor: "pointer", transition: "transform 250ms ease", touchAction: "manipulation" }}
              >
                {(active || isHub) && (
                  <circle r={r + 14} fill="none" stroke="hsl(var(--gold) / 0.4)" strokeWidth="1">
                    <animate attributeName="r" values={`${r + 6};${r + 18};${r + 6}`} dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={r + (active ? 6 : 0)}
                  fill="hsl(var(--background) / 0.7)"
                  stroke="hsl(var(--gold) / 0.6)"
                  strokeWidth={isHub ? 2 : 1.2}
                  style={{ filter: active ? "drop-shadow(0 0 14px hsl(var(--gold) / 0.6))" : "none", transition: "all 250ms ease" }}
                />
                <foreignObject x={-r} y={-r} width={r * 2} height={r * 2}>
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
                    <n.Icon className={`text-gold ${isHub ? "size-8" : "size-6"}`} />
                    <div className={`mt-1 font-display font-semibold leading-tight ${isHub ? "text-[12px] sm:text-sm" : "text-[10px] sm:text-[11px]"}`}>
                      {n.name}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>


        <div className="relative mt-4 flex flex-wrap gap-2 justify-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {["Growth", "Creator", "Wellness", "Commerce", "Analytics", "AI", "Vaults", "Community"].map((t) => (
            <span key={t} className="px-2 py-1 rounded border border-gold/15 bg-gold/5">{t}</span>
          ))}
        </div>
      </div>

      {/* Ecosystem metrics strip */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ECOSYSTEM_METRICS.map((m) => (
          <div key={m.label} className="glass-panel rounded-xl p-4 border border-gold/15 text-center">
            <Counter value={m.value} suffix={m.suffix} />
            <div className="text-telemetry mt-2">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Node detail grid */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NODES.map((n) => (
          <NodeCard key={n.id} node={n} highlighted={hover === n.id} onHover={setHover} />
        ))}
      </div>

      {/* Command Center Card */}
      <div className="mt-10 glass-panel rounded-2xl p-6 sm:p-10 relative overflow-hidden border-gold/40 shadow-gold">
        <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="size-14 rounded-xl bg-gradient-gold/20 border border-gold/40 grid place-items-center shrink-0">
            <Cpu className="size-7 text-gold" />
          </div>
          <div>
            <div className="text-telemetry">// COMMAND CENTER</div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">ResoFlex Unified OS</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              The infrastructure layer connecting wellness, commerce, creators, analytics
              and future SaaS innovation.
            </p>
          </div>
        </div>
        <div className="relative mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NODES.filter((n) => n.id !== "os").map((n) => (
            <div key={n.id} className="flex items-center gap-3 glass-panel rounded-lg p-3 border border-gold/15">
              <div className="size-9 rounded-md bg-gold/10 border border-gold/30 grid place-items-center">
                <n.Icon className="size-4 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm truncate">{n.name}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{n.tag}</div>
              </div>
              <span className={`size-2 rounded-full ${STATUS_DOT[n.status]} animate-pulse`} title={n.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Narrative flow */}
      <div className="mt-14 glass-panel rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute inset-0 telemetry-grid opacity-20" />
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="text-telemetry mb-3">// ECOSYSTEM NARRATIVE</div>
          <p className="font-display text-xl sm:text-2xl">
            "Building Africa's Connected <span className="text-gold">Wellness, Commerce, Creator Economy</span> and <span className="text-gold">AI Infrastructure</span> Ecosystem."
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            A unified ecosystem designed to transform communities through wellness,
            innovation, commerce, culture, and scalable digital infrastructure.
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
        <div className="flex items-center gap-2">
          <div className="font-display font-semibold text-lg">{node.name}</div>
        </div>
        <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          <span className={`size-1.5 rounded-full ${STATUS_DOT[node.status]} animate-pulse`} />
          {node.status}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{node.desc}</p>
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
