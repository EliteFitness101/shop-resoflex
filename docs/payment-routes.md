# Payment / Legal Route Contract

These routes are architectural contracts. Implement only routes supported by the current application framework and protect server operations with authentication, authorization, rate limits and idempotency.

## Public policy routes

- `/legal`
- `/payment`
- `/refund`
- `/delivery`
- `/disclaimer`
- `/privacy`
- `/terms`

## Guarded transaction routes

- `/checkout-guard`
- `/checkout-register`
- `/payment/*`
- `/payment/paystack/*`
- `/payment-platform/*`
- `/payment-request`
- `/invoice`

## Requirements

A payment request must contain an immutable internal order/payment reference, customer/session reference, intent, amount, currency, selected provider, status, timestamps and audit metadata. Provider responses are stored server-side. Public clients receive only the minimum information required to complete the transaction.

Invoice generation must use server-side order data. Refund requests must reference an existing transaction and enter a review/provider workflow; they must never be represented as an immediate refund solely because a browser requested one.

Delivery records must distinguish digital entitlement, local physical delivery and international delivery. Delivery zones and estimated timelines are configuration, not promises embedded in UI code. Tracking numbers are linked to fulfillment records and never generated from guesswork.

External rails such as PayPal, Cash App, wire, cheque, remittance and crypto are capability flags. They are hidden unless enabled, verified and legally/operationally supported.

`/.well-known/` may expose only standards-compliant public metadata such as security or service discovery documents. Never expose credentials, account numbers, secret configuration, internal provider IDs or private payment routing data there.
