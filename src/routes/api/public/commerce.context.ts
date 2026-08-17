import { createFileRoute } from "@tanstack/react-router";

const CATALOG_BASE = (process.env.CATALOG_BASE_URL || "https://catalog.resofit.fit").replace(/\/$/, "");

export const Route = createFileRoute("/api/public/commerce/context")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = new URL(request.url);
        const target = new URL(`${CATALOG_BASE}/api/public/commerce/context`);
        const country = source.searchParams.get("country");
        if (country) target.searchParams.set("country", country);

        const response = await fetch(target, {
          headers: { accept: "application/json", "x-resofit-consumer": "shop-resoflex" },
          cache: "no-store",
        });
        const body = await response.text();
        return new Response(body, {
          status: response.status,
          headers: {
            "content-type": response.headers.get("content-type") || "application/json; charset=utf-8",
            "cache-control": "public, max-age=300, stale-while-revalidate=900",
            "access-control-allow-origin": "*",
          },
        });
      },
    },
  },
});
