# ResoFlex Commerce — `store.resofit.fit`

This repository is the **separate store experience** for ResoFit. It must remain distinct from `shop.resofit.fit` while consuming the same canonical ResoCatalog commerce contracts.

## Production topology

`store.resofit.fit` → Vercel project `shop-resoflex` → `EliteFitness101/shop-resoflex` → canonical `catalog.resofit.fit` → Supabase commerce ledger → Paystack → fulfillment/value delivery.

`shop.resofit.fit` is a separate storefront/application. Do not merge, alias, redirect, or replace the two domains as part of normal feature work.

## Canonical catalog

`catalog.resofit.fit` is authoritative for:

- SKU and handle
- product identity and description
- price and compare-at price
- inventory/lifecycle state
- delivery type/value deliverables
- images/assets
- bundles/collections
- recommendations
- country → currency → gateway → fulfillment routing

Local data is a UI/cache fallback only and must never override canonical production price or availability.

## ChatB2K commerce contract

ChatB2K™ may hand off an exact canonical SKU/handle based on visitor intent. The store must resolve that SKU through the catalog before checkout. It must not replace an exact recommendation with the generic shop homepage.

## Payment security

The browser supplies customer identity, SKU and quantity. The server resolves the product and amount from the canonical catalog, persists the pending order, initializes Paystack, verifies the transaction server-side, and relies on the signed webhook/payment ledger for fulfillment. A client-supplied amount is never trusted.

Paystack is the active Nigeria route. Other gateways remain inactive until independently enabled and tested. Paystack supports international cards and Nigeria can receive USD when the merchant account is enabled for that currency; otherwise the safe default remains NGN. citeturn0search0turn0search8

## Lovable two-way development

Lovable remains part of the development loop. Do **not** remove `.lovable` integration or Lovable-related workflow solely to simplify deployment.

## Required ecosystem continuity

Preserve attribution, anonymous/member identity, funnel origin, recommended SKU, safe return URL, transaction reference and order status across the ResoFit → ChatB2K → store → payment → delivery journey.

## P4 APIs

- `/api/public/catalog/:sku`
- `/api/public/commerce/context`
- `/api/public/recommendations`
- `/api/checkout/initiate`
- `/api/checkout/verify`

## Documentation

- `plan.md` — advanced architecture/implementation plan
- `integration.md` — cross-system contract
- `production.md` — production gate and rollback runbook
