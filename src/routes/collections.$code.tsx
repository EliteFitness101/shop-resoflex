import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCollection } from "@/lib/collections";
import { filterByCollection, featuredProducts } from "@/lib/catalog-engine";
import { PriceTag } from "@/components/PriceTag";
import { TacticalPanel } from "@/components/TacticalPanel";

const BASE = "https://shop-resoflex.lovable.app";

export const Route = createFileRoute("/collections/$code")({
  loader: ({ params }) => {
    const collection = getCollection(params.code);
    if (!collection) throw notFound();
    return { collection };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Collection not found</h1>
      <Link to="/collections" className="text-gold font-mono text-xs uppercase tracking-widest mt-4 inline-block">
        → All collections
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-lg px-4 py-16 text-center text-destructive">
      Collection failed to load.
    </div>
  ),
  head: ({ params, loaderData }) => {
    const c = loaderData?.collection;
    const url = `${BASE}/collections/${params.code}`;
    return {
      meta: [
        { title: c?.seoTitle ?? "Collection — ResoFlex OS™" },
        { name: "description", content: c?.metaDescription ?? "ResoFlex OS collection." },
        { property: "og:title", content: c?.seoTitle ?? "Collection — ResoFlex OS™" },
        { property: "og:description", content: c?.metaDescription ?? "ResoFlex OS collection." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: c?.name,
            description: c?.metaDescription,
            url,
          }),
        },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const records = collection.skus.length
    ? filterByCollection(collection.code)
    : featuredProducts(8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-telemetry uppercase">// {collection.type} · {collection.code}</div>
      <h1 className="font-display text-4xl font-bold mt-2">{collection.name}</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">{collection.description}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {records.map((r) => (
          <TacticalPanel key={r.sku.slug} className="p-5 flex flex-col">
            <div className="text-telemetry uppercase">{r.category}</div>
            <h2 className="font-display text-lg font-semibold mt-1">{r.sku.name}</h2>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.sku.tagline}</p>
            <div className="mt-4 flex items-end justify-between">
              <PriceTag amountNGN={r.sku.priceNGN} />
              <Link
                to="/products/$slug"
                params={{ slug: r.sku.slug }}
                className="text-gold font-mono text-xs uppercase tracking-widest"
              >
                Deploy →
              </Link>
            </div>
          </TacticalPanel>
        ))}
      </div>

      {records.length === 0 && (
        <p className="text-muted-foreground mt-8">No products assigned to this collection yet.</p>
      )}
    </div>
  );
}
