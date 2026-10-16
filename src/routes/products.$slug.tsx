import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSKU } from "@/lib/sovereign-catalog";
import { GoldButton } from "@/components/GoldButton";
import { TacticalPanel } from "@/components/TacticalPanel";
import { track } from "@/lib/analytics";
import { ensureAttribution } from "@/lib/attribution";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const WHATSAPP_E164 = "2348000000000";
const CATALOG_BASE = "https://vbqjvmnhdtdhmeeudqnn.supabase.co/functions/v1/catalog-public";
const CANONICAL_SUPABASE_URL = "https://vbqjvmnhdtdhmeeudqnn.supabase.co";

type CanonicalProduct = {
  sku: string;
  handle?: string | null;
  name?: string | null;
  title?: string | null;
  body_html?: string | null;
  product_type?: string | null;
  tags?: string[] | null;
  variant_price?: number | null;
  price_ngn?: number | null;
  image_src?: string | null;
  image_url?: string | null;
  variant_inventory_qty?: number | null;
  inventory?: number | null;
};

type CanonicalAsset = {
  canonical_url?: string | null;
  role?: string | null;
  alt_text?: string | null;
  image_position?: number | null;
};

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const knownSku = getSKU(params.slug);
    const lookupKey = params.slug;
    if (!/^[A-Za-z0-9_-]{1,160}$/.test(lookupKey)) throw new Error("Invalid canonical product key");

    // Server-only secret key: never expose this in client code or loader data.
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || CANONICAL_SUPABASE_URL).replace(/\\/+$/, "");
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error("Canonical catalog server credential is not configured");
    const headers = { accept: "application/json", apikey: supabaseKey, authorization: `Bearer ${supabaseKey}` };
    const productQuery = new URLSearchParams({
      select: "id,sku,handle,title,vendor,product_type,tags,published,variant_price,variant_inventory_qty,image_src,body_html",
      published: "eq.true",
      or: `(sku.eq.${lookupKey},handle.eq.${lookupKey})`,
      limit: "1",
    });
    const productResponse = await fetch(`${supabaseUrl}/rest/v1/products?${productQuery}`, { headers, cache: "no-store" });
    if (!productResponse.ok) throw new Error(`Canonical catalog lookup failed (${productResponse.status})`);
    const productRows = await productResponse.json();
    const canonical = (Array.isArray(productRows) ? productRows[0] : null) as CanonicalProduct | undefined;
    if (!canonical) throw notFound();

    const assetQuery = new URLSearchParams({
      select: "sku,handle,canonical_url,role,image_type,image_position,alt_text,format,mime_type,width,height",
      web_ready: "eq.true",
      canonical_url: "not.is.null",
      or: `(sku.eq.${lookupKey},handle.eq.${lookupKey})`,
      order: "image_position.asc.nullsfirst",
    });
    const assetResponse = await fetch(`${supabaseUrl}/rest/v1/resofit_catalog_assets?${assetQuery}`, { headers, cache: "no-store" });
    const assetRows = assetResponse.ok ? await assetResponse.json() : [];
    const assets = (Array.isArray(assetRows) ? assetRows : []) as CanonicalAsset[];
    const images = assets.map((asset) => asset.canonical_url).filter((url): url is string => Boolean(url));
    const heroImage = images[0] ?? canonical.image_url ?? canonical.image_src ?? null;

    if (!canonical.sku || (canonical.variant_price ?? canonical.price_ngn) == null) throw new Error("Canonical product is missing a payable SKU or price");

    const sku = knownSku ?? {
      slug: canonical.handle ?? params.slug,
      name: canonical.name ?? canonical.title ?? params.slug,
      tagline: canonical.product_type ?? "Canonical catalog product",
      description: canonical.body_html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "",
      badge: canonical.tags?.[0] ?? null,
    };

    let recommendation: CanonicalProduct | null = null;
    try {
      const intent = encodeURIComponent(canonical.product_type ?? canonical.title ?? params.slug);
      const recommendationResponse = await fetch(`${CATALOG_BASE}/recommendations?intent=${intent}&limit=4`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (recommendationResponse.ok) {
        const recommendationPayload = await recommendationResponse.json();
        recommendation = ((recommendationPayload?.data ?? []) as CanonicalProduct[]).find((item) => item.sku !== canonical.sku) ?? null;
      }
    } catch {
      recommendation = null;
    }

    return { sku, canonical, images, heroImage, recommendation };
  },
  notFoundComponent: NotFoundSKU,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-telemetry">// CANONICAL SKU ROUTE ERROR</div>
        <h1 className="font-display text-2xl font-bold mt-2">Something failed.</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 text-gold font-mono uppercase text-xs tracking-widest hover:underline">Retry</button>
      </div>
    );
  },
  component: ProductRoute,
  head: ({ loaderData }) => {
    const sku = loaderData?.sku;
    const canonical = loaderData?.canonical;
    if (!sku || !canonical) return { meta: [{ title: "Product — ResoFlex OS" }] };
    const url = `https://store.resofit.fit/products/${sku.slug}`;
    const name = canonical.name ?? canonical.title ?? sku.name;
    const description = canonical.body_html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || sku.description;
    const image = loaderData.heroImage;
    const price = canonical.variant_price ?? canonical.price_ngn ?? 0;
    return {
      meta: [
        { title: `${name} — ResoFlex Sovereign OS` },
        { name: "description", content: description },
        { property: "og:title", content: name },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: name },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name, description, sku: canonical.sku, brand: { "@type": "Brand", name: "ResoFlex OS" }, ...(image ? { image: [image] } : {}), offers: { "@type": "Offer", priceCurrency: "NGN", price, availability: "https://schema.org/InStock", url } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: "https://store.resofit.fit/" }, { "@type": "ListItem", position: 2, name: "Tiers", item: "https://store.resofit.fit/tiers" }, { "@type": "ListItem", position: 3, name, item: url } ] }) },
      ],
    };
  },
});

