import { createContext, useContext, useState, type ReactNode } from "react";
import type { Currency } from "./types";

// Static FX placeholder. TODO: replace with live rate via server fn.
const NGN_PER_USD = 1600;

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountNGN: number) => string;
}

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");

  const format = (amountNGN: number) => {
    if (currency === "NGN") {
      return `₦${Math.round(amountNGN).toLocaleString("en-NG")}`;
    }
    const usd = amountNGN / NGN_PER_USD;
    return `$${usd.toFixed(2)}`;
  };

  return <Ctx.Provider value={{ currency, setCurrency, format }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
