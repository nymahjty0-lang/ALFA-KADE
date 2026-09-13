"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Settings,
  Package,
  LogOut,
  ArrowRight,
} from "lucide-react";

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

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("alfa_kade_logged_in") ===
      "true";

    const verified =
      localStorage.getItem(
        "alfa_kade_admin_verified"
      ) === "true";

    const phone = normalizePhone(
      localStorage.getItem("alfa_kade_phone") || ""
    );

    const isAdmin =
      loggedIn &&
      verified &&
      ADMIN_NUMBERS.includes(phone);

    if (!isAdmin) {
      window.location.href = "/ALFA-KADE/products";
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, []);

  function logout() {
    localStorage.removeItem("alfa_kade_logged_in");
    localStorage.removeItem("alfa_kade_phone");
    localStorage.removeItem(
      "alfa_kade_admin_verified"
    );

    window.location.href = "/ALFA-KADE/login";
  }

  if (loading || !authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] text-white">
        <p className="text-gray-500">
          در حال بررسی دسترسی...
        </p>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] px-4 py-8 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#d8aa4d]">
              <ShieldCheck size={24} />
              پنل مدیریت
            </div>

            <h1 className="text-3xl font-black">
              مدیریت آلفا کده
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              مدیریت بخش‌های اصلی سایت
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-3 text-sm text-gray-300 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
            >
              <ArrowRight size={17} />
              سایت
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-red-900/60 px-4 py-3 text-sm text-red-400 hover:bg-red-950/30"
            >
              <LogOut size={17} />
              خروج
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products"
            className="rounded-3xl border border-[#2d2414] bg-[#0d0d0d] p-6 transition hover:border-[#d8aa4d]"
          >
            <Package
              size={30}
              className="mb-5 text-[#d8aa4d]"
            />

            <h2 className="text-xl font-bold">
              محصولات
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              مشاهده محصولات و قیمت‌های ثبت‌شده
            </p>
          </Link>

          <Link
            href="/products/register"
            className="rounded-3xl border border-[#2d2414] bg-[#0d0d0d] p-6 transition hover:border-[#d8aa4d]"
          >
            <Package
              size={30}
              className="mb-5 text-[#d8aa4d]"
            />

            <h2 className="text-xl font-bold">
              ثبت محصول
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              افزودن محصول و پیشنهاد فروشنده
            </p>
          </Link>

          <Link
            href="/settings"
            className="rounded-3xl border border-[#2d2414] bg-[#0d0d0d] p-6 transition hover:border-[#d8aa4d]"
          >
            <Settings
              size={30}
              className="mb-5 text-[#d8aa4d]"
            />

            <h2 className="text-xl font-bold">
              تنظیمات
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              تنظیم هزینه‌ها و محدودیت‌های سایت
            </p>
          </Link>
        </div>

        <footer className="mt-14 border-t border-white/10 py-7 text-center text-xs text-gray-600">
          سازنده این سایت: نیما حجتی
          <br />
          alphakade11@gmail.com
        </footer>
      </div>
    </main>
  );
            }
