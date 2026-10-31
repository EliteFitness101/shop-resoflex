# Paystack → Make webhook rotation

The previous Make webhook URL was hard-coded in this public repository. Treat that endpoint as compromised and rotate it in Make.com before restoring forwarding.

## Required production configuration

1. In Make.com, replace the old custom webhook with a newly generated webhook URL and update the scenario's trigger.
2. In Vercel, open project `shop-resoflex` → Settings → Environment Variables.
3. Add `MAKE_PAYSTACK_WEBHOOK_URL` for **Production** only, using the newly generated HTTPS Make webhook URL.
4. Redeploy the production project.
5. Verify a controlled Paystack test event reaches the new scenario. Do not paste the webhook URL into source control or chat.

Until the new value is configured, payment processing and Supabase order persistence continue; only the optional Make forwarding is skipped. The webhook now forwards a whitelist of transaction and attribution fields and does not send customer email or raw Paystack payloads.
