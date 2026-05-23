import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Admin only");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

// Accepts base64 file content (≤ 8MB) and uploads to a private/public bucket
// using the service-role client. Used by the admin upload UI.
export const adminUploadFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        bucket: z.enum(["product-images", "meal-templates", "workout-templates"]),
        path: z.string().min(1).max(300).regex(/^[a-zA-Z0-9._\/-]+$/),
        contentType: z.string().min(1).max(120),
        base64: z.string().min(4),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("File too large (>8MB)");
    const { error } = await supabaseAdmin.storage
      .from(data.bucket)
      .upload(data.path, bytes, { contentType: data.contentType, upsert: true });
    if (error) throw new Error(error.message);
    if (data.bucket === "product-images") {
      const { data: pub } = supabaseAdmin.storage.from(data.bucket).getPublicUrl(data.path);
      return { ok: true, publicUrl: pub.publicUrl };
    }
    return { ok: true, publicUrl: null };
  });

// Registers an uploaded template file in meal_plan_templates / workout_templates.
export const registerTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        kind: z.enum(["meal", "workout"]),
        product_id: z.string().min(1).max(120),
        name: z.string().min(1).max(200),
        storage_path: z.string().min(1).max(300),
        notes: z.string().max(2000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const table = data.kind === "meal" ? "meal_plan_templates" : "workout_templates";
    const { error } = await supabaseAdmin.from(table).insert({
      product_id: data.product_id,
      name: data.name,
      storage_path: data.storage_path,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const [meals, workouts] = await Promise.all([
      supabaseAdmin.from("meal_plan_templates").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("workout_templates").select("*").order("created_at", { ascending: false }),
    ]);
    return { meals: meals.data ?? [], workouts: workouts.data ?? [] };
  });
