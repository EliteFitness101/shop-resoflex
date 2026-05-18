import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { verifyPayment } from "@/lib/paystack";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { products } from "@/lib/mock-data";
import { CheckCircle2, Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>) => ({ reference: (s.reference as string) ?? "" }),
  component: Success,
  head: () => ({ meta: [{ title: "Order confirmed — ResoFlex OS™" }, { name: "robots", content: "noindex" }] }),
});

function Success() {
  const { reference } = Route.useSearch();
  const [info, setInfo] = useState<{ productName: string; amountNGN: number; productId: string } | null>(null);

  useEffect(() => {
    verifyPayment(reference).then((r) => r && setInfo(r));
  }, [reference]);

  const upsell = products.find((p) => p.id !== info?.productId) ?? products[0];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-center">
        <CheckCircle2 className="size-14 mx-auto text-gold" />
        <div className="text-telemetry mt-4">// TRANSACTION CLEARED</div>
        <h1 className="font-display text-4xl font-bold mt-2">Sovereign deployment confirmed.</h1>
        <p className="text-muted-foreground mt-2">Reference <span className="font-mono text-gold">{reference || "—"}</span></p>
      </div>

      {info && (
        <TacticalPanel label="ORDER · DELIVERED" status="PAID" className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display font-semibold text-lg">{info.productName}</div>
              <div className="text-telemetry mt-1">PAID ₦{info.amountNGN.toLocaleString()}</div>
            </div>
            <GoldButton onClick={() => {
              const blob = new Blob([`ResoFlex OS Receipt\nRef: ${reference}\n${info.productName}\n₦${info.amountNGN}`], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `resoflex-${reference}.txt`; a.click();
              URL.revokeObjectURL(url);
            }}>
              <Download className="size-4"/> Download asset
            </GoldButton>
          </div>
        </TacticalPanel>
      )}

      <div className="mt-6 glass-panel rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gold/10 flex items-center gap-2">
          <Sparkles className="size-4 text-gold"/>
          <span className="text-telemetry">RECOMMENDED NEXT</span>
        </div>
        <div className="p-5 flex flex-col sm:flex-row gap-5 items-center">
          <div className="size-24 rounded-lg shrink-0 relative overflow-hidden" style={{ backgroundImage: upsell.imageGradient }}>
            <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="font-display font-semibold text-lg">{upsell.name}</div>
            <div className="text-sm text-muted-foreground">{upsell.tagline}</div>
          </div>
          <Link to="/shop/$productId" params={{ productId: upsell.slug }}>
            <GoldButton variant="outline">Stack it →</GoldButton>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/wallet" className="text-gold font-mono uppercase tracking-widest text-xs hover:underline">View wallet impact →</Link>
      </div>
    </div>
  );
}
