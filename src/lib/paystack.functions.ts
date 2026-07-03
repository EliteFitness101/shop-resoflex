// Real Paystack server functions: initialize + verify.
// Uses PAYSTACK_SECRET_KEY (sk_live or sk_test). Public key (pk_*) stays
// frontend-only and is read via VITE_PAYSTACK_PUBLIC_KEY where needed.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecret(): string {
  const s = process.env.PAYSTACK_SECRET_KEY;
  if (!s) throw new Error("PAYSTACK_SECRET_KEY not configured");
  return s;
}

export const initiatePaystackPayment = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        email: z.string().email().max(200),
        amountKobo: z.number().int().positive().max(1_000_000_000),
        productId: z.string().min(1).max(64),
        productName: z.string().min(1).max(200),
        userId: z.string().uuid().nullable().optional(),
        callbackOrigin: z.string().url(),
        attribution: z
          .object({
            rsid: z.string().max(128).optional().nullable(),
            utm_source: z.string().max(128).optional().nullable(),
            utm_medium: z.string().max(128).optional().nullable(),
            utm_campaign: z.string().max(128).optional().nullable(),
            utm_content: z.string().max(128).optional().nullable(),
            utm_term: z.string().max(128).optional().nullable(),
            funnel_origin: z.string().max(128).optional().nullable(),
          })
          .partial()
          .optional()
          .nullable(),
        sku: z.string().max(64).optional().nullable(),
        variant: z.string().max(64).optional().nullable(),
        quantity: z.number().int().positive().max(9999).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const reference = `RSFX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Persist pending order first so the webhook can match it.
    const { error: insertErr } = await supabaseAdmin.from("orders").insert({
      user_id: data.userId ?? null,
      reference,
      product_id: data.productId,
      product_name: data.productName,
      amount_ngn: data.amountKobo / 100,
      status: "pending",
      customer_email: data.email,
    });
    if (insertErr) throw new Error(`Order persistence failed: ${insertErr.message}`);

    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getSecret()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amountKobo,
        reference,
        currency: "NGN",
        callback_url: `${data.callbackOrigin}/checkout/callback`,
        metadata: {
          productId: data.productId,
          productName: data.productName,
          userId: data.userId ?? null,
          sku: data.sku ?? data.productId,
          quantity: data.quantity ?? 1,
          rsid: data.attribution?.rsid ?? null,
          utm_source: data.attribution?.utm_source ?? null,
          utm_medium: data.attribution?.utm_medium ?? null,
          utm_campaign: data.attribution?.utm_campaign ?? null,
          utm_content: data.attribution?.utm_content ?? null,
          utm_term: data.attribution?.utm_term ?? null,
          funnel_origin: data.attribution?.funnel_origin ?? null,
        },
      }),
    });

    const body = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url: string; reference: string };
    };
    if (!res.ok || !body.status || !body.data) {
      throw new Error(`Paystack init failed: ${body.message ?? res.statusText}`);
    }

    return {
      reference: body.data.reference,
      authorizationUrl: body.data.authorization_url,
    };
  });

export const verifyPaystackPayment = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ reference: z.string().min(4).max(128) }).parse(d))
  .handler(async ({ data }) => {
    // First try the database — webhook may have already updated.
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("reference", data.reference)
      .maybeSingle();

    if (order && order.status === "paid") {
      return {
        status: "success" as const,
        amountNGN: Number(order.amount_ngn),
        productId: order.product_id,
        productName: order.product_name,
        email: order.customer_email,
      };
    }

    // Fall back to Paystack /verify (covers cases where webhook hasn't fired yet).
    const res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${getSecret()}` } },
    );
    const body = (await res.json()) as {
      status?: boolean;
      data?: {
        status: string;
        amount: number;
        customer?: { email?: string };
        metadata?: { productId?: string; productName?: string };
      };
    };
    if (!res.ok || !body.status || !body.data) {
      return null;
    }
    if (body.data.status !== "success") {
      return { status: "failed" as const };
    }

    const productId = body.data.metadata?.productId ?? order?.product_id ?? "unknown";
    const productName = body.data.metadata?.productName ?? order?.product_name ?? "Order";
    const amountNGN = body.data.amount / 100;
    const email = body.data.customer?.email ?? order?.customer_email ?? "";

    // Promote pending → paid if needed.
    if (order && order.status !== "paid") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "paid", paystack_data: body.data })
        .eq("reference", data.reference);
    }

    return { status: "success" as const, amountNGN, productId, productName, email };
  });
