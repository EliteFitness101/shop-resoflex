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
