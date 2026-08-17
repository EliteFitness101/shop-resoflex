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

          const { data: order } = await supabaseAdmin.from("orders").select("*").eq("reference", reference).maybeSingle();
          if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
          if (order.status === "paid") return Response.json({ status: "success", order });

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

          const { data: updated, error } = await supabaseAdmin
            .from("orders")
            .update({ status: "paid", paystack_data: body.data })
            .eq("reference", reference)
            .select("*")
            .maybeSingle();
          if (error) throw new Error(error.message);

          return Response.json({ status: "success", order: updated });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Verification failed" }, { status: 400 });
        }
      },
    },
  },
});
