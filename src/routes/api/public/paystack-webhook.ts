import { createFileRoute } from "@tanstack/react-router";

// Paystack webhook endpoint placeholder.
// TODO when going live:
//   1. Read raw body + `x-paystack-signature` header.
//   2. Verify HMAC SHA512 against process.env.PAYSTACK_SECRET_KEY.
//   3. On event.event === "charge.success":
//        - mark order paid in DB
//        - accrue referral commission to wallet
//        - trigger digital asset delivery email
//        - queue upsell sequence
//   4. Always respond 200 quickly; do real work async.
export const Route = createFileRoute("/api/public/paystack-webhook")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(JSON.stringify({ ok: true, scaffold: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
