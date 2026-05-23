// AI personalization pipeline. Reads admin-uploaded base template (meal or
// workout) from private storage + user profile, asks Lovable AI to tailor it,
// then stores a personalized markdown plan in the `personalized-plans` bucket
// and registers a row in `personalized_plans`.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function aiGenerate(prompt: string, system: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 200)}`);
  }
  const body = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return body.choices?.[0]?.message?.content ?? "";
}

async function readTemplate(bucket: string, path: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage.from(bucket).download(path);
  if (error || !data) throw new Error(`Template download failed: ${error?.message}`);
  // Treat as text/markdown. For PDFs admins should upload .md (lovable note).
  return await data.text();
}

export const generatePersonalizedPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        orderId: z.string().uuid().optional().nullable(),
        productId: z.string().min(1).max(120),
        kind: z.enum(["meal", "workout"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Pull profile for personalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, fitness_goal, dietary_pref, weight_kg, height_cm")
      .eq("id", userId)
      .maybeSingle();

    // Pick the latest template for the product+kind
    const table = data.kind === "meal" ? "meal_plan_templates" : "workout_templates";
    const bucket = data.kind === "meal" ? "meal-templates" : "workout-templates";
    const { data: tpl } = await supabaseAdmin
      .from(table)
      .select("id, name, storage_path, notes")
      .eq("product_id", data.productId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!tpl) throw new Error(`No ${data.kind} template uploaded for product ${data.productId}`);

    const baseTemplate = await readTemplate(bucket, tpl.storage_path);
    const system =
      data.kind === "meal"
        ? "You are an elite Nigerian sports nutritionist. Personalize meal plans using local foods, exact macros, and shopping lists. Return clean markdown."
        : "You are an elite strength coach. Personalize workouts with sets, reps, RPE, and weekly progression. Return clean markdown.";

    const userCtx = JSON.stringify({
      name: profile?.full_name ?? "Operator",
      goal: profile?.fitness_goal ?? "general fitness",
      diet: profile?.dietary_pref ?? "omnivore",
      weight_kg: profile?.weight_kg ?? null,
      height_cm: profile?.height_cm ?? null,
    });
    const prompt = `User profile:\n${userCtx}\n\nBase template (${tpl.name}):\n${baseTemplate.slice(0, 8000)}\n\nReturn a personalized plan in markdown, with sections and a brief summary at the top.`;

    const personalized = await aiGenerate(prompt, system);
    const summary = personalized.split("\n").slice(0, 4).join(" ").slice(0, 400);

    const path = `${userId}/${data.kind}/${data.productId}-${Date.now()}.md`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("personalized-plans")
      .upload(path, new TextEncoder().encode(personalized), {
        contentType: "text/markdown",
        upsert: true,
      });
    if (upErr) throw new Error(`Plan upload failed: ${upErr.message}`);

    const { error: insErr } = await supabaseAdmin.from("personalized_plans").insert({
      user_id: userId,
      order_id: data.orderId ?? null,
      product_id: data.productId,
      plan_type: data.kind,
      storage_path: path,
      ai_summary: summary,
    });
    if (insErr) throw new Error(insErr.message);

    const { data: signed } = await supabaseAdmin.storage
      .from("personalized-plans")
      .createSignedUrl(path, 60 * 60 * 24 * 7);

    return { ok: true, url: signed?.signedUrl ?? null, summary };
  });
