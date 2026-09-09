-- ============================================
-- ALFA KADE / آلفا کده
-- Supabase Database Schema
-- ============================================

create extension if not exists "pgcrypto";


-- ============================================
-- PROFILES
-- ============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  national_id text,
  birth_date date,
  role text not null default 'user'
    check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);


-- ============================================
-- PRODUCTS
-- ============================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,
  category text not null,

  image_url text,

  created_at timestamptz not null default now()
);


-- ============================================
-- SELLERS
-- ============================================

create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  phone text not null,
  national_id text,
  birth_date date,

  website text,

  created_at timestamptz not null default now()
);


-- ============================================
-- OFFERS / قیمت فروشندگان
-- ============================================

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references public.products(id)
    on delete cascade,

  seller_id uuid not null
    references public.sellers(id)
    on delete cascade,

  price bigint not null,

  seller_url text,

  source_type text not null default 'direct'
    check (source_type in ('website', 'direct')),

  created_at timestamptz not null default now(),

  constraint offers_price_limit
    check (price > 0 and price <= 500000000)
);


-- ============================================
-- SITE SETTINGS
-- ============================================

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);


-- ============================================
-- PRODUCT SUBSCRIPTIONS
-- ============================================

create table if not exists public.product_subscriptions (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references public.products(id)
    on delete cascade,

  seller_id uuid not null
    references public.sellers(id)
    on delete cascade,

  starts_at timestamptz not null default now(),

  expires_at timestamptz not null,

  created_at timestamptz not null default now()
);


-- ============================================
-- DEFAULT SETTINGS
-- ============================================

insert into public.site_settings (key, value)
values
  ('new_product_fee', '0'),
  ('renewal_fee', '200000'),
  ('renewal_months', '6'),
  ('max_products', '10000000'),
  ('max_sellers_per_product', '1000'),
  ('support_email', 'alphakade11@gmail.com'),
  ('suggestions_email', 'alphakade11@gmail.com')
on conflict (key) do nothing;


-- ============================================
-- INDEXES
-- ============================================

create index if not exists products_category_idx
on public.products(category);

create index if not exists products_title_idx
on public.products(title);

create index if not exists offers_product_id_idx
on public.offers(product_id);

create index if not exists offers_seller_id_idx
on public.offers(seller_id);

create index if not exists offers_price_idx
on public.offers(price);

create index if not exists sellers_phone_idx
on public.sellers(phone);


-- ============================================
-- PRICE LIMIT
-- حداکثر قیمت: 500 میلیون تومان
-- ============================================

create or replace function public.check_offer_price()
returns trigger
language plpgsql
as $$
begin
  if new.price <= 0 then
    raise exception 'قیمت باید بیشتر از صفر باشد';
  end if;

  if new.price > 500000000 then
    raise exception 'قیمت نمی‌تواند بیشتر از 500000000 تومان باشد';
  end if;

  return new;
end;
$$;

drop trigger if exists offer_price_limit_trigger
on public.offers;

create trigger offer_price_limit_trigger
before insert or update on public.offers
for each row
execute function public.check_offer_price();


-- ============================================
-- PRODUCT LIMIT
-- حداکثر 10 میلیون محصول
-- ============================================

create or replace function public.check_product_limit()
returns trigger
language plpgsql
as $$
declare
  max_products_value bigint;
  current_products bigint;
begin
  select coalesce(value::bigint, 10000000)
  into max_products_value
  from public.site_settings
  where key = 'max_products';

  select count(*)
  into current_products
  from public.products;

  if current_products >= max_products_value then
    raise exception 'ظرفیت ثبت محصول تکمیل شده است';
  end if;

  return new;
end;
$$;

drop trigger if exists product_limit_trigger
on public.products;

create trigger product_limit_trigger
before insert on public.products
for each row
execute function public.check_product_limit();


-- ============================================
-- SELLER LIMIT PER PRODUCT
-- حداکثر 1000 فروشنده برای هر محصول
-- ============================================

create or replace function public.check_seller_limit()
returns trigger
language plpgsql
as $$
declare
  max_sellers_value bigint;
  current_sellers bigint;
begin
  select coalesce(value::bigint, 1000)
  into max_sellers_value
  from public.site_settings
  where key = 'max_sellers_per_product';

  select count(*)
  into current_sellers
  from public.offers
  where product_id = new.product_id;

  if current_sellers >= max_sellers_value then
    raise exception 'ظرفیت فروشندگان این محصول تکمیل شده است';
  end if;

  return new;
end;
$$;

drop trigger if exists seller_limit_trigger
on public.offers;

create trigger seller_limit_trigger
before insert on public.offers
for each row
execute function public.check_seller_limit();


-- ============================================
-- STORAGE
-- ============================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;


-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.sellers enable row level security;
alter table public.offers enable row level security;
alter table public.site_settings enable row level security;
alter table public.product_subscriptions enable row level security;


-- ============================================
-- PRODUCTS POLICIES
-- ============================================

drop policy if exists "Products are publicly readable"
on public.products;

create policy "Products are publicly readable"
on public.products
for select
using (true);


drop policy if exists "Products can be created"
on public.products;

create policy "Products can be created"
on public.products
for insert
with check (true);


-- ============================================
-- SELLERS POLICIES
-- ============================================

drop policy if exists "Sellers are publicly readable"
on public.sellers;

create policy "Sellers are publicly readable"
on public.sellers
for select
using (true);


drop policy if exists "Sellers can be created"
on public.sellers;

create policy "Sellers can be created"
on public.sellers
for insert
with check (true);


-- ============================================
-- OFFERS POLICIES
-- ============================================

drop policy if exists "Offers are publicly readable"
on public.offers;

create policy "Offers are publicly readable"
on public.offers
for select
using (true);


drop policy if exists "Offers can be created"
on public.offers;

create policy "Offers can be created"
on public.offers
for insert
with check (true);


-- ============================================
-- PROFILES POLICIES
-- ============================================

drop policy if exists "Users can read profiles"
on public.profiles;

create policy "Users can read profiles"
on public.profiles
for select
using (true);


drop policy if exists "Users can create profiles"
on public.profiles;

create policy "Users can create profiles"
on public.profiles
for insert
with check (true);


-- ============================================
-- SITE SETTINGS POLICIES
-- ============================================

drop policy if exists "Settings can be read"
on public.site_settings;

create policy "Settings can be read"
on public.site_settings
for select
using (true);


drop policy if exists "Settings can be updated"
on public.site_settings;

create policy "Settings can be updated"
on public.site_settings
for update
using (true)
with check (true);


drop policy if exists "Settings can be inserted"
on public.site_settings;

create policy "Settings can be inserted"
on public.site_settings
for insert
with check (true);


-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

drop policy if exists "Subscriptions can be read"
on public.product_subscriptions;

create policy "Subscriptions can be read"
on public.product_subscriptions
for select
using (true);


drop policy if exists "Subscriptions can be created"
on public.product_subscriptions;

create policy "Subscriptions can be created"
on public.product_subscriptions
for insert
with check (true);


-- ============================================
-- STORAGE POLICIES
-- ============================================

drop policy if exists "Product images are publicly readable"
on storage.objects;

create policy "Product images are publicly readable"
on storage.objects
for select
using (bucket_id = 'product-images');


drop policy if exists "Product images can be uploaded"
on storage.objects;

create policy "Product images can be uploaded"
on storage.objects
for insert
with check (bucket_id = 'product-images');


-- ============================================
-- DONE
-- ============================================
