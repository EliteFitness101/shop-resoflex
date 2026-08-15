// PersonalizedPanel — surfaces ChatB2K scores + top recommended SKU
// in the storefront. Reuses SOVEREIGN_CATALOG. Hidden if not authed
// or no profile yet (falls back to a soft CTA into the assessment).
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Activity, Sparkles, ArrowRight, Target, Brain } from "lucide-react";
import { usePersonalization } from "@/hooks/use-personalization";
import { track } from "@/lib/analytics";
import { decorateUrl } from "@/lib/attribution";

const CHATB2K_URL = "https://chatb2k.resofit.fit";

interface Props {
  variant?: "wide" | "compact";
  surface: "home" | "shop" | "product";
}

export function PersonalizedPanel({ variant = "wide", surface }: Props) {
  const p = usePersonalization();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (p.isLoading) return;
    if (p.hasProfile && p.recommendation) {
      firedRef.current = true;
      track("recommendation_shown", {
        surface,
        sku: p.recommendation.slug,
        tier: p.recommendation.tier,
        bundleTier: p.bundleTier,
        scores: p.scores,
      });
    }
  }, [p.isLoading, p.hasProfile, p.recommendation, p.bundleTier, p.scores, surface]);

  if (p.isLoading || !p.isAuthed) return null;

  if (!p.hasProfile) {
    return (
      <div className="glass-panel rounded-xl p-4 sm:p-5 flex items-center gap-4 flex-wrap">
        <div className="size-10 rounded-md bg-gradient-gold text-primary-foreground grid place-items-center shrink-0">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1 min-w-[220px]">
          <div className="text-telemetry">// ASSESSMENT PENDING</div>
          <div className="font-display font-semibold">
            Unlock personalized recommendations.
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Take the ChatB2K assessment — we'll tune the arsenal to your goals, budget, and Nigerian meal preferences.
          </p>
        </div>
        <a
          href={decorateUrl(CHATB2K_URL)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("assessment_to_shop", { surface, direction: "shop_to_assessment" })}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-gold text-primary-foreground text-xs font-mono uppercase tracking-widest px-4 py-2.5 shadow-gold"
        >
          Take assessment <ArrowRight className="size-3.5" />
        </a>
      </div>
    );
  }

  const rec = p.recommendation!;
  const name = p.profile?.full_name?.split(" ")[0] ?? "Operator";

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div
        className="px-4 sm:px-5 py-3 flex items-center gap-3 border-b border-gold/10"
        style={{ background: "linear-gradient(135deg, oklch(0.18 0.05 155 / 0.6), oklch(0.16 0.01 80 / 0.6))" }}
      >
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <div className="text-telemetry text-emerald-400">// CHATB2K SYNC · LIVE</div>
        <div className="ml-auto text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Tier: {p.bundleTier}
        </div>
      </div>

      <div className={`p-4 sm:p-5 grid gap-4 ${variant === "wide" ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]" : ""}`}>
        {/* Scores */}
        <div>
          <div className="text-telemetry mb-2">// {name.toUpperCase()} · TODAY</div>
          <div className="grid grid-cols-3 gap-2">
            <Score icon={Activity} label="HEALTH" value={p.scores.health} />
            <Score icon={Target} label="HABIT" value={p.scores.habit} />
            <Score icon={Brain} label="CEO" value={p.scores.ceo} />
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-gold/20 bg-background/40 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-telemetry text-gold">
            <Sparkles className="size-3.5" /> MATCH READY
          </div>
          <div className="font-display font-semibold mt-1 text-base sm:text-lg">{rec.name}</div>
          <div className="text-xs text-muted-foreground">{rec.tagline}</div>
          <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
            <div className="font-display font-bold text-gold text-lg">
              {rec.priceNGN === 0 ? "FREE · Tier 0" : `₦${rec.priceNGN.toLocaleString()} · Tier ${rec.tier}`}
            </div>
            <Link
              to="/products/$slug"
              params={{ slug: rec.slug }}
              onClick={() =>
                track("recommendation_clicked", {
                  surface,
                  sku: rec.slug,
                  tier: rec.tier,
                  bundleTier: p.bundleTier,
                })
              }
              className="inline-flex items-center gap-2 rounded-md bg-gradient-gold text-primary-foreground text-xs font-mono uppercase tracking-widest px-3 py-2 shadow-gold"
            >
              Deploy <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Score({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-md border border-gold/10 bg-background/30 px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
        <Icon className="size-3 text-gold" /> {label}
      </div>
      <div className="font-display font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">{value}</div>
      <div className="text-[9px] text-muted-foreground">/100</div>
    </div>
  );
}
