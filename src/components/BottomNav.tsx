import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Store, Wallet, Utensils, Shield } from "lucide-react";

const items = [
  { to: "/", label: "Base", icon: LayoutDashboard },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/meals", label: "Meals", icon: Utensils },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/agents", label: "Agents", icon: Shield },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-gold/15">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = path === it.to;
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-widest transition ${
                  active ? "text-gold" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.6} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
