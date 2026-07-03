# ResoFit AI Coach — Build Plan

The full spec (auth, dashboard, onboarding, meal engine, workout engine, habit tracker, CEO OS, AI chat, analytics, notifications, gamification, admin, payments, PWA, SEO) is **~6–8 weeks of engineering**. Building it in one turn would produce a shallow shell of every feature and burn credits. I'll ship it in focused, working phases.

The app already has: Lovable Cloud (Supabase), Paystack live, auth pages, admin panel, AI personalization function, referral wallet, attribution/analytics, TanStack Start routing, "Industrial Luxe" (obsidian + gold) theme.

I'll build ResoFit AI Coach as a namespaced module under `/chatb2k/*` reusing this foundation.

---

## Phase 1 — Foundation (this turn)

1. **DB migration**: `health_profiles`, `daily_logs` (water/calories/protein/mood/weight), `habits`, `habit_logs`, `meal_plans`, `workout_plans`, `ceo_tasks`, `ai_conversations`, `ai_messages`. All RLS-scoped to `auth.uid()`, with GRANTs.
2. **Route shell** at `src/routes/chatb2k/` (layout + sub-routes): `index` (Today dashboard), `onboarding`, `meals`, `workouts`, `habits`, `ceo`, `coach` (AI chat), `analytics`.
3. **Onboarding wizard**: multi-step form → writes `health_profiles`.
4. **Today Dashboard**: greeting, Health/Habit/CEO scores, water/calories/protein rings, quick-log actions.
5. **AI Coach chat** (`/chatb2k/coach`): streaming `useChat` → `/api/chatb2k/chat` server route calling Lovable AI (`google/gemini-3-flash-preview`) with conversation persistence. System prompt: Nigerian nutrition + fitness + CEO expert.

## Phase 2 — Engines
6. Nigerian meal generator (server fn → structured output with Nigerian food library, macros, cost NGN, shopping list, regenerate).
7. Personalized workout generator (server fn → warmup/main/cooldown, sets/reps/rest, weekly progression).
8. Habit tracker with streaks, XP, badges.

## Phase 3 — CEO OS + Analytics
9. CEO dashboard (priorities, deep work, KPIs, decision journal, weekly review).
10. Analytics page (Recharts: weight, macros, habit consistency, revenue).
11. PDF export.

## Phase 4 — Polish
12. Subscriptions via existing Paystack flow (monthly/quarterly/annual + free trial).
13. Push notifications (web push) + PWA manifest.
14. Admin extension for meal/workout template curation.
15. SEO (sitemap, robots, JSON-LD), Lighthouse pass.

---

## Technical notes

- **AI**: Lovable AI Gateway via existing `createLovableAiGatewayProvider` (no user key needed). Default `google/gemini-3-flash-preview`. Streaming chat uses AI SDK `streamText` + `useChat`.
- **Auth**: reuse `src/hooks/use-auth.tsx` + existing `/login`, `/register`; add Google + magic link + password reset via `supabase.auth`.
- **Routes**: gated under `/chatb2k/*` — since the app has no `_authenticated/` layout yet, I'll add client-side redirect to `/login` in the chatb2k layout (matches current app pattern).
- **State**: TanStack Query for reads, server functions for writes, RLS enforced.
- **Design**: reuse `glass-panel`, gold gradient, JetBrains Mono telemetry — already on-brand.

## Confirmations needed

1. Ship **Phase 1** this turn, or do you want a different starting slice (e.g., just AI Coach chat + onboarding first, skip dashboard)?
2. **Google login + magic link** — enable now, or Phase 4? (Google requires `supabase--configure_social_auth`.)
3. **Subscriptions**: monthly/quarterly/annual pricing (NGN)? Or defer until Phase 4 with placeholders?
4. Domain `resofit.fit/chatb2k` — is that a separate domain you'll point at this project, or should `/chatb2k` live inside the current `shop-resoflex.lovable.app`?

Once you confirm (or say "just go"), I'll execute Phase 1.
