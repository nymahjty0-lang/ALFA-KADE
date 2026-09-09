import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  Watch,
  Camera,
  Speaker,
  ShoppingBag,
  Cable,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
} from "lucide-react";

const categories = [
  { name: "ساعت هوشمند", icon: Watch },
  { name: "هدفون و هندزفری", icon: Headphones },
  { name: "اسپیکر", icon: Speaker },
  { name: "دوربین", icon: Camera },
  { name: "لوازم جانبی", icon: Cable },
  { name: "کیف و کوله", icon: ShoppingBag },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#2a2418] bg-[#090909]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(212,160,55,0.18),transparent_32%)]" />

        <div className="absolute right-[12%] top-16 h-[420px] w-[420px] rounded-full border border-[#c99a3d]/30" />
        <div className="absolute right-[18%] top-28 h-[300px] w-[300px] rounded-full border border-[#c99a3d]/20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">

          {/* متن */}
          <div className="text-right">
            <p className="mb-5 text-lg text-[#d8a94e]">
              به دنیای خرید هوشمند خوش آمدید
            </p>

            <h1 className="text-6xl font-black leading-tight md:text-8xl">
              آلفا کده
            </h1>

            <p className="mt-5 text-xl text-zinc-300">
              تجربه‌ای متفاوت از خرید آنلاین
            </p>

            <p className="mt-3 max-w-xl text-base leading-8 text-zinc-500">
              قیمت‌ها را مقایسه کن، فروشنده‌ها را ببین و بهترین انتخاب را پیدا کن.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                href="/products"
                className="rounded-full bg-gradient-to-r from-[#d9aa4d] to-[#a87520] px-8 py-4 font-bold text-black shadow-lg shadow-[#c99532]/20"
              >
                مشاهده محصولات
              </Link>

              <Link
                href="/compare"
                className="rounded-full border border-[#80652f] px-8 py-4 font-bold text-[#e2b45b]"
              >
                مقایسه قیمت‌ها
              </Link>
            </div>
          </div>

          {/* لوگو / المان طلایی */}
          <div className="relative flex min-h-[380px] items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-[#c89536]/10 blur-3xl" />

            <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#c99a3d]/40 bg-gradient-to-br from-[#17130c] to-[#050505] shadow-2xl">
              <div className="absolute h-64 w-64 rounded-full border border-[#c99a3d]/20" />

              <img
                src="/alfa-cade.png"
                alt="ALFA KADE"
                className="relative z-10 w-56 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* خدمات */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid overflow-hidden rounded-2xl border border-[#2b261d] bg-[#111111] md:grid-cols-4">

          <div className="flex items-center gap-4 border-b border-[#2b261d] p-6 md:border-b-0 md:border-l">
            <Truck className="text-[#d8a94e]" size={38} />
            <div>
              <b>ارسال سریع و رایگان</b>
              <p className="mt-1 text-xs text-zinc-500">برای سفارش‌های واجد شرایط</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-[#2b261d] p-6 md:border-b-0 md:border-l">
            <RotateCcw className="text-[#d8a94e]" size={38} />
            <div>
              <b>ضمانت بازگشت کالا</b>
              <p className="mt-1 text-xs text-zinc-500">خرید با خیال راحت</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-[#2b261d] p-6 md:border-b-0 md:border-l">
            <ShieldCheck className="text-[#d8a94e]" size={38} />
            <div>
              <b>ضمانت اصالت کالا</b>
              <p className="mt-1 text-xs text-zinc-500">اطلاعات شفاف فروشندگان</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6">
            <Headset className="text-[#d8a94e]" size={38} />
            <div>
              <b>پشتیبانی ۲۴/۷</b>
              <p className="mt-1 text-xs text-zinc-500">همیشه کنار شما هستیم</p>
            </div>
          </div>

        </div>
      </section>

      {/* دسته بندی */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#d8a94e]">
            دسته‌بندی محصولات
          </h2>

          <Link
            href="/products"
            className="flex items-center gap-2 text-sm text-[#d8a94e]"
          >
            همه محصولات
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-[#2b261d] bg-[#111111] p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-[#c99a3d]"
              >
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#17130d]">
                  <Icon
                    size={48}
                    className="text-[#d8a94e] transition group-hover:scale-110"
                  />
                </div>

                <h3 className="font-bold">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs text-zinc-500">
                  مشاهده محصولات
                </p>
              </Link>
            );
          })}

        </div>
      </section>

      {/* بخش مقایسه */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-[#3a2d18] bg-gradient-to-l from-[#171208] to-[#0c0c0c] p-10 text-center">

          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d09b35]/10 blur-3xl" />

          <div className="relative">
            <p className="text-[#d8a94e]">
              خرید هوشمند یعنی انتخاب بهتر
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              بهترین قیمت را پیدا کن
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-zinc-500">
              در آلفا کده قیمت فروشندگان مختلف را کنار هم ببین و قبل از خرید
              بهترین گزینه را انتخاب کن.
            </p>

            <Link
              href="/compare"
              className="mt-7 inline-block rounded-full bg-gradient-to-r from-[#d9aa4d] to-[#a87520] px-9 py-4 font-bold text-black"
            >
              شروع مقایسه قیمت
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
