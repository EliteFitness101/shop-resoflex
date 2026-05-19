import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { buildSignedAssetUrl } from "./asset-signing.server";

// Issues a short-lived signed download URL for a paid order.
// NOTE: until the webhook persists orders (Lovable Cloud phase), we trust
// the client-supplied reference. The HMAC still ensures the resulting URL
// can't be tampered with and expires automatically.
export const issueAssetDownload = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        reference: z.string().min(4).max(128),
        productId: z.string().min(1).max(64),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const host = getRequestHeader("host") ?? "localhost";
    const proto =
      getRequestHeader("x-forwarded-proto") ??
      (host.includes("localhost") ? "http" : "https");
    const origin = `${proto}://${host}`;
    const url = buildSignedAssetUrl(origin, data.reference, data.productId);
    return { url, expiresInHours: 24 * 7 };
  });
