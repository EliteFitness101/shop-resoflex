import { createFileRoute, Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { Dumbbell } from "lucide-react";

export const Route = createFileRoute("/chatb2k/workouts")({
  component: () => (
    <TacticalPanel label="WORKOUT ENGINE" status="PHASE 2">
      <div className="text-center py-10">
        <Dumbbell className="size-10 text-gold mx-auto mb-3" />
        <h1 className="font-display text-3xl font-bold">Personalized Workouts</h1>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
          Warmup, main, cooldown — sets, reps, rest, weekly progression. Home or gym, matched to your equipment.
        </p>
        <Link to="/chatb2k/coach" className="inline-block mt-4"><GoldButton>Generate via AI Coach</GoldButton></Link>
      </div>
    </TacticalPanel>
  ),
});
