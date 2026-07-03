import { createFileRoute, Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { Sparkles } from "lucide-react";

function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <TacticalPanel label={`${title.toUpperCase()} · ENGINE`} status="PHASE 2">
      <div className="text-center py-10">
        <Sparkles className="size-10 text-gold mx-auto mb-3" />
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">{blurb}</p>
        <p className="mt-4 text-xs text-muted-foreground">Available now: ask the AI Coach to generate this for you today.</p>
        <Link to="/chatb2k/coach" className="inline-block mt-5">
          <GoldButton>Open AI Coach</GoldButton>
        </Link>
      </div>
    </TacticalPanel>
  );
}

export const meals = ComingSoon;
