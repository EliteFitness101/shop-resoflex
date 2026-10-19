-- Custom Pay™ fallback contract.
-- Account details are intentionally NOT stored in source control.
-- They are stored encrypted in Supabase Vault as
-- `resofit_custom_pay_accounts_v1`.

create table if not exists public.custom_payment_requests (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null,
  user_id uuid null references auth.users(id) on delete set null,
  customer_name text null,
  customer_email text null,
  customer_phone text null,
  amount_ngn numeric(14,2) not null check (amount_ngn > 0),
  method text not null check (method in ('bank_transfer','deposit','slip','remittance','whatsapp','ussd')),
  account_id text not null,
  evidence_url text null,
  customer_note text null,
  status text not null default 'pending_review' check (status in ('pending_review','verified','rejected','expired')),
  verified_by uuid null references auth.users(id) on delete set null,
  verified_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_payment_requests_reference_idx on public.custom_payment_requests(order_reference);
create index if not exists custom_payment_requests_status_idx on public.custom_payment_requests(status);

alter table public.custom_payment_requests enable row level security;
revoke all on table public.custom_payment_requests from anon, authenticated;
grant all on table public.custom_payment_requests to service_role;

create or replace function public.get_custom_pay_config()
returns jsonb
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  payload text;
begin
  if current_setting('request.jwt.claim.role', true) <> 'service_role' then
    raise exception 'forbidden';
  end if;

  select decrypted_secret into payload
  from vault.decrypted_secrets
  where name = 'resofit_custom_pay_accounts_v1'
  limit 1;

  if payload is null then
    return jsonb_build_object('enabled', false, 'accounts', '[]'::jsonb);
  end if;

  return payload::jsonb;
end;
$$;

revoke all on function public.get_custom_pay_config() from public, anon, authenticated;
grant execute on function public.get_custom_pay_config() to service_role;
