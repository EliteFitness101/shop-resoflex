import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getCanonicalProduct, priceNgnMinor } from "@/lib/catalog-canonical.server";

const PAYSTACK_BASE = "https://api.paystack.co";
const Input = z.object({
  email: z.string().email().max(200),
  sku: z.string().min(1).max(64),
  userId: z.string().uuid().nullable().optional(),
  callbackOrigin: z.string().url(),
  quantity: z.number().int().positive().max(99).default(1),
  attribution: z.record(z.string().max(128)).optional(),
});

export const Route = createFileRoute("/api/checkout/initiate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const data = Input.parse(await request.json());
          if (!process.env.PAYSTACK_SECRET_KEY) throw new Error("PAYSTACK_SECRET_KEY not configured");

          const product = await getCanonicalProduct(data.sku);
          if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
          const amountKobo = priceNgnMinor(product, data.quantity);
          const reference = `RSFX-${crypto.randomUUID().replaceAll("-", "").slice(0, 24).toUpperCase()}`;

          const { error } = await supabaseAdmin.from("orders").insert({
            user_id: data.userId ?? null,
            reference,
            product_id: product.sku,
            product_name: product.name,
            amount_ngn: amountKobo / 100,
            status: "pending",
            customer_email: data.email,
          });
          if (error) throw new Error(`Order persistence failed: ${error.message}`);

          const paystack = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
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
                quantity: data.quantity,
                attribution: data.attribution ?? null,
              },
            }),
          });
          const body = await paystack.json();
          if (!paystack.ok || !body.status || !body.data?.authorization_url) {
            throw new Error(body.message || "Paystack initialization failed");
          }

          return Response.json({
            reference: body.data.reference,
            authorizationUrl: body.data.authorization_url,
            sku: product.sku,
            productName: product.name,
            amountNGN: amountKobo / 100,
            currency: "NGN",
          });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Checkout initialization failed" }, { status: 400 });
        }
      },
    },
  },
});
