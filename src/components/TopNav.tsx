import { Link, useRouterState } from "@tanstack/react-router";
import { CurrencySwitcher } from "./PriceTag";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/meals", label: "Meal Plans" },
  { to: "/elite", label: "Elite" },
  { to: "/agents", label: "Agents" },
  { to: "/autopilot", label: "Autopilot" },
  { to: "/wallet", label: "Wallet" },
] as const;

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-gold/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="size-7 rounded bg-gradient-gold shadow-gold grid place-items-center text-primary-foreground font-display font-black text-sm">R</span>
          <span className="font-display font-semibold tracking-tight">ResoFlex<span className="text-gold">OS</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 text-sm font-mono uppercase tracking-wider rounded transition ${
                  active ? "text-gold bg-gold/10" : "text-muted-foreground hover:text-gold"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <Link
            to="/login"
            className="hidden sm:inline-flex text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded border border-gold/30 hover:bg-gold/10 transition"
          >
            Access
          </Link>
        </div>
      </div>
    </header>
  );
}
