DROP POLICY IF EXISTS "Anyone records analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Anyone records product_view_events" ON public.product_view_events;

CREATE POLICY "Anon records analytics_events" ON public.analytics_events FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Users record own analytics_events" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Anon records product_view_events" ON public.product_view_events FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Users record own product_view_events" ON public.product_view_events FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());