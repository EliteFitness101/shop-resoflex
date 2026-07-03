// ResoFit AI Coach — server functions (Phase 1)
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function aiComplete(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI rate limit — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
    throw new Error(`AI gateway ${res.status}: ${txt.slice(0, 200)}`);
  }
  const body = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return body.choices?.[0]?.message?.content ?? "";
}

// -------- Profile --------
export const getHealthProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("health_profiles")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const ProfileSchema = z.object({
  full_name: z.string().max(120).optional().nullable(),
  age: z.coerce.number().int().min(10).max(120).optional().nullable(),
  gender: z.string().max(40).optional().nullable(),
  height_cm: z.coerce.number().min(80).max(260).optional().nullable(),
  weight_kg: z.coerce.number().min(20).max(400).optional().nullable(),
  body_fat_pct: z.coerce.number().min(3).max(70).optional().nullable(),
  goal: z.string().max(120).optional().nullable(),
  medical_conditions: z.string().max(1000).optional().nullable(),
  food_allergies: z.string().max(500).optional().nullable(),
  workout_experience: z.string().max(60).optional().nullable(),
  occupation: z.string().max(120).optional().nullable(),
  daily_schedule: z.string().max(500).optional().nullable(),
  wake_time: z.string().max(20).optional().nullable(),
  sleep_time: z.string().max(20).optional().nullable(),
  stress_level: z.string().max(40).optional().nullable(),
  budget_ngn: z.coerce.number().min(0).max(10_000_000).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  preferred_foods: z.string().max(1000).optional().nullable(),
  foods_to_avoid: z.string().max(500).optional().nullable(),
  religious_restrictions: z.string().max(200).optional().nullable(),
  equipment: z.string().max(500).optional().nullable(),
  training_venue: z.string().max(60).optional().nullable(),
  target_weight_kg: z.coerce.number().min(20).max(400).optional().nullable(),
  target_date: z.string().max(30).optional().nullable(),
});

export const upsertHealthProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProfileSchema.parse(d))
  .handler(async ({ data, context }) => {
    // Try to generate AI summary; degrade gracefully.
    let ai_summary: string | null = null;
    try {
      const facts = Object.entries(data)
        .filter(([, v]) => v !== null && v !== "" && v !== undefined)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      ai_summary = await aiComplete([
        {
          role: "system",
          content:
            "You are ResoFit AI Coach — a Nigerian luxury health, fitness and CEO coach. In 4 short lines (≤60 words total), summarize this operator's profile and give ONE bold action they must take this week. Use crisp, motivating language. No emojis.",
        },
        { role: "user", content: facts },
      ]);
    } catch (err) {
      console.warn("[chatb2k] profile summary failed:", err);
    }

    const payload = { ...data, ai_summary, user_id: context.userId };
    const { data: row, error } = await context.supabase
      .from("health_profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// -------- Daily log --------
export const getTodayLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await context.supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", context.userId)
      .eq("log_date", today)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const LogSchema = z.object({
  water_ml: z.coerce.number().int().min(0).max(20000).optional(),
  calories: z.coerce.number().int().min(0).max(20000).optional(),
  protein_g: z.coerce.number().min(0).max(1000).optional(),
  carbs_g: z.coerce.number().min(0).max(2000).optional(),
  fat_g: z.coerce.number().min(0).max(1000).optional(),
  weight_kg: z.coerce.number().min(20).max(400).optional().nullable(),
  mood: z.string().max(40).optional().nullable(),
  sleep_hours: z.coerce.number().min(0).max(24).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const upsertTodayLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => LogSchema.parse(d))
  .handler(async ({ data, context }) => {
    const today = new Date().toISOString().slice(0, 10);
    const { data: row, error } = await context.supabase
      .from("daily_logs")
      .upsert(
        { ...data, user_id: context.userId, log_date: today },
        { onConflict: "user_id,log_date" },
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// -------- Habits --------
export const listHabits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("habits")
      .select("*")
      .eq("user_id", context.userId)
      .eq("active", true)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// -------- CEO tasks --------
export const listTodayTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await context.supabase
      .from("ceo_tasks")
      .select("*")
      .eq("user_id", context.userId)
      .eq("task_date", today)
      .order("priority", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// -------- AI Coach chat --------
export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ai_conversations")
      .select("*")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getConversationMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ conversationId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("ai_messages")
      .select("*")
      .eq("conversation_id", data.conversationId)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const sendCoachMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        conversationId: z.string().uuid().optional().nullable(),
        message: z.string().min(1).max(4000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;

    // Ensure conversation
    let convId = data.conversationId ?? null;
    if (!convId) {
      const title = data.message.slice(0, 60);
      const { data: conv, error } = await supabase
        .from("ai_conversations")
        .insert({ user_id: context.userId, title })
        .select()
        .single();
      if (error) throw new Error(error.message);
      convId = conv.id;
    }

    // Load profile + recent messages for context
    const [{ data: profile }, { data: history }] = await Promise.all([
      supabase
        .from("health_profiles")
        .select("*")
        .eq("user_id", context.userId)
        .maybeSingle(),
      supabase
        .from("ai_messages")
        .select("role, parts")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true })
        .limit(30),
    ]);

    const profileFacts = profile
      ? Object.entries(profile)
          .filter(([k, v]) => v && !["id", "user_id", "created_at", "updated_at"].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      : "No profile on file yet.";

    const systemPrompt = `You are ResoFit AI Coach — a world-class Nigerian personal health, fitness, nutrition, habit, mindset, and CEO productivity assistant. Speak with warm confidence and precision. Use Nigerian context: local foods (jollof, egusi, moi moi, plantain, beans, yam, brown rice, ofada, pepper soup, banga), NGN pricing, Lagos/Abuja/PH lifestyle. Give specific, actionable answers. Use short paragraphs and bulleted lists when helpful. Never invent user data — ask if unknown.

Operator profile:
${profileFacts}`;

    type PartLike = { type?: string; text?: string };
    const priorMessages =
      (history ?? []).map((m) => {
        const parts = Array.isArray(m.parts) ? (m.parts as PartLike[]) : [];
        const text = parts
          .filter((p) => p?.type === "text")
          .map((p) => p.text ?? "")
          .join("");
        return { role: m.role as "user" | "assistant", content: text };
      });

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...priorMessages,
      { role: "user" as const, content: data.message },
    ];

    // Persist user message
    const { error: userErr } = await supabase.from("ai_messages").insert({
      conversation_id: convId,
      user_id: context.userId,
      role: "user",
      parts: [{ type: "text", text: data.message }],
    });
    if (userErr) throw new Error(userErr.message);

    // Call model
    const reply = await aiComplete(messages);

    // Persist assistant message
    const { error: asstErr } = await supabase.from("ai_messages").insert({
      conversation_id: convId,
      user_id: context.userId,
      role: "assistant",
      parts: [{ type: "text", text: reply }],
    });
    if (asstErr) throw new Error(asstErr.message);

    // Touch conversation
    await supabase
      .from("ai_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", convId);

    return { conversationId: convId, reply };
  });

export const newConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ai_conversations")
      .insert({ user_id: context.userId, title: "New conversation" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  });
