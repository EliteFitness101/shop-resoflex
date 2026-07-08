// Onboarding checklist — AI-driven setup guidance for new ResoFit operators.
// Derives progress from existing health_profiles + daily_logs + ceo_tasks data
// (no new tables, no new server functions). Uses existing route surfaces.
import { Link } from "@tanstack/react-router";
import { TacticalPanel } from "@/components/TacticalPanel";
import { CheckCircle2, Circle, Sparkles, ArrowRight } from "lucide-react";

type Profile = Record<string, unknown> | null | undefined;
type Log = Record<string, unknown> | null | undefined;
type Task = { id: string; is_done?: boolean | null } | Record<string, unknown>;

export interface OnboardingChecklistProps {
  profile: Profile;
  log: Log;
  tasks: readonly Task[] | null | undefined;
}

interface ChecklistItem {
  key: string;
  label: string;
  hint: string;
  done: boolean;
  href: { to: string; hash?: string };
}

function nonEmpty(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return Number.isFinite(v) && v > 0;
  return true;
}

export function computeChecklist(
  profile: Profile,
  log: Log,
  tasks: readonly Task[] | null | undefined,
): ChecklistItem[] {
  const p = (profile ?? {}) as Record<string, unknown>;
  const l = (log ?? {}) as Record<string, unknown>;
  const t = tasks ?? [];

  return [
    {
      key: "profile",
      label: "Complete health assessment",
      hint: "Age, body, medical background — powers every recommendation.",
      done: nonEmpty(p.full_name) && nonEmpty(p.age) && nonEmpty(p.weight_kg),
      href: { to: "/chatb2k/onboarding" },
    },
    {
      key: "goal",
      label: "Set health goal & target",
      hint: "Fat loss, muscle, wellness — plus a target weight and date.",
      done: nonEmpty(p.goal) && (nonEmpty(p.target_weight_kg) || nonEmpty(p.target_date)),
      href: { to: "/chatb2k/onboarding" },
    },
    {
      key: "nigerian_prefs",
      label: "Configure Nigerian wellness preferences",
      hint: "Preferred local foods, dishes to avoid, religious restrictions.",
      done:
        nonEmpty(p.preferred_foods) ||
        nonEmpty(p.foods_to_avoid) ||
        nonEmpty(p.religious_restrictions),
      href: { to: "/chatb2k/onboarding" },
    },
    {
      key: "schedule",
      label: "Lock daily schedule",
      hint: "Wake/sleep windows so meals and workouts fit your day.",
      done: nonEmpty(p.wake_time) && nonEmpty(p.sleep_time),
      href: { to: "/chatb2k/onboarding" },
    },
    {
      key: "first_log",
      label: "Log your first day",
      hint: "Water, calories, or protein — start the telemetry.",
      done: nonEmpty(l.water_ml) || nonEmpty(l.calories) || nonEmpty(l.protein_g),
      href: { to: "/chatb2k" },
    },
    {
      key: "first_task",
      label: "Set today's CEO priority",
      hint: "One high-leverage task keeps momentum compounding.",
      done: Array.isArray(t) && t.length > 0,
      href: { to: "/chatb2k/ceo" },
    },
    {
      key: "ai_briefing",
      label: "Generate AI briefing",
      hint: "Sovereign summary + this-week action from ResoFit AI.",
      done: nonEmpty(p.ai_summary),
      href: { to: "/chatb2k/coach" },
    },
  ];
}

export function OnboardingChecklist({ profile, log, tasks }: OnboardingChecklistProps) {
  const items = computeChecklist(profile, log, tasks);
  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);
  if (doneCount === items.length) return null;

  const next = items.find((i) => !i.done);

  return (
    <TacticalPanel
      label={`SOVEREIGN SETUP · ${doneCount}/${items.length}`}
      status={`${pct}%`}
    >
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="size-3.5 text-gold shrink-0" aria-hidden />
        <span>
          AI Coach unlocks fully once these are complete. Nigerian meal engine, workout protocol, and CEO OS calibrate from your answers.
        </span>
      </div>

      <div className="h-1 rounded bg-muted overflow-hidden mb-4" aria-hidden>
        <div
          className="h-full bg-gradient-gold transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              to={item.href.to}
              className={`flex items-start gap-3 rounded-lg border p-3 transition min-h-14 ${
                item.done
                  ? "border-gold/15 bg-background/30 opacity-70"
                  : "border-gold/25 bg-background/50 hover:border-gold hover:bg-gold/5"
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="size-5 text-gold shrink-0 mt-0.5" aria-hidden />
              ) : (
                <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${item.done ? "line-through" : ""}`}>
                  {item.label}
                </div>
                {!item.done && (
                  <div className="text-xs text-muted-foreground mt-0.5">{item.hint}</div>
                )}
              </div>
              {!item.done && (
                <ArrowRight className="size-4 text-gold shrink-0 mt-1" aria-hidden />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {next && (
        <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-3 text-xs">
          <span className="font-mono uppercase tracking-widest text-gold">Next → </span>
          <span className="text-foreground/90">{next.label}</span>
        </div>
      )}
    </TacticalPanel>
  );
}
