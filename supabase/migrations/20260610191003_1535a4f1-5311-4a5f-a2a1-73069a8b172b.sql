
CREATE TABLE IF NOT EXISTS public.revenue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rsid text,
  reference text UNIQUE,
  sku text,
  variant text,
  amount_ngn numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  funnel_origin text,
  customer_email text,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.revenue_events TO authenticated;
GRANT ALL ON public.revenue_events TO service_role;
ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view revenue_events" ON public.revenue_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_revenue_events_created ON public.revenue_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_events_rsid ON public.revenue_events (rsid);
CREATE INDEX IF NOT EXISTS idx_revenue_events_sku ON public.revenue_events (sku);
CREATE INDEX IF NOT EXISTS idx_revenue_events_utm_source ON public.revenue_events (utm_source);

CREATE TABLE IF NOT EXISTS public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rsid text,
  event_type text NOT NULL,
  sku text,
  path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  funnel_origin text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.funnel_events TO authenticated;
GRANT ALL ON public.funnel_events TO service_role;
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view funnel_events" ON public.funnel_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON public.funnel_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnel_events_rsid ON public.funnel_events (rsid);
CREATE INDEX IF NOT EXISTS idx_funnel_events_type ON public.funnel_events (event_type);
