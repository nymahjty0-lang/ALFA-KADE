"use client";

import { useState } from "react";
import { LockKeyhole, Smartphone, ShieldCheck } from "lucide-react";

const BASE_PATH = "/ALFA-KADE";

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
  const [error, setError] = useState("");

  function sendCode() {
    const normalizedPhone = normalizePhone(phone);

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("لطفاً یک شماره موبایل معتبر وارد کنید.");
      return;
    }

    setPhone(normalizedPhone);
    setCode("");
    setError("");
    setStep("code");
  }

  function verifyCode() {
    const normalizedPhone = normalizePhone(phone);

    if (code !== TEST_CODE) {
      setError("کد تأیید اشتباه است. کد آزمایشی: 1234");
      return;
    }

    const isAdmin = ADMIN_NUMBERS.includes(normalizedPhone);

    localStorage.setItem("alfa_kade_logged_in", "true");
    localStorage.setItem("alfa_kade_phone", normalizedPhone);

    if (isAdmin) {
      localStorage.setItem("alfa_kade_admin_verified", "true");
    } else {
      localStorage.removeItem("alfa_kade_admin_verified");
    }

    setError("");
    window.location.href = `${BASE_PATH}/products`;
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] px-4 py-8 text-white"
    >
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-[#5b4824] bg-[#0d0d0d] shadow-2xl">
          <div className="flex flex-col items-center px-6 pb-6 pt-8">
            <img
              src={`${BASE_PATH}/alfa-cade.png`}
              alt="ALFA KADE"
              className="h-28 w-28 rounded-2xl border border-[#b88a32] object-cover"
            />

            <h1 className="mt-5 text-3xl font-bold text-[#d8aa4d]">
              آلفا کده
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              ALFA KADE
            </p>

            <p className="mt-5 text-center leading-7 text-gray-300">
              ورود به آلفا کده
              <br />
              مقایسه قیمت و خرید هوشمند
            </p>
          </div>

          <div className="px-6 pb-7">
            {step === "phone" ? (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    شماره موبایل
                  </label>

                  <div className="relative">
                    <Smartphone
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8aa4d]"
                    />

                    <input
                      dir="ltr"
                      inputMode="tel"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="09123456789"
                      className="w-full rounded-2xl border border-[#40331d] bg-black py-4 pl-4 pr-12 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d8aa4d]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={sendCode}
                  className="w-full rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black transition hover:bg-[#efc766] active:scale-[0.99]"
                >
                  دریافت کد ورود
                </button>

                <div className="flex items-start gap-3 rounded-2xl border border-[#292929] bg-black/40 p-4">
                  <ShieldCheck
                    size={23}
                    className="mt-0.5 shrink-0 text-[#d8aa4d]"
                  />

                  <p className="text-xs leading-6 text-gray-400">
                    ورود مدیر فقط برای شماره‌های مجاز آلفا کده فعال است.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    کد تأیید
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8aa4d]"
                    />

                    <input
                      dir="ltr"
                      inputMode="numeric"
                      type="text"
                      maxLength={4}
                      value={code}
                      onChange={(event) =>
                        setCode(
                          normalizePhone(
                            event.target.value
                          ).slice(0, 4)
                        )
                      }
                      placeholder="1234"
                      className="w-full rounded-2xl border border-[#40331d] bg-black py-4 pl-4 pr-12 text-center tracking-[0.5em] text-white outline-none transition placeholder:text-gray-700 focus:border-[#d8aa4d]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={verifyCode}
                  className="w-full rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black transition hover:bg-[#efc766] active:scale-[0.99]"
                >
                  ورود به آلفا کده
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setCode("");
                    setError("");
                  }}
                  className="w-full rounded-2xl border border-[#40331d] py-3 text-sm text-gray-300 transition hover:border-[#d8aa4d] hover:text-white"
                >
                  تغییر شماره موبایل
                </button>

                <div className="rounded-2xl border border-[#292929] bg-black/40 p-4 text-center">
                  <p className="text-xs text-gray-500">
                    کد آزمایشی ورود
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 text-lg font-bold tracking-widest text-[#d8aa4d]"
                  >
                    1234
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#242424] px-6 py-5 text-center">
            <p className="text-xs text-gray-500">
              سازنده: نیماحجتی
            </p>

            <p className="mt-2 text-xs text-gray-600">
              © ALFA KADE
            </p>
          </div>
        </div>
      </div>
    </main>
  );
      }
