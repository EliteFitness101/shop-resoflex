import { createFileRoute } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { referrals } from "@/lib/mock-data";
import { Copy, Radio } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/agents")({
  component: Agents,
  head: () => ({
    meta: [
      { title: "Agent Network Terminal — ResoFlex OS™" },
      { name: "description", content: "Operator referral terminal. Real-time agent telemetry, commissions, and network signal." },
      { property: "og:title", content: "Agent Network Terminal" },
      { property: "og:description", content: "Operator referral terminal with real-time commissions." },
      { property: "og:url", content: "/agents" },
    ],
    links: [{ rel: "canonical", href: "/agents" }],
  }),
});

function Agents() {
  const code = "RSFX-OP-2811";
  const link = `https://resofit.fit/?ref=${code}`;
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="text-telemetry mb-2">// AGENT TERMINAL</div>
      <h1 className="font-display text-4xl font-bold">Network Operations</h1>
      <p className="text-muted-foreground mt-2">Live referral telemetry. Tier progression. Payout queue.</p>

      <div className="grid sm:grid-cols-3 gap-3 mt-8">
        <TacticalPanel label="TIER" status="OPERATOR">
          <div className="font-display font-bold text-3xl text-gold">II</div>
          <div className="text-xs text-muted-foreground mt-1">Next: SOVEREIGN @ 25 refs</div>
        </TacticalPanel>
        <TacticalPanel label="ACTIVE REFS">
          <div className="font-display font-bold text-3xl text-gold">{referrals.filter(r => r.status === "active").length}</div>
        </TacticalPanel>
        <TacticalPanel label="LIFETIME EARNED">
          <div className="font-display font-bold text-3xl text-gold">₦{referrals.reduce((a, r) => a + r.earningsNGN, 0).toLocaleString()}</div>
        </TacticalPanel>
      </div>

      <TacticalPanel label="REFERRAL LINK · BROADCAST" status="LIVE" className="mt-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <code className="flex-1 font-mono text-sm bg-background/60 border border-gold/15 rounded px-3 py-2.5 truncate">{link}</code>
          <GoldButton onClick={() => { navigator.clipboard?.writeText(link); toast.success("Broadcast link copied"); }}>
            <Copy className="size-4"/> Copy
          </GoldButton>
        </div>
      </TacticalPanel>

      <TacticalPanel label="RECRUITED OPERATORS" className="mt-4">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-telemetry text-left">
                <th className="font-normal py-2 px-1">EMAIL</th>
                <th className="font-normal py-2 px-1">JOINED</th>
                <th className="font-normal py-2 px-1">EARNED</th>
                <th className="font-normal py-2 px-1">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-gold/5">
                  <td className="py-3 px-1 font-mono text-xs">{r.email}</td>
                  <td className="py-3 px-1 text-muted-foreground">{r.joinedAt}</td>
                  <td className="py-3 px-1 text-gold font-medium">₦{r.earningsNGN.toLocaleString()}</td>
                  <td className="py-3 px-1">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${r.status === "active" ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"}`}>
                      <Radio className="inline size-3 mr-1" />{r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TacticalPanel>
    </div>
  );
}
