import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_ngn: number;
  compare_price_ngn: number | null;
  commission_pct: number;
  category: string | null;
  badge: string | null;
  image_url: string | null;
  hero_url: string | null;
  active: boolean;
};

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return { products: (data ?? []) as DbProduct[] };
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { data: p, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { product: (p as DbProduct | null) };
  });

export const upsertProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        slug: z.string().min(1).max(120),
        image_url: z.string().url().max(1000).nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Admin only");
    const { error } = await supabaseAdmin
      .from("products")
      .update({ image_url: data.image_url })
      .eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
