"use client";

import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Camera,
  Speaker,
  Gamepad2,
  Tv,
  Refrigerator,
  Shirt,
  ShoppingBag,
  Search,
} from "lucide-react";

const categories = [
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

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* عنوان */}
        <div className="text-center">
          <p className="text-sm text-[#d8aa4d]">
            ALFA KADE
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            همه دسته‌بندی‌ها
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">
            دسته‌بندی موردنظر خود را انتخاب کنید و محصولات آن را جستجو کنید.
          </p>
        </div>

        {/* جستجو */}
        <Link
          href="/search"
          className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-[#101010] px-5 py-4 text-gray-500 transition hover:border-[#d8aa4d]/50 hover:text-gray-300"
        >
          <Search className="h-5 w-5 text-[#d8aa4d]" />
          <span>جستجوی محصول...</span>
        </Link>

        {/* دسته‌بندی‌ها */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={`/search?q=${encodeURIComponent(category.title)}`}
                className="group rounded-2xl border border-white/10 bg-[#101010] p-5 transition hover:-translate-y-1 hover:border-[#d8aa4d]/60 hover:bg-[#141414]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d8aa4d]/10">
                  <Icon className="h-6 w-6 text-[#d8aa4d] transition group-hover:scale-110" />
                </div>

                <h2 className="mt-4 font-bold text-white">
                  {category.title}
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  مشاهده محصولات
                </p>
              </Link>
            );
          })}
        </div>

        {/* ثبت محصول */}
        <div className="mt-12 rounded-3xl border border-[#d8aa4d]/25 bg-[#101010] p-7 text-center">
          <h2 className="text-xl font-bold text-[#d8aa4d]">
            محصولی پیدا نکردی؟
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            می‌توانی محصول جدید را در آلفا کده ثبت کنی.
          </p>

          <Link
            href="/products/register"
            className="mt-6 inline-flex rounded-xl bg-[#d8aa4d] px-7 py-3 font-bold text-black transition hover:bg-[#e8bd65]"
          >
            ثبت محصول جدید
          </Link>
        </div>
      </div>
    </main>
  );
              }
