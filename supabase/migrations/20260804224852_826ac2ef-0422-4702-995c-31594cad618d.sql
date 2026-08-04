-- ============ ROLES ============
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'catalog_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'operations_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_admin';

-- text-based role check (safe with newly added enum values in same tx)
CREATE OR REPLACE FUNCTION public.has_role_text(_user_id uuid, _role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('admin','super_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.can_manage_catalog(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('admin','super_admin','catalog_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.can_manage_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('admin','super_admin','catalog_admin','content_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.can_manage_ops(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('admin','super_admin','operations_admin')
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role_text(uuid,text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_manage_catalog(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_manage_content(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_manage_ops(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role_text(uuid,text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_manage_catalog(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_manage_content(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_manage_ops(uuid) TO authenticated, service_role;

-- ============ COLLECTIONS ============
ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'category',
  ADD COLUMN IF NOT EXISTS parent_collection text,
  ADD COLUMN IF NOT EXISTS thumbnail_image text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS open_graph_image text,
  ADD COLUMN IF NOT EXISTS shopify_collection_id text,
  ADD COLUMN IF NOT EXISTS chatb2k_priority integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured_products jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS landing_page_slug text;

-- ============ PRODUCTS ============
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS bulk_price_ngn numeric,
  ADD COLUMN IF NOT EXISTS bulk_threshold integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS hero_image_asset text,
  ADD COLUMN IF NOT EXISTS sub_assets jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS digital_product boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_shipping boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS chatb2k_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS recommendation_priority integer NOT NULL DEFAULT 0;

UPDATE public.products SET sku = upper(replace(slug, '-', '_')) WHERE sku IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_key ON public.products (sku) WHERE sku IS NOT NULL;

-- ============ VARIANTS ============
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- ============ MAPPINGS ============
ALTER TABLE public.product_collection_mappings
  ADD COLUMN IF NOT EXISTS product_sku text,
  ADD COLUMN IF NOT EXISTS collection_code text;

-- ============ PRODUCT ASSETS ============
CREATE TABLE IF NOT EXISTS public.product_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL,
  variant_sku text,
  asset_type text NOT NULL DEFAULT 'image',
  file_name text NOT NULL,
  relative_path text,
  cdn_url text,
  alt_text text,
  width integer,
  height integer,
  format text,
  file_size_kb integer,
  is_hero boolean NOT NULL DEFAULT false,
  seo_title text,
  open_graph_asset boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS product_assets_sku_idx ON public.product_assets (sku);

GRANT SELECT ON public.product_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_assets TO authenticated;
GRANT ALL ON public.product_assets TO service_role;
ALTER TABLE public.product_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_assets public read" ON public.product_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "product_assets content admin write" ON public.product_assets FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

CREATE TRIGGER trg_product_assets_touch BEFORE UPDATE ON public.product_assets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ CATALOG SYNC AUDIT ============
CREATE TABLE IF NOT EXISTS public.catalog_sync_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  entity text NOT NULL,
  action text NOT NULL,
  rows_processed integer NOT NULL DEFAULT 0,
  rows_succeeded integer NOT NULL DEFAULT 0,
  rows_failed integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ok',
  error_message text,
  performed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_sync_audit TO authenticated;
GRANT ALL ON public.catalog_sync_audit TO service_role;
ALTER TABLE public.catalog_sync_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_sync_audit super admin read" ON public.catalog_sync_audit FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============ CATALOG ADMIN WRITE POLICIES (additive) ============
CREATE POLICY "products catalog admin write" ON public.products FOR ALL TO authenticated
  USING (public.can_manage_catalog(auth.uid())) WITH CHECK (public.can_manage_catalog(auth.uid()));
CREATE POLICY "variants catalog admin write" ON public.product_variants FOR ALL TO authenticated
  USING (public.can_manage_catalog(auth.uid())) WITH CHECK (public.can_manage_catalog(auth.uid()));
CREATE POLICY "collections catalog admin write" ON public.collections FOR ALL TO authenticated
  USING (public.can_manage_catalog(auth.uid())) WITH CHECK (public.can_manage_catalog(auth.uid()));
CREATE POLICY "mappings catalog admin write" ON public.product_collection_mappings FOR ALL TO authenticated
  USING (public.can_manage_catalog(auth.uid())) WITH CHECK (public.can_manage_catalog(auth.uid()));
CREATE POLICY "inventory ops admin write" ON public.inventory_ledger FOR ALL TO authenticated
  USING (public.can_manage_ops(auth.uid())) WITH CHECK (public.can_manage_ops(auth.uid()));