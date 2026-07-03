// Cross-domain attribution: persists RSID + UTM + funnel_origin in localStorage.
// Safe on SSR (guards `window`). Reads UTM from current URL on first touch.

const KEY = "rsfx_attribution_v1";
const RSID_KEY = "rsfx_rsid";

export interface Attribution {
  rsid: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  funnel_origin: string | null;
  first_touch_at: string;
  last_touch_at: string;
  referrer: string | null;
}

function uid(): string {
  return `RSID-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`.toUpperCase();
}

function readUTM(url: URL) {
  const p = url.searchParams;
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
    utm_content: p.get("utm_content"),
    utm_term: p.get("utm_term"),
    funnel_origin: p.get("funnel_origin") ?? p.get("funnel") ?? null,
  };
}

export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {}
  return null;
}

export function ensureAttribution(): Attribution {
  if (typeof window === "undefined") {
    return {
      rsid: "RSID-SSR", utm_source: null, utm_medium: null, utm_campaign: null,
      utm_content: null, utm_term: null, funnel_origin: null,
      first_touch_at: new Date().toISOString(), last_touch_at: new Date().toISOString(),
      referrer: null,
    };
  }
  const now = new Date().toISOString();
  const url = new URL(window.location.href);
  const utm = readUTM(url);
  const existing = getAttribution();

  if (existing) {
    // Update last-touch + overlay any new UTM/funnel from the current URL.
    const merged: Attribution = {
      ...existing,
      last_touch_at: now,
      utm_source: utm.utm_source ?? existing.utm_source,
      utm_medium: utm.utm_medium ?? existing.utm_medium,
      utm_campaign: utm.utm_campaign ?? existing.utm_campaign,
      utm_content: utm.utm_content ?? existing.utm_content,
      utm_term: utm.utm_term ?? existing.utm_term,
      funnel_origin: utm.funnel_origin ?? existing.funnel_origin ?? "resofit",
    };
    try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {}
    return merged;
  }

  const rsid = localStorage.getItem(RSID_KEY) || uid();
  try { localStorage.setItem(RSID_KEY, rsid); } catch {}

  const fresh: Attribution = {
    rsid,
    ...utm,
    first_touch_at: now,
    last_touch_at: now,
    referrer: document.referrer || null,
  };
  try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch {}
  return fresh;
}

// Append attribution to any outbound URL (cross-domain link forwarding).
export function decorateUrl(href: string): string {
  if (typeof window === "undefined") return href;
  try {
    const a = ensureAttribution();
    const u = new URL(href, window.location.origin);
    if (a.rsid) u.searchParams.set("rsid", a.rsid);
    if (a.utm_source) u.searchParams.set("utm_source", a.utm_source);
    if (a.utm_campaign) u.searchParams.set("utm_campaign", a.utm_campaign);
    if (a.utm_medium) u.searchParams.set("utm_medium", a.utm_medium);
    if (a.funnel_origin) u.searchParams.set("funnel_origin", a.funnel_origin);
    return u.toString();
  } catch {
    return href;
  }
}
