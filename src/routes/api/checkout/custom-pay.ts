import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createCustomPaymentRequest, getCustomPayConfig } from "@/lib/custom-pay.server";

const RequestSchema = z.object({
  orderReference: z.string().min(3).max(120),
  sku: z.string().min(1).max(64),
  productName: z.string().min(1).max(240),
  quantity: z.number().int().positive().max(99).default(1),
  userId: z.string().uuid().nullable().optional(),
  customerName: z.string().max(160).nullable().optional(),
  customerEmail: z.string().email().max(200).nullable().optional(),
  customerPhone: z.string().max(40).nullable().optional(),
  amountNgn: z.number().positive().max(100_000_000),
  method: z.enum(["bank_transfer", "deposit", "slip", "remittance", "whatsapp", "ussd"]),
  accountId: z.string().min(3).max(100),
  evidenceUrl: z.string().url().max(2048).nullable().optional(),
  customerNote: z.string().max(2000).nullable().optional(),
});

export const Route = createFileRoute("/api/checkout/custom-pay")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const reason = url.searchParams.get("reason");
        if (!["primary_payment_unavailable", "customer_requested_manual", "no_online_payment_method"].includes(reason ?? "")) {
          return Response.json({ error: "Fallback payment is available only from an eligible checkout state." }, { status: 400 });
        }

        try {
          const config = await getCustomPayConfig();
          if (!config.enabled) return Response.json({ enabled: false });

          return Response.json({
            enabled: true,
            accounts: config.accounts,
            methods: ["bank_transfer", "deposit", "slip", "remittance", "whatsapp", "ussd"],
            notes: config.notes,
          }, {
            headers: {
              "Cache-Control": "private, no-store",
              "X-Robots-Tag": "noindex, nofollow",
            },
          });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Custom payment unavailable" }, { status: 503 });
        }
      },
      POST: async ({ request }) => {
        try {
          const data = RequestSchema.parse(await request.json());
          const created = await createCustomPaymentRequest(data);
          return Response.json({
            ok: true,
            request: created,
            message: "Payment evidence received. Your payment remains pending until ResoFit verifies it.",
          }, { status: 201 });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Custom payment request failed" }, { status: 400 });
        }
      },
    },
  },
});
