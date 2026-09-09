"use client";

import Link from "next/link";
import {
  Search,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Tv,
  Speaker,
  Refrigerator,
  Shirt,
  ShoppingBag,
} from "lucide-react";

const BASE_PATH = "/ALFA-KADE";

const featuredCategories = [
  { title: "هدفون", icon: Headphones, query: "هدفون" },
  { title: "ساعت هوشمند", icon: Watch, query: "ساعت هوشمند" },
  { title: "دوربین", icon: Camera, query: "دوربین" },
  { title: "لوازم جانبی", icon: ShoppingBag, query: "لوازم جانبی" },
  { title: "کنسول بازی", icon: Gamepad2, query: "کنسول بازی" },
  { title: "تلویزیون", icon: Tv, query: "تلویزیون" },
];

const allCategories = [
  { title: "گوشی موبایل", icon: Smartphone },
  { title: "کامپیوتر", icon: Laptop },
  { title: "لپ‌تاپ", icon: Laptop },
  { title: "تبلت", icon: Tablet },
  { title: "هدفون", icon: Headphones },
  { title: "ساعت هوشمند", icon: Watch },
  { title: "دوربین", icon: Camera },
  { title: "اسپیکر", icon: Speaker },
  { title: "کنسول و بازی", icon: Gamepad2 },
  { title: "تلویزیون", icon: Tv },
  { title: "لوازم خانگی", icon: Refrigerator },
  { title: "پوشاک", icon: Shirt },
  { title: "لوازم جانبی", icon: ShoppingBag },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#d8aa4d]/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,170,77,0.14),transparent_55%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <img
            src={`${BASE_PATH}/alfa-cade.png`}
            alt="آلفا کده"
            className="mx-auto mb-7 h-28 w-28 rounded-3xl object-contain md:h-36 md:w-36"
          />

          <p className="mb-3 text-sm font-medium text-[#d8aa4d]">
            مقایسه قیمت و خرید هوشمند
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            آلفا کده
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-400 md:text-base">
            قیمت محصولات را بین فروشندگان مقایسه کن و بهترین انتخاب را با
            خیال راحت پیدا کن.
          </p>

          {/* جستجو */}
          <Link
            href="/search"
            className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#d8aa4d]/30 bg-[#111111] px-5 py-4 text-right text-gray-500 shadow-2xl transition hover:border-[#d8aa4d] hover:text-gray-300"
          >
            <Search className="h-5 w-5 shrink-0 text-[#d8aa4d]" />
            <span>نام محصول موردنظر را جستجو کنید...</span>
          </Link>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-xl bg-[#d8aa4d] px-7 py-3 font-bold text-black transition hover:bg-[#e8bd65]"
            >
              مشاهده همه محصولات
            </Link>

            <Link
              href="/products/register"
              className="rounded-xl border border-[#d8aa4d]/40 bg-transparent px-7 py-3 font-bold text-[#d8aa4d] transition hover:bg-[#d8aa4d]/10"
            >
              ثبت محصول
            </Link>
          </div>
        </div>
      </section>

      {/* دسته‌های منتخب */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#d8aa4d]">محبوب‌ترین‌ها</p>
            <h2 className="mt-1 text-2xl font-bold">دسته‌بندی‌های منتخب</h2>
          </div>

          <Link
            href="/products"
            className="text-sm text-[#d8aa4d] hover:underline"
          >
            همه دسته‌بندی‌ها
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {featuredCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={`/search?q=${encodeURIComponent(category.query)}`}
                className="group rounded-2xl border border-white/10 bg-[#101010] p-6 transition hover:-translate-y-1 hover:border-[#d8aa4d]/60"
              >
                <Icon className="h-9 w-9 text-[#d8aa4d] transition group-hover:scale-110" />

                <h3 className="mt-5 font-bold">{category.title}</h3>

                <p className="mt-2 text-xs text-gray-500">
                  مشاهده محصولات
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* همه دسته‌بندی‌ها */}
      <section className="border-y border-[#d8aa4d]/10 bg-[#090909]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 text-center">
            <p className="text-xs text-[#d8aa4d]">دسته‌بندی کامل</p>

            <h2 className="mt-2 text-2xl font-bold">
              همه دسته‌بندی‌ها
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              از موبایل و کامپیوتر تا لوازم خانه و سرگرمی
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allCategories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  href={`/search?q=${encodeURIComponent(category.title)}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101010] px-4 py-4 transition hover:border-[#d8aa4d]/50 hover:bg-[#151515]"
                >
                  <Icon className="h-5 w-5 shrink-0 text-[#d8aa4d]" />

                  <span className="text-sm text-gray-300">
                    {category.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* مقایسه قیمت */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-[#d8aa4d]/30 bg-gradient-to-l from-[#151515] to-[#0b0b0b] p-7 md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm text-[#d8aa4d]">
              خرید بهتر، انتخاب هوشمندتر
            </p>

            <h2 className="mt-3 text-2xl font-black md:text-3xl">
              قبل از خرید، قیمت‌ها را مقایسه کن
            </h2>

            <p className="mt-4 text-sm leading-8 text-gray-400">
              آلفا کده قیمت فروشندگان مختلف را کنار هم قرار می‌دهد تا
              بتوانی سریع‌تر مناسب‌ترین قیمت را پیدا کنی.
            </p>

            <Link
              href="/search"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d8aa4d] px-6 py-3 font-bold text-black transition hover:bg-[#e8bd65]"
            >
              <Search className="h-5 w-5" />
              شروع جستجو
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
          }
