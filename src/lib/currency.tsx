import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Currency } from "./types";

export type CommerceContext = {
  country: string;
  region: string;
  currency: Currency;
  presentmentCurrency: Currency;
  settlementCurrency: string;
  gateway: string;
  fulfillmentHub: string | null;
  displayOnly: boolean;
};

const DEFAULT_CONTEXT: CommerceContext = {
  country: "NG",
  region: "AF-NG",
  currency: "NGN",
  presentmentCurrency: "NGN",
  settlementCurrency: "NGN",
  gateway: "paystack",
  fulfillmentHub: "Lagos",
  displayOnly: false,
};

const CACHE_KEY = "rf_commerce_context_v2";

function detectCountry() {
  if (typeof window === "undefined") return "NG";
  const forced = new URL(window.location.href).searchParams.get("country");
  if (forced && /^[A-Za-z]{2}$/.test(forced)) return forced.toUpperCase();
  try {
    return new Intl.Locale(navigator.language).maximize().region?.toUpperCase() || "NG";
  } catch {
    return "NG";
  }
}

function readContext(): CommerceContext {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached?.country && cached?.currency) return cached as CommerceContext;
  } catch {}
  return DEFAULT_CONTEXT;
}

interface CurrencyCtx {
  context: CommerceContext;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountNGN: number) => string;
}

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<CommerceContext>(readContext);

  useEffect(() => {
    let cancelled = false;
    const country = detectCountry();
    fetch(`/api/public/commerce/context?country=${encodeURIComponent(country)}`, { credentials: "omit" })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (cancelled || !payload?.data?.currency) return;
        const next = payload.data as CommerceContext;
        setContext(next);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch {}
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const format = (amountNGN: number) => {
    // NGN is the authoritative catalog price. International presentment is
    // enabled only when the canonical router supplies a supported currency;
    // this layer never invents a client-side FX rate.
    if (context.currency === "NGN") {
      return `₦${Math.round(amountNGN).toLocaleString("en-NG")}`;
    }
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: context.currency,
      maximumFractionDigits: 0,
    }).format(amountNGN);
  };

  const setCurrency = (currency: Currency) => {
    setContext((current) => ({ ...current, currency, presentmentCurrency: currency }));
  };

  return <Ctx.Provider value={{ context, currency: context.currency, setCurrency, format }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
