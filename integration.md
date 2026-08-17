# P4 Integration Contract

## Canonical services

- Catalog: `catalog.resofit.fit`
- Main ecosystem: `resofit.fit`
- ChatB2K: `chatb2k.resofit.fit`
- Primary shop: `shop.resofit.fit`
- Separate store: `store.resofit.fit`
- Backend/ledger: canonical Supabase production services
- Payments: Paystack for the active Nigeria route

## Catalog APIs consumed

`GET /api/public/products/:sku` resolves exact product identity and value. `GET /api/public/recommendations` supplies intent-aware recommendations. `GET /api/public/commerce/context` supplies country, region, presentment currency, gateway and fulfillment context.

## Cross-domain contract

Every commercial handoff should preserve safe state:

- anonymous/member identifier
- attribution/UTMs
- funnel origin
- ChatB2K intent
- recommended SKU/handle
- safe return path
- transaction reference after initialization

Never transfer API keys, service-role credentials or signed secrets through query strings.

## Payment contract

The client sends SKU + quantity + customer identity. The server resolves canonical price, validates availability, creates an order, initializes Paystack, and verifies payment. The webhook/payment ledger is authoritative for paid/fulfilled state.

## Delivery contract

After verified payment, route digital or physical delivery according to the canonical product `delivery_type`, then expose the member-safe status route and configured Resend/WhatsApp notification path.

## Domain separation

Do not collapse `shop.resofit.fit` and `store.resofit.fit`. Shared catalog/payment infrastructure is intentionally different from shared frontend deployment.
