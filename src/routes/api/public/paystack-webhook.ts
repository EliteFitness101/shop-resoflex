import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { buildSignedAssetUrl } from "@/lib/asset-signing.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Real Paystack webhook. Verifies HMAC SHA512 of the raw body with
// PAYSTACK_SECRET_KEY, then persists the order and mints a signed asset URL.
// Configure: Paystack dashboard → Settings → API & Webhooks → URL:
//   https://sovereign-resofit.lovable.app/api/public/paystack-webhook
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

            const { error } = await supabaseAdmin
              .from("orders")
              .update({
                status: "paid",
                paystack_data: event.data,
                download_url: downloadUrl,
                download_expires_at: expiresAt,
                amount_ngn: amountNGN,
                customer_email: email ?? undefined,
              })
              .eq("reference", ref);

            if (error) {
              console.error("[paystack-webhook] order update failed:", error);
            } else {
              console.log(`[paystack-webhook] charge.success ref=${ref} amount=NGN${amountNGN}`);
            }
            // TODO: enqueue AI personalization once admin uploads base templates.
            break;
          }
          case "charge.failed": {
            const ref = event.data?.reference;
            if (ref) {
              await supabaseAdmin.from("orders").update({ status: "failed" }).eq("reference", ref);
            }
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
