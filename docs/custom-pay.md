# Custom Pay™ — secure fallback payment architecture

## Purpose

Custom Pay™ is a **fallback/manual payment path**, not the primary checkout rail.

Primary payment remains the configured online gateway (currently Paystack). Custom Pay appears only when:

- the online payment path is unavailable;
- the customer explicitly requests manual/direct payment; or
- the customer cannot use online payment and asks for transfer, deposit, slip, remittance, or WhatsApp assistance.

## Account-data security

Real account details are **not committed to GitHub, not placed in client code, and not included in public catalog/product APIs**.

They are stored encrypted in Supabase Vault under the secret name:

`resofit_custom_pay_accounts_v1`

A server-only `service_role` function retrieves the configuration for the checkout fallback route.

## Customer flow

```text
Primary checkout
  ↓
Paystack available?
  ├─ YES → Paystack → verified webhook → fulfillment
  └─ NO / customer requests manual
          ↓
       Custom Pay™
          ↓
       current approved account options
          ↓
       transfer / deposit / slip / remittance / WhatsApp
          ↓
       evidence / payment request
          ↓
       admin verification
          ↓
       paid entitlement + fulfillment
```

## USSD rule

A generic USSD code must **never be invented from a bank account number**. USSD is provider-specific. When an established provider integration exposes a valid USSD channel, the checkout can use that provider's generated code/session. Otherwise the customer is routed to Paystack or Custom Pay manual assistance.

## Entitlement rule

A manual payment request is always `pending_review` initially. It must never grant paid entitlement solely because the customer submitted a request or evidence URL. Admin verification is required.

## Public exposure guardrails

- `Cache-Control: private, no-store`
- `X-Robots-Tag: noindex, nofollow`
- endpoint requires an eligible checkout reason;
- endpoint is restricted to same-site checkout requests;
- account data is not part of catalog, sitemap, SEO, or product JSON-LD.

## Persistence

`custom_payment_requests` records the payment request, selected account, amount, method, evidence reference, customer contact details, verification status, and timestamps. The related `orders` row remains pending until verification.
