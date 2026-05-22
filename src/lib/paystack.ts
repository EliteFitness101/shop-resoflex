// Real Paystack client: redirects to authorization_url returned by the
// server-side /transaction/initialize call.
import { initiatePaystackPayment, verifyPaystackPayment } from "./paystack.functions";

export interface PaystackInitInput {
  email: string;
  amountKobo: number;
  productId: string;
  productName: string;
  userId?: string | null;
}

export async function initiatePayment(input: PaystackInitInput): Promise<{
  reference: string;
  authorizationUrl: string;
}> {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://sovereign-resofit.lovable.app";
  return initiatePaystackPayment({
    data: { ...input, userId: input.userId ?? null, callbackOrigin: origin },
  });
}

export async function verifyPayment(reference: string) {
  if (!reference) return null;
  return verifyPaystackPayment({ data: { reference } });
}
