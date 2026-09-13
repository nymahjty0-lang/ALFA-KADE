-- ALFA KADE / آلفا کده — Full Schema
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  category text,
  category_id uuid references public.categories(id) on delete set null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  source_type text not null default 'direct' check (source_type in ('direct', 'website')),
  seller_name text not null,
  seller_phone text,
  website_url text,
  price bigint not null check (price > 0 and price <= 500000000),
  registrant_name text,
  registrant_phone text,
  registrant_national_id text,
  registrant_birth_date date,
  is_active boolean not null default true,
  renewed_until timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists products_name_idx on public.products(name);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists product_offers_product_id_idx on public.product_offers(product_id);
create index if not exists product_offers_price_idx on public.product_offers(price);
create index if not exists product_offers_active_idx on public.product_offers(is_active);

create or replace function public.enforce_max_offers_per_product()
returns trigger as $$
declare
  offer_count int;
begin
  select count(*) into offer_count from public.product_offers where product_id = new.product_id;
  if offer_count >= 1000 then
    raise exception 'تعداد فروشندگان این محصول به حداکثر (۱۰۰۰) رسیده است';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_max_offers_per_product on public.product_offers;
create trigger trg_max_offers_per_product
before insert on public.product_offers
for each row execute function public.enforce_max_offers_per_product();

create table if not exists public.site_settings (
  id int primary key default 1,
  new_product_fee bigint not null default 0,
  renewal_fee bigint not null default 200000,
  renewal_months int not null default 6,
  max_product_price bigint not null default 500000000,
  max_sellers_per_product int not null default 1000,
  support_email text not null default 'alphakade11@gmail.com',
  suggestions_email text not null default 'alphakade11@gmail.com',
  show_seller_phone_public boolean not null default false,
  site_title text not null default 'ALFA KADE | آلفا کده',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

insert into public.app_users (phone, is_admin) values
  ('09936874192', true), ('09966920595', true), ('09010391546', true)
on conflict (phone) do update set is_admin = true;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_phone text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  total_amount bigint not null default 0,
  tracking_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  offer_id uuid references public.product_offers(id) on delete set null,
  product_name text not null,
  seller_name text,
  price bigint not null,
  quantity int not null default 1
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  purpose text not null check (purpose in ('order', 'new_product_fee', 'renewal_fee')),
  offer_id uuid references public.product_offers(id) on delete set null,
  amount bigint not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  gateway text,
  tracking_code text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_offers enable row level security;
alter table public.site_settings enable row level security;
alter table public.app_users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select to anon, authenticated using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select to anon, authenticated using (true);

drop policy if exists "Public can read product offers" on public.product_offers;
create policy "Public can read product offers" on public.product_offers for select to anon, authenticated using (is_active = true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Public can insert products" on public.products;
create policy "Public can insert products" on public.products for insert to anon, authenticated with check (true);

drop policy if exists "Public can insert product offers" on public.product_offers;
create policy "Public can insert product offers" on public.product_offers for insert to anon, authenticated with check (true);

drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders" on public.orders for insert to anon, authenticated with check (true);

drop policy if exists "Public can insert order items" on public.order_items;
create policy "Public can insert order items" on public.order_items for insert to anon, authenticated with check (true);
