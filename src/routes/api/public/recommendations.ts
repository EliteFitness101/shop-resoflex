import { createFileRoute } from "@tanstack/react-router";

const CATALOG_BASE = (process.env.CATALOG_BASE_URL || "https://catalog.resofit.fit").replace(/\/$/, "");

export const Route = createFileRoute("/api/public/recommendations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = new URL(request.url);
        const target = new URL(`${CATALOG_BASE}/api/public/recommendations`);
        for (const key of ["goal", "category", "intent", "sku", "limit", "country"]) {
          const value = source.searchParams.get(key);
          if (value) target.searchParams.set(key, value);
        }
        const response = await fetch(target, { headers: { accept: "application/json" }, cache: "no-store" });
        const body = await response.text();
        return new Response(body, {
          status: response.status,
          headers: {
            "content-type": response.headers.get("content-type") || "application/json; charset=utf-8",
            "cache-control": "public, max-age=30, stale-while-revalidate=120",
            "access-control-allow-origin": "*",
          },
        });
      },
    },
  },
});
