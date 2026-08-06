import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { useAuth } from "@/hooks/use-auth";
import { checkIsAdmin, adminUploadFile, registerTemplate, listTemplates } from "@/lib/admin.functions";
import { listProducts, upsertProductImage } from "@/lib/products.functions";
import { toast } from "sonner";
import { Lock, Upload, ImageIcon, FileText, Dumbbell, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Secure Admin — ResoFlex OS™" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Tab = "products" | "meals" | "workouts";

async function fileToBase64(f: File): Promise<string> {
  const buf = await f.arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function Admin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<{ meals: any[]; workouts: any[] }>({ meals: [], workouts: [] });

  useEffect(() => {
    if (loading || !user) return;
    checkIsAdmin().then((r) => setIsAdmin(r.isAdmin));
  }, [loading, user]);

  const reload = async () => {
    const [p, t] = await Promise.all([listProducts(), listTemplates()]);
    setProducts(p.products);
    setTemplates({ meals: t.meals, workouts: t.workouts });
  };
  useEffect(() => {
    if (isAdmin) reload();
  }, [isAdmin]);

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
    return <div className="p-10 text-center text-destructive">Forbidden · admin role required.</div>;
  if (isAdmin === null) return <div className="p-10 text-center text-muted-foreground">Verifying clearance…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-telemetry mb-2">
        <Lock className="size-3.5" /> ADMIN CONSOLE · AUTH-LEVEL SOVEREIGN
      </div>
      <h1 className="font-display text-4xl font-bold">Command Console</h1>

      <nav aria-label="Admin sections" className="mt-3">
        <Link
          to="/admin/media"
          className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-gold hover:bg-gold/10"
        >
          <ImageIcon className="size-3.5" /> Media Library
        </Link>
      </nav>


      <div className="mt-6 flex gap-1 border-b border-gold/20">
        {([
          ["products", "Products", ImageIcon],
          ["meals", "Meal templates", FileText],
          ["workouts", "Workout templates", Dumbbell],
        ] as const).map(([k, label, Icon]) => (
          <button
            key={k}
            onClick={() => setTab(k as Tab)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest flex items-center gap-2 border-b-2 -mb-px transition ${
              tab === k ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-gold"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "products" && <ProductsTab products={products} onChange={reload} />}
        {tab === "meals" && <TemplatesTab kind="meal" products={products} list={templates.meals} onChange={reload} />}
        {tab === "workouts" && <TemplatesTab kind="workout" products={products} list={templates.workouts} onChange={reload} />}
      </div>
    </div>
  );
}

function ProductsTab({ products, onChange }: { products: any[]; onChange: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  const upload = async (slug: string, file: File) => {
    setBusy(slug);
    try {
      const base64 = await fileToBase64(file);
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const r = await adminUploadFile({
        data: {
          bucket: "product-images",
          path: `${slug}.${ext}`,
          contentType: file.type || "image/jpeg",
          base64,
        },
      });
      if (r.publicUrl) {
        await upsertProductImage({ data: { slug, image_url: r.publicUrl } });
      }
      toast.success(`Uploaded ${slug}`);
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <TacticalPanel key={p.slug} label={p.slug.toUpperCase()} status={p.image_url ? "OK" : "PENDING"}>
          <div className="aspect-[4/3] rounded mb-3 bg-gold/5 overflow-hidden">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
                NO IMAGE
              </div>
            )}
          </div>
          <div className="font-display font-semibold text-sm">{p.name}</div>
          <label className="mt-3 block">
            <span className="text-telemetry">REPLACE IMAGE</span>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-xs file:bg-gold file:text-primary-foreground file:border-0 file:rounded file:px-3 file:py-1.5 file:font-mono file:uppercase file:tracking-widest file:mr-3"
              disabled={busy === p.slug}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(p.slug, f);
              }}
            />
          </label>
          {busy === p.slug && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gold font-mono">
              <Loader2 className="size-3 animate-spin" /> Uploading…
            </div>
          )}
        </TacticalPanel>
      ))}
    </div>
  );
}

function TemplatesTab({
  kind,
  products,
  list,
  onChange,
}: {
  kind: "meal" | "workout";
  products: any[];
  list: any[];
  onChange: () => void;
}) {
  const [productId, setProductId] = useState(products[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!productId && products[0]) setProductId(products[0].slug);
  }, [products, productId]);

  const submit = async () => {
    if (!file || !productId || !name) {
      toast.error("Product, name, and file required");
      return;
    }
    setBusy(true);
    try {
      const base64 = await fileToBase64(file);
      const ext = (file.name.split(".").pop() ?? "md").toLowerCase();
      const path = `${productId}/${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;
      await adminUploadFile({
        data: {
          bucket: kind === "meal" ? "meal-templates" : "workout-templates",
          path,
          contentType: file.type || "text/markdown",
          base64,
        },
      });
      await registerTemplate({
        data: { kind, product_id: productId, name, storage_path: path, notes },
      });
      toast.success("Template registered");
      setName("");
      setNotes("");
      setFile(null);
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <TacticalPanel label={`UPLOAD ${kind.toUpperCase()} TEMPLATE`} status="READY">
        <div className="space-y-3">
          <label className="block">
            <span className="text-telemetry">PRODUCT</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full bg-background/60 border border-gold/20 rounded px-3 py-2 text-sm"
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-telemetry">NAME</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lagos Lean Protocol v1"
              className="mt-1 w-full bg-background/60 border border-gold/20 rounded px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-telemetry">NOTES (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full bg-background/60 border border-gold/20 rounded px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-telemetry">FILE · .md preferred (used by AI)</span>
            <input
              type="file"
              accept=".md,.txt,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-xs file:bg-gold file:text-primary-foreground file:border-0 file:rounded file:px-3 file:py-1.5 file:font-mono file:uppercase file:tracking-widest file:mr-3"
            />
          </label>
          <GoldButton onClick={submit} disabled={busy} className="w-full">
            {busy ? <><Loader2 className="size-4 animate-spin" /> Uploading…</> : <><Upload className="size-4" /> Register template</>}
          </GoldButton>
        </div>
      </TacticalPanel>

      <TacticalPanel label={`ACTIVE ${kind.toUpperCase()} TEMPLATES`} status="LIVE">
        {list.length === 0 ? (
          <p className="text-xs text-muted-foreground">No templates yet.</p>
        ) : (
          <ul className="divide-y divide-gold/10 text-sm">
            {list.map((t) => (
              <li key={t.id} className="py-2">
                <div className="font-display font-semibold">{t.name}</div>
                <div className="text-telemetry mt-0.5">
                  {t.product_id} · {t.storage_path}
                </div>
              </li>
            ))}
          </ul>
        )}
      </TacticalPanel>
    </div>
  );
}
