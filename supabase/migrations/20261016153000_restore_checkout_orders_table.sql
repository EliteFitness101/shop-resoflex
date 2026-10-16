-- Additive repair: restore the order persistence table required by the Paystack checkout flow.
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reference text UNIQUE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  amount_ngn numeric(12,2) NOT NULL CHECK (amount_ngn >= 0),
  status public.order_status NOT NULL DEFAULT 'pending',
  customer_email text NOT NULL,
  paystack_data jsonb,
  download_url text,
  download_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_ref ON public.orders(reference);

DO $$ BEGIN
  CREATE POLICY orders_select_own ON public.orders
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
