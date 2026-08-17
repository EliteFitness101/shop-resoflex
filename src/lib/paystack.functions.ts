// Secure Paystack server functions.
// The browser supplies identity + SKU only. Amount and product identity are
// resolved from the canonical ResoCatalog service on the server.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getCanonicalProduct, priceNgnMinor } from "./catalog-canonical.server";

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecret(): string {
  const s = process.env.PAYSTACK_SECRET_KEY;
  if (!s) throw new Error("PAYSTACK_SECRET_KEY not configured");
  return s;
}

const Attribution = z
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
  .nullable();

export const initiatePaystackPayment = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        email: z.string().email().max(200),
        sku: z.string().min(1).max(64),
        userId: z.string().uuid().nullable().optional(),
        callbackOrigin: z.string().url(),
        attribution: Attribution,
        variant: z.string().max(64).optional().nullable(),
        quantity: z.number().int().positive().max(99).default(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const product = await getCanonicalProduct(data.sku);
    if (!product) throw new Error("Product not found in canonical catalog");

    const amountKobo = priceNgnMinor(product, data.quantity);
    const reference = `RSFX-${crypto.randomUUID().replaceAll("-", "").slice(0, 24).toUpperCase()}`;

    // Persist the exact server-resolved commercial state before redirecting.
    const { error: insertErr } = await supabaseAdmin.from("orders").insert({
      user_id: data.userId ?? null,
      reference,
      product_id: product.sku,
      product_name: product.name,
      amount_ngn: amountKobo / 100,
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
        amount: amountKobo,
        reference,
        currency: "NGN",
        callback_url: `${data.callbackOrigin}/checkout/callback?reference=${encodeURIComponent(reference)}`,
        metadata: {
          sku: product.sku,
          productName: product.name,
          handle: product.handle ?? null,
          userId: data.userId ?? null,
          variant: data.variant ?? null,
          quantity: data.quantity,
          rsid: data.attribution?.rsid ?? null,
          utm_source: data.attribution?.utm_source ?? null,
          utm_medium: data.attribution?.utm_medium ?? null,
          utm_campaign: data.attribution?.utm_campaign ?? null,
          utm_content: data.attribution?.utm_content ?? null,
          utm_term: data.attribution?.utm_term ?? null,
          funnel_origin: data.attribution?.funnel_origin ?? "resofit",
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
      sku: product.sku,
      productName: product.name,
      amountNGN: amountKobo / 100,
      currency: "NGN",
    };
  });

export const verifyPaystackPayment = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ reference: z.string().min(4).max(128) }).parse(d))
  .handler(async ({ data }) => {
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

    const res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${getSecret()}` } },
    );
    const body = (await res.json()) as {
      status?: boolean;
      data?: {
        status: string;
        amount: number;
        currency?: string;
        customer?: { email?: string };
        metadata?: { sku?: string; productName?: string };
      };
    };
    if (!res.ok || !body.status || !body.data) return null;
    if (body.data.status !== "success" || body.data.currency !== "NGN") {
      return { status: "failed" as const };
    }

    // Payment verification remains server-side. The stored pending order is
    // the expected commercial state; never trust a client-supplied amount.
    if (order && order.status !== "paid") {
      if (Number(order.amount_ngn) * 100 !== Number(body.data.amount)) {
        return { status: "failed" as const };
      }
      await supabaseAdmin
        .from("orders")
        .update({ status: "paid", paystack_data: body.data })
        .eq("reference", data.reference);
    }

    return {
      status: "success" as const,
      amountNGN: body.data.amount / 100,
      productId: body.data.metadata?.sku ?? order?.product_id ?? "unknown",
      productName: body.data.metadata?.productName ?? order?.product_name ?? "Order",
      email: body.data.customer?.email ?? order?.customer_email ?? "",
    };
  });
