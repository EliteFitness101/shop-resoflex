
-- Admin manage (UPDATE/DELETE) on template buckets
CREATE POLICY "Admins update meal templates storage"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'meal-templates' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'meal-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete meal templates storage"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'meal-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update workout templates storage"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'workout-templates' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'workout-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete workout templates storage"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'workout-templates' AND public.has_role(auth.uid(), 'admin'));

-- Entitled users can read template files: must have a paid order for the product the template belongs to
CREATE POLICY "Entitled users read meal templates storage"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'meal-templates'
  AND EXISTS (
    SELECT 1
    FROM public.meal_plan_templates t
    JOIN public.orders o
      ON o.product_id = t.product_id
     AND o.user_id = auth.uid()
     AND o.status = 'paid'
    WHERE t.storage_path = storage.objects.name
  )
);

CREATE POLICY "Entitled users read workout templates storage"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'workout-templates'
  AND EXISTS (
    SELECT 1
    FROM public.workout_templates t
    JOIN public.orders o
      ON o.product_id = t.product_id
     AND o.user_id = auth.uid()
     AND o.status = 'paid'
    WHERE t.storage_path = storage.objects.name
  )
);

-- Tighten table-level reads to entitled users only (replace broad authenticated-true policies)
DROP POLICY IF EXISTS "Authenticated view meal templates" ON public.meal_plan_templates;
DROP POLICY IF EXISTS "Authenticated view workout templates" ON public.workout_templates;

CREATE POLICY "Entitled users view meal templates"
ON public.meal_plan_templates FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.product_id = meal_plan_templates.product_id
      AND o.user_id = auth.uid()
      AND o.status = 'paid'
  )
);

CREATE POLICY "Entitled users view workout templates"
ON public.workout_templates FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.product_id = workout_templates.product_id
      AND o.user_id = auth.uid()
      AND o.status = 'paid'
  )
);

-- Lock down has_role EXECUTE so authenticated/anon cannot call it directly via RPC.
-- RLS policies still invoke it server-side via the function owner.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
