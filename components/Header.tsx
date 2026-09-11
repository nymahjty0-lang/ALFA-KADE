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

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("alfa_kade_logged_in") === "true";

    const phone = normalizePhone(
      localStorage.getItem("alfa_kade_phone") || ""
    );

    const adminVerified =
      localStorage.getItem("alfa_kade_admin_verified") === "true";

    if (
      loggedIn &&
      adminVerified &&
      ADMIN_NUMBERS.includes(phone)
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8aa4d]/20 bg-[#050505]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">

        {/* لوگو */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src={`${BASE_PATH}/alfa-cade.png`}
            alt="آلفا کده"
            className="h-12 w-12 rounded-xl object-contain"
          />

          <div className="hidden sm:block">
            <div className="text-lg font-bold text-[#d8aa4d]">
              ALFA KADE
            </div>

            <div className="text-[11px] text-gray-500">
              سازنده: نیماحجتی
            </div>
          </div>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-2 md:flex">

          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
          >
            خانه
          </Link>

          <Link
            href="/products"
            className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
          >
            همه محصولات
          </Link>

          <Link
            href="/products/register"
            className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
          >
            ثبت محصول
          </Link>

          {/* فقط مدیران مجاز */}
          {isAdmin && (
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <Settings className="h-4 w-4" />
              مدیریت و تنظیمات
            </Link>
          )}
        </nav>

        {/* دکمه‌های سمت چپ */}
        <div className="flex items-center gap-2">

          <Link
            href="/search"
            aria-label="جستجو"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#101010] text-gray-300 transition hover:border-[#d8aa4d]/50 hover:text-[#d8aa4d]"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/login"
            aria-label="ورود"
            className="hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#101010] text-gray-300 transition hover:border-[#d8aa4d]/50 hover:text-[#d8aa4d] sm:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            type="button"
            aria-label="منو"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8aa4d]/30 bg-[#101010] text-[#d8aa4d] md:hidden"
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* منوی موبایل */}
      {open && (
        <div className="border-t border-[#d8aa4d]/20 bg-[#090909] px-4 py-4 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <Package className="h-5 w-5" />
              خانه
            </Link>

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <Package className="h-5 w-5" />
              همه محصولات
            </Link>

            <Link
              href="/products/register"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <Package className="h-5 w-5" />
              ثبت محصول
            </Link>

            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <Search className="h-5 w-5" />
              جستجوی محصولات
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <User className="h-5 w-5" />
              ورود
            </Link>

            {/* فقط مدیران مجاز */}
            {isAdmin && (
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
              >
                <Settings className="h-5 w-5" />
                مدیریت و تنظیمات
              </Link>
            )}

          </div>
        </div>
      )}
    </header>
  );
              }
