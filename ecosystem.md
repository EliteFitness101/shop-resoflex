# ResoFlex Store Ecosystem UX Contract

Updated: 2026-10-16

## Authority and domain boundaries
- `store.resofit.fit` remains the ResoFlex native/fallback store.
- `shop.resofit.fit` remains a separate commerce surface.
- `catalog.resofit.fit` owns canonical SKU, price, inventory, lifecycle, delivery type, asset and recommendation metadata.
- UI caches and local fixtures are fallbacks only and must not override canonical price or availability.

## Product lifecycle
- Activate a draft or archived product only when the live record has a price strictly above ₦1,000, a real image and a meaningful description.
- Otherwise leave it non-active until metadata is reconciled.
- Preserve separate SKU identities and never infer stock, bonuses, ratings, purchase counts or popularity.

## Pitch-Noir Glass presentation
- Obsidian/pitch-black backgrounds, champagne-gold accents, rounded glass panels, responsive two-column mobile product cards, native touch scrolling and snap-aligned product galleries.
- Respect reduced-motion settings and use lazy-loaded, dimension-stable images with responsive delivery where the image provider supports it.
- Features, deliverables, bundles and related offers must be grounded in canonical metadata.

## Checkout, email and media caching
- Checkout resolves exact SKU/price server-side and preserves attribution and safe return state.
- Only verified payment/webhook and entitlement events may trigger receipt, fulfillment or access emails; canonical sender is `no-reply@resofit.fit`.
- Never cache checkout, payment, inventory or personalized account state as immutable media. CDN caching is for versioned assets and safe presentation data.

## Release gate
- Lint/build and mobile product-page tests must pass.
- Verify store, catalog, checkout and product routes on production domains.
- Trace checkout → signed payment webhook → order/entitlement → transactional email before declaring production-ready.
## Payment and delivery trust boundaries
- Canonical commerce amount and product SKU come from the stored order and catalog, not the browser or webhook metadata.
- A signed Paystack webhook is HMAC-verified, must match an existing pending/paid order, must be NGN and must match the expected amount before fulfillment transitions.
- Payment verification cannot authorize an arbitrary reference: the order must exist and the stored product SKU must match the requested delivery SKU.
- Private digital delivery requires a ready delivery-job record and an output bucket/path. The delivery endpoint re-checks payment state and product identity before redirecting to a signed storage URL.
- If a product is delivered through an account entitlement, send the buyer to the dashboard; if neither a ready file nor entitlement exists, show a pending-delivery message. Never return a fabricated placeholder file.
- ASSET_SIGNING_SECRET or PAYSTACK_SECRET_KEY is required for HMAC signing. No development fallback secret is allowed.
- Provider/media route state is configuration, not proof of runtime health. media.resofit.fit stays planned until R2 bucket binding, DNS/TLS, upload/read, and cache-header smoke tests pass.
