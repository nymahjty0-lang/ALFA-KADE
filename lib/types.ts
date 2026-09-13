export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
};

export type Offer = {
  id: string;
  product_id: string;
  seller_name: string;
  seller_phone: string | null;
  website_url: string | null;
  price: number;
  created_at: string;
};

export type SiteSettings = {
  registration_fee: number;
  renewal_fee: number;
  renewal_months: number;
  max_price: number;
  support_email: string;
  suggestions_email: string;
};
