import { GoldButton } from "@/components/GoldButton";
import { ArrowDown } from "lucide-react";

interface RouteHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

export function RouteHero({ eyebrow, title, subtitle, ctaLabel, ctaHref, image }: RouteHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-gold/15 bg-[#060607]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060607] via-[#060607]/85 to-[#060607]/30" aria-hidden />
      <div className="absolute inset-0 telemetry-grid opacity-20 mix-blend-overlay" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <div className="text-telemetry mb-3">// {eyebrow}</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            {title}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">{subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={ctaHref}>
              <GoldButton size="lg" className="!rounded-none font-mono tracking-widest text-xs uppercase">
                {ctaLabel} <ArrowDown className="size-4 -rotate-45" />
              </GoldButton>
            </a>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold/60">SYS · LIVE</span>
          </div>
        </div>

        {/* Glass data panel */}
        <div className="hidden lg:block">
          <div className="relative bg-[#121215]/80 backdrop-blur-md border border-gold/20 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="absolute -top-px left-0 h-px w-24 bg-gold" />
            <div className="absolute -bottom-px right-0 h-px w-24 bg-gold" />
            <div className="text-telemetry mb-4">SIGNAL · {eyebrow}</div>
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gold/10 bg-black/30 p-3">
                  <div className="text-gold/60 uppercase tracking-widest text-[9px]">CH {String(i + 1).padStart(2, "0")}</div>
                  <div className="text-gold font-semibold mt-1">{(Math.random() * 99).toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
