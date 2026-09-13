"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Store,
  ShieldCheck,
  TrendingDown,
  Heart,
} from "lucide-react";

const BASE_PATH = "/ALFA-KADE";

type CartItem = {
  id: string;
  quantity: number;
};

function getCartCount() {
  try {
    const raw = localStorage.getItem("alfa_kade_cart");

    if (!raw) return 0;

    const cart = JSON.parse(raw);

    if (!Array.isArray(cart)) return 0;

    return cart.reduce(
      (total: number, item: CartItem) =>
        total + Math.max(0, Number(item.quantity) || 0),
      0
    );
  } catch {
    return 0;
  }
}

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCart() {
      setCartCount(getCartCount());
    }

    updateCart();

    window.addEventListener(
      "alfa-kade-cart-updated",
      updateCart
    );

    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener(
        "alfa-kade-cart-updated",
        updateCart
      );

      window.removeEventListener(
        "storage",
        updateCart
      );
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#070707] text-white">

      {/* Hero */}
      <section className="border-b border-[#d8aa4d]/10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border border-[#d8aa4d]/30 bg-[#101010] p-3 shadow-2xl shadow-[#d8aa4d]/5">
              <img
                src={`${BASE_PATH}/alfa-cade.png`}
                alt="آلفا کده"
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>

            <div className="mb-3 text-sm font-bold tracking-[0.25em] text-[#d8aa4d]">
              ALFA KADE
            </div>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              بهترین قیمت را
              <span className="block text-[#d8aa4d]">
                پیدا کن
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-500 md:text-lg">
              قیمت محصولات را از فروشندگان مختلف مقایسه کن،
              بهترین پیشنهاد را پیدا کن و خریدت را هوشمندانه‌تر انجام بده.
            </p>

            {/* Search */}
            <form
              action="/search"
              method="get"
              className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-[#101010] px-4">
                <Search
                  className="shrink-0 text-[#d8aa4d]"
                  size={22}
                />

                <input
                  type="search"
                  name="q"
                  placeholder="نام محصول را جستجو کنید..."
                  className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-gray-600"
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-[#d8aa4d] px-7 py-4 font-black text-black transition hover:bg-[#e8bd65]"
              >
                جستجو
              </button>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <Link
                href="/products"
                className="flex items-center gap-2 rounded-xl border border-[#d8aa4d]/40 bg-[#d8aa4d]/10 px-5 py-3 text-sm font-bold text-[#e8c875] transition hover:bg-[#d8aa4d]/20"
              >
                مشاهده محصولات
                <ArrowLeft size={17} />
              </Link>

              <Link
                href="/cart"
                className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-[#101010] px-5 py-3 text-sm font-bold text-gray-300 transition hover:border-[#d8aa4d]/50 hover:text-[#d8aa4d]"
              >
                <ShoppingCart size={17} />
                سبد خرید

                {cartCount > 0 && (
                  <span
                    dir="ltr"
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8aa4d] px-1 text-[10px] font-black text-black"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* امکانات */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">

        <div className="mb-10 text-center">
          <div className="text-sm font-bold text-[#d8aa4d]">
            چرا آلفا کده؟
          </div>

          <h2 className="mt-2 text-2xl font-black md:text-3xl">
            خرید هوشمند، ساده و شفاف
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
            <TrendingDown
              className="text-[#d8aa4d]"
              size={30}
            />

            <h3 className="mt-5 font-bold">
              مقایسه قیمت
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              قیمت‌های فروشندگان مختلف را کنار هم ببینید.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
            <Store
              className="text-[#d8aa4d]"
              size={30}
            />

            <h3 className="mt-5 font-bold">
              فروشندگان مختلف
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              فروشنده‌های دارای سایت و فروشنده‌های بدون سایت.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
            <ShieldCheck
              className="text-[#d8aa4d]"
              size={30}
            />

            <h3 className="mt-5 font-bold">
              فروشنده معتبر
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              امکان امتیازدهی و اعتبارسنجی فروشندگان.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
            <Heart
              className="text-[#d8aa4d]"
              size={30}
            />

            <h3 className="mt-5 font-bold">
              علاقه‌مندی‌ها
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              محصولات موردعلاقه خود را ذخیره و دنبال کنید.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-3xl border border-[#d8aa4d]/20 bg-[#0c0c0c] p-8 text-center md:p-12">

          <h2 className="text-2xl font-black md:text-3xl">
            محصول موردنظرت را پیدا نکردی؟
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
            می‌توانی محصول جدید را در آلفا کده ثبت کنی؛
            حتی اگر فروشگاه اینترنتی نداشته باشی.
          </p>

          <Link
            href="/products/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d8aa4d] px-6 py-3 font-bold text-black transition hover:bg-[#e8bd65]"
          >
            ثبت محصول
            <ArrowLeft size={18} />
          </Link>

        </div>
      </section>

      <footer className="border-t border-[#d8aa4d]/10 px-4 py-8 text-center">
        <div className="text-sm text-zinc-600">
          سازنده این سایت: نیما حجتی
        </div>
      </footer>

    </main>
  );
      }
