import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { GoldButton } from "@/components/GoldButton";
import { ShieldCheck, Loader2 } from "lucide-react";

const SUPABASE_URL = "https://vbqjvmnhdtdhmeeudqnn.supabase.co";
const CATALOG_URL = `${SUPABASE_URL}/functions/v1/catalog-public/product`;
const PAYSTACK_INIT_URL = `${SUPABASE_URL}/functions/v1/paystack-init`;

type Product = {
  sku: string;
  handle: string;
  title: string;
  body_html?: string | null;
  variant_price: number;
  image_src?: string | null;
  variant_inventory_qty?: number;
};

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params }) => {
    const response = await fetch(`${CATALOG_URL}?handle=${encodeURIComponent(params.handle)}`);
    if (!response.ok) throw notFound();
    const payload = (await response.json()) as { data?: Product; error?: string };
    if (!payload.data || payload.error) throw notFound();
    return { product: payload.data };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="text-telemetry">// CANONICAL SKU LOOKUP FAILED</div>
      <h1 className="font-display text-3xl font-bold mt-2">Product unavailable.</h1>
      <p className="text-muted-foreground mt-2 text-sm">The requested product is not published in the canonical ResoFit catalogue.</p>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const price = Number(product.variant_price || 0);

  const startCheckout = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      window.alert("Complete your name, email, phone and delivery address first.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(PAYSTACK_INIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: product.sku,
          email: email.trim(),
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        }),
      });
      const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
      const authorizationUrl =
        typeof payload?.authorization_url === "string"
          ? payload.authorization_url
          : typeof payload?.data === "object" && payload.data && typeof (payload.data as Record<string, unknown>).authorization_url === "string"
            ? (payload.data as Record<string, unknown>).authorization_url
            : null;
      if (!response.ok || !authorizationUrl) {
        throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to initialize Paystack checkout");
      }
      window.location.assign(authorizationUrl);
    } catch (error) {
      console.error("Paystack initialization failed", error);
      window.alert(error instanceof Error ? error.message : "Unable to initialize secure checkout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="glass-panel rounded-xl overflow-hidden aspect-square">
          {product.image_src ? (
            <img src={product.image_src} alt={product.title} className="size-full object-cover" loading="eager" />
          ) : (
            <div className="size-full grid place-items-center bg-gradient-gold/10 text-telemetry">IMAGE PENDING</div>
          )}
        </div>
        <section>
          <div className="text-telemetry">// CANONICAL SKU · {product.sku}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{product.title}</h1>
          <div className="font-display text-3xl font-bold text-gold mt-5">₦{price.toLocaleString()}</div>
          {product.body_html && (
            <div className="mt-5 text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: product.body_html }} />
          )}
          <div className="mt-7 glass-panel rounded-lg p-5 space-y-3">
            <div className="grid gap-2">
              <input className="rounded border border-gold/20 bg-background px-3 py-3 text-sm" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <input className="rounded border border-gold/20 bg-background px-3 py-3 text-sm" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <input className="rounded border border-gold/20 bg-background px-3 py-3 text-sm" placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              <input className="rounded border border-gold/20 bg-background px-3 py-3 text-sm" placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
            </div>
            <GoldButton size="lg" className="w-full" onClick={startCheckout} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Deploy via Paystack"}
            </GoldButton>
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <ShieldCheck className="size-3 text-gold" /> Paystack · server-verified · NGN
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
