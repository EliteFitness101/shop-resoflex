import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { TacticalPanel } from "@/components/TacticalPanel";
import { GoldButton } from "@/components/GoldButton";
import { getHealthProfile, upsertHealthProfile } from "@/lib/chatb2k.functions";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/chatb2k/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Sovereign Health Assessment — ResoFit AI" }] }),
});

interface Form {
  full_name: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  body_fat_pct: string;
  goal: string;
  medical_conditions: string;
  food_allergies: string;
  workout_experience: string;
  occupation: string;
  daily_schedule: string;
  wake_time: string;
  sleep_time: string;
  stress_level: string;
  budget_ngn: string;
  location: string;
  preferred_foods: string;
  foods_to_avoid: string;
  religious_restrictions: string;
  equipment: string;
  training_venue: string;
  target_weight_kg: string;
  target_date: string;
}

const EMPTY: Form = {
  full_name: "", age: "", gender: "", height_cm: "", weight_kg: "", body_fat_pct: "",
  goal: "", medical_conditions: "", food_allergies: "", workout_experience: "",
  occupation: "", daily_schedule: "", wake_time: "", sleep_time: "", stress_level: "",
  budget_ngn: "", location: "", preferred_foods: "", foods_to_avoid: "",
  religious_restrictions: "", equipment: "", training_venue: "",
  target_weight_kg: "", target_date: "",
};

const STEPS = ["Identity", "Body", "Goal", "Lifestyle", "Nutrition", "Training"] as const;

