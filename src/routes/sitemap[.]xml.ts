import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SOVEREIGN_CATALOG } from "@/lib/sovereign-catalog";
import { visibleCollections } from "@/lib/catalog-engine";

const BASE_URL = "https://store.resofit.fit";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/shop", changefreq: "daily", priority: "0.9" },
          { path: "/collections", changefreq: "weekly", priority: "0.9" },
          { path: "/tiers", changefreq: "weekly", priority: "0.8" },
          { path: "/meals", changefreq: "weekly", priority: "0.7" },
          { path: "/elite", changefreq: "monthly", priority: "0.6" },
          { path: "/ecosystem", changefreq: "monthly", priority: "0.6" },
          { path: "/chatb2k", changefreq: "weekly", priority: "0.7" },
          ...visibleCollections().map((c) => ({
            path: `/collections/${c.code}`,
            changefreq: "weekly" as const,
            priority: "0.7",
          })),
          ...SOVEREIGN_CATALOG.map((s) => ({
            path: `/products/${s.slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
