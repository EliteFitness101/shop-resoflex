import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock, Upload, Images, FileSpreadsheet, History } from "lucide-react";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, adminUploadFile } from "@/lib/admin.functions";
import { importCatalogRows, listCatalogAudit } from "@/lib/catalog-import.functions";
import { CATALOG_FILES, importFromCSV, type Entity, type ImportPlan } from "@/lib/catalog-import";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
  head: () => ({
    meta: [
      { title: "Media & Catalog Import — ResoFlex OS™" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Tab = "import" | "assets" | "audit";

async function fileToBase64(f: File): Promise<string> {
  const bytes = new Uint8Array(await f.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function AdminMedia() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("import");

  useEffect(() => {
    if (loading || !user) return;
    checkIsAdmin().then((r) => setIsAdmin(r.isAdmin));
  }, [loading, user]);

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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-telemetry mb-2">
        <Lock className="size-3.5" /> MEDIA & CATALOG PIPELINE
      </div>
      <h1 className="font-display text-4xl font-bold">Asset Command</h1>
      <Link to="/admin" className="text-gold font-mono text-xs uppercase tracking-widest">← Command Console</Link>

      <div className="flex gap-2 mt-6 flex-wrap">
        {(
          [
            ["import", "CSV Import", FileSpreadsheet],
            ["assets", "Assets", Images],
            ["audit", "Audit Log", History],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-widest border ${
              tab === id ? "border-gold/60 text-gold bg-gold/10" : "border-border text-muted-foreground"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "import" && <ImportPanel />}
        {tab === "assets" && <AssetsPanel />}
        {tab === "audit" && <AuditPanel />}
      </div>
    </div>
  );
}

function ImportPanel() {
  const [entity, setEntity] = useState<Entity>("collections");
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File) => {
    const text = await f.text();
    const guessed = CATALOG_FILES[f.name] ?? entity;
    setEntity(guessed);
    setPlan(importFromCSV(guessed, text));
  };

  const apply = async (dryRun: boolean) => {
    if (!plan) return;
    setBusy(true);
    try {
      const res = await importCatalogRows({
        data: { entity, rows: plan.valid, source: "admin_csv", dryRun },
      });
      toast.success(dryRun ? "Dry run logged" : `Imported ${res.applied} rows`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TacticalPanel className="p-5">
      <h2 className="font-display text-xl font-semibold">Master catalog import</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Upload files from <code className="text-gold">/data/catalog/</code>. Rows are validated and
        de-duplicated by SKU before any write. Every run is logged to the audit trail.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value as Entity)}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
        >
          {Object.entries(CATALOG_FILES).map(([file, ent]) => (
            <option key={file} value={ent}>{file}</option>
          ))}
        </select>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          className="text-sm"
        />
      </div>

      {plan && (
        <div className="mt-5">
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              ["Total", plan.summary.total],
              ["Valid", plan.summary.valid],
              ["Duplicates", plan.summary.duplicate],
              ["Invalid", plan.summary.invalid],
            ].map(([label, v]) => (
              <div key={label as string} className="glass-panel rounded-md p-3">
                <div className="text-telemetry">{label}</div>
                <div className="font-display text-2xl font-bold">{v as number}</div>
              </div>
            ))}
          </div>

          {(plan.errors.length > 0 || plan.duplicates.length > 0) && (
            <div role="alert" className="mt-4 rounded-md border border-destructive/40 p-3 text-sm">
              {[...plan.errors, ...plan.duplicates].slice(0, 12).map((i, idx) => (
                <div key={idx} className="text-muted-foreground">
                  Row {i.row}: {i.message}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <GoldButton variant="outline" disabled={busy} onClick={() => apply(true)}>
              Dry run
            </GoldButton>
            <GoldButton disabled={busy || plan.valid.length === 0} onClick={() => apply(false)}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Apply import
            </GoldButton>
          </div>
        </div>
      )}
    </TacticalPanel>
  );
}

function AssetsPanel() {
  const [assets, setAssets] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [sku, setSku] = useState("");
  const [alt, setAlt] = useState("");

  const reload = async () => {
    const { data } = await supabase
      .from("product_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setAssets(data ?? []);
  };
  useEffect(() => {
    reload();
  }, []);

  const upload = async (f: File) => {
    if (!sku) return toast.error("Enter a SKU first");
    if (!alt) return toast.error("Alt text is required for SEO");
    setBusy(true);
    try {
      const path = `${sku.toLowerCase()}/${Date.now()}-${f.name}`;
      const res = await adminUploadFile({
        data: {
          bucket: "product-images",
          path,
          contentType: f.type || "image/webp",
          base64: await fileToBase64(f),
        },
      });
      await importCatalogRows({
        data: {
          entity: "product_assets",
          source: "admin_upload",
          dryRun: false,
          rows: [
            {
              sku,
              file_name: f.name,
              relative_path: path,
              cdn_url: res.publicUrl ?? "",
              alt_text: alt,
              format: (f.name.split(".").pop() ?? "webp").toLowerCase(),
              file_size_kb: String(Math.round(f.size / 1024)),
              is_hero: assets.some((a) => a.sku === sku && a.is_hero) ? "false" : "true",
              asset_type: "image",
            },
          ],
        },
      });
      toast.success("Asset registered");
      setAlt("");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TacticalPanel className="p-5">
      <h2 className="font-display text-xl font-semibold">Asset library</h2>
      <p className="text-sm text-muted-foreground mt-1">
        WebP recommended. Alt text is mandatory; the first asset per SKU becomes the hero image.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value.toUpperCase())}
          placeholder="SKU e.g. RESOFLEX_MENS_TANK"
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
        />
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text (SEO)"
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          className="text-sm"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <div key={a.id} className="glass-panel rounded-md p-3">
            {a.cdn_url && (
              <img
                src={a.cdn_url}
                alt={a.alt_text ?? a.file_name}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover rounded"
              />
            )}
            <div className="text-telemetry mt-2">{a.sku}{a.is_hero ? " · HERO" : ""}</div>
            <div className="text-xs text-muted-foreground truncate">{a.file_name}</div>
          </div>
        ))}
        {assets.length === 0 && <p className="text-sm text-muted-foreground">No assets registered yet.</p>}
      </div>
    </TacticalPanel>
  );
}

function AuditPanel() {
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(() => {
    listCatalogAudit().then((r) => setEntries(r.entries));
  }, []);
  return (
    <TacticalPanel className="p-5">
      <h2 className="font-display text-xl font-semibold">Catalog sync audit</h2>
      <div className="mt-4 space-y-2">
        {entries.map((e) => (
          <div key={e.id} className="flex flex-wrap justify-between gap-2 border-b border-border/60 py-2 text-sm">
            <span className="font-mono text-xs">{new Date(e.created_at).toLocaleString()}</span>
            <span>{e.entity} · {e.action}</span>
            <span className={e.status === "ok" ? "text-gold" : "text-destructive"}>
              {e.status} · {e.rows_succeeded}/{e.rows_processed}
            </span>
          </div>
        ))}
        {entries.length === 0 && <p className="text-sm text-muted-foreground">No sync runs recorded.</p>}
      </div>
    </TacticalPanel>
  );
}
