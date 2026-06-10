import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { verifyPayment } from "@/lib/paystack";
import { GoldButton } from "@/components/GoldButton";
import { track } from "@/lib/analytics";
import { recordRsidValue } from "@/lib/cta-intelligence";

export const Route = createFileRoute("/checkout/callback")({
  validateSearch: (s: Record<string, unknown>) => ({
    reference: (s.reference as string) ?? "",
    status: (s.status as string) ?? "",
  }),
  component: Callback,
  head: () => ({ meta: [{ title: "Verifying payment…" }, { name: "robots", content: "noindex" }] }),
});

type State = "verifying" | "success" | "failed" | "timeout";

function Callback() {
  const { reference } = Route.useSearch();
  const nav = useNavigate();
  const [state, setState] = useState<State>("verifying");
  const [message, setMessage] = useState<string>("");
  const [attempt, setAttempt] = useState(0);

  const verify = useCallback(async () => {
    if (!reference) {
      setState("failed");
      setMessage("Missing transaction reference.");
      return;
    }
    setState("verifying");
    setMessage("");
    // Up to 5 polls (handles webhook race conditions).
    for (let i = 0; i < 5; i++) {
      try {
        const result = await verifyPayment(reference);
        if (result?.status === "success") {
          track("payment_success", { reference, amountNGN: result.amountNGN, productId: result.productId });
          recordRsidValue(result.amountNGN);
          setState("success");
          nav({ to: "/checkout/success", search: { reference } });
          return;
        }
        if (result?.status === "failed") {
          setState("failed");
          setMessage("Payment was declined or cancelled.");
          return;
        }
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Verification error");
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    setState("timeout");
    setMessage("Verification is taking longer than expected.");
  }, [reference, nav]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await verify();
    })();
    return () => { cancelled = true; };
  }, [verify, attempt]);

  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="text-center max-w-md">
        {state === "verifying" && (
          <>
            <div className="mx-auto size-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            <div className="text-telemetry mt-6">VERIFYING TRANSACTION</div>
            <div className="font-mono text-xs text-muted-foreground mt-2">REF · {reference || "—"}</div>
          </>
        )}
        {state === "success" && (
          <>
            <div className="text-telemetry mb-2 text-emerald-400">// CONFIRMED</div>
            <h1 className="font-display text-2xl">Routing to your receipt…</h1>
          </>
        )}
        {(state === "failed" || state === "timeout") && (
          <>
            <div className="text-telemetry mb-2 text-destructive">// ERR · {state === "timeout" ? "PENDING_CONFIRMATION" : "TRANSACTION_FAILED"}</div>
            <h1 className="font-display text-2xl text-gold">{state === "timeout" ? "Still confirming with Paystack" : "Payment not completed"}</h1>
            <p className="text-sm text-muted-foreground mt-3">{message}</p>
            <div className="font-mono text-xs text-muted-foreground mt-2">REF · {reference || "—"}</div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <GoldButton onClick={() => setAttempt((a) => a + 1)}>Retry verification</GoldButton>
              <Link to="/shop" className="font-mono uppercase tracking-widest text-xs px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 transition">
                Back to shop
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
