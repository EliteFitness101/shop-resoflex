-- Orders: block forged client inserts; only own-user rows allowed
CREATE POLICY "Users insert own orders" ON public.orders
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Product/collection mappings: scope public reads to active catalog only
DROP POLICY IF EXISTS "Anyone views mappings" ON public.product_collection_mappings;
CREATE POLICY "Anyone views active mappings" ON public.product_collection_mappings
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_collection_mappings.product_id AND p.active AND coalesce(p.status, 'active') <> 'archived' AND coalesce(p.status, 'active') <> 'draft')
    AND EXISTS (SELECT 1 FROM public.collections c WHERE c.id = product_collection_mappings.collection_id AND c.active)
  )
);