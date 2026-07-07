// Lightweight Make.com webhook dispatcher. Fire-and-forget; never blocks UI.
// Also mirrors the event into our Supabase `funnel_events` table via a
// server function so we have a sovereign source of truth.
import { ensureAttribution } from "./attribution";
import { ingestFunnelEvent } from "./revenue.functions";

const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/p0c26asklninfrxhp2sw6nkdjjb19a89";

export type AnalyticsEvent =
  | "landing_view"
  | "product_view"
  | "scroll_depth_50"
  | "scroll_depth_90"
  | "cta_click"
  | "checkout_started"
  | "checkout_guard_failure"
  | "payment_success"
  | "whatsapp_click"
  | "upgrade_clicked"
  | "referral_share";

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    const attribution = ensureAttribution();
    const body = JSON.stringify({
      event,
      ts: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname,
      attribution,
      ...payload,
    });
    // Mirror to Supabase (sovereign truth) — fire-and-forget.
    void ingestFunnelEvent({
      data: {
        event_type: event,
        sku: (payload.sku as string) ?? (payload.productId as string) ?? null,
        path: window.location.pathname,
        attribution: {
          rsid: attribution.rsid,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          utm_content: attribution.utm_content,
          utm_term: attribution.utm_term,
          funnel_origin: attribution.funnel_origin,
        },
        metadata: payload,
      },
    }).catch(() => {});
    // Prefer sendBeacon so navigations don't drop the event.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(MAKE_WEBHOOK_URL, blob);
      return;
    }
    void fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "no-cors",
    }).catch(() => {});
  } catch {
    // analytics never throws
  }
}

// Attach scroll-depth listeners on the landing page once.
export function attachScrollDepthTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  const fired = new Set<number>();
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop + window.innerHeight) / h.scrollHeight;
    if (scrolled >= 0.5 && !fired.has(50)) { fired.add(50); track("scroll_depth_50"); }
    if (scrolled >= 0.9 && !fired.has(90)) { fired.add(90); track("scroll_depth_90"); }
    if (fired.size >= 2) window.removeEventListener("scroll", onScroll);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
