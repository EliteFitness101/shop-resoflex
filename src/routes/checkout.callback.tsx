import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { verifyPayment } from "@/lib/paystack";

export const Route = createFileRoute("/checkout/callback")({
  validateSearch: (s: Record<string, unknown>) => ({
    reference: (s.reference as string) ?? "",
    status: (s.status as string) ?? "",
  }),
  component: Callback,
  head: () => ({ meta: [{ title: "Verifying payment…" }, { name: "robots", content: "noindex" }] }),
});

function Callback() {
  const { reference } = Route.useSearch();
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await verifyPayment(reference);
      if (cancelled) return;
      if (result?.status === "success") {
        nav({ to: "/checkout/success", search: { reference } });
      } else {
        nav({ to: "/shop" });
      }
    })();
    return () => { cancelled = true; };
  }, [reference, nav]);

  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="text-center">
        <div className="mx-auto size-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        <div className="text-telemetry mt-6">VERIFYING TRANSACTION</div>
        <div className="font-mono text-xs text-muted-foreground mt-2">REF · {reference || "—"}</div>
      </div>
    </div>
  );
}
