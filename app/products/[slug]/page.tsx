import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const db = supabase();
  let product:any = null;
  let offers:any[] = [];
  if (db) {
    const r = await db.from("products").select("*").eq("slug", slug).eq("is_active", true).single();
    product = r.data;
    if (product) {
      const o = await db.from("offers").select("*").eq("product_id", product.id).eq("is_active", true).order("price", {ascending:true});
      offers = o.data || [];
    }
  }
  if (!product) {
    if (!slug.startsWith("demo-")) notFound();
    product = {title:"محصول نمونه", description:"این محصول نمونه است؛ بعد از اتصال دیتابیس اطلاعات واقعی نمایش داده می‌شود.", image_url:null, category:"نمونه"};
    offers = [
      {seller_name:"فروشگاه نمونه ۱", seller_url:"#", price:2500000},
      {seller_name:"فروشگاه نمونه ۲", seller_url:"#", price:2750000}
    ];
  }
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-7 md:grid-cols-2">
        <div className="card grid min-h-80 place-items-center overflow-hidden">
          {product.image_url ? <img src={product.image_url} alt={product.title} className="h-full max-h-[520px] w-full object-contain"/> : <div className="text-8xl font-black gold-text">A</div>}
        </div>
        <div>
          <div className="text-sm text-gold">{product.category}</div>
          <h1 className="mt-3 text-4xl font-black">{product.title}</h1>
          <p className="mt-5 leading-8 text-zinc-400">{product.description}</p>
          <div className="mt-8 card p-5">
            <h2 className="mb-4 text-xl font-bold">مقایسه قیمت فروشندگان</h2>
            <div className="space-y-3">
              {offers.map((o:any, i:number) => (
                <div key={o.id || i} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div><div className="font-bold">{o.seller_name}</div><div className="text-xs text-zinc-500">فروشنده</div></div>
                  <div className="text-left"><div className="font-black text-gold">{Number(o.price).toLocaleString("fa-IR")} تومان</div><a href={o.seller_url} target="_blank" className="text-xs text-zinc-400">مشاهده فروشگاه ←</a></div>
                </div>
              ))}
              {!offers.length && <p className="text-zinc-500">هنوز قیمتی برای این محصول ثبت نشده است.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}