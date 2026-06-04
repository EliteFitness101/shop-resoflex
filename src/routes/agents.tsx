import { createFileRoute } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { RouteHero } from "@/components/RouteHero";
import { referrals } from "@/lib/mock-data";
import { Copy, Radio } from "lucide-react";
import { toast } from "sonner";
import heroAgents from "@/assets/hero-agents.jpg";

export const Route = createFileRoute("/agents")({
  component: Agents,
  head: () => ({
    meta: [
      { title: "Sovereign Agent Economy Network — Earn While You Build" },
      { name: "description", content: "Unlock up to 40% commission on every referred operator with real-time tracking, instant wallet generation, and transparent outbound Paystack payouts." },
      { property: "og:title", content: "Sovereign Agent Economy Network — Earn While You Build" },
      { property: "og:description", content: "Unlock up to 40% commission on every referred operator with real-time tracking, instant wallet generation, and transparent outbound Paystack payouts." },
      { property: "og:url", content: "/agents" },
      { property: "og:image", content: heroAgents },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroAgents },
    ],
    links: [{ rel: "canonical", href: "/agents" }],
  }),
});

function Agents() {
  const code = "RSFX-OP-2811";
  const link = `https://resofit.fit/?ref=${code}`;
  return (
    <>
      <RouteHero
        eyebrow="AGENT TERMINAL"
        title="Sovereign Agent Economy"
        subtitle="Unlock up to 40% commission on every referred operator — real-time tracking, instant wallet generation, transparent outbound Paystack payouts."
        ctaLabel="Activate Agent Credentials"
        ctaHref="#agent-console"
        image={heroAgents}
      />

      <div id="agent-console" className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-3">
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
            <code className="flex-1 font-mono text-sm bg-background/60 border border-gold/15 px-3 py-2.5 truncate">{link}</code>
            <GoldButton className="!rounded-none" onClick={() => { navigator.clipboard?.writeText(link); toast.success("Broadcast link copied"); }}>
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
                      <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 ${r.status === "active" ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"}`}>
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
    </>
  );
}
