import { createFileRoute } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { Bell, Globe, Moon, Shield, User } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({
    meta: [
      { title: "Settings — ResoFlex OS™" },
      { name: "description", content: "Operator profile, security, and notification controls." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Settings() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="text-telemetry mb-2">// PROFILE</div>
      <h1 className="font-display text-4xl font-bold">Operator Settings</h1>

      <TacticalPanel label="IDENTITY" className="mt-8">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-gold grid place-items-center font-display font-black text-2xl text-primary-foreground shadow-gold">OP</div>
          <div>
            <div className="font-display font-semibold text-lg">Operator 2811</div>
            <div className="text-telemetry mt-1">RSFX-OP-2811 · OPERATOR TIER</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {[
            ["FULL NAME", "Tunde Adebayo"],
            ["EMAIL", "tunde@resofit.fit"],
            ["PHONE", "+234 803 ••• ••12"],
            ["LOCATION", "Lagos, NG"],
          ].map(([l, v]) => (
            <div key={l} className="text-sm">
              <div className="text-telemetry mb-1">{l}</div>
              <div className="font-mono">{v}</div>
            </div>
          ))}
        </div>
      </TacticalPanel>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {[
          { Icon: Bell, label: "Notifications", body: "Telemetry alerts, payout notices, threat warnings" },
          { Icon: Shield, label: "Security", body: "2FA, session locks, hardware key" },
          { Icon: Globe, label: "Region", body: "NG · Lagos default" },
          { Icon: Moon, label: "Appearance", body: "Sovereign dark · always" },
        ].map((p) => (
          <TacticalPanel key={p.label} label={p.label.toUpperCase()}>
            <div className="flex items-start gap-3">
              <p.Icon className="size-5 text-gold mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-display font-medium">{p.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.body}</div>
              </div>
              <GoldButton variant="ghost" size="sm">EDIT</GoldButton>
            </div>
          </TacticalPanel>
        ))}
      </div>

      <TacticalPanel label="DANGER ZONE" className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display font-medium">Sign out</div>
            <div className="text-xs text-muted-foreground mt-1">Terminate all active sessions across devices.</div>
          </div>
          <GoldButton variant="outline" size="sm" className="border-destructive/40 text-destructive hover:bg-destructive/10">Sign out</GoldButton>
        </div>
      </TacticalPanel>

      <div className="mt-6 flex items-center justify-center gap-2 text-telemetry">
        <User className="size-3"/> SESSION · ACTIVE · LAGOS-EDGE
      </div>
    </div>
  );
}
