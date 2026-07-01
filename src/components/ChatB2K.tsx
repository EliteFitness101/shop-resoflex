import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Sparkles, PackageSearch, Briefcase, ArrowRight, Target } from "lucide-react";
import { recommendSKU } from "@/lib/chatb2k-intent";
import type { Intent } from "@/lib/sovereign-catalog";

// Floating ChatB2K bubble — 4 cold-traffic conversion paths.
type Path = "menu" | "drops" | "track" | "bulk" | "intent";

const INTENT_OPTIONS: { intent: Intent; label: string }[] = [
  { intent: "fat-loss", label: "Cut fat" },
  { intent: "glute", label: "Grow glutes" },
  { intent: "muscle", label: "Build muscle" },
  { intent: "wellness", label: "Restore wellness" },
  { intent: "meal", label: "Fix my meals" },
  { intent: "elite", label: "Elite concierge" },
];

export function ChatB2K() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<Path>("menu");
  const [pick, setPick] = useState<{ intent: Intent; commitment: "test" | "serious" | "elite" } | null>(null);

  const recommendation = pick
    ? recommendSKU({ intent: pick.intent, commitment: pick.commitment, budgetNGN: pick.commitment === "elite" ? 200_000 : pick.commitment === "serious" ? 40_000 : 15_000 })
    : null;

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
                  <PathButton onClick={() => setPath("intent")} icon={<Target className="size-4" />} label="🎯 Match me to a protocol" sub="Intent → Paystack in 10 seconds" />
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
            {path === "intent" && (
              <PanelBody back={() => { setPath("menu"); setPick(null); }} title="🎯 Intent match">
                {!pick ? (
                  <>
                    <p className="text-muted-foreground text-xs mb-3">What are you optimizing for right now?</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {INTENT_OPTIONS.map((o) => (
                        <button
                          key={o.intent}
                          type="button"
                          onClick={() => setPick({ intent: o.intent, commitment: "serious" })}
                          className="text-left rounded border border-gold/20 hover:border-gold/50 bg-background/40 px-2.5 py-2 text-xs transition"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">// 8 SKUs · locked catalog</p>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2">// MATCH READY</div>
                    <div className="font-display font-semibold">{recommendation!.name}</div>
                    <div className="text-xs text-muted-foreground">{recommendation!.tagline}</div>
                    <div className="text-gold font-display font-bold text-lg mt-1">
                      ₦{recommendation!.priceNGN.toLocaleString()} · Tier {recommendation!.tier}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Commitment</span>
                      {(["test", "serious", "elite"] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setPick({ ...pick, commitment: c })}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border transition ${
                            pick.commitment === c ? "bg-gold border-gold text-black font-bold" : "border-gold/20 text-muted-foreground"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: recommendation!.slug }}
                      onClick={() => setOpen(false)}
                      className="block mt-4"
                    >
                      <CTA>Deploy {recommendation!.name}</CTA>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPick(null)}
                      className="mt-2 w-full text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-gold"
                    >
                      ← re-pick intent
                    </button>
                  </>
                )}
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
