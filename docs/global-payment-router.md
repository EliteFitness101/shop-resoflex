# ResoFit Global Payment Router

## Purpose

Provide a secure, data-driven payment routing layer for local and international customers without hardcoding a currency, payment provider, bank account, product SKU, or checkout destination into ChatB2K™.

## Priority order

1. Paystack or another verified online provider configured for the customer's country/currency.
2. Provider-supported card, bank, transfer, USSD, mobile-money or local rails.
3. Approved manual-payment fallback only when online payment is unavailable or the customer explicitly requests it.
4. Manual fallback account details are server-only and must never be exposed in public source, catalog APIs, SEO, client bundles, logs, analytics or public documentation.

## Currency routing

Currency is resolved from country, customer selection, supported merchant currencies and provider capabilities. FX rates must come from an approved exchange-rate source with timestamp, source, TTL and fail-safe behavior. Never fabricate a rate. If a currency/provider combination is unavailable, route to a verified supported rail or show a transparent unavailability state.

## Manual payment

Wire transfer, cheque, cash deposit, remittance, WhatsApp-assisted payment and other approved offline methods create a pending payment request. They never create a paid entitlement directly. Staff verification or a verified provider event is required before fulfillment.

USSD must be generated only from a real provider capability/API or official provider configuration. An account number alone is not sufficient to invent a USSD transaction code.

## Donations and tips

Donations/tips use the same payment router but a dedicated transaction intent. They must not silently convert into a product purchase. Provider, currency and receipt metadata are persisted with the transaction.

## External payment requests

PayPal, Cash App, wire, cheque and similar methods may be offered only when configured as enabled payment methods and legally/operationally supported. The system must never claim that an external rail is available unless it is configured and verified.

## Guards

- `/checkout-guard` validates session, cart, offer eligibility, currency and payment method.
- `/checkout-register` creates an idempotent pending checkout/order record.
- `/payment/*` contains server-side payment lifecycle endpoints.
- `/payment/paystack/*` contains Paystack-specific operations.
- `/payment-platform/*` is an adapter namespace; providers are selected by configuration, not by ChatB2K hardcoding.
- Webhooks are signature-verified and idempotent.
- Client-side success is never authoritative for fulfillment.

## Refunds, delivery and legal

Refund, disclaimer, delivery, delivery-zone and payment terms are policy/configuration resources linked from checkout. Physical delivery requires address/zone validation and tracking state. Digital products require entitlement issuance. Refunds require an auditable order/payment reference and must follow the published policy.

## Location

Geolocation may assist country/region detection but must not override an explicit customer country. GPS, satellite and mapping services are optional integrations and cannot be assumed to exist. Location data must be minimized and protected.

## Crypto and enterprise

Crypto/coins and enterprise settlement are disabled unless a verified provider, supported asset, compliance rules, pricing source and settlement workflow are configured. Never display a cryptocurrency payment option merely because the customer asks for crypto.

## Security

Secrets remain in server-side secret management. Public APIs expose capability metadata only. Rate limiting, CSRF/session controls, idempotency keys, audit logs and least-privilege service access are required. Payment account details are never returned from public catalog/product APIs.

## Canonical principle

ChatB2K™ supplies intent and context. The payment router supplies the currently eligible payment capability. Neither layer owns permanent product, price, currency or provider assumptions.