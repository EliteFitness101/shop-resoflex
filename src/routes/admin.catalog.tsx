import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, CheckCircle2, AlertTriangle, ListChecks } from "lucide-react";
import { TacticalPanel } from "@/components/TacticalPanel";
import { useAuth } from "@/hooks/use-auth";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  PRODUCTION_CATALOG,
  UPLOAD_QUEUE,
  buildReadinessReport,
  crossSells,
  PRODUCTION_COLLECTIONS,
} from "@/lib/production-catalog";

export const Route = createFileRoute("/admin/catalog")({
  component: AdminCatalog,
  head: () => ({
    meta: [
      { title: "Product Asset Readiness — ResoFit OS™" },
      { name: "description", content: "Production catalog, image manifest and asset readiness report." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AdminCatalog() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    checkIsAdmin().then((r) => setIsAdmin(r.isAdmin));
  }, [loading, user]);

  const report = useMemo(() => buildReadinessReport(), []);

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
    return <div className="p-10 text-center text-destructive">Forbidden · catalog admin role required.</div>;
  if (isAdmin === null) return <div className="p-10 text-center text-muted-foreground">Verifying clearance…</div>;

  const errors = report.catalogIssues.filter((i) => i.level === "error");
  const warnings = report.catalogIssues.filter((i) => i.level === "warning");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-telemetry mb-2">
        <ListChecks className="size-3.5" /> PRODUCTION CATALOG · ASSET READINESS
      </div>
      <h1 className="font-display text-4xl font-bold">Product Asset Readiness</h1>
      <nav className="mt-3 flex gap-2">
        <Link
          to="/admin"
          className="rounded-md border border-gold/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-gold hover:bg-gold/10"
        >
          ← Console
        </Link>
        <Link
          to="/admin/media"
          className="rounded-md border border-gold/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-gold hover:bg-gold/10"
        >
          Media Library
        </Link>
      </nav>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Products", report.totalProducts],
          ["SKUs", report.totalSkus],
          ["Required images", report.requiredImages],
          ["Uploaded", report.uploadedImages],
          ["Missing", report.missingImages],
          ["Optimized", report.optimizedImages],
          ["Broken assets", report.brokenAssets.length],
          ["SEO complete", `${report.seoCompletenessPct}%`],
        ].map(([label, value]) => (
          <TacticalPanel key={String(label)} className="p-4">
            <div className="text-telemetry">{label}</div>
            <div className="font-display text-2xl font-bold text-gold">{value}</div>
          </TacticalPanel>
        ))}
      </div>

      <TacticalPanel className="mt-4 p-5">
        <div className="text-telemetry">Overall production readiness</div>
        <div className="font-display text-4xl font-bold text-gold">{report.readinessPct}%</div>
        <div className="mt-2 h-2 w-full rounded bg-muted">
          <div className="h-2 rounded bg-gold" style={{ width: `${report.readinessPct}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Catalog data, SEO and relationships are complete. Remaining gap is image upload —
          upload the queue below through the Media Library and this figure closes automatically.
        </p>
      </TacticalPanel>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">Validation</h2>
        <div className="mt-3 space-y-2">
          {errors.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-gold">
              <CheckCircle2 className="size-4" /> No duplicate SKUs or slugs · all products searchable ·
              Shopify + Paystack mappings valid · SEO complete
            </div>
          )}
          {errors.map((i, n) => (
            <div key={n} className="text-sm text-destructive">✕ {i.sku} — {i.message}</div>
          ))}
          {warnings.map((i, n) => (
            <div key={`w${n}`} className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="size-3.5" /> {i.sku} — {i.message}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">Upload queue</h2>
        <p className="text-sm text-muted-foreground">
          Exact shots required per product. Upload as WebP; the pipeline emits AVIF, responsive
          widths and blur placeholders automatically.
        </p>
        <div className="mt-4 space-y-4">
          {UPLOAD_QUEUE.map((q) => (
            <TacticalPanel key={q.sku} className="p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">{q.title}</h3>
                <span className="font-mono text-xs text-gold">{q.sku}</span>
              </div>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {q.shots.map((s) => (
                  <li key={s.role} className="text-xs text-muted-foreground">
                    <span className="font-mono uppercase text-foreground">{s.role}</span> — {s.brief}
                    <div className="font-mono text-[10px] opacity-60">{s.path}</div>
                  </li>
                ))}
              </ul>
            </TacticalPanel>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">Relationships & collections</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <TacticalPanel className="p-4">
            <div className="text-telemetry mb-2">Cross-sell ladder</div>
            {PRODUCTION_CATALOG.map((p) => (
              <div key={p.sku} className="text-xs text-muted-foreground">
                <span className="font-mono text-foreground">{p.sku}</span> →{" "}
                {crossSells(p.sku).map((c) => c.sku).join(" · ") || "—"}
              </div>
            ))}
          </TacticalPanel>
          <TacticalPanel className="p-4">
            <div className="text-telemetry mb-2">Collections</div>
            {Object.entries(PRODUCTION_COLLECTIONS).map(([code, skus]) => (
              <div key={code} className="text-xs text-muted-foreground">
                <span className="font-mono text-foreground">{code}</span> — {skus.length} products
              </div>
            ))}
          </TacticalPanel>
        </div>
      </section>
    </div>
  );
}
