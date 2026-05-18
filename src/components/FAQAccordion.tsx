import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQ { q: string; a: string; }

export function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-gold/10 glass-panel rounded-lg">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-display font-medium">{it.q}</span>
            <ChevronDown className={`size-4 text-gold transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{it.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
