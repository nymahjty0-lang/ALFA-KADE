create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.product_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  seller_name text not null,
  seller_phone text,
  website_url text,
  price bigint not null check (price > 0 and price <= 500000000),
  created_at timestamptz not null default now()
);

create index if not exists products_name_idx
on public.products(name);

create index if not exists products_category_idx
on public.products(category);

create index if not exists product_offers_product_id_idx
on public.product_offers(product_id);

create index if not exists product_offers_price_idx
on public.product_offers(price);

alter table public.products enable row level security;
alter table public.product_offers enable row level security;

drop policy if exists "Public can read products"
on public.products;

create policy "Public can read products"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read product offers"
on public.product_offers;

create policy "Public can read product offers"
on public.product_offers
for select
to anon, authenticated
using (true);
