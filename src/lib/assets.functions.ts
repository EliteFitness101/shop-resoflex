import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const DASHBOARD_URL = "https://dashboard.resofit.fit";

export type AssetDeliveryResult =
  | { mode: "download"; url: string; expiresInHours: number; message: string }
  | { mode: "entitlement"; url: string; message: string }
  | { mode: "pending"; url: null; message: string };

// Only issue delivery after server-side order verification. Client-provided
// references and product IDs are selectors, never proof of payment.
export const issueAssetDownload = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      reference: z.string().min(4).max(128),
      productId: z.string().min(1).max(64),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<AssetDeliveryResult> => {
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("reference,status,product_id,product_name,customer_email")
      .eq("reference", data.reference)
      .maybeSingle();

    if (orderError) throw new Error("ORDER_LOOKUP_FAILED");
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (order.status !== "paid") throw new Error("ORDER_NOT_PAID");
    if (String(order.product_id) !== data.productId) throw new Error("ORDER_PRODUCT_MISMATCH");

    const { data: job, error: jobError } = await supabaseAdmin
      .from("digital_product_delivery_jobs")
      .select("status,product_sku,output_bucket,output_path,provenance")
      .eq("payment_reference", data.reference)
      .eq("product_sku", data.productId)
      .maybeSingle();

    if (jobError) throw new Error("DELIVERY_STATUS_LOOKUP_FAILED");

    if (job?.status === "ready" && job.output_bucket && job.output_path) {
      const { data: signed, error: signedError } = await supabaseAdmin.storage
        .from(job.output_bucket)
        .createSignedUrl(job.output_path, 60 * 60 * 24 * 7);
      if (signedError || !signed?.signedUrl) throw new Error("DELIVERY_ASSET_SIGNING_FAILED");

      return {
        mode: "download",
        url: signed.signedUrl,
        expiresInHours: 24 * 7,
        message: "Your paid download is ready. This private-storage link expires in 7 days.",
      };
    }

    const { data: entitlement, error: entitlementError } = await supabaseAdmin
      .from("resofit_entitlement_product_config")
      .select("product_sku,entitlement_key")
      .eq("product_sku", data.productId)
      .maybeSingle();

    if (entitlementError) throw new Error("ENTITLEMENT_LOOKUP_FAILED");

    const academyEntitlement =
      job?.status === "not_required" &&
      (job?.provenance as Record<string, unknown> | null)?.fulfillment_resolution === "academy_entitlement";

    if (entitlement || academyEntitlement) {
      return {
        mode: "entitlement",
        url: DASHBOARD_URL,
        message: "This purchase is delivered through your ResoFit account. Sign in with the purchase email to access your course or entitlement.",
      };
    }

    return {
      mode: "pending",
      url: null,
      message: "Payment is verified, but this SKU has no ready delivery asset or configured entitlement yet. Keep your reference and contact support; do not pay again.",
    };
  });
