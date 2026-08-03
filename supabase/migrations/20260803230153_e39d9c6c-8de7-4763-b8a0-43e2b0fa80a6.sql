-- ============ PHASE 3: migration audit ============
CREATE TABLE IF NOT EXISTS public.migration_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name text NOT NULL,
  executed_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'success',
  error_message text
);
GRANT SELECT ON public.migration_runs TO authenticated;
GRANT ALL ON public.migration_runs TO service_role;
ALTER TABLE public.migration_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view migration_runs" ON public.migration_runs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ ROLES ============
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';

-- ============ CORE COMMERCE ============
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text NOT NULL,
  title text NOT NULL,
  size text,
  color text,
  price_ngn numeric NOT NULL DEFAULT 0,
  compare_price_ngn numeric,
  stock_qty integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sku)
);
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active variants" ON public.product_variants FOR SELECT USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage variants" ON public.product_variants FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_product_variants_touch BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  banner_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.collections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active collections" ON public.collections FOR SELECT USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage collections" ON public.collections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_collections_touch BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.product_collection_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, collection_id)
);
GRANT SELECT ON public.product_collection_mappings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_collection_mappings TO authenticated;
GRANT ALL ON public.product_collection_mappings TO service_role;
ALTER TABLE public.product_collection_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views mappings" ON public.product_collection_mappings FOR SELECT USING (true);
CREATE POLICY "Admins manage mappings" ON public.product_collection_mappings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.inventory_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  delta integer NOT NULL,
  reason text NOT NULL DEFAULT 'adjustment',
  reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inventory_ledger TO authenticated;
GRANT ALL ON public.inventory_ledger TO service_role;
ALTER TABLE public.inventory_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage inventory_ledger" ON public.inventory_ledger FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ CHECKOUT ============
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  sku text,
  variant text,
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price_ngn numeric NOT NULL DEFAULT 0,
  total_ngn numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order_items" ON public.order_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY "Admins manage order_items" ON public.order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'paystack',
  reference text NOT NULL,
  amount_ngn numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending',
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, reference)
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_payments_touch BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ ANALYTICS ============
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  rsid text,
  event_type text NOT NULL,
  path text,
  sku text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone records analytics_events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view analytics_events" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.product_view_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  rsid text,
  product_slug text NOT NULL,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.product_view_events TO anon, authenticated;
GRANT SELECT ON public.product_view_events TO authenticated;
GRANT ALL ON public.product_view_events TO service_role;
ALTER TABLE public.product_view_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone records product_view_events" ON public.product_view_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view product_view_events" ON public.product_view_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ PERSONALIZATION ============
CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sku text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  reason text,
  surface text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own recommendations" ON public.recommendations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ DIGITAL DELIVERY ============
CREATE TABLE IF NOT EXISTS public.digital_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  name text NOT NULL,
  bucket text NOT NULL DEFAULT 'digital-assets',
  storage_path text NOT NULL,
  content_type text,
  version integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.digital_assets TO authenticated;
GRANT ALL ON public.digital_assets TO service_role;
ALTER TABLE public.digital_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Entitled users view digital_assets" ON public.digital_assets FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.product_id = digital_assets.product_id AND o.user_id = auth.uid() AND o.status = 'paid'));
CREATE POLICY "Admins manage digital_assets" ON public.digital_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_digital_assets_touch BEFORE UPDATE ON public.digital_assets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.asset_download_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  asset_id uuid REFERENCES public.digital_assets(id) ON DELETE SET NULL,
  product_id text,
  order_reference text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.asset_download_logs TO authenticated;
GRANT ALL ON public.asset_download_logs TO service_role;
ALTER TABLE public.asset_download_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own download logs" ON public.asset_download_logs FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage download logs" ON public.asset_download_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_pcm_collection ON public.product_collection_mappings(collection_id);
CREATE INDEX IF NOT EXISTS idx_pcm_product ON public.product_collection_mappings(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON public.inventory_ledger(variant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_view_events_slug ON public.product_view_events(product_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_assets_product ON public.digital_assets(product_id);
CREATE INDEX IF NOT EXISTS idx_asset_download_logs_user ON public.asset_download_logs(user_id);

-- ============ PHASE 2: STORAGE POLICIES ============
CREATE POLICY "Public read product-assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-assets');
CREATE POLICY "Admins manage product-assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'product-assets' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'product-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read marketing-assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'marketing-assets');
CREATE POLICY "Admins manage marketing-assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'marketing-assets' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'marketing-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Entitled users read digital-assets" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'digital-assets' AND (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.digital_assets da
      JOIN public.orders o ON o.product_id = da.product_id
      WHERE da.storage_path = storage.objects.name AND o.user_id = auth.uid() AND o.status = 'paid')));
CREATE POLICY "Admins manage digital-assets objects" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'digital-assets' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'digital-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own uploads" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users insert own uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

INSERT INTO public.migration_runs (migration_name, status) VALUES ('v3.0.1_infrastructure_hardening', 'success');