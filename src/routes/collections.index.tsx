import { createFileRoute, Link } from "@tanstack/react-router";
import { visibleCollections } from "@/lib/catalog-engine";
import { TacticalPanel } from "@/components/TacticalPanel";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/collections/")({
  component: CollectionsIndex,
  head: () => ({
    meta: [
      { title: "Collections — ResoFlex OS™ Global Commerce" },
      {
        name: "description",
        content:
          "Browse every ResoFlex OS™ collection: activewear, home gym equipment, Nigerian meal plans, digital programs, memberships and corporate wellness.",
      },
      { property: "og:title", content: "Collections — ResoFlex OS™" },
      {
        property: "og:description",
        content: "16 curated ResoFlex collections spanning apparel, equipment, digital programs and memberships.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://store.resofit.fit/collections" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://store.resofit.fit/collections" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ResoFlex OS Collections",
          hasPart: visibleCollections().map((c) => ({
            "@type": "CollectionPage",
            name: c.name,
            url: `https://store.resofit.fit/collections/${c.code}`,
          })),
        }),
      },
    ],
  }),
});

function CollectionsIndex() {
  const collections = visibleCollections();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-telemetry">// GLOBAL COMMERCE OS · COLLECTION INDEX</div>
      <h1 className="font-display text-4xl font-bold mt-2">Collections</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Every ResoFlex line — equipment, activewear, digital programs, meal architecture,
        memberships and corporate deployments.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {collections.map((c) => (
          <TacticalPanel key={c.code} className="p-5">
            <div className="text-telemetry uppercase">{c.type}</div>
            <h2 className="font-display text-xl font-semibold mt-1">{c.name}</h2>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
            <Link
              to="/collections/$code"
              params={{ code: c.code }}
              className="mt-4 inline-flex items-center gap-1.5 text-gold font-mono text-xs uppercase tracking-widest"
            >
              View collection <ArrowRight className="size-3.5" />
            </Link>
          </TacticalPanel>
        ))}
      </div>
    </div>
  );
}
