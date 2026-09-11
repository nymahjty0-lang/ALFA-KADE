"use client";

import { useState } from "react";
import { LockKeyhole, Smartphone, ShieldCheck } from "lucide-react";

const ADMIN_NUMBERS = [
  "09936874192",
  "09966920595",
  "09010391546",
];

const TEST_CODE = "1234";

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

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  function sendCode() {
    const normalizedPhone = normalizePhone(phone);

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("لطفاً یک شماره موبایل معتبر وارد کنید.");
      return;
    }

    const adminUser = ADMIN_NUMBERS.includes(normalizedPhone);

    setPhone(normalizedPhone);
    setIsAdmin(adminUser);
    setError("");
    setStep("code");
  }

  function verifyCode() {
    if (code !== TEST_CODE) {
      setError("کد تأیید اشتباه است. کد آزمایشی: 1234");
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    const adminUser = ADMIN_NUMBERS.includes(normalizedPhone);

    localStorage.setItem("alfa_kade_logged_in", "true");
    localStorage.setItem("alfa_kade_phone", normalizedPhone);

    if (adminUser) {
      localStorage.setItem("alfa_kade_admin_verified", "true");
    } else {
      localStorage.removeItem("alfa_kade_admin_verified");
    }

    setError("");
    setIsAdmin(adminUser);

    // ورود به سایت بعد از تأیید کد
    window.location.href = "/ALFA-KADE/products";
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-[#d8aa4d]/30 bg-[#101010] p-6 shadow-2xl md:p-8">

          <div className="mb-8 text-center">
            <img
              src="/ALFA-KADE/alfa-cade.png"
              alt="آلفا کده"
              className="mx-auto h-24 w-24 rounded-2xl object-contain"
            />

            <h1 className="mt-5 text-2xl font-bold text-[#d8aa4d]">
              ورود به آلفا کده
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {step === "phone"
                ? "برای ورود شماره موبایل خود را وارد کنید"
                : "کد تأیید ارسال‌شده را وارد کنید"}
            </p>
          </div>

          {step === "phone" ? (
            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  شماره موبایل
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4">
                  <Smartphone className="h-5 w-5 text-[#d8aa4d]" />

                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    placeholder="09123456789"
                    maxLength={11}
                    className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={sendCode}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d8aa4d] px-5 py-4 font-bold text-black transition hover:bg-[#e8bd65]"
              >
                <LockKeyhole className="h-5 w-5" />
                دریافت کد ورود
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  کد تأیید
                </label>

                <input
                  type="tel"
                  dir="ltr"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  maxLength={6}
                  placeholder="1234"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-center text-2xl tracking-[0.4em] text-white outline-none focus:border-[#d8aa4d]"
                />
              </div>

              <div className="rounded-xl border border-[#d8aa4d]/20 bg-[#d8aa4d]/5 p-4 text-center">
                <p className="text-sm text-[#e8c875]">
                  کد آزمایشی ورود:
                </p>

                <p
                  dir="ltr"
                  className="mt-2 text-2xl font-bold tracking-[0.3em] text-white"
                >
                  1234
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  بعداً این قسمت به سرویس واقعی پیامک متصل می‌شود.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={verifyCode}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d8aa4d] px-5 py-4 font-bold text-black transition hover:bg-[#e8bd65]"
              >
                <ShieldCheck className="h-5 w-5" />
                تأیید و ورود
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError("");
                  setIsAdmin(false);
                }}
                className="w-full text-sm text-gray-500 transition hover:text-[#d8aa4d]"
              >
                تغییر شماره موبایل
              </button>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-[#d8aa4d]/20 bg-[#d8aa4d]/5 p-4 text-center">
            <p className="text-xs leading-6 text-gray-400">
              کد تأیید از طریق پیامک برای شماره موبایل شما ارسال می‌شود.
              در حال حاضر سیستم پیامک آزمایشی است.
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-zinc-600">
            سازنده این سایت: نیما حجتی
          </div>
        </div>
      </div>
    </main>
  );
}
