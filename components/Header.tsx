"use client";

import Link from "next/link";
import { Search, User, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "#050505",
        borderBottom: "1px solid #2d2414",
      }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src="/alfa-cade.png"
            alt="آلفا کده"
            className="h-12 w-12 rounded-xl object-contain"
          />

          <div className="hidden sm:block">
            <div
              className="text-xl font-black tracking-wide"
              style={{ color: "#d8aa4d" }}
            >
              آلفا کده
            </div>

            <div className="text-[11px] text-gray-400">
              مقایسه و خرید هوشمند
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="hidden max-w-xl flex-1 md:block">
          <form action="/search" className="relative">
            <input
              type="search"
              name="q"
              placeholder="دنبال چه محصولی هستید؟"
              className="w-full rounded-2xl border border-[#3a2e18] bg-[#101010] py-3 pr-12 pl-4 text-right text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#d8aa4d]"
            />

            <button
              type="submit"
              aria-label="جستجو"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl transition"
              style={{
                background: "#d8aa4d",
                color: "#000",
              }}
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          <Link
            href="/products"
            className="rounded-xl px-4 py-2 text-sm text-gray-300 transition hover:bg-[#15120c] hover:text-[#d8aa4d]"
          >
            همه محصولات
          </Link>

          <Link
            href="/products/register"
            className="rounded-xl px-4 py-2 text-sm text-gray-300 transition hover:bg-[#15120c] hover:text-[#d8aa4d]"
          >
            ثبت محصول
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2 text-sm text-gray-200 transition hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
          >
            <User size={17} />
            ورود
          </Link>

          <Link
            href="/settings"
            aria-label="تنظیمات"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3a2e18] text-gray-300 transition hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
          >
            <Settings size={18} />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="منو"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#3a2e18] text-gray-200 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <form action="/search" className="relative">
          <input
            type="search"
            name="q"
            placeholder="جستجوی محصول..."
            className="w-full rounded-2xl border border-[#3a2e18] bg-[#101010] py-3 pr-12 pl-4 text-right text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#d8aa4d]"
          />

          <button
            type="submit"
            aria-label="جستجو"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl"
            style={{
              background: "#d8aa4d",
              color: "#000",
            }}
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#2d2414] bg-[#080808] px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-[#211b10] px-4 py-3 text-right text-sm text-gray-200 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
            >
              همه محصولات
            </Link>

            <Link
              href="/products/register"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-[#211b10] px-4 py-3 text-right text-sm text-gray-200 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
            >
              ثبت محصول
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-[#211b10] px-4 py-3 text-right text-sm text-gray-200 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
            >
              ورود به حساب
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-[#211b10] px-4 py-3 text-right text-sm text-gray-200 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
            >
              تنظیمات
            </Link>

            <div className="mt-3 border-t border-[#211b10] pt-3 text-center text-xs text-gray-500">
              سازنده: نیماحجتی
            </div>
          </div>
        </div>
      )}

      {/* Creator */}
      <div className="hidden border-t border-[#17130c] py-1 text-center text-[10px] text-gray-600 lg:block">
        سازنده: نیماحجتی
      </div>
    </header>
  );
      }
