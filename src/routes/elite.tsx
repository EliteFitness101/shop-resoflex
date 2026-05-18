import { createFileRoute, Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { Crown, Zap, Brain, Dumbbell, Trophy } from "lucide-react";

export const Route = createFileRoute("/elite")({
  component: Elite,
  head: () => ({
    meta: [
      { title: "Ecosystem Blueprint — ResoFlex Elite" },
      { name: "description", content: "The full sovereign performance blueprint. Strength. Nutrition. Recovery. Commerce. Network." },
      { property: "og:title", content: "ResoFlex Elite Blueprint" },
      { property: "og:description", content: "The full sovereign performance blueprint." },
      { property: "og:url", content: "/elite" },
    ],
    links: [{ rel: "canonical", href: "/elite" }],
  }),
});

function Elite() {
  const pillars = [
    { Icon: Dumbbell, title: "Strength Protocol", body: "Periodized programming with weekly load adjustments and Naija-context exercise alternatives." },
    { Icon: Brain, title: "Cognitive Stack", body: "Sleep, focus, and stress regulation supplements paired with circadian engineering." },
    { Icon: Zap, title: "Energy System", body: "Nutrient timing and fuel delivery built around the Lagos heat & humidity reality." },
    { Icon: Trophy, title: "Commerce Engine", body: "Earn while you transform — referral commissions clear directly to wallet." },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <Crown className="size-10 mx-auto text-gold mb-4" />
        <div className="text-telemetry mb-2">// THE BLUEPRINT</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">A complete operating system for elite human performance.</h1>
        <p className="text-muted-foreground mt-4">Not a gym. Not a supplement brand. Not a meal app. ResoFlex OS™ is the integrated infrastructure beneath all of them.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-12">
        {pillars.map((p) => (
          <TacticalPanel key={p.title} label={`PILLAR · ${p.title.toUpperCase()}`}>
            <div className="flex items-start gap-3">
              <p.Icon className="size-6 text-gold shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{p.body}</p>
              </div>
            </div>
          </TacticalPanel>
        ))}
      </div>

      <div className="mt-12 glass-panel rounded-xl p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl font-bold">Elite tier unlocks Q3.</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Limited to 250 operators. Includes 1:1 protocol calibration, priority sourcing, private agent terminal access.</p>
        <Link to="/register"><GoldButton size="lg" className="mt-6">Reserve Sovereign Tier</GoldButton></Link>
      </div>
    </div>
  );
}
