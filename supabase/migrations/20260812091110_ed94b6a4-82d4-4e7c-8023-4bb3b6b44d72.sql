-- 1. Catalog source classification (additive)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS catalog_source text NOT NULL DEFAULT 'legacy';
COMMENT ON COLUMN public.products.catalog_source IS 'legacy = unmapped pre-launch row; production = reconciled launch SKU';

UPDATE public.products SET catalog_source = 'legacy' WHERE catalog_source IS NULL;

-- 2. Deterministic upsert of the 9 canonical launch SKUs
INSERT INTO public.products
  (sku, slug, name, tagline, description, price_ngn, category, active, status,
   digital_product, requires_shipping, chatb2k_enabled, recommendation_priority, catalog_source)
VALUES
  ('RES-DIG-RESET','7-day-reset','ResoFit 7-Day Reset','Seven days to reset your metabolism','A 7-day Nigerian-food metabolic reset: jollof, ofada, swallow and soups mapped to precise macro bands with daily movement blocks.',5000,'digital',true,'published',true,false,true,90,'production'),
  ('RES-DIG-NUT','nigerian-nutrition-protocol','Nigerian Nutrition Protocol','Full macro system for Nigerian food','Swap tables, 4-week rotating menus, naira-priced shopping lists and portion visuals for Nigerian bodies and Nigerian markets.',15000,'digital',true,'published',true,false,true,85,'production'),
  ('RES-DIG-90D','90-day-metabolic-transformation','90-Day Metabolic Transformation','The full 90-day operating system','Progressive 90-day nutrition and training system with phase-based macro cycling, accountability checkpoints and Nigerian meal engineering.',45000,'digital',true,'published',true,false,true,95,'production'),
  ('RES-COACH-01','chatb2k-premium-coaching','ChatB2K Premium Coaching','1:1 AI + human coaching','Premium coaching subscription combining ChatB2K AI personalization with human review of your plan, macros and progress.',25000,'coaching',true,'published',true,false,true,80,'production'),
  ('RES-IRON-15','15kg-cast-iron-set','15kg Cast Iron Set','Home strength foundation','Cast iron plate and bar set for home strength foundations. Delivered nationwide across Nigeria.',95000,'equipment',true,'published',false,true,true,60,'production'),
  ('RES-IRON-30','30kg-cast-iron-set','30kg Cast Iron Set','Progressive load set','30kg cast iron loading set for progressive strength work at home.',165000,'equipment',true,'published',false,true,true,62,'production'),
  ('RES-IRON-50','50kg-cast-iron-set','50kg Cast Iron Set','Serious home gym load','50kg cast iron loading set for serious home lifters.',265000,'equipment',true,'published',false,true,true,64,'production'),
  ('RES-BENCH-01','adjustable-elite-bench','Adjustable Elite Bench','Commercial-grade adjustable bench','Multi-angle commercial-grade adjustable bench built for heavy pressing and full-body work.',145000,'equipment',true,'published',false,true,true,58,'production'),
  ('RES-BUNDLE-APEX','buchi-power-apex-bundle','Buchi Power Apex Bundle','The complete apex stack','The complete ResoFit apex stack: full equipment loadout plus every digital program and coaching access.',495000,'bundle',true,'published',false,true,true,99,'production')
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  price_ngn = EXCLUDED.price_ngn,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  status = EXCLUDED.status,
  digital_product = EXCLUDED.digital_product,
  requires_shipping = EXCLUDED.requires_shipping,
  chatb2k_enabled = EXCLUDED.chatb2k_enabled,
  recommendation_priority = EXCLUDED.recommendation_priority,
  catalog_source = 'production',
  updated_at = now();

-- 3. Production collections (only those the launch set actually maps into)
INSERT INTO public.collections (collection_code, name, description, sort_order, active, type, chatb2k_priority)
VALUES
  ('digital-programs','Digital Programs','Instant-download nutrition and training systems.',10,true,'category',90),
  ('coach-buchi-signature','Coach Buchi Signature','Coaching and signature programs from Coach Buchi.',20,true,'category',85),
  ('home-gym-essentials','Home Gym Essentials','Cast iron and benches for serious home training.',30,true,'category',70),
  ('vip-bundles','VIP Bundles','Complete apex stacks at bundle pricing.',40,true,'category',95)
ON CONFLICT (collection_code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  updated_at = now();

-- 4. Map only verified launch products into collections
INSERT INTO public.product_collection_mappings (product_id, collection_id, position, product_sku, collection_code)
SELECT p.id, c.id, m.pos, p.sku, c.collection_code
FROM (VALUES
  ('RES-DIG-RESET','digital-programs',1),
  ('RES-DIG-NUT','digital-programs',2),
  ('RES-DIG-90D','digital-programs',3),
  ('RES-COACH-01','coach-buchi-signature',1),
  ('RES-IRON-15','home-gym-essentials',1),
  ('RES-IRON-30','home-gym-essentials',2),
  ('RES-IRON-50','home-gym-essentials',3),
  ('RES-BENCH-01','home-gym-essentials',4),
  ('RES-BUNDLE-APEX','vip-bundles',1)
) AS m(sku, code, pos)
JOIN public.products p ON p.sku = m.sku
JOIN public.collections c ON c.collection_code = m.code
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_collection_mappings x
  WHERE x.product_id = p.id AND x.collection_id = c.id
);

-- 5. Storage hardening: no blanket public SELECT on private buckets
DROP POLICY IF EXISTS "Public read marketing-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read product-assets" ON storage.objects;