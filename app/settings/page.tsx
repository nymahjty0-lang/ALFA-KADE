"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Settings,
  Save,
  ShieldCheck,
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

export default function SettingsPage() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [registrationFee, setRegistrationFee] = useState("0");
  const [renewalFee, setRenewalFee] = useState("200000");
  const [maxPrice, setMaxPrice] = useState("500000000");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("alfa_kade_logged_in") === "true";

    const adminVerified =
      localStorage.getItem("alfa_kade_admin_verified") === "true";

    const phone = normalizePhone(
      localStorage.getItem("alfa_kade_phone") || ""
    );

    const isAllowed =
      loggedIn &&
      adminVerified &&
      ADMIN_NUMBERS.includes(phone);

    setAllowed(isAllowed);

    if (isAllowed) {
      setRegistrationFee(
        localStorage.getItem("alfa_kade_registration_fee") || "0"
      );

      setRenewalFee(
        localStorage.getItem("alfa_kade_renewal_fee") || "200000"
      );

      setMaxPrice(
        localStorage.getItem("alfa_kade_max_price") ||
          "500000000"
      );
    }

    setLoading(false);
  }, []);

  function saveSettings() {
    const registration =
      Number(normalizePhone(registrationFee));

    const renewal =
      Number(normalizePhone(renewalFee));

    const maximum =
      Number(normalizePhone(maxPrice));

    if (
      !Number.isFinite(registration) ||
      registration < 0
    ) {
      setMessage("هزینه ثبت محصول معتبر نیست.");
      return;
    }

    if (
      !Number.isFinite(renewal) ||
      renewal < 0
    ) {
      setMessage("هزینه تمدید معتبر نیست.");
      return;
    }

    if (
      !Number.isFinite(maximum) ||
      maximum <= 0
    ) {
      setMessage("حداکثر قیمت معتبر نیست.");
      return;
    }

    localStorage.setItem(
      "alfa_kade_registration_fee",
      String(registration)
    );

    localStorage.setItem(
      "alfa_kade_renewal_fee",
      String(renewal)
    );

    localStorage.setItem(
      "alfa_kade_max_price",
      String(maximum)
    );

    setMessage("تنظیمات با موفقیت ذخیره شد.");
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#070707] text-white flex items-center justify-center"
      >
        <p className="text-[#d8aa4d]">
          در حال بررسی دسترسی...
        </p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-4"
      >
        <div className="w-full max-w-md rounded-3xl border border-red-900 bg-[#0d0d0d] p-7 text-center">
          <ShieldCheck
            size={48}
            className="mx-auto mb-5 text-red-400"
          />

          <h1 className="text-2xl font-bold">
            دسترسی غیرمجاز
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            این بخش فقط برای مدیران مجاز آلفا کده قابل دسترسی است.
          </p>

          <Link
            href={`${BASE_PATH}/products`}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#d8aa4d] px-6 py-3 font-bold text-black"
          >
            بازگشت
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] px-4 py-8 text-white"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href={`${BASE_PATH}/products`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#40331d] px-4 py-2 text-sm text-gray-300 hover:border-[#d8aa4d]"
          >
            بازگشت
            <ArrowRight size={18} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#181307] p-3 text-[#d8aa4d]">
              <Settings size={25} />
            </div>

            <div>
              <h1 className="font-bold text-[#d8aa4d]">
                تنظیمات
              </h1>

              <p className="text-xs text-gray-600">
                ALFA KADE
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-[#40331d] bg-[#0d0d0d] p-6 shadow-2xl">
          <h2 className="mb-6 text-xl font-bold">
            تنظیمات سایت
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                هزینه ثبت محصول
              </label>

              <input
                dir="ltr"
                inputMode="numeric"
                value={registrationFee}
                onChange={(e) =>
                  setRegistrationFee(
                    normalizePhone(e.target.value)
                  )
                }
                className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-white outline-none focus:border-[#d8aa4d]"
              />

              <p className="mt-2 text-xs text-gray-600">
                تومان
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                هزینه تمدید هر ۶ ماه
              </label>

              <input
                dir="ltr"
                inputMode="numeric"
                value={renewalFee}
                onChange={(e) =>
                  setRenewalFee(
                    normalizePhone(e.target.value)
                  )
                }
                className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-white outline-none focus:border-[#d8aa4d]"
              />

              <p className="mt-2 text-xs text-gray-600">
                تومان
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                حداکثر قیمت محصول
              </label>

              <input
                dir="ltr"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    normalizePhone(e.target.value)
                  )
                }
                className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-white outline-none focus:border-[#d8aa4d]"
              />

              <p className="mt-2 text-xs text-gray-600">
                مقدار پیش‌فرض: ۵۰۰ میلیون تومان
              </p>
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-2xl border border-[#665122] bg-[#181307] p-4 text-sm text-[#e5c46b]">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={saveSettings}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black transition hover:bg-[#efc766]"
          >
            <Save size={19} />
            ذخیره تنظیمات
          </button>
        </section>

        <footer className="py-8 text-center text-xs text-gray-600">
          سازنده این سایت: نیما حجتی
          <br />
          alphakade11@gmail.com
        </footer>
      </div>
    </main>
  );
  }
