import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

const demo: Product[] = [
  {id:"demo-1", title:"گوشی هوشمند نمونه", slug:"demo-phone", description:"محصول نمونه برای شروع پروژه", image_url:null, category:"گوشی موبایل"},
  {id:"demo-2", title:"هدفون بی‌سیم نمونه", slug:"demo-headphone", description:"محصول نمونه برای شروع پروژه", image_url:null, category:"هدفون و هندزفری"},
  {id:"demo-3", title:"ساعت هوشمند نمونه", slug:"demo-watch", description:"محصول نمونه برای شروع پروژه", image_url:null, category:"ساعت هوشمند"}
];

export default async function Products() {
  const db = supabase();
  let products = demo;
  if (db) {
    const { data } = await db.from("products").select("*").eq("is_active", true).order("created_at", {ascending:false}).limit(48);
    if (data?.length) products = data as Product[];
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black gold-text">محصولات</h1>
        <p className="mt-2 text-zinc-500">محصول را انتخاب کن و قیمت فروشنده‌ها را مقایسه کن.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map(p => (
          <Link href={`/products/${p.slug}`} key={p.id} className="card overflow-hidden transition hover:-translate-y-1 hover:border-gold/50">
            <div className="grid aspect-square place-items-center bg-zinc-900 text-gold">
              {p.image_url ? <img src={p.image_url} alt={p.title} className="h-full w-full object-cover"/> : <span className="text-6xl">A</span>}
            </div>
            <div className="p-4">
              <div className="text-sm text-zinc-500">{p.category || "بدون دسته"}</div>
              <h2 className="mt-2 font-bold">{p.title}</h2>
              <div className="mt-4 text-sm text-gold">مشاهده قیمت‌ها ←</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}