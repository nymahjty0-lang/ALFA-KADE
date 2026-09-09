"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, Smartphone } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-[#d8aa4d]/30 bg-[#101010] p-6 shadow-2xl md:p-8">
          {/* لوگو */}
          <div className="mb-8 text-center">
            <img
              src="/alfa-cade.png"
              alt="آلفا کده"
              className="mx-auto h-24 w-24 rounded-2xl object-contain"
            />

            <h1 className="mt-5 text-2xl font-bold text-[#d8aa4d]">
              ورود به آلفا کده
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              برای ورود شماره موبایل خود را وارد کنید
            </p>
          </div>

          {/* فرم */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                "ورود پیامکی در مرحله بعد به سرویس SMS متصل خواهد شد."
              );
            }}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                شماره موبایل
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4">
                <Smartphone className="h-5 w-5 text-[#d8aa4d]" />

                <input
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  maxLength={11}
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d8aa4d] px-5 py-4 font-bold text-black transition hover:bg-[#e8bd65]"
            >
              <LockKeyhole className="h-5 w-5" />
              دریافت کد ورود
            </button>
          </form>

          {/* توضیح */}
          <div className="mt-6 rounded-xl border border-[#d8aa4d]/20 bg-[#d8aa4d]/5 p-4 text-center">
            <p className="text-xs leading-6 text-gray-400">
              کد تأیید از طریق پیامک برای شماره موبایل شما ارسال می‌شود.
              اتصال واقعی سرویس پیامک در مرحله راه‌اندازی سرویس SMS انجام
              خواهد شد.
            </p>
          </div>

          {/* برگشت */}
          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-[#d8aa4d]"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </main>
  );
          }
