import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { useAuth } from "@/hooks/use-auth";
import { getHealthProfile, getTodayLog, upsertTodayLog, listTodayTasks } from "@/lib/chatb2k.functions";
import { Droplet, Flame, Beef, Plus, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/chatb2k/")({
  component: TodayDashboard,
});

const WATER_TARGET_ML = 3000;

function TodayDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const getProfile = useServerFn(getHealthProfile);
  const getLog = useServerFn(getTodayLog);
  const upsertLog = useServerFn(upsertTodayLog);
  const getTasks = useServerFn(listTodayTasks);

  const profile = useQuery({ queryKey: ["chatb2k", "profile"], queryFn: () => getProfile() });
  const log = useQuery({ queryKey: ["chatb2k", "log", "today"], queryFn: () => getLog() });
  const tasks = useQuery({ queryKey: ["chatb2k", "tasks", "today"], queryFn: () => getTasks() });

  const logMutation = useMutation({
    mutationFn: (patch: Record<string, unknown>) => upsertLog({ data: patch }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatb2k", "log", "today"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = profile.data?.full_name || user?.email?.split("@")[0] || "Operator";

  const water = log.data?.water_ml ?? 0;
  const calories = log.data?.calories ?? 0;
  const protein = Number(log.data?.protein_g ?? 0);

  const healthScore = Math.min(100, Math.round(((water / WATER_TARGET_ML) * 40) + Math.min(30, protein / 3) + Math.min(30, calories / 60)));
  const habitScore = tasks.data ? Math.round((tasks.data.filter((t) => t.is_done).length / Math.max(1, tasks.data.length)) * 100) : 0;
  const ceoScore = tasks.data && tasks.data.length > 0 ? habitScore : 0;

  if (!profile.data) {
    return (
      <div className="space-y-6">
        <TacticalPanel label="ONBOARDING · TIER-0" status="REQUIRED">
          <div className="text-center py-6">
            <Sparkles className="size-10 text-gold mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold">Welcome, {name}</h1>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Complete your Sovereign Health Assessment. ResoFit AI will generate your personalized meal engine, workout protocol, and CEO operating system — tuned to Nigerian foods, your schedule, and your goals.
            </p>
            <Link to="/chatb2k/onboarding" className="inline-block mt-6">
              <GoldButton size="lg">
                Begin Assessment <ArrowRight className="size-4 ml-1" />
              </GoldButton>
            </Link>
          </div>
        </TacticalPanel>
        <OnboardingChecklist profile={null} log={null} tasks={[]} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-telemetry">// {new Date().toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            {greeting}, <span className="bg-gradient-gold bg-clip-text text-transparent">{name}</span>
          </h1>
        </div>
        <Link to="/chatb2k/coach">
          <GoldButton size="sm"><Sparkles className="size-4 mr-1" /> Ask AI Coach</GoldButton>
        </Link>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <ScoreCard label="HEALTH" value={healthScore} />
        <ScoreCard label="HABIT" value={habitScore} />
        <ScoreCard label="CEO" value={ceoScore} />
      </div>

      <OnboardingChecklist profile={profile.data} log={log.data} tasks={tasks.data} />

      {profile.data?.ai_summary && (
        <TacticalPanel label="AI BRIEFING" status="LIVE">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{profile.data.ai_summary}</p>
        </TacticalPanel>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickLogCard
          icon={Droplet}
          label="Water"
          value={`${(water / 1000).toFixed(1)}L`}
          target={`${(WATER_TARGET_ML / 1000).toFixed(1)}L`}
          onAdd={() => logMutation.mutate({ water_ml: water + 250 })}
        />
        <QuickLogCard
          icon={Flame}
          label="Calories"
          value={String(calories)}
          target="2200"
          onAdd={() => qcOpenInput(logMutation, "calories", calories)}
        />
        <QuickLogCard
          icon={Beef}
          label="Protein"
          value={`${protein.toFixed(0)}g`}
          target="150g"
          onAdd={() => qcOpenInput(logMutation, "protein_g", protein)}
        />
      </div>

      <TacticalPanel label="TODAY'S TASKS" status={tasks.data?.length ? `${tasks.data.filter((t) => t.is_done).length}/${tasks.data.length}` : "EMPTY"}>
        {tasks.data && tasks.data.length > 0 ? (
          <ul className="space-y-2">
            {tasks.data.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 text-sm">
                <span className={`size-2 rounded-full ${t.is_done ? "bg-gold" : "bg-muted"}`} />
                <span className={t.is_done ? "line-through text-muted-foreground" : ""}>{t.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">
            No tasks yet. <Link to="/chatb2k/ceo" className="text-gold underline">Set today's priorities →</Link>
          </div>
        )}
      </TacticalPanel>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-panel rounded-lg p-4 text-center">
      <div className="text-telemetry text-[10px]">{label}</div>
      <div className="font-display text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent mt-1">
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">/ 100</div>
    </div>
  );
}

function QuickLogCard({
  icon: Icon,
  label,
  value,
  target,
  onAdd,
}: {
  icon: typeof Droplet;
  label: string;
  value: string;
  target: string;
  onAdd: () => void;
}) {
  return (
    <div className="glass-panel rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-telemetry text-[10px]">
          <Icon className="size-3.5 text-gold" /> {label.toUpperCase()}
        </div>
        <div className="font-display text-2xl font-bold mt-1">{value}</div>
        <div className="text-[10px] text-muted-foreground">Target {target}</div>
      </div>
      <button
        onClick={onAdd}
        className="size-9 rounded-full grid place-items-center bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90"
        aria-label={`Log ${label}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function qcOpenInput(
  m: { mutate: (v: Record<string, unknown>) => void },
  key: string,
  current: number,
) {
  const raw = window.prompt(`Add to ${key} (current ${current})`);
  if (!raw) return;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    toast.error("Enter a positive number");
    return;
  }
  m.mutate({ [key]: current + n });
}
