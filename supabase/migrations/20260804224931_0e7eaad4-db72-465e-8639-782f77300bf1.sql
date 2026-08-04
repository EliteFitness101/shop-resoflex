DROP POLICY IF EXISTS "products catalog admin write" ON public.products;
DROP POLICY IF EXISTS "variants catalog admin write" ON public.product_variants;
DROP POLICY IF EXISTS "collections catalog admin write" ON public.collections;
DROP POLICY IF EXISTS "mappings catalog admin write" ON public.product_collection_mappings;
DROP POLICY IF EXISTS "inventory ops admin write" ON public.inventory_ledger;
DROP POLICY IF EXISTS "product_assets content admin write" ON public.product_assets;
DROP POLICY IF EXISTS "catalog_sync_audit super admin read" ON public.catalog_sync_audit;

DROP FUNCTION IF EXISTS public.has_role_text(uuid, text);
DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.can_manage_catalog(uuid);
DROP FUNCTION IF EXISTS public.can_manage_content(uuid);
DROP FUNCTION IF EXISTS public.can_manage_ops(uuid);

CREATE POLICY "products catalog admin write" ON public.products FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')));

CREATE POLICY "variants catalog admin write" ON public.product_variants FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')));

CREATE POLICY "collections catalog admin write" ON public.collections FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')));

CREATE POLICY "mappings catalog admin write" ON public.product_collection_mappings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin')));

CREATE POLICY "inventory ops admin write" ON public.inventory_ledger FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','operations_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','operations_admin')));

CREATE POLICY "product_assets content admin write" ON public.product_assets FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin','content_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin','catalog_admin','content_admin')));

CREATE POLICY "catalog_sync_audit super admin read" ON public.catalog_sync_audit FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')));