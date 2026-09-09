export type Product = {
  id: string; title: string; slug: string; description: string | null; image_url: string | null; category: string | null;
};
export type Offer = { id:string; product_id:string; seller_name:string; seller_url:string|null; price:number; is_active:boolean; source_type:'website'|'direct'; };
export type SiteSettings = { new_product_fee:number; renewal_fee:number; renewal_months:number; max_products:number; max_sellers_per_product:number; support_email:string; suggestions_email:string; };
