// Verify a checkout URL belongs to the approved sovereign payment surface.
// Reuse-only helper — no new deps, no runtime fetches.
// Approved:
//   https://paystack.shop/pay/*
//   https://paystack.shop/resoflex
//   https://paystack.com/buy/*
//   https://start.resofit.fit/*
//   https://joy-funnel-ai.lovable.app/*   (sovereign funnel entry)

export type CheckoutUrlRejection =
  | "empty"
  | "malformed"
  | "insecure_scheme"
  | "unsupported_host"
  | "unsupported_path";

export interface CheckoutUrlOk {
  ok: true;
  url: string;
  host: string;
}
export interface CheckoutUrlErr {
  ok: false;
  reason: CheckoutUrlRejection;
  message: string;
}
export type CheckoutUrlResult = CheckoutUrlOk | CheckoutUrlErr;

const ALLOW: Array<{ host: string; prefixes: string[] }> = [
  { host: "paystack.shop", prefixes: ["/pay/", "/resoflex"] },
  { host: "paystack.com", prefixes: ["/buy/"] },
  { host: "start.resofit.fit", prefixes: ["/"] },
  { host: "joy-funnel-ai.lovable.app", prefixes: ["/"] },
];

export function verifyCheckoutUrl(raw: string | null | undefined): CheckoutUrlResult {
  if (!raw || typeof raw !== "string") {
    return { ok: false, reason: "empty", message: "Checkout URL is empty." };
  }
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false, reason: "malformed", message: `Malformed checkout URL: ${raw}` };
  }
  if (u.protocol !== "https:") {
    return { ok: false, reason: "insecure_scheme", message: `Checkout URL must be https: ${raw}` };
  }
  const host = u.hostname.toLowerCase();
  const allowed = ALLOW.find((a) => a.host === host);
  if (!allowed) {
    return { ok: false, reason: "unsupported_host", message: `Unsupported checkout host: ${host}` };
  }
  const path = u.pathname;
  const okPath = allowed.prefixes.some((p) =>
    p.endsWith("/") ? path.startsWith(p) : path === p || path.startsWith(p + "/"),
  );
  if (!okPath) {
    return {
      ok: false,
      reason: "unsupported_path",
      message: `Unsupported checkout path on ${host}: ${path}`,
    };
  }
  return { ok: true, url: raw, host };
}
