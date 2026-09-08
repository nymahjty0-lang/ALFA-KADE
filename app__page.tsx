import Link from "next/link";
import { ArrowLeft, Search, Smartphone, Headphones, Watch, Camera, Laptop, ShoppingBag } from "lucide-react";

const cats = [
  ["گوشی موبایل", Smartphone], ["هدفون و هندزفری", Headphones],
  ["ساعت هوشمند", Watch], ["دوربین", Camera], ["لپ‌تاپ", Laptop], ["کیف و کوله", ShoppingBag]
] as const;

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-l from-[#18130a] via-[#0b0b0b] to-black p-8 md:p-16">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl"/>
          <div className="relative max-w-2xl">
            <p className="mb-4 text-gold">به دنیای خرید هوشمند خوش آمدید</p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl"><span className="gold-text">آلفا کده</span></h1>
            <p className="mt-5 text-xl text-zinc-300">قیمت فروشگاه‌ها را کنار هم ببین و ارزان‌ترین گزینه را پیدا کن.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="gold-gradient rounded-full px-7 py-3 font-bold text-black">مشاهده محصولات</Link>
              <Link href="/compare" className="rounded-full border border-zinc-600 px-7 py-3">مقایسه قیمت‌ها</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold gold-text">دسته‌بندی محصولات</h2>
          <Link href="/products" className="text-sm text-gold">همه محصولات <ArrowLeft className="inline" size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {cats.map(([name, Icon]) => (
            <Link key={name} href={`/products?category=${encodeURIComponent(name)}`} className="card p-5 text-center transition hover:-translate-y-1 hover:border-gold/50">
              <Icon className="mx-auto mb-4 text-gold" size={38}/>
              <div className="font-bold">{name}</div>
              <div className="mt-2 text-xs text-zinc-500">مشاهده محصولات</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="card grid gap-5 p-7 md:grid-cols-4">
          {[
            ["ارسال سریع و رایگان", "سفارش‌های بالای مبلغ تعیین‌شده"],
            ["ضمانت بازگشت کالا", "تا مدت تعیین‌شده در تنظیمات"],
            ["ضمانت اصالت کالا", "اطلاعات فروشندگان شفاف"],
            ["پشتیبانی ۲۴/۷", "همیشه در کنار شما هستیم"]
          ].map(([a,b]) => <div key={a} className="border-b border-zinc-800 pb-4 md:border-b-0 md:border-l md:pb-0 md:pl-5 last:border-0"><b>{a}</b><p className="mt-2 text-sm text-zinc-500">{b}</p></div>)}
        </div>
      </section>
    </div>
  );
}