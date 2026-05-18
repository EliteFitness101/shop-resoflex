
# ResoFlex OS™ — Lean MVP Plan

A single-app, frontend-only build of all 10 pages with mock JSON data. No backend wired up — Paystack, Supabase, and Shopify are scaffolded as typed interfaces and stub functions so they can be activated later without restructuring.

## Scope (this pass)

In:
- 10 pages, mobile-first noir-and-gold design system
- Shared layout, bottom nav (mobile), top nav (desktop)
- Mock data layer for products, meal plans, referrals, orders, transactions, telemetry
- Paystack checkout flow scaffolded as a typed client stub (`initiatePayment` → fake redirect → `/checkout/callback` → success screen → asset download + upsell UI)
- Auth UI only (login/register forms post to a mock auth store; no real session)
- SEO `head()` per route, OpenGraph defaults, error & not-found boundaries

Out (deferred, noted in code with TODO markers):
- Lovable Cloud / Supabase enablement
- Real Paystack secret keys, webhook endpoint, signature verification
- Shopify storefront API calls
- Real admin auth gating
- PWA manifest + service worker (architecture-ready but not enabled)

## Routes (TanStack Start file-based)

```text
src/routes/
  __root.tsx              shell, providers, bottom nav slot
  index.tsx               Dashboard Landing (hero, scarcity banner, programs, metrics, FAQ)
  shop.tsx                Sovereign Shop (product grid, currency switcher, Paystack CTA)
  shop.$productId.tsx     Product detail
  meals.tsx               Nigerian Meal Plan Marketplace
  elite.tsx               Ecosystem Blueprint
  agents.tsx              Agent Network Terminal
  wallet.tsx              Referral Wallet Dashboard
  admin.tsx               Secure Admin Panel (telemetry, logs, threat cards)
  settings.tsx            Settings / Profile
  login.tsx               Login
  register.tsx            Register
  checkout.callback.tsx   Paystack return handler (mock)
  checkout.success.tsx    Success + asset download + upsell
```

Subdomains (`shop.`, `elite.`, `agents.`, `admin.`) map to these paths today; DNS/rewrites can be added later without code changes.

## Design system

Tokens in `src/styles.css` (oklch):
- `--background` matte black, `--foreground` warm white
- `--primary` gold `#E0A96D`, `--accent` deep gold `#C5A059`
- `--gradient-tactical`, `--shadow-gold`, `--glass-panel` (backdrop-blur + 1px gold border)
- Mono font for telemetry labels (JetBrains Mono), display font for headings (Sora or Bebas), Inter body

Shared components in `src/components/`:
- `TacticalPanel`, `GlassCard`, `TelemetryLabel`, `GoldButton`, `ScarcityBanner`
- `BottomNav` (mobile-only), `TopNav` (desktop), `Footer`
- `ProductCard`, `MealPlanCard`, `ReferralStatCard`, `FAQAccordion`
- `PriceTag` (handles NGN/USD via currency context)

## Data & integration scaffolding

- `src/lib/mock/` — products.json, mealPlans.json, referrals.json, telemetry.json, orders.json
- `src/lib/types.ts` — User, Product, Order, Transaction, Referral, MealPlan, Workout (mirrors planned Supabase schema)
- `src/lib/paystack.ts` — `initiatePayment({amount, email, reference})` returns a fake redirect URL; documented swap point for real Paystack init + webhook
- `src/lib/supabase.placeholder.ts` — typed interface matching the future client, all methods return mock data
- `src/lib/shopify.placeholder.ts` — same pattern for storefront API
- `src/lib/currency.tsx` — context + switcher (NGN default, USD toggle)

## Payment flow (mock, swap-ready)

1. Shop → product → "Pay with Paystack" → `paystack.initiatePayment()` → mock redirect to `/checkout/callback?reference=...`
2. Callback verifies (mocked) → routes to `/checkout/success`
3. Success page: download button for digital asset (placeholder file) + upsell card (related product / meal plan)
4. Webhook handler placeholder: a `src/routes/api/public/paystack-webhook.ts` file with signature-verification TODO and a no-op handler, so the URL exists for later activation

## Performance & quality

- Lazy-load heavy routes (`admin`, `wallet`, `elite`) via TanStack's built-in code splitting
- Skeleton loaders on every data-bound section
- `sonner` toasts, error boundaries already in `__root.tsx`
- Per-route `head()` with title, description, og:title, og:description

## Technical notes

- Framework note: the template is **TanStack Start** (React 19 + Vite + TS + Tailwind v4), not plain Vite-React. Same DX, same React code, but routing is file-based via `src/routes/` and Tailwind tokens live in `src/styles.css`. Functionally equivalent to the spec.
- **Paystack is not a Lovable built-in payment integration.** Built-ins are Paddle, Stripe, and Shopify. Per your "lean MVP, no backend wiring" choice, Paystack will be scaffolded as UI + typed stubs only. When you're ready to go live, we'll add real keys + a webhook route (Lovable Cloud strongly recommended at that point for secure secret storage).
- Hosting: Lovable. The single-app + path-based routing means you can publish today and add custom domains/subdomains via project settings later.
- Deferred but ready: Lovable Cloud (auth, DB tables for users/referrals/orders/transactions/subscriptions/meal_plans/workouts), real Paystack webhook + signature verification, Shopify storefront, admin role gating, PWA manifest.

## Suggested next phases (after MVP ships)

1. Enable Lovable Cloud → real auth + users/referrals/orders tables
2. Wire real Paystack (keys via Cloud secrets, webhook signature verification, server-fn for charge verification)
3. Admin role + RLS, replace mock telemetry with real query
4. Shopify storefront for physical product SKUs
5. PWA manifest + offline shell
