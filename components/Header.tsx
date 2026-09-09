"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  X,
  User,
  Settings,
  Package,
} from "lucide-react";

const BASE_PATH = "/ALFA-KADE";

export default function Header() {
  const [open, setOpen] = useState(false);

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

          <Link
            href="/settings"
            className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
          >
            تنظیمات
          </Link>
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

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#d8aa4d]/10 hover:text-[#d8aa4d]"
            >
              <Settings className="h-5 w-5" />
              تنظیمات
            </Link>
          </div>
        </div>
      )}
    </header>
  );
          }
