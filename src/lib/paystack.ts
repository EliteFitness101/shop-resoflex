// Real Paystack client: redirects to authorization_url returned by the
// server-side /transaction/initialize call.
import { initiatePaystackPayment, verifyPaystackPayment } from "./paystack.functions";
import { ensureAttribution } from "./attribution";

export interface PaystackInitInput {
  email: string;
  amountKobo: number;
  productId: string;
  productName: string;
  userId?: string | null;
  sku?: string | null;
  variant?: string | null;
  quantity?: number;
}

export async function initiatePayment(input: PaystackInitInput): Promise<{
  reference: string;
  authorizationUrl: string;
}> {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://shop-resoflex.lovable.app";
  const attribution = typeof window !== "undefined" ? ensureAttribution() : null;
  return initiatePaystackPayment({
    data: {
      ...input,
      userId: input.userId ?? null,
      callbackOrigin: origin,
      attribution: attribution
        ? {
            rsid: attribution.rsid,
            utm_source: attribution.utm_source,
            utm_medium: attribution.utm_medium,
            utm_campaign: attribution.utm_campaign,
            utm_content: attribution.utm_content,
            utm_term: attribution.utm_term,
            funnel_origin: attribution.funnel_origin,
          }
        : null,
      sku: input.sku ?? input.productId,
      quantity: input.quantity ?? 1,
    },
  });
}

export async function verifyPayment(reference: string) {
  if (!reference) return null;
  return verifyPaystackPayment({ data: { reference } });
}
