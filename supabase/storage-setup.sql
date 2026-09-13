insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects for select
to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "Public upload product images" on storage.objects;
create policy "Public upload product images" on storage.objects for insert
to anon, authenticated with check (bucket_id = 'product-images');
