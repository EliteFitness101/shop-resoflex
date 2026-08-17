import { createFileRoute } from "@tanstack/react-router";

const CATALOG_BASE = (process.env.CATALOG_BASE_URL || "https://catalog.resofit.fit").replace(/\/$/, "");

export const Route = createFileRoute("/api/public/catalog/$sku")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const response = await fetch(`${CATALOG_BASE}/api/public/products/${encodeURIComponent(params.sku)}`, {
          headers: { accept: "application/json" },
          cache: "no-store",
        });
        const body = await response.text();
        return new Response(body, {
          status: response.status,
          headers: {
            "content-type": response.headers.get("content-type") || "application/json; charset=utf-8",
            "cache-control": "public, max-age=60, stale-while-revalidate=300",
            "access-control-allow-origin": "*",
          },
        });
      },
    },
  },
});
