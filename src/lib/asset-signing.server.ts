// Signed delivery tokens are only an additional gate. The asset endpoint must
// also verify a paid order and a ready delivery job before returning any file.
import { createHmac, timingSafeEqual } from "node:crypto";

const ENC = (s: string) =>
  Buffer.from(s).toString("base64url");
const DEC = (s: string) =>
  Buffer.from(s, "base64url").toString("utf8");

function secret(): string {
  const value = process.env.ASSET_SIGNING_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!value) throw new Error("ASSET_SIGNING_SECRET or PAYSTACK_SECRET_KEY must be configured");
  return value;
}

export interface AssetTokenPayload {
  ref: string;       // paystack reference
  pid: string;       // product id
  exp: number;       // unix seconds
}

export function signAssetToken(payload: AssetTokenPayload): string {
  const body = ENC(JSON.stringify(payload));
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyAssetToken(token: string): AssetTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(DEC(body)) as AssetTokenPayload;
    if (!payload.ref || !payload.pid || !payload.exp) return null;
    if (Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function buildSignedAssetUrl(
  origin: string,
  ref: string,
  pid: string,
  ttlSeconds = 60 * 60 * 24 * 7, // 7 days
): string {
  const token = signAssetToken({
    ref,
    pid,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  });
  return `${origin}/api/public/asset/${encodeURIComponent(pid)}?token=${token}`;
}
