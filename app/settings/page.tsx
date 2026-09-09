"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Headphones,
  Lightbulb,
  PackagePlus,
  Settings,
} from "lucide-react";

const SUPPORT_EMAIL = "alphakade11@gmail.com";
const SUGGESTION_EMAIL = "alphakade11@gmail.com";

export default function SettingsPage() {
  const items = [
    {
      title: "پشتیبانی",
      description: "برای دریافت کمک و ارتباط با تیم آلفا کده",
      icon: Headphones,
      href: `mailto:${SUPPORT_EMAIL}`,
    },
    {
      title: "پیشنهادات",
      description: "پیشنهاد یا نظر خود را برای بهتر شدن سایت ارسال کنید",
      icon: Lightbulb,
      href: `mailto:${SUGGESTION_EMAIL}?subject=پیشنهاد برای آلفا کده`,
    },
    {
      title: "ثبت محصول",
      description: "محصول جدید خود را در آلفا کده ثبت کنید",
      icon: PackagePlus,
      href: "/products/register",
    },
    {
      title: "مدیریت و تنظیمات",
      description: "تنظیم هزینه‌ها، محدودیت‌ها و تنظیمات اصلی سایت",
      icon: Settings,
      href: "/admin",
    },
  ];

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* عنوان */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full border border-[#d8aa4d]/40 bg-[#d8aa4d]/10 p-4">
            <Settings className="h-8 w-8 text-[#d8aa4d]" />
          </div>

          <h1 className="text-3xl font-bold text-[#d8aa4d] md:text-4xl">
            تنظیمات آلفا کده
          </h1>

          <p className="mt-3 text-sm text-gray-400 md:text-base">
            دسترسی سریع به امکانات و تنظیمات سایت
          </p>
        </div>

        {/* کارت‌ها */}
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-[#d8aa4d]/20 bg-[#101010] p-6 transition hover:-translate-y-1 hover:border-[#d8aa4d]/70 hover:bg-[#151515]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#d8aa4d]/10">
                    <Icon className="h-7 w-7 text-[#d8aa4d]" />
                  </div>

                  <ArrowLeft className="h-5 w-5 text-gray-500 transition group-hover:-translate-x-1 group-hover:text-[#d8aa4d]" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-white">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* اطلاعات */}
        <div className="mt-8 rounded-2xl border border-[#d8aa4d]/20 bg-[#101010] p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-[#d8aa4d]" />

            <h2 className="text-lg font-bold text-[#d8aa4d]">
              اطلاعات ثبت محصول
            </h2>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-gray-300 md:grid-cols-3">
            <div className="rounded-xl bg-black/40 p-4">
              <span className="text-gray-500">هزینه ثبت فعلی</span>
              <p className="mt-1 font-bold text-white">رایگان</p>
            </div>

            <div className="rounded-xl bg-black/40 p-4">
              <span className="text-gray-500">تمدید</span>
              <p className="mt-1 font-bold text-white">
                هر ۶ ماه
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-4">
              <span className="text-gray-500">حداکثر قیمت</span>
              <p className="mt-1 font-bold text-white">
                ۵۰۰ میلیون تومان
              </p>
            </div>
          </div>
        </div>

        {/* ایمیل‌ها */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 text-center">
          <p className="text-sm text-gray-400">
            ایمیل پشتیبانی و پیشنهادات
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-block text-sm font-bold text-[#d8aa4d] hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </main>
  );
}
