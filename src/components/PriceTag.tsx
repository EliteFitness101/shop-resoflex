import { useCurrency } from "@/lib/currency";

export function PriceTag({ amountNGN, compareAtNGN, size = "md" }: {
  amountNGN: number;
  compareAtNGN?: number;
  size?: "sm" | "md" | "lg";
}) {
  const { format } = useCurrency();
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-display font-semibold text-gold ${sizes[size]}`}>{format(amountNGN)}</span>
      {compareAtNGN && (
        <span className="text-muted-foreground line-through text-xs">{format(compareAtNGN)}</span>
      )}
    </div>
  );
}

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="inline-flex rounded-md border border-gold/30 overflow-hidden text-xs font-mono">
      {(["NGN", "USD"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-2.5 py-1 transition ${
            currency === c ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-gold"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
