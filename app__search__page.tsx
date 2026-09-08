import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const {q=""} = await searchParams;
  const db = supabase();
  let products:any[] = [];
  if (db && q.trim()) {
    const {data} = await db.from("products").select("*").eq("is_active", true).ilike("title", `%${q.trim()}%`).limit(50);
    products = data || [];
  }
  return <section className="mx-auto max-w-5xl px-4 py-10">
    <h1 className="text-3xl font-black">نتایج جستجو برای «{q || "—"}»</h1>
    <div className="mt-7 space-y-3">
      {!products.length && <div className="card p-8 text-zinc-400">نتیجه‌ای پیدا نشد. بعد از راه‌اندازی دیتابیس، محصولات واقعی اینجا جستجو می‌شوند.</div>}
      {products.map(p=><Link key={p.id} href={`/products/${p.slug}`} className="card block p-5 hover:border-gold/50">{p.title}</Link>)}
    </div>
  </section>;
}