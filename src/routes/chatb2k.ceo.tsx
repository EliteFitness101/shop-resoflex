import { createFileRoute, Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/chatb2k/ceo")({
  component: () => (
    <TacticalPanel label="CEO OPERATING SYSTEM" status="PHASE 3">
      <div className="text-center py-10">
        <Brain className="size-10 text-gold mx-auto mb-3" />
        <h1 className="font-display text-3xl font-bold">CEO OS</h1>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
          Morning briefing, top 3 priorities, deep work blocks, KPI tracking, decision journal. Phase 3.
        </p>
        <Link to="/chatb2k/coach" className="inline-block mt-4"><GoldButton>Get today's CEO briefing</GoldButton></Link>
      </div>
    </TacticalPanel>
  ),
});
