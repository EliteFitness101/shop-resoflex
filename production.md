# P4 Production Runbook

## Gate 1 — build
- Typecheck/build passes.
- Route tree includes all P4 API routes.
- No secret appears in client bundles.

## Gate 2 — catalog
- Exact SKU resolves from `catalog.resofit.fit`.
- Product page shows canonical name/price/value.
- Inventory/lifecycle is enforced.

## Gate 3 — routing
- Nigeria resolves to NGN + Paystack + Lagos.
- Explicit supported country selection is retained.
- Unsupported currency/provider does not silently fall back to a different customer charge.

## Gate 4 — payment
- Server resolves amount.
- Paystack reference is unique.
- Pending order is persisted before redirect.
- Verification matches amount/currency/reference.
- Signed webhook is authoritative for fulfillment.

## Gate 5 — member continuity
- Customer returns to a safe route.
- Order status is retrievable.
- Digital/physical value delivery is triggered exactly once.
- Resend/WhatsApp notifications do not expose secrets.

## Gate 6 — domain isolation
- `shop.resofit.fit` remains separate from `store.resofit.fit`.
- No DNS/domain switch is part of this change.
- Vercel source connections are not changed without an explicit instruction.

## Rollback
Rollback only the storefront deployment if the P4 build or runtime fails. Do not delete or mutate canonical catalog data to repair a frontend defect.
