import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PAYSTACK_BASE = "https://api.paystack.co";

export const Route = createFileRoute("/api/checkout/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { reference } = z.object({ reference: z.string().min(4).max(128) }).parse(await request.json());
          if (!process.env.PAYSTACK_SECRET_KEY) throw new Error("PAYSTACK_SECRET_KEY not configured");

          const { data: order } = await supabaseAdmin.from("orders").select("reference,amount_ngn,customer_email,product_id,product_name,status").eq("reference", reference).maybeSingle();
          if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

          const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
          });
          const body = await response.json();
          if (!response.ok || !body.status || body.data?.status !== "success" || body.data?.currency !== "NGN") {
            return Response.json({ status: "failed" }, { status: 402 });
          }
          if (Number(order.amount_ngn) * 100 !== Number(body.data.amount)) {
            return Response.json({ status: "failed", error: "Verified amount mismatch" }, { status: 409 });
          }

          // This endpoint verifies the transaction for the user-facing callback,
          // but deliberately does NOT mark the order paid. The signed Paystack
          // webhook is the authoritative payment/fulfillment transition.
          return Response.json({
            status: "verified",
            fulfillmentStatus: order.status,
            reference,
            amountNGN: Number(body.data.amount) / 100,
            currency: "NGN",
            productId: order.product_id,
            productName: order.product_name,
            email: body.data.customer?.email ?? order.customer_email ?? "",
          });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Verification failed" }, { status: 400 });
        }
      },
    },
  },
});
