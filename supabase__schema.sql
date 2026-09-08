-- ALFA KADE production-oriented schema
create extension if not exists pgcrypto;
create table if not exists profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, phone text, national_id text, birth_date date, role text not null default 'user' check(role in('user','seller','admin')), created_at timestamptz not null default now());
create table if not exists products (id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, description text, image_url text, category text, is_active boolean not null default true, created_by uuid references profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index if not exists products_title_idx on products using gin(to_tsvector('simple',title));
create index if not exists products_category_idx on products(category);
create table if not exists sellers (id uuid primary key default gen_random_uuid(), owner_id uuid references profiles(id) on delete set null, name text not null, website_url text, is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists offers (id uuid primary key default gen_random_uuid(), product_id uuid not null references products(id) on delete cascade, seller_id uuid not null references sellers(id) on delete cascade, price bigint not null check(price>=0), seller_url text, source_type text not null default 'direct' check(source_type in('website','direct')), is_active boolean not null default true, expires_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(product_id,seller_id));
create index if not exists offers_product_price_idx on offers(product_id,price);
create table if not exists site_settings (id integer primary key check(id=1), new_product_fee bigint not null default 0, renewal_fee bigint not null default 200000, renewal_months integer not null default 6, max_products bigint not null default 10000000, max_sellers_per_product integer not null default 1000, support_email text not null default 'alphakade11@gmail.com', suggestions_email text not null default 'alphakade11@gmail.com', updated_at timestamptz not null default now());
insert into site_settings(id) values(1) on conflict(id) do nothing;
create table if not exists product_subscriptions (id uuid primary key default gen_random_uuid(), product_id uuid not null references products(id) on delete cascade, owner_id uuid not null references profiles(id) on delete cascade, started_at timestamptz not null default now(), expires_at timestamptz, amount_paid bigint not null default 0, status text not null default 'active' check(status in('active','expired','pending','cancelled')));

-- Hard server-side limits: product price <= 500m by default, max 10m products, max 1000 offers per product.
create or replace function enforce_alfa_limits() returns trigger language plpgsql as $$
declare cfg record; seller_count integer; product_count bigint;
begin
 select * into cfg from site_settings where id=1;
 if cfg is null then raise exception 'Site settings are not initialized'; end if;
 if tg_table_name='offers' then
   if new.price > 500000000 then raise exception 'PRICE_LIMIT: product price cannot exceed 500,000,000 tomans'; end if;
   if (select count(*) from offers where product_id=new.product_id and id<>coalesce(new.id,'00000000-0000-0000-0000-000000000000'::uuid)) >= cfg.max_sellers_per_product then raise exception 'SELLER_LIMIT: maximum sellers reached'; end if;
 end if;
 if tg_table_name='products' then
   select count(*) into product_count from products;
   if product_count >= cfg.max_products then raise exception 'PRODUCT_LIMIT: maximum products reached'; end if;
 end if;
 return new;
end $$;
drop trigger if exists trg_alfa_offer_limits on offers;
create trigger trg_alfa_offer_limits before insert or update on offers for each row execute function enforce_alfa_limits();
drop trigger if exists trg_alfa_product_limits on products;
create trigger trg_alfa_product_limits before insert on products for each row execute function enforce_alfa_limits();

alter table profiles enable row level security; alter table products enable row level security; alter table sellers enable row level security; alter table offers enable row level security; alter table site_settings enable row level security; alter table product_subscriptions enable row level security;
drop policy if exists "public read active products" on products; create policy "public read active products" on products for select using(is_active=true);
drop policy if exists "public read active sellers" on sellers; create policy "public read active sellers" on sellers for select using(is_active=true);
drop policy if exists "public read active offers" on offers; create policy "public read active offers" on offers for select using(is_active=true);
drop policy if exists "public read settings" on site_settings; create policy "public read settings" on site_settings for select using(true);
-- Authenticated users can maintain their own profile and create their own seller/product/offer records.
create policy "own profile insert" on profiles for insert with check(auth.uid()=id);
create policy "own profile update" on profiles for update using(auth.uid()=id) with check(auth.uid()=id);
create policy "own seller insert" on sellers for insert with check(auth.uid()=owner_id);
create policy "own product insert" on products for insert with check(auth.uid()=created_by);
create policy "own product update" on products for update using(auth.uid()=created_by) with check(auth.uid()=created_by);
create policy "own offer insert" on offers for insert with check(exists(select 1 from sellers s where s.id=seller_id and s.owner_id=auth.uid()));
create policy "own offer update" on offers for update using(exists(select 1 from sellers s where s.id=seller_id and s.owner_id=auth.uid()));
create policy "own subscriptions" on product_subscriptions for select using(auth.uid()=owner_id);

-- Storage bucket for product images. Public read, authenticated uploads.
insert into storage.buckets(id,name,public) values('product-images','product-images',true) on conflict(id) do nothing;
drop policy if exists "public product images" on storage.objects;
create policy "public product images" on storage.objects for select using(bucket_id='product-images');
drop policy if exists "authenticated product image upload" on storage.objects;
create policy "authenticated product image upload" on storage.objects for insert to authenticated with check(bucket_id='product-images');
-- Only admins may change site settings. Make one user admin manually once in profiles.
drop policy if exists "admin update settings" on site_settings;
create policy "admin update settings" on site_settings for update using(exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin')) with check(exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "admin insert settings" on site_settings;
create policy "admin insert settings" on site_settings for insert with check(exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
