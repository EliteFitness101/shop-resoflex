import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { products } from "@/lib/mock-data";
import { PriceTag } from "@/components/PriceTag";
import { GoldButton } from "@/components/GoldButton";
import { TacticalPanel } from "@/components/TacticalPanel";
import { initiatePayment } from "@/lib/paystack";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { ArrowLeft, Shield, Truck, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/shop/$productId")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — ResoFlex OS™` },
      { name: "description", content: loaderData.product.tagline },
      { property: "og:title", content: loaderData.product.name },
      { property: "og:description", content: loaderData.product.tagline },
      { property: "og:type", content: "product" },
    ] : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-telemetry mb-2">ERR · SKU_NOT_FOUND</div>
      <h1 className="font-display text-3xl">Asset not in inventory</h1>
      <Link to="/shop" className="mt-6 inline-block text-gold font-mono uppercase tracking-widest text-xs">← Back to shop</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
});

const BULK_MIN_QTY = 10;
const BULK_UNIT_NGN = 8500;

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(product.sizes?.[0] ?? null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    track("product_view", { productId: product.id, sku: product.slug, name: product.name, priceNGN: product.priceNGN });
  }, [product.id, product.slug, product.name, product.priceNGN]);

  const isBulk = qty >= BULK_MIN_QTY;
  const unitPrice = isBulk ? Math.min(BULK_UNIT_NGN, product.priceNGN) : product.priceNGN;
  const total = unitPrice * qty;
  const savings = isBulk ? (product.priceNGN - unitPrice) * qty : 0;

  const handleCheckout = async () => {
    if (!email.includes("@")) {
      toast.error("Operator email required");
      return;
    }
    if (product.sizes && !size) {
      toast.error("Select a size");
      return;
    }
    setBusy(true);
    track("checkout_started", { productId: product.id, sku: product.slug, qty, total });
    try {
      const { authorizationUrl } = await initiatePayment({
        email,
        amountKobo: total * 100,
        productId: product.id,
        productName: qty > 1 ? `${product.name} ×${qty}${isBulk ? " (bulk)" : ""}` : product.name,
        userId: user?.id ?? null,
        sku: product.slug,
        quantity: qty,
      });
      if (!authorizationUrl) throw new Error("Paystack did not return a checkout URL.");
      toast.success("Routing to Paystack…");
      window.location.href = authorizationUrl;
    } catch (e) {
      setBusy(false);
      toast.error(e instanceof Error ? e.message : "Checkout failed — please retry.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-gold mb-6">
        <ArrowLeft className="size-3.5" /> Back
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div
          className="aspect-square rounded-xl relative overflow-hidden glass-panel bg-cover bg-center"
          style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : { backgroundImage: product.imageGradient }}
        >
          {!product.imageUrl && <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />}
          {product.badge && (
            <span className="absolute top-4 left-4 text-xs font-mono uppercase tracking-widest bg-gold text-primary-foreground px-3 py-1.5 rounded">
              {product.badge}
            </span>
          )}
          <div className="absolute bottom-4 right-4 text-telemetry">SKU · {product.id.toUpperCase()}</div>
        </div>

        <div>
          <div className="text-telemetry mb-2">{product.category}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.tagline}</p>
          <div className="mt-4"><PriceTag amountNGN={product.priceNGN} compareAtNGN={product.comparePriceNGN} size="lg" /></div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <TacticalPanel label="REFERRAL">
              <div className="font-display font-bold text-xl text-gold">{product.commissionPct}%</div>
            </TacticalPanel>
            <TacticalPanel label="DELIVERY">
              <div className="font-display font-bold text-sm text-gold flex items-center gap-1.5"><Truck className="size-4"/>24–72h</div>
            </TacticalPanel>
            <TacticalPanel label="VERIFIED">
              <div className="font-display font-bold text-sm text-gold flex items-center gap-1.5"><BadgeCheck className="size-4"/>LAB</div>
            </TacticalPanel>
          </div>

          {/* Bulk / wholesale tier */}
          <div id="bulk-tier" className={`mt-6 rounded-lg p-4 border transition ${isBulk ? "border-emerald-400/60 bg-emerald-400/5" : "border-gold/15 bg-background/40"}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-telemetry">// WHOLESALE TIER</div>
                <div className="text-sm mt-1">
                  10+ pieces drop to <span className="text-emerald-400 font-semibold">₦{BULK_UNIT_NGN.toLocaleString()}</span> per unit
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-8 rounded border border-gold/20 hover:border-gold/40">−</button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(999, parseInt(e.target.value) || 1)))}
                  className="w-16 bg-background/60 border border-gold/20 rounded px-2 py-1.5 text-center text-sm"
                />
                <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))} className="size-8 rounded border border-gold/20 hover:border-gold/40">+</button>
              </div>
            </div>
            {isBulk && (
              <div className="mt-3 text-xs font-mono uppercase tracking-widest text-emerald-400">
                ✓ Bulk unlocked · You save ₦{savings.toLocaleString()}
              </div>
            )}
          </div>

          <div className="mt-6 glass-panel rounded-lg p-5 space-y-3">
            <label className="block">
              <span className="text-telemetry">OPERATOR EMAIL</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@resofit.fit"
                className="mt-2 w-full bg-background/60 border border-gold/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
              />
            </label>
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                {qty} × ₦{unitPrice.toLocaleString()}
              </span>
              <span className="text-gold font-bold text-base">₦{total.toLocaleString()}</span>
            </div>
            <GoldButton size="lg" className="w-full" disabled={busy} onClick={handleCheckout}>
              {busy ? "Routing…" : `Pay ₦${total.toLocaleString()} via Paystack`}
            </GoldButton>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="size-3"/> Secure · NGN settlement · Instant receipt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
