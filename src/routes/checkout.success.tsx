import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { verifyPayment } from "@/lib/paystack";
import { issueAssetDownload } from "@/lib/assets.functions";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { products } from "@/lib/mock-data";
import { PriceTag } from "@/components/PriceTag";
import { CheckCircle2, Download, Sparkles, RefreshCw, Loader2, MessageCircle, AlertCircle } from "lucide-react";

const CHATB2K_URL = "https://chatb2k.resofit.fit";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>) => ({ reference: (s.reference as string) ?? "" }),
  component: Success,
  head: () => ({
    meta: [
      { title: "Order status — ResoFlex OS™" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type VerificationState = "checking" | "verified" | "failed";

function Success() {
  const { reference } = Route.useSearch();
  const [info, setInfo] = useState<{
    productName: string;
    amountNGN: number;
    productId: string;
  } | null>(null);
  const [verificationState, setVerificationState] = useState<VerificationState>("checking");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [upsellIndex, setUpsellIndex] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setInfo(null);
    setDownloadUrl(null);
    setDownloadError(false);
    setIssuing(false);
    setVerificationState("checking");
    setVerificationMessage("");

    const confirmPayment = async () => {
      if (!reference) {
        setVerificationState("failed");
        setVerificationMessage("No transaction reference was provided. Check your receipt or contact support before attempting payment again.");
        return;
      }

      try {
        const result = await verifyPayment(reference);
        if (cancelled) return;
        if (!result || result.status !== "success") {
          setVerificationState("failed");
          setVerificationMessage("The payment provider has not confirmed this transaction. Do not pay again yet; retry verification or contact support with this reference.");
          return;
        }

        setInfo({ productName: result.productName, amountNGN: result.amountNGN, productId: result.productId });
        setVerificationState("verified");
        setIssuing(true);
        try {
          const asset = await issueAssetDownload({ data: { reference, productId: result.productId } });
          if (!cancelled) setDownloadUrl(asset.url);
        } catch {
          if (!cancelled) setDownloadError(true);
        } finally {
          if (!cancelled) setIssuing(false);
        }
      } catch {
        if (cancelled) return;
        setVerificationState("failed");
        setVerificationMessage("We could not verify this transaction right now. Your payment may still be processing; retry verification before making another payment.");
      }
    };

    void confirmPayment();
    return () => { cancelled = true; };
  }, [reference, attempt]);

  const candidates = useMemo(
    () => products.filter((p) => p.id !== info?.productId),
    [info?.productId],
  );
  const upsell = candidates[upsellIndex % Math.max(candidates.length, 1)] ?? products[0];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-center">
        {verificationState === "checking" ? (
          <Loader2 className="size-14 mx-auto text-gold animate-spin" />
        ) : verificationState === "verified" ? (
          <CheckCircle2 className="size-14 mx-auto text-gold" />
        ) : (
          <AlertCircle className="size-14 mx-auto text-amber-400" />
        )}
        <div className="text-telemetry mt-4">
          {verificationState === "checking" ? "// VERIFYING WITH PAYSTACK" : verificationState === "verified" ? "// PAYMENT VERIFIED" : "// CONFIRMATION PENDING"}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">
          {verificationState === "checking" ? "Confirming your payment…" : verificationState === "verified" ? "Your order is confirmed." : "We couldn't confirm payment yet."}
        </h1>
        <p className="text-muted-foreground mt-2">
          Reference <span className="font-mono text-gold break-all">{reference || "—"}</span>
        </p>
        {verificationState === "failed" && (
          <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-muted-foreground">
            {verificationMessage}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <GoldButton onClick={() => setAttempt((value) => value + 1)}>
                <RefreshCw className="size-4" /> Retry verification
              </GoldButton>
              <a href={CHATB2K_URL} target="_blank" rel="noopener noreferrer">
                <GoldButton variant="outline"><MessageCircle className="size-4" /> Get help</GoldButton>
              </a>
            </div>
          </div>
        )}
      </div>

      {verificationState === "checking" && (
        <div className="mt-8">
          <TacticalPanel label="PAYMENT STATUS" status="CHECKING">
            <p className="text-sm text-muted-foreground">We are checking the payment provider response. Delivery links and order confirmation will appear only after successful verification.</p>
          </TacticalPanel>
        </div>
      )}

      {info && verificationState === "verified" && (
        <TacticalPanel label="ORDER · PAYMENT VERIFIED" status="PAID" className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display font-semibold text-lg">{info.productName}</div>
              <div className="text-telemetry mt-1">PAID ₦{info.amountNGN.toLocaleString()}</div>
            </div>
            {downloadUrl ? (
              <a href={downloadUrl} download>
                <GoldButton><Download className="size-4" /> Download asset</GoldButton>
              </a>
            ) : (
              <GoldButton disabled>
                {issuing ? <><Loader2 className="size-4 animate-spin" /> Issuing link…</> : downloadError ? "Delivery link unavailable" : <><Download className="size-4" /> Preparing…</>}
              </GoldButton>
            )}
            {downloadUrl && (
              <div className="basis-full text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Signed link · expires in 7 days · bound to reference {reference}
              </div>
            )}
            {downloadError && (
              <p className="basis-full text-sm text-muted-foreground">Payment is verified, but automatic delivery-link issuance failed. Keep your reference and request help; do not pay again.</p>
            )}
          </div>
        </TacticalPanel>
      )}

      {verificationState === "verified" && info && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/20 p-4">
          <p className="text-sm text-muted-foreground max-w-md">Need onboarding help or have a delivery question? Chat with the ResoFit assistant and include your transaction reference.</p>
          <a href={CHATB2K_URL} target="_blank" rel="noopener noreferrer">
            <GoldButton variant="outline"><MessageCircle className="size-4" /> ChatB2K support</GoldButton>
          </a>
        </div>
      )}

      {verificationState === "verified" && info && candidates.length > 0 && (
        <div className="mt-6 glass-panel rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-gold" />
              <span className="text-telemetry">EXPLORE NEXT</span>
            </div>
            {candidates.length > 1 && (
              <button
                onClick={() => setUpsellIndex((value) => value + 1)}
                className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-gold flex items-center gap-1 transition"
                aria-label="Show next recommendation"
              >
                <RefreshCw className="size-3" /> Next
              </button>
            )}
          </div>
          <div key={upsell.id} className="p-5 flex flex-col sm:flex-row gap-5 items-center">
            <div className="size-24 rounded-lg shrink-0 relative overflow-hidden" style={{ backgroundImage: upsell.imageGradient }}>
              <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="font-display font-semibold text-lg">{upsell.name}</div>
              <div className="text-sm text-muted-foreground">{upsell.tagline}</div>
              <div className="mt-2"><PriceTag amountNGN={upsell.priceNGN} compareAtNGN={upsell.comparePriceNGN} /></div>
            </div>
            <Link to="/shop/$productId" params={{ productId: upsell.slug }}>
              <GoldButton variant="outline">Explore product →</GoldButton>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/shop" className="text-gold font-mono uppercase tracking-widest text-xs hover:underline">
          Return to shop →
        </Link>
      </div>
    </div>
  );
}
