import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Sparkles, PackageSearch, Briefcase, ArrowRight } from "lucide-react";

// Floating ChatB2K bubble — 3 cold-traffic conversion paths.
// Pure frontend; no tracking, no backend hits beyond standard <Link> nav.
type Path = "menu" | "drops" | "track" | "bulk";

export function ChatB2K() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<Path>("menu");

  return (
    <>
      {/* Bubble trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setPath("menu");
        }}
        aria-label={open ? "Close ChatB2K" : "Open ChatB2K"}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 size-14 rounded-full shadow-gold flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #10b981 0%, #E0A96D 100%)" }}
      >
        {open ? <X className="size-6 text-background" /> : <MessageCircle className="size-6 text-background" />}
        {!open && (
          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="ChatB2K assistant"
          className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-50 w-[88vw] max-w-sm rounded-xl glass-panel shadow-panel overflow-hidden"
        >
          <header
            className="px-4 py-3 flex items-center gap-3 border-b border-gold/10"
            style={{ background: "linear-gradient(135deg, oklch(0.18 0.05 155 / 0.8), oklch(0.16 0.01 80 / 0.8))" }}
          >
            <div className="size-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10b981, #E0A96D)" }}>
              <Sparkles className="size-4 text-background" />
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold text-sm">ChatB2K</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE · INSTANT
              </div>
            </div>
          </header>

          <div className="p-4 max-h-[60vh] overflow-y-auto text-sm">
            {path === "menu" && (
              <>
                <p className="text-muted-foreground mb-3">
                  Welcome, operator. Pick a path — I'll route you instantly.
                </p>
                <div className="space-y-2">
                  <PathButton onClick={() => setPath("drops")} icon={<Sparkles className="size-4" />} label="🔥 New Arrivals Drop Alert" sub="Latest 8XL configurations" />
                  <PathButton onClick={() => setPath("track")} icon={<PackageSearch className="size-4" />} label="📦 Track My Order" sub="Delivery status validation" />
                  <PathButton onClick={() => setPath("bulk")} icon={<Briefcase className="size-4" />} label="💼 Corporate Bulk Portal" sub="Lock 10+ piece wholesale" />
                </div>
              </>
            )}

            {path === "drops" && (
              <PanelBody back={() => setPath("menu")} title="🔥 Fresh drops">
                <p className="text-muted-foreground mb-3">
                  This week's 8XL muscle-fit polos and vests are live. Flat ₦12,000 — bulk hits ₦8,500 at 10 pieces.
                </p>
                <Link to="/shop" onClick={() => setOpen(false)}>
                  <CTA>Browse the drop</CTA>
                </Link>
              </PanelBody>
            )}

            {path === "track" && (
              <PanelBody back={() => setPath("menu")} title="📦 Track your order">
                <p className="text-muted-foreground mb-3">
                  Log in to see live delivery telemetry, Paystack receipt, and your personalized blueprint download.
                </p>
                <Link to="/wallet" onClick={() => setOpen(false)}>
                  <CTA>Open my dashboard</CTA>
                </Link>
              </PanelBody>
            )}

            {path === "bulk" && (
              <PanelBody back={() => setPath("menu")} title="💼 Corporate bulk">
                <ul className="text-muted-foreground text-xs space-y-1.5 mb-3 list-disc pl-4">
                  <li>10+ mixed pieces → ₦8,500 per unit</li>
                  <li>Mixed sizes 3XL–8XL allowed</li>
                  <li>Paid via Paystack · NGN settlement</li>
                </ul>
                <Link to="/shop" onClick={() => setOpen(false)}>
                  <CTA>Lock my wholesale tier</CTA>
                </Link>
              </PanelBody>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function PathButton({ onClick, icon, label, sub }: { onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg border border-gold/15 hover:border-gold/40 bg-background/40 px-3 py-2.5 transition flex items-center gap-3"
    >
      <span className="size-8 rounded-md bg-gold/10 text-gold flex items-center justify-center">{icon}</span>
      <span className="flex-1">
        <span className="block font-medium">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
      <ArrowRight className="size-4 text-gold/60" />
    </button>
  );
}

function PanelBody({ back, title, children }: { back: () => void; title: string; children: React.ReactNode }) {
  return (
    <div>
      <button type="button" onClick={back} className="text-[10px] font-mono uppercase tracking-widest text-gold mb-2">
        ← back
      </button>
      <div className="font-display font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex w-full justify-center items-center gap-2 rounded-md px-4 py-2.5 font-mono uppercase tracking-widest text-xs text-background"
      style={{ background: "linear-gradient(135deg, #10b981 0%, #E0A96D 100%)" }}
    >
      {children} <ArrowRight className="size-3.5" />
    </span>
  );
}
