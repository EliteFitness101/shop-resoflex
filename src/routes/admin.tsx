import { createFileRoute } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { telemetry, stats } from "@/lib/mock-data";
import { AlertTriangle, Cpu, Database, Lock, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Secure Admin — ResoFlex OS™" },
      { name: "description", content: "Read-only command telemetry for sovereign infrastructure." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Admin() {
  const levelColor = (l: string) => l === "threat" ? "text-destructive" : l === "warn" ? "text-amber-400" : "text-gold";
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-telemetry mb-2">
        <Lock className="size-3.5" /> SECURE TELEMETRY · READ-ONLY · AUTH-LEVEL: SOVEREIGN
      </div>
      <h1 className="font-display text-4xl font-bold">Command Console</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
        <TacticalPanel label="UPTIME" status="NOMINAL">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl text-gold">{stats.systemUptime}%</span>
            <Cpu className="size-5 text-gold/60" />
          </div>
        </TacticalPanel>
        <TacticalPanel label="ACTIVE SESSIONS" status="LIVE">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl text-gold">{stats.agentsOnline}</span>
            <Database className="size-5 text-gold/60" />
          </div>
        </TacticalPanel>
        <TacticalPanel label="THREATS · 24H" status="CONTAINED">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl text-gold">12</span>
            <ShieldAlert className="size-5 text-gold/60" />
          </div>
        </TacticalPanel>
        <TacticalPanel label="ANOMALIES" status="OBSERVING">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl text-amber-400">3</span>
            <AlertTriangle className="size-5 text-amber-400/70" />
          </div>
        </TacticalPanel>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <TacticalPanel label="SYSTEM LOG STREAM" status="LIVE" className="lg:col-span-2">
          <ul className="font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {telemetry.map((e) => (
              <li key={e.id} className="flex gap-3 items-start py-1 border-b border-gold/5">
                <span className="text-muted-foreground shrink-0">{e.timestamp}</span>
                <span className={`uppercase shrink-0 w-14 ${levelColor(e.level)}`}>{e.level}</span>
                <span className="text-gold/70 shrink-0">{e.source}</span>
                <span className="text-muted-foreground">{e.message}</span>
              </li>
            ))}
          </ul>
        </TacticalPanel>

        <TacticalPanel label="ENVIRONMENT">
          <ul className="font-mono text-xs space-y-2">
            {[
              ["PAYSTACK_SECRET_KEY", "•••••• not set"],
              ["SUPABASE_URL", "•••••• not set"],
              ["SHOPIFY_STOREFRONT_TOKEN", "•••••• not set"],
              ["WEBHOOK_SECRET", "•••••• not set"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between gap-3">
                <span className="text-gold/80">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">Wire secrets via Lovable Cloud → Project Settings to activate live commerce.</p>
        </TacticalPanel>
      </div>
    </div>
  );
}
