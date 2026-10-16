import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/types";
import { PriceTag } from "./PriceTag";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="reso-card group glass-panel rounded-[1.25rem] overflow-hidden flex min-w-0 flex-col border border-gold/20 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold"
    >
      <div
        className="reso-product-media aspect-[4/3] relative overflow-hidden bg-cover bg-center"
        style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : { backgroundImage: product.imageGradient }}
      >
        {!product.imageUrl && <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest bg-gold text-primary-foreground px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        {product.commissionPct > 0 && (
          <span className="absolute top-3 right-3 text-telemetry">
            {product.commissionPct}% REF
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="text-telemetry">{product.category}</div>
        <h3 className="font-display font-semibold text-base sm:text-lg leading-tight group-hover:text-gold transition">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.tagline}</p>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <PriceTag amountNGN={product.priceNGN} compareAtNGN={product.comparePriceNGN} />
          <span className="text-xs font-mono text-gold group-hover:translate-x-1 transition-transform">DEPLOY →</span>
        </div>
      </div>
    </Link>
  );
}
