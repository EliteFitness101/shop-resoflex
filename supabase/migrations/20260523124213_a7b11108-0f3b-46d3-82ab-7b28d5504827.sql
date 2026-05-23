
-- Products table for admin-managed assets
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  description text,
  price_ngn numeric NOT NULL DEFAULT 0,
  compare_price_ngn numeric,
  commission_pct numeric NOT NULL DEFAULT 0,
  category text,
  badge text,
  image_url text,
  hero_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (active OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_touch BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Wallet transactions ledger
CREATE TYPE public.wallet_tx_kind AS ENUM ('commission','withdrawal','adjustment','bonus');
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_ngn numeric NOT NULL,
  kind public.wallet_tx_kind NOT NULL,
  note text,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX wallet_tx_user_idx ON public.wallet_transactions(user_id, created_at DESC);
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own wallet tx" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage wallet tx" ON public.wallet_transactions FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Referral attribution
ALTER TABLE public.profiles ADD COLUMN referred_by uuid REFERENCES public.profiles(id);
CREATE INDEX profiles_referred_by_idx ON public.profiles(referred_by);
CREATE INDEX profiles_referral_code_idx ON public.profiles(referral_code);

-- Updated trigger captures referrer from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref_id uuid;
BEGIN
  IF NEW.raw_user_meta_data->>'ref_code' IS NOT NULL THEN
    SELECT id INTO ref_id FROM public.profiles WHERE referral_code = upper(NEW.raw_user_meta_data->>'ref_code') LIMIT 1;
  END IF;
  INSERT INTO public.profiles (id, email, full_name, referred_by)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ref_id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'recruit');
  RETURN NEW;
END; $$;

-- Idempotency guard for wallet credits (one commission per order)
CREATE UNIQUE INDEX wallet_tx_order_commission_unique
  ON public.wallet_transactions(order_id) WHERE kind = 'commission';
