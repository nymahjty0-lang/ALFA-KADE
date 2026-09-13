"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  Settings,
  Package,
} from "lucide-react";

const BASE_PATH = "/ALFA-KADE";

const ADMIN_NUMBERS = [
  "09936874192",
  "09966920595",
  "09010391546",
];

const ADMIN_PASSWORD = "909174";

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
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [registrationFee, setRegistrationFee] = useState("0");
  const [renewalFee, setRenewalFee] = useState("200000");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("alfa_kade_logged_in") === "true";

    const adminVerified =
      localStorage.getItem("alfa_kade_admin_verified") === "true";

    const phone = normalizePhone(
      localStorage.getItem("alfa_kade_phone") || ""
    );

    const allowed =
      loggedIn &&
      adminVerified &&
      ADMIN_NUMBERS.includes(phone);

    setAuthorized(allowed);
    setLoading(false);

    if (allowed) {
      const savedRegistrationFee =
        localStorage.getItem("alfa_kade_registration_fee");

      const savedRenewalFee =
        localStorage.getItem("alfa_kade_renewal_fee");

      if (savedRegistrationFee !== null) {
        setRegistrationFee(savedRegistrationFee);
      }

      if (savedRenewalFee !== null) {
        setRenewalFee(savedRenewalFee);
      }
    }
  }, []);

  function verifyPassword() {
    if (password !== ADMIN_PASSWORD) {
      setError("رمز مدیریت اشتباه است.");
      setLoginSuccess(false);
      return;
    }

    setError("");
    setLoginSuccess(true);
    localStorage.setItem(
      "alfa_kade_admin_password_verified",
      "true"
    );
  }

  function saveSettings() {
    localStorage.setItem(
      "alfa_kade_registration_fee",
      registrationFee
    );

    localStorage.setItem(
      "alfa_kade_renewal_fee",
      renewalFee
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#070707] text-white flex items-center justify-center"
      >
        <div className="text-[#d8aa4d]">
          در حال بررسی دسترسی...
        </div>
      </main>
    );
  }

  if (!authorized) {
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
            href={`${BASE_PATH}/login`}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#d8aa4d] px-6 py-3 font-bold text-black"
          >
            ورود
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  if (!loginSuccess) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-4"
      >
        <div className="w-full max-w-md rounded-3xl border border-[#5b4824] bg-[#0d0d0d] p-7">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#181307] text-[#d8aa4d]">
              <LockKeyhole size={30} />
            </div>

            <h1 className="text-2xl font-bold text-[#d8aa4d]">
              مدیریت آلفا کده
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              رمز مدیریت را وارد کنید.
            </p>
          </div>

          <input
            dir="ltr"
            type="password"
            inputMode="numeric"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز مدیریت"
            className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-center tracking-[0.3em] text-white outline-none focus:border-[#d8aa4d]"
          />

          {error && (
            <div className="mt-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={verifyPassword}
            className="mt-5 w-full rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black transition hover:bg-[#efc766]"
          >
            ورود به مدیریت
          </button>

          <Link
            href={`${BASE_PATH}/products`}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[#3f331e] py-3 text-sm text-gray-400 hover:text-white"
          >
            بازگشت
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] text-white px-4 py-8"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#181307] p-3 text-[#d8aa4d]">
              <Settings size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#d8aa4d]">
                پنل مدیریت
              </h1>
              <p className="text-sm text-gray-500">
                ALFA KADE
              </p>
            </div>
          </div>

          <Link
            href={`${BASE_PATH}/products`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#40331d] px-4 py-2 text-sm text-gray-300 hover:border-[#d8aa4d]"
          >
            محصولات
            <Package size={17} />
          </Link>
        </div>

        <section className="rounded-3xl border border-[#40331d] bg-[#0d0d0d] p-6">
          <h2 className="mb-6 text-xl font-bold">
            تنظیمات هزینه‌ها
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
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
                مبلغ به تومان
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                هزینه تمدید ۶ ماهه
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
                مبلغ به تومان
              </p>
            </div>
          </div>

          {saved && (
            <div className="mt-5 rounded-2xl border border-[#665122] bg-[#181307] p-4 text-sm text-[#e5c46b]">
              تنظیمات با موفقیت ذخیره شد.
            </div>
          )}

          <button
            type="button"
            onClick={saveSettings}
            className="mt-6 w-full rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black hover:bg-[#efc766]"
          >
            ذخیره تنظیمات
          </button>
        </section>

        <section className="mt-6 rounded-3xl border border-[#30291c] bg-[#0d0d0d] p-6">
          <h2 className="text-lg font-bold text-[#d8aa4d]">
            وضعیت مدیریت
          </h2>

          <div className="mt-4 grid gap-3 text-sm text-gray-400 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#242424] p-4">
              <span className="block text-gray-600">
                وضعیت
              </span>
              <span className="mt-1 block text-green-400">
                فعال
              </span>
            </div>

            <div className="rounded-2xl border border-[#242424] p-4">
              <span className="block text-gray-600">
                ثبت محصول
              </span>
              <span className="mt-1 block">
                قابل مدیریت
              </span>
            </div>

            <div className="rounded-2xl border border-[#242424] p-4">
              <span className="block text-gray-600">
                تمدید
              </span>
              <span className="mt-1 block">
                ۶ ماهه
              </span>
            </div>
          </div>
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
