import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

 type Account = {
  id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  channels: string[];
};

type Props = {
  reason: "primary_payment_unavailable" | "customer_requested_manual" | "no_online_payment_method";
  orderReference: string;
  sku: string;
  productName: string;
  amountNgn: number;
  quantity: number;
  userId?: string | null;
  email: string;
  onClose?: () => void;
};

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  deposit: "Cash / bank deposit",
  slip: "Payment slip / teller",
  remittance: "Remittance",
  whatsapp: "WhatsApp payment assistance",
};

export function CustomPayFallback(props: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [method, setMethod] = useState("bank_transfer");
  const [accountId, setAccountId] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/checkout/custom-pay?reason=${encodeURIComponent(props.reason)}`, { cache: "no-store" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok || !body.enabled) throw new Error(body.error || "Manual payment is unavailable.");
        if (!cancelled) {
          setAccounts(body.accounts ?? []);
          const first = body.accounts?.[0]?.id ?? "";
          setAccountId(first);
        }
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Manual payment unavailable"))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [props.reason]);

  const eligibleAccounts = useMemo(
    () => accounts.filter((account) => account.channels.includes(method)),
    [accounts, method],
  );

  useEffect(() => {
    if (!eligibleAccounts.some((account) => account.id === accountId)) {
      setAccountId(eligibleAccounts[0]?.id ?? "");
    }
  }, [eligibleAccounts, accountId]);

  const selected = eligibleAccounts.find((account) => account.id === accountId);

  async function submit() {
    if (!selected) return toast.error("Select a payment account.");
    setBusy(true);
    try {
      const response = await fetch("/api/checkout/custom-pay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderReference: props.orderReference,
          sku: props.sku,
          productName: props.productName,
          quantity: props.quantity,
          userId: props.userId ?? null,
          customerEmail: props.email,
          customerPhone: phone || null,
          amountNgn: props.amountNgn,
          method,
          accountId: selected.id,
          evidenceUrl: evidenceUrl || null,
          customerNote: note || null,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not submit payment request.");
      toast.success("Manual payment request recorded. We will verify it before fulfillment.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit payment request.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="mt-4 rounded-lg border border-gold/15 p-4 text-sm text-muted-foreground">Loading alternative payment options…</div>;

  return (
    <div className="mt-4 rounded-lg border border-gold/20 bg-background/60 p-4 space-y-4" aria-label="Alternative payment">
      <div>
        <div className="text-telemetry">// CUSTOM PAY™ · FALLBACK</div>
        <p className="mt-1 text-sm text-muted-foreground">
          For customers who cannot complete online payment or prefer direct transfer, deposit, remittance, or WhatsApp assistance.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(METHOD_LABELS).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMethod(value)}
            className={`rounded border px-3 py-2 text-left text-xs font-mono transition ${method === value ? "border-gold bg-gold/10" : "border-gold/15 hover:border-gold/40"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-xs font-mono">
        <span className="text-telemetry">PAYMENT ACCOUNT</span>
        <select value={accountId} onChange={(event) => setAccountId(event.target.value)} className="mt-2 w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-sm">
          {eligibleAccounts.map((account) => <option key={account.id} value={account.id}>{account.bank_name} · {account.account_name}</option>)}
        </select>
      </label>

      {selected && (
        <div className="rounded border border-gold/15 p-3 text-sm space-y-1">
          <div><span className="text-muted-foreground">Account name:</span> {selected.account_name}</div>
          <div><span className="text-muted-foreground">Bank / wallet:</span> {selected.bank_name}</div>
          <div><span className="text-muted-foreground">Account number:</span> <span className="font-mono">{selected.account_number}</span></div>
          <div className="pt-2 text-xs text-muted-foreground">Amount: ₦{props.amountNgn.toLocaleString()}</div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="WhatsApp / phone (optional)" className="rounded border border-gold/20 bg-background px-3 py-2.5 text-sm" />
        <input value={evidenceUrl} onChange={(event) => setEvidenceUrl(event.target.value)} placeholder="Evidence URL (optional)" className="rounded border border-gold/20 bg-background px-3 py-2.5 text-sm" />
      </div>
      <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Payment note / remittance details (optional)" className="min-h-20 w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-sm" />

      <button type="button" disabled={busy || !selected} onClick={submit} className="w-full rounded bg-gold px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">
        {busy ? "Recording…" : "I’ll Pay This Way"}
      </button>
      <p className="text-[10px] text-muted-foreground">Payment remains pending until ResoFit verifies the transfer/evidence. No paid entitlement is granted automatically.</p>
      {props.onClose && <button type="button" onClick={props.onClose} className="w-full text-xs text-muted-foreground hover:text-foreground">Close alternative payment</button>}
    </div>
  );
}
