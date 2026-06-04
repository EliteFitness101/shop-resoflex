import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GoldButton } from "@/components/GoldButton";
import { listProducts, type DbProduct } from "@/lib/products.functions";
import { Ruler, ShieldCheck, Truck } from "lucide-react";
import forzaOlive from "@/assets/forzafit-olive-back.asset.json";
import forzaRoyal from "@/assets/forzafit-royal-tank.asset.json";
import forzaCobalt from "@/assets/forzafit-cobalt-tank.asset.json";
import forzaGreen from "@/assets/forzafit-green-tank.asset.json";
import forzaCharcoal from "@/assets/forzafit-charcoal-tank.asset.json";
import hzhWhite from "@/assets/hzh-white-singlet.asset.json";

const FALLBACK_GALLERY = [
  forzaOlive.url, forzaRoyal.url, forzaCobalt.url,
  forzaGreen.url, forzaCharcoal.url, hzhWhite.url,
];

// Plus-size "Elite Drip" hero + styling gallery.
export function PlusSizeHero() {
  const [gallery, setGallery] = useState<DbProduct[]>([]);

  useEffect(() => {
    listProducts()
      .then((r) => setGallery(r.products.filter((p) => p.image_url).slice(0, 6)))
      .catch(() => {});
  }, []);


  return (
    <section className="relative border-b border-gold/10">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, oklch(0.55 0.12 155 / 0.18), transparent 55%), radial-gradient(circle at 80% 90%, oklch(0.78 0.09 65 / 0.18), transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-14 md:pt-20 md:pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-telemetry mb-3 inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SIZES 3XL · 4XL · 5XL · 6XL · 7XL · 8XL
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
              Finally, original{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #10b981 0%, #E0A96D 100%)" }}
              >
                plus-size polos
              </span>{" "}
              built for elite drip.
            </h1>
            <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-xl">
              Adidas · Nike · ForzaFit. True-to-size cuts engineered for broad frames, lifters, and big-and-tall
              streetwear curators. Flat ₦12,000 per piece — bulk drops to ₦8,500 from 10 units.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop">
                <GoldButton size="lg">Shop the Collection</GoldButton>
              </Link>
              <a href="#bulk-tier">
                <GoldButton size="lg" variant="outline">
                  Bulk Pricing
                </GoldButton>
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {[
                { Icon: Ruler, l: "3XL → 8XL" },
                { Icon: ShieldCheck, l: "Original Stock" },
                { Icon: Truck, l: "24–72h NG" },
              ].map(({ Icon, l }) => (
                <div
                  key={l}
                  className="glass-panel rounded-md px-3 py-2.5 flex items-center gap-2 text-xs font-mono uppercase tracking-wider"
                >
                  <Icon className="size-3.5 text-gold" />
                  {l}
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Coached by <span className="text-gold">Buchi</span> · Styled by{" "}
              <span className="text-gold">Mavia</span>
            </p>
          </div>

          {/* Styling gallery */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => {
              const p = gallery[i];
              const fallbackUrl = FALLBACK_GALLERY[i];
              const src = p?.image_url ?? fallbackUrl;
              const alt = p?.name ?? `Elite drip ${i + 1}`;
              return (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-lg glass-panel ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.22 0.04 155 / 0.6), oklch(0.18 0.03 80 / 0.6))",
                      }}
                    >
                      <div className="absolute inset-0 telemetry-grid opacity-30" />
                    </div>
                  )}
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-widest bg-background/70 backdrop-blur px-2 py-1 rounded text-gold">
                      8XL · MUSCLE FIT
                    </span>
                  )}
                </div>
              );

            })}
          </div>
        </div>
      </div>
    </section>
  );
}
