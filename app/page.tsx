import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  Watch,
  Camera,
  Speaker,
  ShoppingBag,
  Cable,
  Gamepad2,
  Tv,
  Refrigerator,
  Tablet,
  Laptop,
  Smartphone,
} from "lucide-react";

const featuredCategories = [
  { name: "ساعت هوشمند", icon: Watch },
  { name: "هدفون و هندزفری", icon: Headphones },
  { name: "اسپیکر", icon: Speaker },
  { name: "دوربین", icon: Camera },
  { name: "لوازم جانبی", icon: Cable },
  { name: "کیف و کوله", icon: ShoppingBag },
];

const allCategories = [
  { name: "موبایل", icon: Smartphone },
  { name: "کامپیوتر", icon: Laptop },
  { name: "لپ‌تاپ", icon: Laptop },
  { name: "تبلت", icon: Tablet },
  { name: "ساعت هوشمند", icon: Watch },
  { name: "هدفون و هندزفری", icon: Headphones },
  { name: "اسپیکر", icon: Speaker },
  { name: "دوربین", icon: Camera },
  { name: "لوازم جانبی", icon: Cable },
  { name: "کنسول و بازی", icon: Gamepad2 },
  { name: "تلویزیون", icon: Tv },
  { name: "لوازم خانگی", icon: Refrigerator },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">

      {/* هدر اصلی */}
      <section className="relative overflow-hidden border-b border-[#2b2417]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(212,160,55,0.16),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

          <div className="text-right">
            <p className="mb-5 text-lg text-[#d6a744]">
              خرید هوشمند با آلفا کده
            </p>

            <h1 className="text-6xl font-black leading-tight md:text-8xl">
              آلفا کده
            </h1>

            <p className="mt-5 text-2xl font-bold text-zinc-200">
              بهترین قیمت را پیدا کن
            </p>

            <p className="mt-4 max-w-xl leading-8 text-zinc-500">
              قیمت محصولات فروشندگان مختلف را مقایسه کن و قبل از خرید،
              بهترین انتخاب را داشته باش.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <Link
                href="/products"
                className="rounded-full bg-gradient-to-r from-[#dfb452] to-[#9c6c1e] px-8 py-4 font-bold text-black"
              >
                همه محصولات
              </Link>

              <Link
                href="/compare"
                className="rounded-full border border-[#735a29] px-8 py-4 font-bold text-[#ddb050]"
              >
                مقایسه قیمت
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#c99a3d]/40 bg-[#10100f] shadow-[0_0_100px_rgba(201,154,61,0.12)]">
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

      {/* جستجو */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-[#302817] bg-[#11100e] p-3">
          <Link
            href="/search"
            className="flex items-center justify-between rounded-xl bg-[#181610] px-6 py-5"
          >
            <span className="text-zinc-500">
              نام محصول، برند یا مدل را جستجو کنید...
            </span>

            <span className="rounded-xl bg-gradient-to-r from-[#d9ad50] to-[#9b6d21] px-6 py-3 font-bold text-black">
              جستجو
            </span>
          </Link>
        </div>
      </section>

      {/* دسته‌بندی‌های منتخب */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black text-[#d8aa4d]">
            دسته‌بندی‌های منتخب
          </h2>

          <Link
            href="/products"
            className="flex items-center gap-2 text-[#d8aa4d]"
          >
            همه محصولات
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

          {featuredCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-[#2d271b] bg-[#101010] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c99a3d]"
              >
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#17140e]">
                  <Icon
                    size={45}
                    className="text-[#d8aa4d] transition group-hover:scale-110"
                  />
                </div>

                <h3 className="font-bold">
                  {category.name}
                </h3>
              </Link>
            );
          })}

        </div>
      </section>

      {/* همه دسته‌بندی‌ها */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#d8aa4d]">
            همه دسته‌بندی‌ها
          </h2>

          <p className="mt-2 text-zinc-500">
            تمام محصولات آلفا کده را مشاهده و قیمت‌ها را مقایسه کنید.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

          {allCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex items-center gap-3 rounded-xl border border-[#29241b] bg-[#101010] p-4 transition hover:border-[#c99a3d] hover:bg-[#15130f]"
              >
                <Icon size={28} className="shrink-0 text-[#d8aa4d]" />

                <span className="font-semibold">
                  {category.name}
                </span>
              </Link>
            );
          })}

        </div>
      </section>

      {/* دعوت به مقایسه */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#3a2d18] bg-gradient-to-l from-[#181207] to-[#0c0c0c] p-12 text-center">

          <div className="relative">
            <p className="text-[#d8aa4d]">
              آلفا کده
            </p>

            <h2 className="mt-3 text-4xl font-black">
              قبل از خرید، قیمت‌ها را مقایسه کن
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-zinc-500">
              فروشندگان مختلف را ببین، قیمت‌ها را از ارزان‌ترین تا گران‌ترین
              مقایسه کن و انتخاب بهتری داشته باش.
            </p>

            <Link
              href="/compare"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-[#dfb452] to-[#9c6c1e] px-10 py-4 font-bold text-black"
            >
              شروع مقایسه
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
        }
