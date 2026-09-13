"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  seller?: string;
  quantity: number;
};

const BASE_PATH = "/ALFA-KADE";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("alfa_kade_cart");

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          Number.isFinite(Number(item.price))
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: Math.max(0, Number(item.price)),
        image:
          typeof item.image === "string"
            ? item.image
            : "",
        seller:
          typeof item.seller === "string"
            ? item.seller
            : "",
        quantity: Math.max(
          1,
          Math.floor(Number(item.quantity) || 1)
        ),
      }));
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(
    "alfa_kade_cart",
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("alfa-kade-cart-updated")
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function getImageSrc(image?: string) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith(BASE_PATH + "/")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${BASE_PATH}${image}`;
  }

  return image;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(loadCart());
    setReady(true);

    function updateCart() {
      setCart(loadCart());
    }

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

      window.removeEventListener("storage", updateCart);
    };
  }, []);

  function updateQuantity(
    id: string,
    change: number
  ) {
    setCart((current) => {
      const updated = current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            1,
            item.quantity + change
          ),
        };
      });

      saveCart(updated);
      return updated;
    });
  }

  function removeItem(id: string) {
    setCart((current) => {
      const updated = current.filter(
        (item) => item.id !== id
      );

      saveCart(updated);
      return updated;
    });
  }

  function clearCart() {
    setCart([]);
    saveCart([]);
  }

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-[#101010] p-8 text-center text-gray-400">
            در حال بارگذاری سبد خرید...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-white md:py-12">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-[#d8aa4d] md:text-3xl">
              <ShoppingCart className="h-7 w-7" />
              سبد خرید
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {totalItems > 0
                ? `${formatPrice(totalItems)} کالا در سبد خرید`
                : "سبد خرید شما خالی است"}
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl border border-[#d8aa4d]/40 bg-[#d8aa4d]/10 px-4 py-3 text-sm font-bold text-[#e8c875] transition hover:bg-[#d8aa4d]/20"
          >
            ادامه خرید
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-[#d8aa4d]/20 bg-[#101010] px-6 py-16 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-[#d8aa4d]/40" />

            <h2 className="mt-5 text-xl font-bold text-white">
              سبد خرید شما خالی است
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              محصول موردنظر خود را پیدا کنید و به سبد خرید اضافه کنید.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d8aa4d] px-6 py-3 font-bold text-black transition hover:bg-[#e8bd65]"
            >
              مشاهده محصولات
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

            <div className="space-y-4">
              {cart.map((item) => {
                const imageSrc = getImageSrc(
                  item.image
                );

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-[#101010] p-4"
                  >
                    <div className="flex gap-4">

                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-[#d8aa4d]/40" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-white">
                          {item.name}
                        </h2>

                        {item.seller && (
                          <p className="mt-1 text-xs text-gray-500">
                            فروشنده: {item.seller}
                          </p>
                        )}

                        <p
                          dir="rtl"
                          className="mt-3 font-bold text-[#d8aa4d]"
                        >
                          {formatPrice(item.price)} تومان
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        aria-label={`حذف ${item.name}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 transition hover:bg-red-950/40"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">

                      <span className="text-sm text-gray-500">
                        تعداد
                      </span>

                      <div className="flex items-center gap-2 rounded-xl border border-[#d8aa4d]/30 bg-black/40 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              -1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#d8aa4d] transition hover:bg-[#d8aa4d]/10 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span
                          dir="ltr"
                          className="min-w-8 text-center font-bold text-white"
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#d8aa4d] transition hover:bg-[#d8aa4d]/10"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        مبلغ این کالا
                      </span>

                      <span
                        dir="rtl"
                        className="font-bold text-white"
                      >
                        {formatPrice(
                          item.price *
                            item.quantity
                        )}{" "}
                        تومان
                      </span>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={clearCart}
                className="w-full rounded-xl border border-red-900/40 bg-red-950/10 px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-950/20"
              >
                حذف همه کالاها
              </button>
            </div>

            <aside className="h-fit rounded-2xl border border-[#d8aa4d]/30 bg-[#101010] p-5 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold text-[#e8c875]">
                خلاصه سبد خرید
              </h2>

              <div className="mt-5 space-y-4 text-sm">

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    تعداد کالا
                  </span>

                  <span className="font-bold text-white">
                    {formatPrice(totalItems)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    مبلغ کالاها
                  </span>

                  <span
                    dir="rtl"
                    className="font-bold text-white"
                  >
                    {formatPrice(totalPrice)} تومان
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-300">
                      مبلغ کل
                    </span>

                    <span
                      dir="rtl"
                      className="text-lg font-bold text-[#d8aa4d]"
                    >
                      {formatPrice(totalPrice)} تومان
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl bg-[#d8aa4d]/40 px-5 py-4 font-bold text-black/60"
              >
                پرداخت — به‌زودی
              </button>

              <p className="mt-3 text-center text-xs leading-6 text-gray-600">
                درگاه پرداخت فعلاً فعال نیست و بعداً به سبد خرید متصل می‌شود.
              </p>
            </aside>
          </div>
        )}

        <div className="mt-10 text-center text-sm text-zinc-600">
          سازنده این سایت: نیما حجتی
        </div>
      </div>
    </main>
  );
}
