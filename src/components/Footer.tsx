import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gold/10 pt-12 pb-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="size-7 rounded bg-gradient-gold grid place-items-center text-primary-foreground font-display font-black text-sm">R</span>
            <span className="font-display font-semibold">ResoFlex<span className="text-gold">OS</span></span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Sovereign performance operating system. Built in Lagos. Engineered for elite operators.
          </p>
        </div>

        {[
          { title: "Ecosystem", links: [["Shop","/shop"],["Meal Plans","/meals"],["Elite","/elite"],["Agents","/agents"]] },
          { title: "Operator", links: [["Wallet","/wallet"],["Settings","/settings"],["Login","/login"],["Register","/register"]] },
          { title: "Command", links: [["Admin","/admin"],["Blueprint","/elite"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-telemetry mb-3">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map(([label, to]) => (
                <li key={to}><Link to={to} className="text-sm text-muted-foreground hover:text-gold transition">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 pt-6 border-t border-gold/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
        <span>© {new Date().getFullYear()} ResoFlex OS™ — All operators reserved.</span>
        <span className="text-telemetry">v0.1.0 · STATUS: NOMINAL</span>
      </div>
    </footer>
  );
}
