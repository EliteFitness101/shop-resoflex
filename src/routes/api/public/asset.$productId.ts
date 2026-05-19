import { createFileRoute } from "@tanstack/react-router";
import { verifyAssetToken } from "@/lib/asset-signing.server";
import { products } from "@/lib/mock-data";

// Public signed-URL endpoint. Verifies the HMAC token from the webhook
// (or success-page issuer), then streams the digital asset bound to the
// paid order. No auth header required — the token IS the credential.
export const Route = createFileRoute("/api/public/asset/$productId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") ?? "";

        const payload = verifyAssetToken(token);
        if (!payload) {
          return new Response("Invalid or expired download link", { status: 403 });
        }
        if (payload.pid !== params.productId) {
          return new Response("Token / product mismatch", { status: 403 });
        }

        const product = products.find((p) => p.id === payload.pid);
        const name = product?.name ?? payload.pid;

        // Placeholder asset payload — swap for real PDF / signed Storage URL
        // once Lovable Cloud + Supabase Storage are wired up.
        const body = [
          "RESOFLEX OS — DIGITAL ASSET DELIVERY",
          "====================================",
          ``,
          `Product : ${name}`,
          `Order   : ${payload.ref}`,
          `Issued  : ${new Date().toISOString()}`,
          `Expires : ${new Date(payload.exp * 1000).toISOString()}`,
          ``,
          "Thank you for joining the ResoFlex sovereign protocol.",
          "Your full program assets, meal plans and onboarding instructions",
          "will be delivered to this same secure link as they're released.",
        ].join("\n");

        const filename = `resoflex-${payload.ref}-${payload.pid}.txt`;
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "private, no-store",
          },
        });
      },
    },
  },
});
