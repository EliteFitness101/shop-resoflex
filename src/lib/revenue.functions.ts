// Revenue OS server functions: funnel ingest, dashboard read, AI insights.
// Writes always go through supabaseAdmin server-side. Reads are admin-gated.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Attribution = z
  .object({
    rsid: z.string().max(128).nullable().optional(),
    utm_source: z.string().max(128).nullable().optional(),
    utm_medium: z.string().max(128).nullable().optional(),
    utm_campaign: z.string().max(128).nullable().optional(),
    utm_content: z.string().max(128).nullable().optional(),
    utm_term: z.string().max(128).nullable().optional(),
    funnel_origin: z.string().max(128).nullable().optional(),
  })
  .partial();

// Public ingest from the browser. Strict validation, no PII required.
export const ingestFunnelEvent = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        event_type: z.string().min(2).max(64).regex(/^[a-z0-9_]+$/),
        sku: z.string().max(64).nullable().optional(),
        path: z.string().max(512).nullable().optional(),
        attribution: Attribution.nullable().optional(),
        metadata: z.record(z.string(), z.any()).nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const a = data.attribution ?? {};
    await supabaseAdmin.from("funnel_events").insert({
      event_type: data.event_type,
      sku: data.sku ?? null,
      path: data.path ?? null,
      rsid: a.rsid ?? null,
      utm_source: a.utm_source ?? null,
      utm_medium: a.utm_medium ?? null,
      utm_campaign: a.utm_campaign ?? null,
      utm_content: a.utm_content ?? null,
      utm_term: a.utm_term ?? null,
      funnel_origin: a.funnel_origin ?? null,
      metadata: (data.metadata ?? null) as never,
    });
    return { ok: true };
  });

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Admin only");
}

export const getRevenueDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date();
    const startToday = new Date(now); startToday.setUTCHours(0, 0, 0, 0);
    const start30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

    const [revRecent, funnelRecent] = await Promise.all([
      supabaseAdmin
        .from("revenue_events")
        .select("rsid, sku, amount_ngn, currency, utm_source, utm_medium, utm_campaign, created_at")
        .gte("created_at", start30.toISOString())
        .order("created_at", { ascending: false })
        .limit(2000),
      supabaseAdmin
        .from("funnel_events")
        .select("rsid, event_type, sku, utm_source, created_at")
        .gte("created_at", start30.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);

    const revenue = revRecent.data ?? [];
    const funnel = funnelRecent.data ?? [];

    const revenueToday = revenue
      .filter((r) => new Date(r.created_at) >= startToday)
      .reduce((s, r) => s + Number(r.amount_ngn || 0), 0);

    const revenue30 = revenue.reduce((s, r) => s + Number(r.amount_ngn || 0), 0);

    const bucket = (key: string, arr: typeof revenue) => {
      const m = new Map<string, number>();
      for (const r of arr) {
        const k = ((r as any)[key] ?? "(none)") as string;
        m.set(k, (m.get(k) || 0) + Number(r.amount_ngn || 0));
      }
      return [...m.entries()]
        .map(([k, v]) => ({ key: k, amount_ngn: v }))
        .sort((a, b) => b.amount_ngn - a.amount_ngn)
        .slice(0, 10);
    };

    const revenueBySku = bucket("sku", revenue);
    const revenueByUtmSource = bucket("utm_source", revenue);

    const rsidTotals = new Map<string, number>();
    for (const r of revenue) {
      if (!r.rsid) continue;
      rsidTotals.set(r.rsid, (rsidTotals.get(r.rsid) || 0) + Number(r.amount_ngn || 0));
    }
    const topRsids = [...rsidTotals.entries()]
      .map(([rsid, amount_ngn]) => ({ rsid, amount_ngn }))
      .sort((a, b) => b.amount_ngn - a.amount_ngn)
      .slice(0, 10);

    const checkoutStarted = funnel.filter((f) => f.event_type === "checkout_started").length;
    const paymentSuccess = funnel.filter((f) => f.event_type === "payment_success").length || revenue.length;
    const landingViews = funnel.filter((f) => f.event_type === "landing_view").length;

    const conversionRate = landingViews > 0 ? paymentSuccess / landingViews : 0;
    const abandonmentRate =
      checkoutStarted > 0 ? Math.max(0, (checkoutStarted - paymentSuccess) / checkoutStarted) : 0;

    return {
      revenueToday,
      revenue30,
      txnCount30: revenue.length,
      revenueBySku,
      revenueByUtmSource,
      topRsids,
      checkoutStarted,
      paymentSuccess,
      landingViews,
      conversionRate,
      abandonmentRate,
      recentRevenue: revenue.slice(0, 20),
    };
  });

export const generateRevenueInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const start = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const [{ data: rev }, { data: fun }] = await Promise.all([
      supabaseAdmin
        .from("revenue_events")
        .select("sku, amount_ngn, utm_source, utm_campaign, created_at")
        .gte("created_at", start),
      supabaseAdmin
        .from("funnel_events")
        .select("event_type, sku, utm_source, created_at")
        .gte("created_at", start),
    ]);

    const summary = {
      revenue_30d_ngn: (rev ?? []).reduce((s, r) => s + Number(r.amount_ngn || 0), 0),
      txn_count: (rev ?? []).length,
      by_sku: (rev ?? []).reduce<Record<string, number>>((m, r) => {
        const k = r.sku ?? "unknown"; m[k] = (m[k] || 0) + Number(r.amount_ngn || 0); return m;
      }, {}),
      by_source: (rev ?? []).reduce<Record<string, number>>((m, r) => {
        const k = r.utm_source ?? "direct"; m[k] = (m[k] || 0) + Number(r.amount_ngn || 0); return m;
      }, {}),
      funnel_counts: (fun ?? []).reduce<Record<string, number>>((m, f) => {
        m[f.event_type] = (m[f.event_type] || 0) + 1; return m;
      }, {}),
    };

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        status: "pending_review" as const,
        insights: ["LOVABLE_API_KEY not configured — showing raw signal only."],
        recommendations: [],
        summary,
      };
    }

    const prompt = `You are the AI CEO for ResoFlex OS, a Nigerian fitness commerce funnel.
Given the last 30 days of revenue + funnel data (NGN), produce:
1) 3-6 concise INSIGHTS (data observations: payment-failure spikes, abandonment ratios, SKU underperformance, traffic-source inefficiency).
2) 3-6 concrete RECOMMENDATIONS (funnel optimization, WhatsApp recovery, CTA changes, SKU prioritization).
All recommendations are advisory only — no auto-execution.
Return strict JSON: {"insights":[string,...],"recommendations":[string,...]}.

DATA:
${JSON.stringify(summary).slice(0, 6000)}`;

    let insights: string[] = [];
    let recommendations: string[] = [];
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are an analytics CEO assistant. Reply with strict JSON only." },
            { role: "user", content: prompt },
          ],
        }),
      });
      const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = j.choices?.[0]?.message?.content ?? "{}";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      insights = Array.isArray(parsed.insights) ? parsed.insights.slice(0, 8) : [];
      recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 8) : [];
    } catch (e) {
      insights = [`AI analysis unavailable: ${(e as Error).message}`];
    }

    return { status: "pending_review" as const, insights, recommendations, summary };
  });
