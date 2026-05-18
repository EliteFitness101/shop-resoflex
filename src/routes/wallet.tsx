import { createFileRoute } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { transactions } from "@/lib/mock-data";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/wallet")({
  component: Wallet,
  head: () => ({
    meta: [
      { title: "Referral Wallet — ResoFlex OS™" },
      { name: "description", content: "Operator wallet. Real-time commission accruals, withdrawal queue, and transaction ledger." },
      { property: "og:title", content: "Operator Wallet" },
      { property: "og:description", content: "Real-time commission accruals and withdrawal queue." },
      { property: "og:url", content: "/wallet" },
    ],
    links: [{ rel: "canonical", href: "/wallet" }],
  }),
});

function Wallet() {
  const balance = transactions.reduce((a, t) => a + t.amountNGN, 0);
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="text-telemetry mb-2">// WALLET</div>
      <h1 className="font-display text-4xl font-bold">Referral Treasury</h1>

      <div className="mt-8 glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 telemetry-grid opacity-20" />
        <div className="relative">
          <div className="text-telemetry">AVAILABLE BALANCE</div>
          <div className="font-display font-bold text-5xl sm:text-6xl text-gold mt-2">₦{balance.toLocaleString()}</div>
          <div className="mt-6 flex flex-wrap gap-3">
            <GoldButton><ArrowDownToLine className="size-4"/>Withdraw</GoldButton>
            <GoldButton variant="outline"><ArrowUpRight className="size-4"/>Reinvest</GoldButton>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <TacticalPanel label="PENDING">
          <div className="font-display font-bold text-2xl text-gold">₦24,800</div>
        </TacticalPanel>
        <TacticalPanel label="THIS MONTH">
          <div className="font-display font-bold text-2xl text-gold">₦42,460</div>
        </TacticalPanel>
        <TacticalPanel label="ALL-TIME">
          <div className="font-display font-bold text-2xl text-gold">₦318,440</div>
        </TacticalPanel>
      </div>

      <TacticalPanel label="TRANSACTION LEDGER" status="LIVE" className="mt-4">
        <ul className="divide-y divide-gold/10">
          {transactions.map((t) => (
            <li key={t.id} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{t.note}</div>
                <div className="text-telemetry mt-0.5">{t.type} · {t.createdAt}</div>
              </div>
              <div className={`font-mono font-semibold text-sm shrink-0 ${t.amountNGN >= 0 ? "text-gold" : "text-muted-foreground"}`}>
                {t.amountNGN >= 0 ? "+" : ""}₦{t.amountNGN.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </TacticalPanel>
    </div>
  );
}
