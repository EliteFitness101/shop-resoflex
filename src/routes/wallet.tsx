import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { RouteHero } from "@/components/RouteHero";
import { RouteErrorBoundary, RouteSkeleton } from "@/components/RouteFallbacks";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getWalletState } from "@/lib/wallet.functions";
import { ArrowDownToLine, ArrowUpRight, Share2 } from "lucide-react";
import { toast } from "sonner";
import heroWallet from "@/assets/hero-wallet.jpg";

export const Route = createFileRoute("/wallet")({
  component: Wallet,
  pendingComponent: () => <RouteSkeleton rows={3} />,
  errorComponent: ({ error, reset }) => <RouteErrorBoundary error={error} reset={reset} />,
  head: () => ({
    meta: [
      { title: "Real-Time Telemetry Wallet — Outbound Revenue Settlement Node" },
      { name: "description", content: "Secure financial operator dashboard to monitor system commission flows, review balance alert logs, and initiate automated sub-24h bank transfer payouts." },
      { property: "og:title", content: "Real-Time Telemetry Wallet — Outbound Revenue Settlement Node" },
      { property: "og:description", content: "Secure financial operator dashboard to monitor system commission flows, review balance alert logs, and initiate automated sub-24h bank transfer payouts." },
      { property: "og:url", content: "/wallet" },
      { property: "og:image", content: heroWallet },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroWallet },
    ],
    links: [{ rel: "canonical", href: "/wallet" }],
  }),
});

function Wallet() {
  const { user, loading } = useAuth();
  const [state, setState] = useState<Awaited<ReturnType<typeof getWalletState>> | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    setFetching(true);
    getWalletState().then(setState).catch(() => setState(null)).finally(() => setFetching(false));
  }, [loading, user]);

  if (loading) return <RouteSkeleton rows={3} />;
  if (!user)
    return (
      <div className="p-10 max-w-md mx-auto text-center">
        <p>Sign in to view your referral wallet.</p>
        <Link to="/login" className="mt-4 inline-block text-gold font-mono text-xs uppercase tracking-widest">→ Login</Link>
      </div>
    );
  if (fetching && !state)
    return (
      <>
        <RouteHero eyebrow="WALLET · SETTLEMENT NODE" title="Real-Time Telemetry Wallet" subtitle="Loading settlement node telemetry…" ctaLabel="Initialize" ctaHref="#wallet-vault" image={heroWallet} />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-4">
          <Skeleton className="h-40 w-full !rounded-none bg-gold/10" />
          <div className="grid sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 !rounded-none bg-gold/5" />)}
          </div>
          <Skeleton className="h-48 w-full !rounded-none bg-gold/5" />
        </div>
      </>
    );

  const balance = state?.balance ?? 0;
  const shareUrl = typeof window !== "undefined" && state?.referralCode
    ? `${window.location.origin}/register?ref=${state.referralCode}`
    : "";

  return (
    <>
      <RouteHero
        eyebrow="WALLET · SETTLEMENT NODE"
        title="Real-Time Telemetry Wallet"
        subtitle="Monitor system commission flows, review balance alert logs, and initiate automated sub-24h bank transfer payouts."
        ctaLabel="Initialize Compliance Clearance"
        ctaHref="#wallet-vault"
        image={heroWallet}
      />

      <div id="wallet-vault" className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="bg-[#121215] border border-gold/20 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 telemetry-grid opacity-20" />
          <div className="relative">
            <div className="text-telemetry">AVAILABLE BALANCE</div>
            <div className="font-display font-bold text-5xl sm:text-6xl text-gold mt-2">₦{balance.toLocaleString()}</div>
            <div className="mt-6 flex flex-wrap gap-3">
              <GoldButton className="!rounded-none" onClick={() => toast.info("Withdrawals open at ₦10,000")}>
                <ArrowDownToLine className="size-4" /> Withdraw
              </GoldButton>
              <GoldButton
                variant="outline"
                className="!rounded-none"
                onClick={() => {
                  if (shareUrl) {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Referral link copied");
                  }
                }}
              >
                <Share2 className="size-4" /> Copy referral link
              </GoldButton>
            </div>
            {state?.referralCode && (
              <div className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                CODE · <span className="text-gold">{state.referralCode}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <TacticalPanel label="THIS MONTH">
            <div className="font-display font-bold text-2xl text-gold">₦{(state?.thisMonth ?? 0).toLocaleString()}</div>
          </TacticalPanel>
          <TacticalPanel label="ALL-TIME">
            <div className="font-display font-bold text-2xl text-gold">₦{(state?.allTime ?? 0).toLocaleString()}</div>
          </TacticalPanel>
          <TacticalPanel label="ACTIVE REFERRALS">
            <div className="font-display font-bold text-2xl text-gold">{state?.referralCount ?? 0}</div>
          </TacticalPanel>
        </div>

        <TacticalPanel label="COMMISSION LEDGER" status="LIVE" className="mt-4">
          {!state?.transactions?.length ? (
            <p className="text-xs text-muted-foreground">No transactions yet. Share your referral link to start earning.</p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {state.transactions.map((t: any) => (
                <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.note ?? t.kind}</div>
                    <div className="text-telemetry mt-0.5">
                      {t.kind} · {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-mono font-semibold text-sm shrink-0 ${Number(t.amount_ngn) >= 0 ? "text-gold" : "text-muted-foreground"}`}>
                    {Number(t.amount_ngn) >= 0 ? "+" : ""}₦{Number(t.amount_ngn).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TacticalPanel>

        <div className="mt-6 text-xs text-muted-foreground">
          Commissions credit automatically when a paid Paystack order is attributed to one of your referrals.
          <ArrowUpRight className="size-3 inline ml-1" />
        </div>
      </div>
    </>
  );
}
