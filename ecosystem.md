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