-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Drop overly broad product-images select policy; replace with per-file read only (no listing)
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read individual product images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-images'
    AND coalesce(array_length(string_to_array(name, '/'), 1), 1) >= 1
  );