import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { products } from "@/lib/mock-data";
import { PriceTag } from "@/components/PriceTag";
import { GoldButton } from "@/components/GoldButton";
import { TacticalPanel } from "@/components/TacticalPanel";
import { initiatePayment } from "@/lib/paystack";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const handleCheckout = async () => {
    if (!email.includes("@")) {
      toast.error("Operator email required");
      return;
    }
    setBusy(true);
    const { authorizationUrl } = await initiatePayment({
      email,
      amountKobo: product.priceNGN * 100,
      productId: product.id,
      productName: product.name,
    });
    toast.success("Routing to Paystack…");
    setTimeout(() => nav({ to: authorizationUrl as any }), 600);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-gold mb-6">
        <ArrowLeft className="size-3.5" /> Back
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div
          className="aspect-square rounded-xl relative overflow-hidden glass-panel"
          style={{ backgroundImage: product.imageGradient }}
        >
          <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />
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

          <div className="mt-8 glass-panel rounded-lg p-5 space-y-3">
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
            <GoldButton size="lg" className="w-full" disabled={busy} onClick={handleCheckout}>
              {busy ? "Routing…" : `Pay ₦${product.priceNGN.toLocaleString()} via Paystack`}
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
