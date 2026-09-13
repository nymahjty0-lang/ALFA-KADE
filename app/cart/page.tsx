"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ArrowRight,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  seller?: string | null;
  quantity: number;
};

const CART_KEY = "alfa_kade_cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).id === "string" &&
        typeof (item as CartItem).name === "string"
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      image: item.image ?? null,
      seller: item.seller ?? null,
      quantity: Math.max(
        1,
        Number(item.quantity) || 1
      ),
    }));
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);

      if (raw) {
        setCart(
          normalizeCart(JSON.parse(raw))
        );
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("alfa-kade-cart-updated")
    );
  }, [cart, loaded]);

  function changeQuantity(
    id: string,
    amount: number
  ) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity + amount
              ),
            }
          : item
      )
    );
  }

  function removeItem(id: string) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      ),
    [cart]
  );

  const itemCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cart]
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center text-gray-500">
          در حال بارگذاری سبد خرید...
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] px-4 py-8 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-[#d8aa4d]">
              سبد خرید
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {itemCount} کالا
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2 text-sm text-[#d8aa4d]"
          >
            <ArrowRight size={17} />
            ادامه خرید
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-[#2d2414] bg-[#0c0c0c] p-12 text-center">
            <ShoppingCart
              size={55}
              className="mx-auto mb-4 text-[#d8aa4d]"
            />

            <h2 className="text-xl font-bold">
              سبد خرید خالی است
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              یک محصول را از صفحه محصولات انتخاب کنید.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-xl bg-[#d8aa4d] px-6 py-3 font-bold text-black"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
            <section className="space-y-4">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#2d2414] bg-[#0c0c0c] p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart
                            size={28}
                            className="text-[#80652f]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold leading-7">
                        {item.name}
                      </h2>

                      {item.seller && (
                        <p className="mt-1 text-xs text-gray-500">
                          فروشنده: {item.seller}
                        </p>
                      )}

                      <p className="mt-3 font-bold text-[#d8aa4d]">
                        {formatPrice(item.price)} تومان
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-xl border border-[#3a2e18]">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                1
                              )
                            }
                            className="p-2 text-[#d8aa4d]"
                          >
                            <Plus size={17} />
                          </button>

                          <span className="min-w-10 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                -1
                              )
                            }
                            className="p-2 text-[#d8aa4d]"
                          >
                            <Minus size={17} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="flex items-center gap-1 text-sm text-red-400"
                        >
                          <Trash2 size={17} />
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-red-900/60 px-4 py-2 text-sm text-red-400"
              >
                خالی کردن سبد
              </button>
            </section>

            <aside className="h-fit rounded-2xl border border-[#3a2e18] bg-[#0c0c0c] p-5">
              <h2 className="font-bold">
                خلاصه سفارش
              </h2>

              <div className="my-5 flex justify-between border-b border-white/10 pb-4 text-sm">
                <span className="text-gray-500">
                  تعداد کالا
                </span>

                <span>{itemCount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  مبلغ کل
                </span>

                <span className="font-bold text-[#d8aa4d]">
                  {formatPrice(total)} تومان
                </span>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl bg-[#d8aa4d]/40 py-3 font-bold text-black/60"
              >
                پرداخت — به‌زودی
              </button>

              <p className="mt-3 text-center text-xs text-gray-600">
                درگاه پرداخت هنوز فعال نشده است.
              </p>
            </aside>
          </div>
        )}

        <footer className="mt-14 border-t border-white/10 py-6 text-center text-xs text-gray-600">
          سازنده این سایت: نیما حجتی
        </footer>
      </div>
    </main>
  );
      }
