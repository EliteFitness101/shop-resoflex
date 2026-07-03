import { createFileRoute, Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/chatb2k/meals")({
  component: () => (
    <TacticalPanel label="MEAL ENGINE" status="PHASE 2">
      <div className="text-center py-10">
        <Sparkles className="size-10 text-gold mx-auto mb-3" />
        <h1 className="font-display text-3xl font-bold">Nigerian Meal Engine</h1>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
          Daily jollof, egusi, moi moi and pepper soup plans — tuned to your macros, budget, and schedule. Shipping in Phase 2.
        </p>
        <p className="mt-3 text-sm">Ask the AI Coach to generate today's meals now:</p>
        <Link to="/chatb2k/coach" className="inline-block mt-4"><GoldButton>Open AI Coach</GoldButton></Link>
      </div>
    </TacticalPanel>
  ),
});
