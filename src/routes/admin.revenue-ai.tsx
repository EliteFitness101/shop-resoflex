import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { useAuth } from "@/hooks/use-auth";
import { checkIsAdmin } from "@/lib/admin.functions";
import { getRevenueDashboard, generateRevenueInsights } from "@/lib/revenue.functions";
import { Loader2, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/revenue-ai")({
  component: RevenueAI,
  head: () => ({
    meta: [
      { title: "Revenue AI — ResoFlex OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const fmt = (n: number) =>
  "₦" + Math.round(n).toLocaleString("en-NG");

function RevenueAI() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<{ insights: string[]; recommendations: string[] } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    checkIsAdmin().then((r) => setIsAdmin(r.isAdmin));
  }, [loading, user]);

  useEffect(() => {
    if (!isAdmin) return;
    getRevenueDashboard().then(setData).catch(console.error);
  }, [isAdmin]);

  const runAI = async () => {
    setBusy(true);
    try {
      const r = await generateRevenueInsights();
      setInsights({ insights: r.insights, recommendations: r.recommendations });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Authenticating…</div>;
  if (!user)
    return (
      <div className="p-10 max-w-md mx-auto text-center">
        <Lock className="size-10 mx-auto text-gold" />
        <p className="mt-4">Sign in required.</p>
        <Link to="/login" className="text-gold font-mono text-xs uppercase tracking-widest">→ Login</Link>
      </div>
    );
  if (isAdmin === false)
    return <div className="p-10 text-center text-muted-foreground">Admin only.</div>;
  if (!data) return <div className="p-10 text-center text-muted-foreground"><Loader2 className="animate-spin inline mr-2 size-4" />Loading revenue intelligence…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-gold">Revenue AI</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Sovereign truth · Supabase ingest · advisory only
          </p>
        </div>
        <GoldButton onClick={runAI} disabled={busy}>
          {busy ? <><Loader2 className="size-4 animate-spin mr-2" />Analysing…</> : <><Sparkles className="size-4 mr-2" />Run AI CEO</>}
        </GoldButton>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Revenue · Today" value={fmt(data.revenueToday)} />
        <Kpi label="Revenue · 30d" value={fmt(data.revenue30)} />
        <Kpi label="Conversion" value={(data.conversionRate * 100).toFixed(2) + "%"} />
        <Kpi label="Abandonment" value={(data.abandonmentRate * 100).toFixed(1) + "%"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TacticalPanel title="Revenue by SKU">
          <Table rows={data.revenueBySku.map((r: any) => [r.key, fmt(r.amount_ngn)])} />
        </TacticalPanel>
        <TacticalPanel title="Revenue by UTM Source">
          <Table rows={data.revenueByUtmSource.map((r: any) => [r.key, fmt(r.amount_ngn)])} />
        </TacticalPanel>
        <TacticalPanel title="Top RSIDs">
          <Table rows={data.topRsids.map((r: any) => [r.rsid, fmt(r.amount_ngn)])} />
        </TacticalPanel>
        <TacticalPanel title="Funnel Counts (30d)">
          <Table
            rows={[
              ["landing_view", String(data.landingViews)],
              ["checkout_started", String(data.checkoutStarted)],
              ["payment_success", String(data.paymentSuccess)],
            ]}
          />
        </TacticalPanel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TacticalPanel title="AI Insights">
          {insights ? (
            <ul className="space-y-2 text-sm">
              {insights.insights.map((i, k) => (
                <li key={k} className="border-l-2 border-gold/60 pl-3">{i}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              Press "Run AI CEO" to generate insights.
            </p>
          )}
        </TacticalPanel>
        <TacticalPanel title="AI Recommendations · pending_review">
          {insights ? (
            <ul className="space-y-2 text-sm">
              {insights.recommendations.map((i, k) => (
                <li key={k} className="border-l-2 border-gold/60 pl-3">{i}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              No recommendations yet.
            </p>
          )}
        </TacticalPanel>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card/40 p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-mono text-gold mt-1">{value}</div>
    </div>
  );
}

function Table({ rows }: { rows: [string, string][] }) {
  if (rows.length === 0) return <p className="text-xs text-muted-foreground">No data.</p>;
  return (
    <div className="divide-y divide-border">
      {rows.map(([k, v], i) => (
        <div key={i} className="flex justify-between py-2 text-sm font-mono">
          <span className="truncate text-muted-foreground max-w-[60%]">{k}</span>
          <span className="text-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}
