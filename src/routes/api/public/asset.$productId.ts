import { createFileRoute } from "@tanstack/react-router";
import { verifyAssetToken } from "@/lib/asset-signing.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// The HMAC token is not sufficient by itself: every download also requires a
// paid order matching the product and a ready private-storage delivery job.
export const Route = createFileRoute("/api/public/asset/$productId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") ?? "";
        let payload: ReturnType<typeof verifyAssetToken>;
        try {
          payload = verifyAssetToken(token);
        } catch {
          return new Response("Asset delivery is not configured", { status: 503 });
        }
        if (!payload) return new Response("Invalid or expired download link", { status: 403 });
        if (payload.pid !== params.productId) return new Response("Token / product mismatch", { status: 403 });

        const { data: order, error: orderError } = await supabaseAdmin
          .from("orders")
          .select("reference,status,product_id")
          .eq("reference", payload.ref)
          .maybeSingle();
        if (orderError) return new Response("Order verification unavailable", { status: 503 });
        if (!order) return new Response("Order not found", { status: 404 });
        if (order.status !== "paid") return new Response("Payment is not confirmed", { status: 403 });
        if (String(order.product_id) !== payload.pid) return new Response("Order / product mismatch", { status: 403 });

        const { data: job, error: jobError } = await (supabaseAdmin as any)
          .from("digital_product_delivery_jobs")
          .select("status,output_bucket,output_path")
          .eq("payment_reference", payload.ref)
          .eq("product_sku", payload.pid)
          .maybeSingle();
        if (jobError) return new Response("Delivery status unavailable", { status: 503 });
        if (!job || job.status !== "ready" || !job.output_bucket || !job.output_path) {
          return new Response("Paid order has no ready downloadable asset; contact support with your reference", { status: 409 });
        }

        const { data: signed, error: signedError } = await supabaseAdmin.storage
          .from(job.output_bucket)
          .createSignedUrl(job.output_path, Math.max(1, payload.exp - Math.floor(Date.now() / 1000)));
        if (signedError || !signed?.signedUrl) {
          return new Response("Download signing failed", { status: 503 });
        }

        return new Response(null, {
          status: 302,
          headers: {
            Location: signed.signedUrl,
            "Cache-Control": "private, no-store",
            "Referrer-Policy": "no-referrer",
          },
        });
      },
    },
  },
});
