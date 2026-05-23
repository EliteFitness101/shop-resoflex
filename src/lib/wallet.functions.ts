import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getWalletState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: txs }, { data: referrals }] = await Promise.all([
      supabase.from("profiles").select("wallet_balance_ngn, referral_code").eq("id", userId).maybeSingle(),
      supabase.from("wallet_transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      supabase.from("profiles").select("id, email, created_at").eq("referred_by", userId),
    ]);
    const all = (txs ?? []) as Array<{ amount_ngn: number; kind: string; created_at: string }>;
    const thisMonth = all
      .filter((t) => new Date(t.created_at).getMonth() === new Date().getMonth())
      .reduce((s, t) => s + Number(t.amount_ngn), 0);
    const allTime = all.reduce((s, t) => s + Number(t.amount_ngn), 0);
    return {
      balance: Number(profile?.wallet_balance_ngn ?? 0),
      referralCode: profile?.referral_code ?? "",
      thisMonth,
      allTime,
      transactions: txs ?? [],
      referralCount: referrals?.length ?? 0,
    };
  });
