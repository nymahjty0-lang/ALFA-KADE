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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("alfa-kade-cart-updated"));
  }, [cart, loaded]);

  function changeQuantity(id: string, amount: number) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;

          return {
            ...item,
            quantity: Math.max(1, item.quantity + amount),
          };
        })
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
          sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [cart]
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center text-gray-400">
          در حال بارگذاری سبد خرید...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">
              سبد خرید
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              محصولات انتخاب‌شده شما
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl border border-yellow-500/30 px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10"
          >
            <ArrowRight size={17} />
            ادامه خرید
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <ShoppingCart
              size={55}
              className="mx-auto mb-4 text-yellow-400"
            />

            <h2 className="text-xl font-bold">
              سبد خرید خالی است
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              محصول موردنظر خود را به سبد خرید اضافه کنید.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
            <section className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-600">
                          <ShoppingCart size={30} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-white">
                        {item.name}
                      </h2>

                      {item.seller && (
                        <p className="mt-1 text-xs text-gray-400">
                          فروشنده: {item.seller}
                        </p>
                      )}

                      <p className="mt-3 font-bold text-yellow-400">
                        {formatPrice(item.price)} تومان
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(item.id, 1)
                            }
                            className="p-2 text-yellow-400 hover:bg-white/10"
                          >
                            <Plus size={17} />
                          </button>

                          <span className="min-w-10 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(item.id, -1)
                            }
                            className="p-2 text-yellow-400 hover:bg-white/10"
                          >
                            <Minus size={17} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={17} />
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                خالی کردن سبد
              </button>
            </section>

            <aside className="h-fit rounded-2xl border border-yellow-500/20 bg-white/[0.03] p-5">
              <h2 className="font-bold">خلاصه سفارش</h2>

              <div className="my-5 flex items-center justify-between border-b border-white/10 pb-4 text-sm">
                <span className="text-gray-400">
                  تعداد کالا
                </span>

                <span>
                  {cart.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">
                  مبلغ کل
                </span>

                <span className="text-lg font-bold text-yellow-400">
                  {formatPrice(total)} تومان
                </span>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl bg-yellow-500/40 px-4 py-3 font-bold text-black/60"
              >
                پرداخت — به‌زودی
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                درگاه پرداخت هنوز فعال نشده است.
              </p>
            </aside>
          </div>
        )}

        <footer className="mt-14 border-t border-white/10 py-6 text-center text-sm text-gray-500">
          سازنده این سایت: نیما حجتی
        </footer>
      </div>
    </main>
  );
    }
