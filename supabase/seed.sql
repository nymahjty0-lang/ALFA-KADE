insert into public.categories (name, slug, sort_order) values
  ('گوشی موبایل', 'mobile', 1),
  ('کامپیوتر', 'computer', 2),
  ('لپ‌تاپ', 'laptop', 3),
  ('تبلت', 'tablet', 4),
  ('ساعت هوشمند', 'smartwatch', 5),
  ('هدفون و هندزفری', 'headphone', 6),
  ('اسپیکر', 'speaker', 7),
  ('دوربین', 'camera', 8),
  ('لوازم جانبی', 'accessories', 9),
  ('کنسول و بازی', 'gaming', 10),
  ('تلویزیون', 'tv', 11),
  ('لوازم خانگی', 'home-appliance', 12),
  ('پوشاک', 'clothing', 13),
  ('دیجیتال', 'digital', 14)
on conflict (slug) do nothing;
