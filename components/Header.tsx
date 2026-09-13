"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  X,
  User,
  Settings,
  Package,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

const BASE_PATH = "/ALFA-KADE";

const ADMIN_NUMBERS = [
  "09936874192",
  "09966920595",
  "09010391546",
];

function normalizePhone(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    )
    .replace(/\D/g, "");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAdmin = () => {
      const phone = normalizePhone(
        localStorage.getItem("alfa_kade_phone") || ""
      );

      const loggedIn =
        localStorage.getItem("alfa_kade_logged_in") === "true";

      const adminVerified =
        localStorage.getItem("alfa_kade_admin_verified") === "true";

      setIsAdmin(
        loggedIn &&
          adminVerified &&
          ADMIN_NUMBERS.includes(phone)
      );
    };

    const updateCartCount = () => {
      try {
        const raw = localStorage.getItem("alfa_kade_cart");

        if (!raw) {
          setCartCount(0);
          return;
        }

        const cart = JSON.parse(raw);

        if (!Array.isArray(cart)) {
          setCartCount(0);
          return;
        }

        const count = cart.reduce(
          (total: number, item: { quantity?: number }) =>
            total + Math.max(0, Number(item.quantity) || 0),
          0
        );

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    checkAdmin();
    updateCartCount();

    window.addEventListener("storage", checkAdmin);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener(
      "alfa-kade-cart-updated",
      updateCartCount
    );

    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener(
        "alfa-kade-cart-updated",
        updateCartCount
      );
    };
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-yellow-500/20 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <img
            src={`${BASE_PATH}/alfa-cade.png`}
            alt="ALFA KADE"
            className="h-11 w-11 rounded-xl object-cover"
          />

          <div>
            <div className="font-bold text-yellow-400">
              ALFA KADE
            </div>
            <div className="text-xs text-gray-400">
              آلفا کده
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <Link
            href="/"
            className="text-sm text-gray-200 transition hover:text-yellow-400"
          >
            خانه
          </Link>

          <Link
            href="/products"
            className="text-sm text-gray-200 transition hover:text-yellow-400"
          >
            محصولات
          </Link>

          <Link
            href="/products/register"
            className="text-sm text-gray-200 transition hover:text-yellow-400"
          >
            ثبت محصول
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-1 text-sm text-yellow-400"
              >
                <ShieldCheck size={17} />
                مدیریت
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-1 text-sm text-gray-200 hover:text-yellow-400"
              >
                <Settings size={17} />
                تنظیمات
              </Link>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/search"
            aria-label="جستجو"
            className="rounded-xl p-2 text-gray-200 hover:bg-white/10 hover:text-yellow-400"
          >
            <Search size={21} />
          </Link>

          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative rounded-xl p-2 text-gray-200 hover:bg-white/10 hover:text-yellow-400"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-[10px] font-bold text-black">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            aria-label="ورود"
            className="rounded-xl p-2 text-gray-200 hover:bg-white/10 hover:text-yellow-400"
          >
            <User size={21} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl p-2 text-gray-200 hover:bg-white/10 md:hidden"
          aria-label="منو"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-yellow-500/10 bg-black px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
            >
              خانه
            </Link>

            <Link
              href="/products"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
            >
              محصولات
            </Link>

            <Link
              href="/products/register"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
            >
              ثبت محصول
            </Link>

            <Link
              href="/search"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
            >
              جستجو
            </Link>

            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
            >
              <span>سبد خرید</span>

              {cartCount > 0 && (
                <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
            >
              ورود
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-yellow-400 hover:bg-white/10"
                >
                  مدیریت
                </Link>

                <Link
                  href="/settings"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-gray-200 hover:bg-white/10"
                >
                  تنظیمات
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
      }
