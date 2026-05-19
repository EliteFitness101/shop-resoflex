import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { buildSignedAssetUrl } from "@/lib/asset-signing.server";

// Real Paystack webhook endpoint.
// Verifies HMAC SHA512 of the raw body against PAYSTACK_SECRET_KEY,
// matching the signature Paystack sends in `x-paystack-signature`.
//
// Reference: https://paystack.com/docs/payments/webhooks
//
// We respond 200 fast on every verified event and log the event payload.
// Persistence (orders, referral commission, asset delivery) is deferred
// until Lovable Cloud is enabled — TODOs marked inline.
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
        if (!signature) {
          return new Response("Missing signature", { status: 401 });
        }

        // Must verify against the raw body, byte-for-byte.
        const rawBody = await request.text();
        const expected = createHmac("sha512", secret).update(rawBody).digest("hex");

        const sigBuf = Buffer.from(signature, "hex");
        const expBuf = Buffer.from(expected, "hex");
        if (
          sigBuf.length !== expBuf.length ||
          !timingSafeEqual(sigBuf, expBuf)
        ) {
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

        // Acknowledge fast, process async-style (no DB yet).
        switch (event.event) {
          case "charge.success": {
            const ref = event.data?.reference ?? "";
            const amountNGN = (event.data?.amount ?? 0) / 100;
            const email = event.data?.customer?.email;
            const productId =
              (event.data?.metadata?.productId as string | undefined) ??
              (event.data?.metadata?.product_id as string | undefined) ??
              "unknown";

            // Mint signed digital-asset download URL bound to this order.
            // 7-day expiry; HMAC-signed so it's tamper-proof without a DB.
            const host = request.headers.get("host") ?? "";
            const proto = request.headers.get("x-forwarded-proto") ?? "https";
            const origin = `${proto}://${host}`;
            const downloadUrl = buildSignedAssetUrl(origin, ref, productId);

            console.log(
              `[paystack-webhook] charge.success ref=${ref} amount=NGN${amountNGN} email=${email} pid=${productId} url=${downloadUrl}`,
            );
            // TODO (Lovable Cloud phase):
            //   - upsert order row (status=paid, downloadUrl, expiresAt)
            //   - accrue referral commission to wallet
            //   - email `downloadUrl` to `email` via Resend
            //   - enqueue upsell sequence
            break;
          }
          case "charge.failed": {
            console.log(`[paystack-webhook] charge.failed ref=${event.data?.reference}`);
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