function Onboarding() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const getProfile = useServerFn(getHealthProfile);
  const upsert = useServerFn(upsertHealthProfile);
  const profile = useQuery({ queryKey: ["chatb2k", "profile"], queryFn: () => getProfile() });

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);

  useEffect(() => {
    if (profile.data) {
      const p = profile.data;
      setForm({
        full_name: p.full_name ?? "",
        age: p.age?.toString() ?? "",
        gender: p.gender ?? "",
        height_cm: p.height_cm?.toString() ?? "",
        weight_kg: p.weight_kg?.toString() ?? "",
        body_fat_pct: p.body_fat_pct?.toString() ?? "",
        goal: p.goal ?? "",
        medical_conditions: p.medical_conditions ?? "",
        food_allergies: p.food_allergies ?? "",
        workout_experience: p.workout_experience ?? "",
        occupation: p.occupation ?? "",
        daily_schedule: p.daily_schedule ?? "",
        wake_time: p.wake_time ?? "",
        sleep_time: p.sleep_time ?? "",
        stress_level: p.stress_level ?? "",
        budget_ngn: p.budget_ngn?.toString() ?? "",
        location: p.location ?? "",
        preferred_foods: p.preferred_foods ?? "",
        foods_to_avoid: p.foods_to_avoid ?? "",
        religious_restrictions: p.religious_restrictions ?? "",
        equipment: p.equipment ?? "",
        training_venue: p.training_venue ?? "",
        target_weight_kg: p.target_weight_kg?.toString() ?? "",
        target_date: p.target_date ?? "",
      });
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(form)) {
        if (v === "" || v == null) continue;
        payload[k] = v;
      }
      return upsert({ data: payload });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chatb2k", "profile"] });
      toast.success("Sovereign profile synced — AI briefing generated.");
      nav({ to: "/chatb2k" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (e: FormEvent) => { e.preventDefault(); save.mutate(); };
  const set = (k: keyof Form) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="max-w-2xl mx-auto">
      <TacticalPanel label={`STEP ${step + 1} / ${STEPS.length} · ${STEPS[step].toUpperCase()}`} status="ASSESSMENT">
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-gold" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {step === 0 && (
            <>
              <Field label="Full name" value={form.full_name} onChange={set("full_name")} placeholder="Chinedu Okafor" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Age" type="number" value={form.age} onChange={set("age")} placeholder="28" />
                <Field label="Gender" value={form.gender} onChange={set("gender")} placeholder="male / female / other" />
              </div>
              <Field label="Location" value={form.location} onChange={set("location")} placeholder="Lagos, Nigeria" />
              <Field label="Occupation" value={form.occupation} onChange={set("occupation")} placeholder="Founder / CEO / Doctor…" />
            </>
          )}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height (cm)" type="number" value={form.height_cm} onChange={set("height_cm")} placeholder="175" />
                <Field label="Weight (kg)" type="number" value={form.weight_kg} onChange={set("weight_kg")} placeholder="82" />
              </div>
              <Field label="Body fat % (optional)" type="number" value={form.body_fat_pct} onChange={set("body_fat_pct")} placeholder="22" />
              <Field label="Medical conditions" value={form.medical_conditions} onChange={set("medical_conditions")} placeholder="Hypertension, diabetes, none…" textarea />
              <Field label="Food allergies" value={form.food_allergies} onChange={set("food_allergies")} placeholder="Peanuts, shellfish, none…" />
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Primary goal" value={form.goal} onChange={set("goal")} placeholder="Fat loss / muscle gain / recomp / wellness / performance" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Target weight (kg)" type="number" value={form.target_weight_kg} onChange={set("target_weight_kg")} placeholder="72" />
                <Field label="Target date" type="date" value={form.target_date} onChange={set("target_date")} />
              </div>
              <Field label="Monthly food budget (₦)" type="number" value={form.budget_ngn} onChange={set("budget_ngn")} placeholder="120000" />
            </>
          )}
          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Wake time" type="time" value={form.wake_time} onChange={set("wake_time")} />
                <Field label="Sleep time" type="time" value={form.sleep_time} onChange={set("sleep_time")} />
              </div>
              <Field label="Daily schedule" value={form.daily_schedule} onChange={set("daily_schedule")} placeholder="Office 9–6, gym 7pm, kids 8pm…" textarea />
              <Field label="Stress level" value={form.stress_level} onChange={set("stress_level")} placeholder="low / moderate / high" />
            </>
          )}
          {step === 4 && (
            <>
              <Field label="Preferred Nigerian foods" value={form.preferred_foods} onChange={set("preferred_foods")} placeholder="Jollof, egusi, moi moi, plantain, brown rice, pepper soup…" textarea />
              <Field label="Foods to avoid" value={form.foods_to_avoid} onChange={set("foods_to_avoid")} placeholder="Pork, garri, sugary drinks…" />
              <Field label="Religious restrictions" value={form.religious_restrictions} onChange={set("religious_restrictions")} placeholder="Halal, kosher, none…" />
            </>
          )}
          {step === 5 && (
            <>
              <Field label="Workout experience" value={form.workout_experience} onChange={set("workout_experience")} placeholder="beginner / intermediate / advanced" />
              <Field label="Training venue" value={form.training_venue} onChange={set("training_venue")} placeholder="gym / home / outdoor" />
              <Field label="Available equipment" value={form.equipment} onChange={set("equipment")} placeholder="Dumbbells, resistance bands, treadmill, full gym…" textarea />
            </>
          )}

          <div className="flex justify-between pt-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="flex items-center gap-1 text-xs font-mono uppercase px-3 py-2 rounded border border-gold/30 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-1 text-xs font-mono uppercase px-3 py-2 rounded bg-gold/10 text-gold border border-gold/30"
              >
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <GoldButton type="submit" disabled={save.isPending}>
                {save.isPending ? "Syncing…" : (<><CheckCircle2 className="size-4 mr-1" /> Complete</>)}
              </GoldButton>
            )}
          </div>
        </form>
      </TacticalPanel>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-telemetry text-[10px]">{label.toUpperCase()}</span>
      {textarea ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded bg-background/60 border border-gold/20 px-3 py-2 text-sm focus:border-gold outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded bg-background/60 border border-gold/20 px-3 py-2 text-sm focus:border-gold outline-none"
        />
      )}
    </label>
  );
}
