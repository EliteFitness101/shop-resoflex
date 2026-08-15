import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { buildSignedAssetUrl } from "@/lib/asset-signing.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/p0c26asklninfrxhp2sw6nkdjjb19a89";

async function forwardToMake(event: string, payload: Record<string, unknown>) {
  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ts: new Date().toISOString(), source: "paystack_webhook", ...payload }),
    });
  } catch (e) {
    console.error("[paystack-webhook] Make forward failed:", e);
  }
}

// Real Paystack webhook. Verifies HMAC SHA512 of the raw body with
// PAYSTACK_SECRET_KEY, then persists the order and mints a signed asset URL.
// Configure: Paystack dashboard → Settings → API & Webhooks → URL:
//   https://store.resofit.fit/api/public/paystack-webhook
export const Route = createFileRoute("/api/public/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
          console.error("[paystack-webhook] PAYSTACK_SECRET_KEY not configured");
          return new Response("Server not configured", { status: 500 });
        }

        const signature = request.headers.get("x-paystack-signature");
        if (!signature) return new Response("Missing signature", { status: 401 });

        const rawBody = await request.text();
        const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
        const sigBuf = Buffer.from(signature, "hex");
        const expBuf = Buffer.from(expected, "hex");
        if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
          console.warn("[paystack-webhook] Invalid signature");
          return new Response("Invalid signature", { status: 401 });
        }

        let event: {
          event: string;
          data?: {
            reference?: string;
            amount?: number;
            customer?: { email?: string };
            metadata?: Record<string, unknown>;
          };
        };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        switch (event.event) {
          case "charge.success": {
            const ref = event.data?.reference ?? "";
            const amountNGN = (event.data?.amount ?? 0) / 100;
            const email = event.data?.customer?.email;
            const productId =
              (event.data?.metadata?.productId as string | undefined) ??
              (event.data?.metadata?.product_id as string | undefined) ??
              "unknown";

            const host = request.headers.get("host") ?? "";
            const proto = request.headers.get("x-forwarded-proto") ?? "https";
            const origin = `${proto}://${host}`;
            const downloadUrl = buildSignedAssetUrl(origin, ref, productId);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

            const { data: updated, error } = await supabaseAdmin
              .from("orders")
              .update({
                status: "paid",
                paystack_data: event.data as unknown as Record<string, unknown> as never,
                download_url: downloadUrl,
                download_expires_at: expiresAt,
                amount_ngn: amountNGN,
                customer_email: email ?? undefined,
              })
              .eq("reference", ref)
              .select("id, user_id")
              .maybeSingle();

            if (error) {
              console.error("[paystack-webhook] order update failed:", error);
            } else {
              console.log(`[paystack-webhook] charge.success ref=${ref} amount=NGN${amountNGN}`);
            }

            // Credit referral commission to the buyer's referrer, if any.
            try {
              if (updated?.user_id) {
                const { data: buyer } = await supabaseAdmin
                  .from("profiles")
                  .select("referred_by, full_name")
                  .eq("id", updated.user_id)
                  .maybeSingle();
                if (buyer?.referred_by) {
                  const { data: prod } = await supabaseAdmin
                    .from("products")
                    .select("commission_pct, name")
                    .eq("slug", productId)
                    .maybeSingle();
                  const pct = Number(prod?.commission_pct ?? 0);
                  if (pct > 0 && amountNGN > 0) {
                    const commission = Math.round((amountNGN * pct) / 100);
                    const { error: txErr } = await supabaseAdmin
                      .from("wallet_transactions")
                      .insert({
                        user_id: buyer.referred_by,
                        amount_ngn: commission,
                        kind: "commission",
                        order_id: updated.id,
                        note: `${pct}% on ${prod?.name ?? productId}`,
                      });
                    if (!txErr) {
                      const { data: refp } = await supabaseAdmin
                        .from("profiles")
                        .select("wallet_balance_ngn")
                        .eq("id", buyer.referred_by)
                        .maybeSingle();
                      await supabaseAdmin
                        .from("profiles")
                        .update({ wallet_balance_ngn: Number(refp?.wallet_balance_ngn ?? 0) + commission })
                        .eq("id", buyer.referred_by);
                      console.log(`[paystack-webhook] credited NGN${commission} to ${buyer.referred_by}`);
                    } else if (!txErr.message.includes("duplicate")) {
                      console.error("[paystack-webhook] commission insert failed:", txErr);
                    }
                  }
                }
              }
            } catch (e) {
              console.error("[paystack-webhook] commission flow error:", e);
            }

            // Forward to Make for cross-channel attribution & automations.
            const meta = (event.data?.metadata ?? {}) as Record<string, unknown>;

            // Sovereign source of truth — Supabase revenue_events.
            try {
              await supabaseAdmin.from("revenue_events").insert({
                reference: ref,
                rsid: (meta.rsid as string) ?? null,
                sku: (meta.sku as string) ?? productId,
                variant: (meta.variant as string) ?? null,
                amount_ngn: amountNGN,
                currency: "NGN",
                utm_source: (meta.utm_source as string) ?? null,
                utm_medium: (meta.utm_medium as string) ?? null,
                utm_campaign: (meta.utm_campaign as string) ?? null,
                utm_content: (meta.utm_content as string) ?? null,
                utm_term: (meta.utm_term as string) ?? null,
                funnel_origin: (meta.funnel_origin as string) ?? "resofit",
                customer_email: email ?? null,
                raw: event.data as unknown as Record<string, unknown> as never,
              });
            } catch (e) {
              console.error("[paystack-webhook] revenue_events insert failed:", e);
            }

            await forwardToMake("payment_success", {
              reference: ref,
              amountNGN,
              email,
              productId,
              sku: meta.sku ?? productId,
              quantity: meta.quantity ?? 1,
              rsid: meta.rsid ?? null,
              utm_source: meta.utm_source ?? null,
              utm_medium: meta.utm_medium ?? null,
              utm_campaign: meta.utm_campaign ?? null,
              utm_content: meta.utm_content ?? null,
              funnel_origin: meta.funnel_origin ?? null,
            });
            break;
          }
          case "charge.failed": {
            const ref = event.data?.reference;
            if (ref) {
              await supabaseAdmin.from("orders").update({ status: "failed" }).eq("reference", ref);
            }
            const meta = (event.data?.metadata ?? {}) as Record<string, unknown>;
            await forwardToMake("payment_failed", {
              reference: ref,
              rsid: meta.rsid ?? null,
              utm_source: meta.utm_source ?? null,
              utm_campaign: meta.utm_campaign ?? null,
              funnel_origin: meta.funnel_origin ?? null,
            });
            console.log(`[paystack-webhook] charge.failed ref=${ref}`);
            break;
          }
          default:
            console.log(`[paystack-webhook] event=${event.event}`);
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
