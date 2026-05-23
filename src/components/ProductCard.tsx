import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/types";
import { PriceTag } from "./PriceTag";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/shop/$productId"
      params={{ productId: product.slug }}
      className="group glass-panel rounded-lg overflow-hidden flex flex-col hover:shadow-gold transition-shadow"
    >
      <div
        className="aspect-[4/3] relative bg-cover bg-center"
        style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : { backgroundImage: product.imageGradient }}
      >
        {!product.imageUrl && <div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" />}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest bg-gold text-primary-foreground px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 text-telemetry">
          {product.commissionPct}% REF
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-telemetry">{product.category}</div>
        <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-gold transition">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.tagline}</p>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <PriceTag amountNGN={product.priceNGN} compareAtNGN={product.comparePriceNGN} />
          <span className="text-xs font-mono text-gold group-hover:translate-x-1 transition-transform">DEPLOY →</span>
        </div>
      </div>
    </Link>
  );
}
