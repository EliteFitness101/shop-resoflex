import { createFileRoute, Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { CheckSquare } from "lucide-react";

export const Route = createFileRoute("/chatb2k/habits")({
  component: () => (
    <TacticalPanel label="HABIT TRACKER" status="PHASE 2">
      <div className="text-center py-10">
        <CheckSquare className="size-10 text-gold mx-auto mb-3" />
        <h1 className="font-display text-3xl font-bold">Habit Tracker</h1>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
          Water, sleep, prayer, deep work — streaks, XP, badges. Shipping in Phase 2.
        </p>
        <Link to="/chatb2k/coach" className="inline-block mt-4"><GoldButton>Design habits with AI</GoldButton></Link>
      </div>
    </TacticalPanel>
  ),
});
