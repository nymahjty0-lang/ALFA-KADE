export type Category = { id: string; name: string; slug: string; sort_order: number; };

export type Product = {
  id: string; name: string; slug: string; description: string | null;
  image_url: string | null; category: string | null; category_id: string | null;
  is_featured: boolean; created_at: string;
};

export type Offer = {
  id: string; product_id: string; source_type: "direct" | "website";
  seller_name: string; seller_phone: string | null; website_url: string | null;
  price: number; registrant_name: string | null; registrant_phone: string | null;
  registrant_national_id: string | null; registrant_birth_date: string | null;
  is_active: boolean; created_at: string;
};

export type SiteSettings = {
  new_product_fee: number; renewal_fee: number; renewal_months: number;
  max_product_price: number; max_sellers_per_product: number;
  support_email: string; suggestions_email: string;
  show_seller_phone_public: boolean; site_title: string;
};
