# P4 Advanced Plan — Store + Ecosystem Commerce

## Objective
Make `store.resofit.fit` a secure, catalog-driven commerce surface while preserving its independence from `shop.resofit.fit`.

## Source of truth
`catalog.resofit.fit` owns SKU, price, inventory, lifecycle, delivery type, assets, recommendations, bundles and commerce routing. Store-local product fixtures are never authoritative.

## Customer flow
Traffic → page graph → ChatB2K™ intent → exact canonical SKU/offer → country/currency context → secure checkout → Paystack → verified webhook → order ledger → fulfillment/value delivery → `/status`/member experience → Resend/WhatsApp → cross-sell/upsell.

## Domain invariant
`shop.resofit.fit` and `store.resofit.fit` remain separate domains, projects and UX surfaces. Shared backend/catalog does not imply shared deployment or DNS.

## Currency router
Country detection is best-effort; explicit user selection and the canonical routing table take precedence. Unknown routes fail safely to the Nigeria/NGN/Paystack/Lagos default. No client-side FX constant becomes authoritative.

## Payment router
For Nigeria, Paystack is the active production route. The server resolves SKU and price from catalog, creates the pending order, initializes Paystack, verifies the transaction, and only then permits fulfillment. Unsupported currencies/providers return an unavailable route rather than silently charging in the wrong currency.

## Member continuity
Preserve safe state across every ecosystem boundary: anonymous/member ID, attribution, funnel origin, intent, recommended SKU, return path and payment reference. Never put secrets or service credentials in URLs.

## Pitch-Noir mobile commerce UX — 2026-10-16
- Keep store.resofit.fit independent from shop.resofit.fit and resolve all price, stock, images and delivery data through the canonical catalog.
- Product cards use responsive two-column mobile layouts, rounded glass panels, champagne-gold focus/hover states and restrained transforms. Product galleries use touch-native horizontal scrolling and clickable snap thumbnails.
- Dynamic product pages retain canonical SKU, price, product description, attribution and server-side checkout initialization. Do not cache checkout or customer state as immutable content.
- Use verified canonical product details for features and deliverables. Do not infer purchases, scarcity, reviews or bonuses. Email/fulfillment confirmations depend on verified webhook and entitlement events.
- Acceptance requires lint/build, mobile route tests, canonical catalog checks, and a checkout → signed webhook → order/entitlement → Resend email trace. Styling or plan changes alone do not prove production readiness.
## Payment and digital-delivery safety patch — 2026-10-16
- Paystack verification must require an existing server-created order, NGN currency, successful provider status and an exact amount match before the order can transition to paid.
- The signed webhook must verify the stored order/reference and amount, use the stored SKU rather than untrusted metadata, and be idempotent on repeated charge.success events.
- Download URLs are issued only when a paid order has a ready digital_product_delivery_jobs row with a real private-storage bucket and path. Account-entitlement products route to the ResoFit dashboard; products without a ready file or entitlement show a pending-delivery state instead of a placeholder download.
- The asset endpoint must independently verify the paid order, product/SKU match and ready delivery job before redirecting to a short-lived private-storage signed URL.
- Signing fails closed if ASSET_SIGNING_SECRET and PAYSTACK_SECRET_KEY are absent. Never ship a development signing secret or fake downloadable payload.
- Release gate: build/lint pass, test amount mismatch and unknown reference, confirm unpaid order cannot issue a link, confirm paid ready asset produces a signed URL, confirm entitlement SKU opens account access, and confirm pending SKU cannot masquerade as delivered.
