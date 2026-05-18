// Paystack client stub.
// TODO: replace with real Paystack init via server fn once Lovable Cloud
// is enabled. Real flow:
//   1. server fn calls https://api.paystack.co/transaction/initialize with secret key
//   2. returns authorization_url → client redirects
//   3. callback verifies via /transaction/verify/:reference
//   4. webhook /api/public/paystack-webhook verifies x-paystack-signature
//      (HMAC SHA512 of body with secret), then triggers asset delivery + upsell.

export interface PaystackInitInput {
  email: string;
  amountKobo: number; // NGN * 100
  productId: string;
  productName: string;
}

export interface PaystackInitResult {
  reference: string;
  authorizationUrl: string;
}

export function initiatePayment(input: PaystackInitInput): Promise<PaystackInitResult> {
  const reference = `RSFX-${Date.now().toString(36).toUpperCase()}`;

  // Persist pending intent so callback can hydrate UI.
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      `psk:${reference}`,
      JSON.stringify({ ...input, createdAt: Date.now() }),
    );
  }

  // Mock authorization URL points back to our local callback route.
  const authorizationUrl = `/checkout/callback?reference=${reference}&status=success`;

  return Promise.resolve({ reference, authorizationUrl });
}

export function verifyPayment(reference: string): Promise<{
  status: "success" | "failed";
  amountNGN: number;
  productId: string;
  productName: string;
  email: string;
} | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const raw = sessionStorage.getItem(`psk:${reference}`);
  if (!raw) return Promise.resolve(null);
  const parsed = JSON.parse(raw) as PaystackInitInput;
  return Promise.resolve({
    status: "success",
    amountNGN: parsed.amountKobo / 100,
    productId: parsed.productId,
    productName: parsed.productName,
    email: parsed.email,
  });
}
