import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type CustomPayAccount = {
  id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  channels: string[];
};

export async function getCustomPayConfig() {
  const { data, error } = await supabaseAdmin.rpc("get_custom_pay_config");
  if (error) throw new Error(`Custom payment configuration unavailable: ${error.message}`);
  const payload = (data ?? {}) as {
    enabled?: boolean;
    accounts?: CustomPayAccount[];
    display_policy?: Record<string, boolean>;
    notes?: Record<string, string>;
  };

  return {
    enabled: payload.enabled === true,
    accounts: Array.isArray(payload.accounts) ? payload.accounts : [],
    displayPolicy: payload.display_policy ?? {},
    notes: payload.notes ?? {},
  };
}

export async function createCustomPaymentRequest(input: {
  orderReference: string;
  sku: string;
  productName: string;
  quantity?: number;
  userId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  amountNgn: number;
  method: string;
  accountId: string;
  evidenceUrl?: string | null;
  customerNote?: string | null;
}) {
  const config = await getCustomPayConfig();
  if (!config.enabled) throw new Error("Custom payment fallback is disabled");

  const account = config.accounts.find((item) => item.id === input.accountId);
  if (!account) throw new Error("Invalid fallback payment account");
  if (!account.channels.includes(input.method)) throw new Error("Payment method is not available for this account");

  const quantity = Math.max(1, Math.min(99, input.quantity ?? 1));
  const { data: existingOrder } = await supabaseAdmin
    .from("orders")
    .select("reference")
    .eq("reference", input.orderReference)
    .maybeSingle();

  if (!existingOrder) {
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      user_id: input.userId ?? null,
      reference: input.orderReference,
      product_id: input.sku,
      product_name: input.productName,
      amount_ngn: input.amountNgn,
      status: "pending",
      customer_email: input.customerEmail ?? null,
    });
    if (orderError) throw new Error(`Manual order persistence failed: ${orderError.message}`);
  }

  const { data, error } = await supabaseAdmin
    .from("custom_payment_requests")
    .insert({
      order_reference: input.orderReference,
      user_id: input.userId ?? null,
      customer_name: input.customerName ?? null,
      customer_email: input.customerEmail ?? null,
      customer_phone: input.customerPhone ?? null,
      amount_ngn: input.amountNgn,
      method: input.method,
      account_id: input.accountId,
      evidence_url: input.evidenceUrl ?? null,
      customer_note: input.customerNote ?? null,
      status: "pending_review",
    })
    .select("id, order_reference, status, created_at")
    .single();

  if (error) throw new Error(`Custom payment request failed: ${error.message}`);
  return data;
}