function NotFoundSKU() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="text-telemetry">// SKU NOT IN CANONICAL CATALOG</div>
      <h1 className="font-display text-3xl font-bold mt-2">Unknown product.</h1>
      <p className="text-muted-foreground mt-2 text-sm">This route is not present in the production catalog.</p>
      <Link to="/tiers" className="inline-block mt-6"><GoldButton>See the catalog</GoldButton></Link>
    </div>
  );
}

function ProductRoute() {
  const { sku, canonical, images, heroImage, recommendation } = Route.useLoaderData();
  const [activeImage, setActiveImage] = useState<string | null>(heroImage);
  useEffect(() => setActiveImage(heroImage), [heroImage]);
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const name = canonical.name ?? canonical.title ?? sku.name;
  const description = canonical.body_html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || sku.description;
  const priceNGN = canonical.variant_price ?? canonical.price_ngn ?? 0;
  const total = priceNGN * qty;

  const checkout = async () => {
    if (priceNGN <= 0) {
      window.location.href = "/me";
      return;
    }
    if (!email.trim()) {
      window.alert("Enter your email to continue to secure Paystack checkout.");
      return;
    }
    setCheckingOut(true);
    try {
      ensureAttribution();
      const response = await fetch("/api/checkout/initiate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), sku: canonical.sku, quantity: qty, callbackOrigin: window.location.origin }),
      });
      const body = await response.json();
      if (!response.ok || !body.authorizationUrl) throw new Error(body.error || "Checkout initialization failed");
      track("checkout_started", { sku: canonical.sku, route: sku.slug, qty, amount: body.amountNGN ?? total });
      window.location.assign(body.authorizationUrl);
    } catch (error) {
      track("checkout_guard_failure", { sku: canonical.sku, reason: error instanceof Error ? error.message : "unknown" });
      window.alert(error instanceof Error ? error.message : "Checkout initialization failed");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <Link to="/tiers" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-gold">← Catalog</Link>
      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="reso-card glass-panel rounded-[1.5rem] overflow-hidden aspect-square relative bg-black/30">
          {!heroImage && <><div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, oklch(0.2 0.04 60), oklch(0.78 0.09 65))" }} /><div className="absolute inset-0 telemetry-grid opacity-40 mix-blend-overlay" /></>}
          {images.length > 1 && <div aria-label="Product image gallery" className="reso-gallery-rail absolute bottom-4 right-4 flex max-w-[80%] snap-x snap-mandatory gap-2 overflow-x-auto rounded-2xl border border-gold/20 bg-black/55 p-2 backdrop-blur-xl">{images.slice(0, 6).map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(image)} aria-label={`View product image ${index + 1}`} aria-pressed={activeImage === image} className={`shrink-0 snap-start overflow-hidden rounded-xl border ${activeImage === image ? "border-gold shadow-gold" : "border-white/20"}`}><img src={image} alt={`${name} image ${index + 1}`} className="size-12 object-cover sm:size-14" loading={index === 0 ? "eager" : "lazy"} decoding="async" /></button>)}</div>}
          <div className="absolute bottom-4 left-4"><div className="text-telemetry">// CANONICAL SKU {canonical.sku}</div>{sku.badge && <div className="text-[10px] font-mono uppercase tracking-widest text-gold mt-1">{sku.badge}</div>}</div>
        </div>

        <div className="flex flex-col gap-4">
          <div><h1 className="font-display text-3xl sm:text-4xl font-bold">{name}</h1><p className="text-muted-foreground mt-1">{sku.tagline}</p></div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="reso-card glass-panel rounded-[1.5rem] border border-gold/20 p-4 shadow-panel backdrop-blur-xl sm:p-5">
            <div className="flex items-baseline justify-between"><div className="font-display text-3xl font-bold text-gold">{priceNGN === 0 ? "FREE" : `₦${total.toLocaleString()}`}</div>{priceNGN > 0 && <div className="text-xs text-muted-foreground">₦{priceNGN.toLocaleString()} × {qty}</div>}</div>
            {priceNGN > 0 && <>
              <div className="mt-4 flex items-center gap-2"><span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Qty</span>{[1, 2, 3, 5, 10].map((n) => <button key={n} onClick={() => setQty(n)} className={`px-2.5 py-1 text-xs font-mono rounded border transition ${qty === n ? "bg-gold border-gold text-black font-bold" : "border-gold/20 text-muted-foreground hover:border-gold/50"}`}>{n}</button>)}</div>
              <label className="block mt-4"><span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Receipt email</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className="mt-1 w-full rounded border border-gold/20 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-gold/60" /></label>
            </>}
            <button type="button" disabled={checkingOut} onClick={checkout} className="mt-5 block w-full disabled:opacity-60"><GoldButton size="lg" className="w-full">{checkingOut ? "Opening Secure Checkout…" : priceNGN === 0 ? "Start My Personalized Plan" : "Secure Checkout via Paystack"}</GoldButton></button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"><ShieldCheck className="size-3 text-gold" /> {priceNGN === 0 ? "Canonical catalog · personalized funnel" : "Canonical price · server-side Paystack initialization"}</div>
          </div>
          <a href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(`ResoFlex — I want ${name} (${canonical.sku}).`)}`} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { sku: canonical.sku, source: "product_page" })} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-gold/30 text-gold hover:bg-gold/10 transition text-sm font-mono uppercase tracking-wider min-h-11"><MessageCircle className="size-4" /> Chat concierge on WhatsApp</a>
        </div>
      </div>

      {recommendation && recommendation.sku !== canonical.sku && <TacticalPanel label="CHATB2K · CANONICAL RECOMMENDATION" status="MATCHED" className="mt-8"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex-1 min-w-[240px]"><div className="flex items-center gap-2 text-telemetry text-gold"><Sparkles className="size-3.5" /> CHATB2K RECOMMENDS</div><div className="font-display font-semibold text-lg mt-1">{recommendation.title ?? recommendation.name}</div><div className="text-sm text-muted-foreground">{recommendation.product_type ?? "Personalized next-best offer"}</div><div className="font-display text-lg font-bold text-gold mt-1">₦{Number(recommendation.variant_price ?? recommendation.price_ngn ?? 0).toLocaleString()}</div></div><Link to="/products/$slug" params={{ slug: recommendation.handle ?? recommendation.sku }} onClick={() => track("bundle_recommended", { sku: canonical.sku, recommendation: recommendation.sku, surface: "product" })}><GoldButton>View recommendation <ArrowRight className="size-4" /></GoldButton></Link></div></TacticalPanel>}

      <div className="mt-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">// Canonical catalog · {images.length} verified asset URL{images.length === 1 ? "" : "s"} · Paystack server route</div>
    </div>
  );
}
