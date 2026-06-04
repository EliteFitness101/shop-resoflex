import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import hzhTee from "@/assets/hzh-compression-tee.asset.json";
import hzhLong from "@/assets/hzh-longsleeve-run.asset.json";
import forzaCharcoal from "@/assets/forzafit-charcoal-tank.asset.json";
import forzaBlue from "@/assets/forzafit-blue-runner.asset.json";
import forzaGreen from "@/assets/forzafit-green-tank.asset.json";
import forzaRoyal from "@/assets/forzafit-royal-tank.asset.json";
import forzaCobalt from "@/assets/forzafit-cobalt-tank.asset.json";
import forzaOlive from "@/assets/forzafit-olive-back.asset.json";
import hzhWhite from "@/assets/hzh-white-singlet.asset.json";

const SLIDES = [
  { url: hzhTee.url,        brand: "HZH PERFORMANCE",      title: "Compression Tee",      tag: "Premium Fitness Polo" },
  { url: forzaCharcoal.url, brand: "FORZA FITNESS",        title: "Charcoal Lift Tank",   tag: "Big-Frame Athletic Cut" },
  { url: forzaBlue.url,     brand: "FORZA · RUN SERIES",   title: "Cobalt Runner",        tag: "Track-Tested" },
  { url: hzhLong.url,       brand: "RESOFLEX GEARS",       title: "All-Weather Long Sleeve", tag: "Road & Trail" },
  { url: forzaGreen.url,    brand: "FORZA FITNESS",        title: "Sage Training Tank",   tag: "Recovery Soft" },
  { url: forzaRoyal.url,    brand: "NIKE-STYLE SPORTS",    title: "Royal Sleeveless",     tag: "Rack-Ready" },
  { url: hzhWhite.url,      brand: "HZH ELITE",            title: "White Performance Singlet", tag: "Comp-Grade Vent" },
  { url: forzaCobalt.url,   brand: "FORZA · COBALT",       title: "Cobalt Cut Tank",      tag: "Gym Floor Drip" },
  { url: forzaOlive.url,    brand: "RESOFLEX GEARS",       title: "Olive Back-Cut",       tag: "Locker Room Classic" },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative border-b border-gold/10 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 pt-4 pb-4">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden glass-panel">
          {SLIDES.map((s, idx) => (
            <Link
              key={s.url}
              to="/shop"
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={idx !== i}
            >
              <img
                src={s.url}
                alt={`${s.brand} — ${s.title}`}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute left-4 right-4 sm:left-8 bottom-4 sm:bottom-8">
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gold">
                  {s.brand}
                </div>
                <div className="font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  {s.title}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.tag}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-gold" : "w-1.5 bg-gold/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
