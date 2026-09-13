insert into public.products (
  name,
  slug,
  description,
  category,
  image_url
)
values
(
  'محصول نمونه آلفا کده',
  'alfa-kade-sample-product',
  'این یک محصول نمونه برای آزمایش اولیه سایت است.',
  'نمونه',
  null
)
on conflict (slug) do nothing;

insert into public.product_offers (
  product_id,
  seller_name,
  seller_phone,
  website_url,
  price
)
select
  id,
  'فروشگاه نمونه',
  '09120000000',
  'https://example.com',
  25000000
from public.products
where slug = 'alfa-kade-sample-product'
and not exists (
  select 1
  from public.product_offers
  where product_id = public.products.id
);
